/*!
 * Fetch All Images
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

const fs = require('fs');
const path = require('path');

const fetchAll = (directory, extensions = ['jpg', 'png']) => {
  const findImagesPromise = new Promise((resolve, reject) => {
    if (!fs.existsSync(directory)) {
      reject(new Error('Directory does not exist.'));
    }

    // read the directory and its contents
    fs.readdir(directory, (err, files) => {
      if (err) {
        reject(err);
      }

      const processed = files
        .filter(item => !(/(^|\/)\.[^\/\.]/g).test(item)) // remove unnecessary files (e.g. dot files)
        .filter((item) => {
          // remove the dot from the file extension
          const ext = path.extname(item).split('.').pop();

          // check if the ext is on the allowed file extensions
          return extensions.includes(ext);
        }) // include only jpg files
        .map(item => `${directory}/${item}`) // resolve the full path of the image
        ;

      // reject the promise if the directory does not contain any images.
      if (processed.length === 0) {
        reject(new Error('Directory does not contain any images.'));
      }

      // resolve the promise with the processed images being passed
      resolve(processed);
    });
  });

  return findImagesPromise;
};

module.exports = fetchAll;


