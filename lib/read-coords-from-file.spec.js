/*!
 * Read Coordinates from file Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

const path = require('path');
const expect = require('chai').expect;
const readCoordsFromFile = require('./read-coords-from-file');

describe('Read coords from file', () => {
  const coordsDataPath = path.join(process.cwd(), 'assets/docs/fields39.csv');
  const nonExistentCoordsDataPath = path.join(process.cwd(), 'assets/docs/invalid_path.csv');

  it('should throw an error', (done) => {
    readCoordsFromFile(nonExistentCoordsDataPath)
      .catch((err) => {
        expect(err.message).to.equal('Directory does not exist.');
        done();
      })
      ;
  });

  it('should return the processed coordinates', (done) => {
    readCoordsFromFile(coordsDataPath)
      .then((coordsData) => {
        expect(coordsData.length).to.be.above(0);
        done();
      })
      .catch(err => console.error(err))
      ;
  });
});


