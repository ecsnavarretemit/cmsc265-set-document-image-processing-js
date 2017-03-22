# CMSC 265 Exercise 6 - SET Document Image Processing

## Requirements

1. Node.js 6.x.x or greater (Node.js 6.9.x or greater is recommended)
2. Python 2.x.x (Python 2.7.x or greater is recommended)
3. OpenCV 3

## Installing dependencies

This project requires a working installation of [OpenCV 3](http://opencv.org/). Please install this first before installing
the project dependencies.

Dependencies of this project can be installed via [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/).
It is recommended to use Yarn instead of NPM due to the assurance that the dependencies that will be installed is the same across all machines.
Although there is the `npm shrinkwrap` which aims to achieve what is stated above, read this about [yarn.lock and npm shrinkwrap](https://yarnpkg.com/en/docs/yarn-lock).

Installing dependencies via Yarn is simply as running the command `yarn install`. Installing dependencies NPM is also as simple as running the command `npm install`.

_Note: Make sure that Python 2.x.x is present on your path since OpenCV bindings for Node.js needs this in order for it to be compiled._

## Running the Program

This program can be run using the command `yarn start` if you use Yarn or `npm start` if you use NPM.
The output image files will be under the `out` directory generated at the project root.

This can also be installed as executable script using the command `npm install -g`. After installation which could take some time,
You may now be able to use the command `process-set-images <input_images_dir> <output_directory> <coords_data_file>`.
For more info, you can type: `process-set-images --help`.


## Running Tests

This program includes unit tests written using Mocha test framework and Chai assertion library.
Unit tests can be run using `yarn test` if you use Yarn or `npm test` if you use NPM.

## License

MIT


