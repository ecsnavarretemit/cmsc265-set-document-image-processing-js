/*!
 * Reader Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

const path = require('path');
const expect = require('chai').expect;
const cv = require('opencv');
const reader = require('./reader');

describe('Image Reader', () => {
  const imagePath = path.join(process.cwd(), 'assets/img/forms/0001.jpg');
  const nonExistentImagePath = path.join(process.cwd(), 'assets/img/forms/a.jpg');

  it('should throw an error', (done) => {
    reader(nonExistentImagePath)
      .catch((err) => {
        expect(err.message).to.equal('Directory does not exist.');
        done();
      })
      ;
  });

  it('should create matrix instance', (done) => {
    reader(imagePath)
      .then((image) => {
        const { cvImage } = image;

        expect(cvImage).to.be.an.instanceof(cv.Matrix);

        done();
      })
      ;
  });
});


