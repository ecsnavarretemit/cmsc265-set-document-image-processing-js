/*!
 * Utilities
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

const fs = require('fs');

const wrappedFileWrite = (filename, data) => {
  const fileWritePromise = new Promise((resolve, reject) => {
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
  const cvSavePromise = new Promise((resolve, reject) => {
    cvImage.saveAsync(filename, (err) => {
      if (err) {
        reject(err);
      }

      resolve(filename);
    });
  });

  return cvSavePromise;
};

module.exports = {
  wrappedCvSaveAsync,
  wrappedFileWrite,
};


