const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// console.log(process.argv); //TODO: pass arguments from CLI

// Get images path
const sourcePath = path.join(__dirname, 'images');
const destinationPath = path.join(__dirname, 'output');

// Read images path
fs.readdir(sourcePath, (err, files) => {
    if (err)
        return console.log(`Unable to scan directory: ${err}`);
    
    // Parse files
    if (files.length) {
        // Store all images (jpegs)
        const images = Object.values(files).filter(file => file.split('.')[1] == 'jpg');

        if (images.length) {
            console.log(`Processing ${images.length} files... \n`);

            images.forEach(file => {
                // Get file path, name, buffer and stats
                const fileName = file.split('.')[0];
                const filePath = `${sourcePath}/${file}`;
                const fileBuffer = fs.readFileSync(filePath);
                const fileStats = fs.statSync(filePath);
    
                // Compress image
                sharp(fileBuffer)
                .jpeg({
                    quality: 90,
                    chromaSubsampling: '4:2:0'
                })
                .resize(1400) //TODO: get size from % of source image width
                .toFile(`${destinationPath}/${fileName}.jpg`, (err, info) => {
                    if (err)
                        return console.log(`Unable to process file ${file}: ${err}`);
    
                    console.log(`Filename: ${file}`);
                    console.log(`${formatBytes(fileStats.size)} => ${formatBytes(info.size)} \n`);
                });
            });
        } else {
            console.log('\nNo jpegs found \n');
        }
    } else {
        console.log('\nImages folder is empty \n');
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
