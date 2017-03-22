/*!
 * Reader
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

const fs = require('fs');
const cv = require('opencv');

const reader = (imgPath) => {
  const cvImageReaderPromise = new Promise((resolve, reject) => {
    // check if image does not exist.
    if (!fs.existsSync(imgPath)) {
      reject(new Error('Directory does not exist.'));
    }

    // read the image ung opencv
    cv.readImage(imgPath, (err, img) => {
      if (err) {
        reject(err);
      }

      const width = img.width();
      const height = img.height();

      // check if the image has size or not.
      if (width < 1 || height < 1) {
        reject(new Error('Image has no size'));
      }

      // resolve the promise by passing the cv image instance
      resolve(img);
    });
  });

  return cvImageReaderPromise;
};

module.exports = reader;


