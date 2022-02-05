const path = require('path'),
        fs = require('fs'),
        sharp = require('sharp')

// Get images path
const sourcePath = path.join(__dirname, 'images');

// Read images path
fs.readdir(sourcePath, (err, files) => {
    if (err)
        return console.log(`Unable to scan directory: ${err}`);
    
    // Parse files
    if (files.length) {
        // FIXME: check only for images and count them
        // Ignore DS_Store on files count
        const totalFiles = files[0] == '.DS_store' ? files.length - 1 : files.length;

        console.log(`Processing ${totalFiles} files... \n`)

        files.forEach(file => {
            // Get file path, name, buffer and stats
            const fileName = file.split('.')[0];
            const filePath = `${sourcePath}/${file}`;
            const fileBuffer = fs.readFileSync(filePath);
            const fileStats = fs.statSync(filePath);
            
            // console.log(file, formatBytes(fileStats.size), fileBuffer);

            if (file != '.DS_Store') { //FIXME: check for images
                sharp(fileBuffer)
                .jpeg({
                    quality: 90,
                    chromaSubsampling: '4:2:0'
                })
                .resize(1500) //TODO: get size from % of source image width
                .toFile(`${fileName}.jpg`, (err, info) => { //TODO: put processed files in a folder
                    if (err)
                        return console.log(`Unable to process file ${file}: ${err}`);
    
                    console.log(`Filename ${file}`);
                    console.log(`${formatBytes(fileStats.size)} => ${formatBytes(info.size)} \n`);
                });
            }
        });
    } else {
        console.log('Folder is empty');
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
