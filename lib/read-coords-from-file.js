/*!
 * Read Coordinates from file
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

const fs = require('fs');
const csv = require('fast-csv');
const chunk = require('lodash.chunk');

const readCoordsFromFile = (coordsFile, options) => {
  const readPromise = new Promise((resolve, reject) => {
    // check if image does not exist.
    if (!fs.existsSync(coordsFile)) {
      reject(new Error('Directory does not exist.'));
    }

    const csvStream = fs.createReadStream(coordsFile);
    const collected = [];

    // read the values from stream and save then to the collected array
    // then resolve the promise once the stream has ended.
    csv
      .fromStream(csvStream, options)
      .on('data', (data) => {
        let processed = data
          .filter(item => item !== '') // remove any unwanted data
          .map(item => parseInt(item, 10)) // convert all items to integers
          ;

        if (processed.length > 0) {
          // group the coords by 2 so that it will form [x, y]
          processed = chunk(processed, 2);

          collected.push(processed);
        }
      })
      .on('end', () => {
        resolve(collected);
      })
      .on('error', (err) => {
        reject(err);
      })
      ;
  });

  return readPromise;
};

module.exports = readCoordsFromFile;


