/*!
 * Image Processor
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

const fs = require('fs');
const path = require('path');
const cv = require('opencv');
const assign = require('lodash.assign');
const template = require('lodash.template');
const fetchAll = require('./fetch-all');
const readCoordsFromFile = require('./read-coords-from-file');
const utils = require('./utils');

// template used in writing the file
/* eslint-disable */
const summaryContentsTmplStr = [
  "Rating:\n",
  "<% const range = Array.apply(null, {length: data.breakdownLength}).map(Number.call, Number) %>",
  "<% range.forEach(function(item) { %>",
  "<% let breakdown = data.breakdown[(item + 1)]; %>",
  "<% if (typeof breakdown === 'undefined') { breakdown = 'N/A'; } %>",
  "<%= (item + 1) %>. <%= breakdown %>\n",
  "<% }); %>\n",
  "Summary of Rating:\n",
  "<% const statisticsKeys = Object.keys(data.statistics); %>",
  "<% statisticsKeys.forEach(function(item) { %>",
  "<%= item %>=<%= data.statistics[item] %>\n",
  "<% }); %>",
].join('');
/* eslint-enable */
const summaryContentsTmpl = template(summaryContentsTmplStr, {
  variable: 'data',
});

const processCell = (origImage, binaryImage, coords, diameter, shapeColors, shapeThickness) => {
  const [x, y] = coords;
  let isShaded = false;
  let shapeColor = shapeColors.blank;

  const start = x - (diameter / 2);
  const end = y - (diameter / 2);

  // crop the image to the specific region
  const roi = binaryImage.crop(start, end, diameter, diameter);

  // opencv's mean function processes all 4 channels of the image
  // and we need only the first channel since we are processing binary images
  // and discard all the channels other than the first channel
  //
  // This to determine how much black pixels are present on the cropped area
  const [channel1, , , ] = roi.mean();

  // override the default rectangle color based on certain range of values
  if (channel1 <= 69) {
    shapeColor = shapeColors.crossed;
  } else if (channel1 > 69 && channel1 < 135) {
    shapeColor = shapeColors.shaded;

    isShaded = true;
  }

  // draw rectangle in the original image
  origImage.rectangle([start, end], [diameter, diameter], shapeColor, shapeThickness);

  return isShaded;
};

const imageProcessor = (imagesDirPath, outputPath, coordsDataFile, options = {}) => {
  const defaultOptions = {
    diameter: 16,
    extensions: ['jpg', 'png'],
    shapeThickness: 2,
    shapeColors: {
      blank: [0, 255, 0], // green
      crossed: [0, 255, 0], // green
      shaded: [0, 0, 255], // red
    },
  };

  // resolve the default options
  const resolvedOptions = assign({}, defaultOptions, options);

  return fetchAll(imagesDirPath, resolvedOptions.extensions)
    .then((images) => {
      // show log info
      console.log(`Reading images from the directory: ${imagesDirPath}`);
      console.log(`Saving processed files to: ${outputPath}`);

      // create an array of image promises
      const promises = images.map(imagePath => utils.wrappedCvReadImage(imagePath));

      // process all the promises using the all method of Promise object
      return Promise.all(promises);
    })
    .then((images) => {
      // read the coordinates and re-resolve the casted images
      const retPromise = Promise.all([
        Promise.resolve(images),
        readCoordsFromFile(coordsDataFile, { delimiter: ' ' }),
      ]);

      return retPromise;
    })
    .then((values) => {
      const [images, coordsData] = values;
      const writeQueue = [];

      images.forEach((image) => {
        const { cvImage, imagePath } = image;

        // show log info
        console.log(`Processing Image: ${imagePath}`);

        // convert to grayscale
        const grayImg = cvImage.copy();
        grayImg.convertGrayscale();

        // perform thresholding using Otsu
        const binaryImage = grayImg.threshold(0, 255, 'Binary', 'Otsu');

        // emulate morph_open since node-opencv doesn't support it
        const kernel = cv.imgproc.getStructuringElement(0, [5, 5]);
        binaryImage.erode(1, kernel);
        binaryImage.dilate(1, kernel);

        // initialize variables for the breakdown and statistics
        const shadeBreakdown = {};
        const statistics = {
          SA: 0,
          A: 0,
          SLA: 0,
          NAD: 0,
          SLD: 0,
          D: 0,
          SD: 0,
        };

        const statisticsKeys = Object.keys(statistics);

        coordsData.forEach((row, coordsIdx) => {
          row.forEach((coords, idx) => {
            const isShaded = processCell(cvImage, binaryImage, coords, resolvedOptions.diameter,
              resolvedOptions.shapeColors, resolvedOptions.shapeThickness);

            // identify where the item resides in the choices
            const statKey = statisticsKeys[idx];

            // add one to the matched stat value and
            // store the value of shaded key and its index to the breakdown
            if (isShaded) {
              statistics[statKey] += 1;

              shadeBreakdown[(coordsIdx + 1)] = statKey;
            }
          });
        });

        const imageBasename = path.basename(imagePath);

        // assemble the contents that will be written to the file
        const fileContents = summaryContentsTmpl({
          breakdown: shadeBreakdown,
          breakdownLength: coordsData.length,
          statistics,
        });

        writeQueue.push({
          basename: imageBasename,
          image: cvImage,
          summary: fileContents,
        });
      });

      return Promise.resolve(writeQueue);
    })
    .then((writeQueue) => {
      // create the output folder if it does not exist
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
      }

      // show log info
      console.log('Writing processed files to disk. Please wait.');

      // save the files in a non-blocking manner. combine 2 promises (text and image save)
      // then return the generated promise to the `.map` call so that we can return another promise
      // via `Promise.all` method.
      writeQueue.map((item) => {
        const combinedPromise = ((data) => { // eslint-disable-line arrow-body-style
          return Promise.all([
            utils.wrappedFileWrite(`${outputPath}/${data.basename}.txt`, data.summary),
            utils.wrappedCvSaveAsync(data.image, `${outputPath}/${data.basename}`),
          ]);
        })(item);

        return combinedPromise;
      });

      return Promise.all(writeQueue);
    })
    ;
};

module.exports = imageProcessor;


