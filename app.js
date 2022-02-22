const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { program } = require('commander');

// Set cli parameters
program
    .option('-q, --quality <integer 1 to 100>', 'set jpeg quality, default value is 90')
    .option('-ss, --subsampling', 'use chroma subsampling (less quality), disabled by default')
    .option('-w, --width <integer>', 'set image pixel width, default value is 1500')

program.parse();

const options = program.opts();

// Log parameters if any
if (Object.keys(options).length) {
    console.log('\x1b[35m%s\x1b[0m', '\nStarting with these settings =>', options);
}

// Get images path
const sourcePath = path.join(__dirname, 'images');
const destinationPath = path.join(__dirname, 'output');

// Read images path
fs.readdir(sourcePath, (err, files) => {
    if (err)
        return console.log('\x1b[31m%s\x1b[0m', `\nUnable to scan directory: ${err}`);
    
    // Parse files
    if (files.length) {
        // Store all images (jpegs)
        const images = Object.values(files).filter(file => file.split('.')[1] == 'jpg');

        if (images.length) {
            console.log('\x1b[36m%s\x1b[0m', `\nProcessing ${images.length} files... \n`);

            images.forEach(file => {
                // Get file path, name, buffer and stats
                const fileName = file.split('.')[0];
                const filePath = `${sourcePath}/${file}`;
                const fileBuffer = fs.readFileSync(filePath);
                const fileStats = fs.statSync(filePath);
    
                // Compress image
                sharp(fileBuffer)
                .jpeg({
                    quality: options.quality ? Number(options.quality) : 90,
                    chromaSubsampling: options.subsampling ? '4:2:0' : '4:4:4'
                })
                .resize(options.width ? Number(options.width): 1500)
                .toFile(`${destinationPath}/${fileName}.jpg`, (err, info) => {
                    if (err)
                        return console.log('\x1b[31m%s\x1b[0m', `Unable to process file ${file}: ${err}`);
    
                    console.log('\x1b[34m%s\x1b[0m', `Filename: ${file}`);
                    console.log('\x1b[32m%s\x1b[0m',`${formatBytes(fileStats.size)} => ${formatBytes(info.size)} \n`);
                });
            });
        } else {
            console.log('\x1b[33m%s\x1b[0m', '\nNo jpegs found \n');
        }
    } else {
        console.log('\x1b[33m%s\x1b[0m', '\nImages folder is empty \n');
    }
});

// Convert bytes
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
