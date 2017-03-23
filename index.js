/*!
 * Main
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

const path = require('path');
const imageProcessor = require('./lib/image-processor');

// resolve the path to the images
const resolvedImgsPath = path.join(process.cwd(), 'assets/img/forms');

// resolve the path to the output directory
const resolvedDistPath = path.join(process.cwd(), 'out');

// resolve the path to the coordinates CSV file
const coordsDataFile = path.join(process.cwd(), 'assets/docs/fields39.csv');

// process the images
imageProcessor(resolvedImgsPath, resolvedDistPath, coordsDataFile)
  .then(() => {
    // show log info
    console.log(`Processing images done. Output files on: ${resolvedDistPath}`);
  })
  .catch(err => console.error(`Error: ${err.message}`))
  ;


