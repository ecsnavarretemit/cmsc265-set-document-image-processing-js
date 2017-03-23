/*!
 * Utilities
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

const fs = require('fs');
const path = require('path');
const cv = require('opencv');

const wrappedFileWrite = (filename, data) => {
  const fileWritePromise = new Promise((resolve, reject) => {
    const parentDir = path.dirname(filename);

    // check if image does not exist.
    if (!fs.existsSync(parentDir)) {
      reject(new Error('Directory does not exist.'));
    }

    // write the file asynchronously to the filesystem
    fs.writeFile(filename, data, (err) => {
      if (err) {
        reject(err);
      }

      resolve(filename);
    });
  });

  return fileWritePromise;
};

const wrappedCvSaveAsync = (cvImage, filename) => {
  // write the image asynchronously to the filesystem
  const cvSavePromise = new Promise((resolve, reject) => {
    const parentDir = path.dirname(filename);

    // check if image does not exist.
    if (!fs.existsSync(parentDir)) {
      reject(new Error('Directory does not exist.'));
    }

    cvImage.saveAsync(filename, (err) => {
      if (err) {
        reject(err);
      }

      resolve(filename);
    });
  });

  return cvSavePromise;
};

const wrappedCvReadImage = (imgPath) => {
  const cvImageReaderPromise = new Promise((resolve, reject) => {
    // check if image does not exist.
    if (!fs.existsSync(imgPath)) {
      reject(new Error('Directory does not exist.'));
    }

    // read the image using opencv
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
      resolve({
        cvImage: img,
        imagePath: imgPath,
      });
    });
  });

  return cvImageReaderPromise;
};

module.exports = {
  wrappedCvReadImage,
  wrappedCvSaveAsync,
  wrappedFileWrite,
};


