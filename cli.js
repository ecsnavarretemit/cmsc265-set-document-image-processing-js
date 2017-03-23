#!/usr/bin/env node

/*!
 * CLI App Bootstrapper
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

const fs = require('fs');
const path = require('path');
const program = require('commander');
const imageProcessor = require('./lib/image-processor');

function listString(val) {
  return val.split(',').map(String);
}

let resolvedInputDirectory;
let resolvedOutputDirectory;
let resolvedCoordsDataFile;

// assemble the program
program
  .version('1.0.2')
  .arguments('<input_images_dir> <output_directory> <coords_data_file>')
  .option('-exts, --extensions <extensions>', 'Image file extension to be allowed. Defaults to jpg and png images.', listString, ['jpg', 'png'])
  .action((inputDirectory, outputDirectory, coordsDataFile) => {
    resolvedInputDirectory = path.join(process.cwd(), inputDirectory);
    resolvedOutputDirectory = path.join(process.cwd(), outputDirectory);
    resolvedCoordsDataFile = path.join(process.cwd(), coordsDataFile);
  })
  .parse(process.argv)
  ;

// show error message to the command line when no input dir is provided
if (typeof resolvedInputDirectory === 'undefined') {
  console.error('No input directory containing images provided!');
  process.exit(1);
}

// show error message to the command line when input dir does not exist
if (!fs.existsSync(resolvedInputDirectory)) {
  console.error(`Input directory: ${resolvedInputDirectory} does not exist.`);
  process.exit(1);
}

// show error message to the command line when no output dir is provided
if (typeof resolvedOutputDirectory === 'undefined') {
  console.error('No output directory provided!');
  process.exit(1);
}

// show error message to the command line when no image coordinates file is provided
if (typeof resolvedCoordsDataFile === 'undefined') {
  console.error('No file provided for image coordinates!');
  process.exit(1);
}

// show error message to the command line when image coordinates file does not exist
if (!fs.existsSync(resolvedCoordsDataFile)) {
  console.error(`Coords data file: ${resolvedCoordsDataFile} does not exist.`);
  process.exit(1);
}

const options = {
  extensions: program.extensions,
};

// process the images
imageProcessor(resolvedInputDirectory, resolvedOutputDirectory, resolvedCoordsDataFile, options)
  .then(() => {
    // show log info
    console.log(`Processing images done. Output files on: ${resolvedOutputDirectory}`);
  })
  .catch(err => console.error(`Error: ${err.message}`))
  ;


