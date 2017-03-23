/*!
 * Utilities Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

const fs = require('fs');
const path = require('path');
const del = require('del');
const cv = require('opencv');
const expect = require('chai').expect;
const utils = require('./utils');

describe('Image Reader', () => {
  const imagePath = path.join(process.cwd(), 'assets/img/forms/0001.jpg');
  const nonExistentImagePath = path.join(process.cwd(), 'assets/img/forms/a.jpg');

  it('should throw an error on an non-existent image', (done) => {
    utils.wrappedCvReadImage(nonExistentImagePath)
      .catch((err) => {
        expect(err.message).to.equal('Directory does not exist.');
        done();
      })
      ;
  });

  it('should create matrix instance', (done) => {
    utils.wrappedCvReadImage(imagePath)
      .then((image) => {
        const { cvImage } = image;

        expect(cvImage).to.be.an.instanceof(cv.Matrix);

        done();
      })
      ;
  });
});

describe('Image Async Writer', () => {
  const savePath = path.join(process.cwd(), 'test-out');
  const imagePath = path.join(process.cwd(), 'assets/img/forms/0001.jpg');

  beforeEach(() => {
    // create the temporary folder
    if (!fs.existsSync(savePath)) {
      fs.mkdirSync(savePath);
    }
  });

  it('should throw an error on non-existent parent directory', (done) => {
    utils.wrappedCvReadImage(imagePath)
      .then(value => utils.wrappedCvSaveAsync(value.cvImage, `${savePath}/inner/write-test.jpg`))
      .catch((err) => {
        expect(err.message).to.equal('Directory does not exist.');
        done();
      })
      ;
  });

  it('should write the file', (done) => {
    utils.wrappedCvReadImage(imagePath)
      .then(value => utils.wrappedCvSaveAsync(value.cvImage, `${savePath}/write-test.jpg`))
      .then(() => {
        const exists = fs.existsSync(`${savePath}/write-test.jpg`);

        expect(exists).to.equal(true);

        done();
      })
      ;
  });

  afterEach(() => {
    // delete the temporary folder
    if (fs.existsSync(savePath)) {
      del.sync([savePath]);
    }
  });
});

describe('File Async Writer', () => {
  const savePath = path.join(process.cwd(), 'test-out');

  beforeEach(() => {
    // create the temporary folder
    if (!fs.existsSync(savePath)) {
      fs.mkdirSync(savePath);
    }
  });

  it('should throw an error on non-existent parent directory', (done) => {
    utils.wrappedFileWrite(`${savePath}/inner/test.txt`, 'Hello World')
      .catch((err) => {
        expect(err.message).to.equal('Directory does not exist.');
        done();
      })
      ;
  });

  it('should write the file', (done) => {
    utils.wrappedFileWrite(`${savePath}/test.txt`, 'Hello World')
      .then(() => {
        const exists = fs.existsSync(`${savePath}/test.txt`);

        expect(exists).to.equal(true);

        done();
      })
      ;
  });

  afterEach(() => {
    // delete the temporary folder
    if (fs.existsSync(savePath)) {
      del.sync([savePath]);
    }
  });
});


