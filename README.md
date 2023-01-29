# custom-jpeg-compressor
Simple nodeJS synchronous image compressor (works only with jpegs) done for educational purposes.

![](https://media.giphy.com/media/Vcq7QTUQRggRq5mAV8/giphy.gif)

How to use:

1. Clone this repository. 
2. If you don't have them, install NPM and the most recent LTS Node version.
3. Inside the project folder, launch `npm install` from the command line.
4. Put uncompressed jpegs inside **images** folder.
5. Launch `node app.js` from the command line.

Type `node app.js -h` for help.

Compressed images will be available inside the folder **output**.

This script uses the module [Sharp](https://www.npmjs.com/package/sharp) to process images.
