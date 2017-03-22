/*!
 * Fetch All Images Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

const path = require('path');
const expect = require('chai').expect;
const fetchAll = require('./fetch-all');

describe('Fetch Images', () => {
  const resolvedPath = path.join(process.cwd(), 'assets/img/forms');
  const noImagePath = path.join(process.cwd(), 'assets/docs');
  const nonExistentPath = path.join(process.cwd(), 'non-existent-path');

  it('should throw an error on non-existent directory', (done) => {
    fetchAll(nonExistentPath)
      .catch((err) => {
        expect(err.message).to.equal('Directory does not exist.');
        done();
      })
      ;
  });

  it('should throw an error on directory that contains no images', (done) => {
    fetchAll(noImagePath)
      .catch((err) => {
        expect(err.message).to.equal('Directory does not contain any images.');
        done();
      })
      ;
  });

  it('should fetch images', (done) => {
    fetchAll(resolvedPath)
      .then((images) => {
        expect(images.length).to.be.above(0);

        done();
      })
      ;
  });
});


