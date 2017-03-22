/*!
 * Main
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

const fs = require('fs');
const path = require('path');
const cv = require('opencv');
const fetchAll = require('./lib/fetch-all');
const reader = require('./lib/reader');
const readCoordsFromFile = require('./lib/read-coords-from-file');

// resolve the path to the images
const resolvedImgsPath = path.join(process.cwd(), 'assets/img/forms');

// resolve the path to the output directory
const resolvedDistPath = path.join(process.cwd(), 'out');

// resolve the path to the coordinates CSV file
const coordsDataFile = path.join(process.cwd(), 'assets/docs/fields39.csv');

// processing settings variables
const diameter = 16;
const shapeThickness = 2;
const shapeColors = {
  blank: [0, 255, 0], // green
  crossed: [0, 255, 0], // green
  shaded: [0, 0, 255], // red
};

fetchAll(resolvedImgsPath)
  .then((images) => {
    // show log info
    console.log(`Reading images from the directory: ${resolvedImgsPath}`);
    console.log(`Saving processed files to: ${resolvedDistPath}`);

    // create an array of image promises
    const promises = images.map(imagePath => reader(imagePath));

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

      coordsData.forEach((row) => {
        row.forEach((coords, idx) => {
          const [x, y] = coords;
          let isShaded = false;
          let shapeColor = shapeColors.blank;

          // identify where the item resides in the choices
          const statKey = statisticsKeys[idx];

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
          if (channel1 < 69) {
            shapeColor = shapeColors.crossed;
          } else if (channel1 > 69 && channel1 < 135) {
            shapeColor = shapeColors.shaded;

            isShaded = true;
          }

          // create the output folder if it does not exist
          if (!fs.existsSync(resolvedDistPath)) {
            fs.mkdirSync(resolvedDistPath);
          }

          // add one to the matched stat value
          if (isShaded) {
            statistics[statKey] += 1;
          }

          // draw rectangle in the original image
          cvImage.rectangle([start, end], [diameter, diameter], shapeColor, shapeThickness);
        });
      });

      const imageBasename = path.basename(imagePath);

      // write the manipulated image to the destination folder
      cvImage.save(`${resolvedDistPath}/${imageBasename}`);

      // assemble the contents that will be written to the file
      let fileContents = '';
      statisticsKeys.forEach((key) => {
        fileContents += `${key}=${statistics[key]}\n`;
      });

      // save the statistics in a text file
      fs.writeFileSync(`${resolvedDistPath}/${imageBasename}.txt`, fileContents);
    });

    // show log info
    console.log(`Processing images done. Output files on: ${resolvedDistPath}`);
  })
  .catch(err => console.error(err))
  ;


