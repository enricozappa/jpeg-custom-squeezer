const path = require('path');
const fs = require('fs');

// Join directory path
const directoryPath = path.join(__dirname, 'images');

// Pass directory path and callback function
fs.readdir(directoryPath, (err, files) => {
    // Error handling
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    
    // Parse files
    if (files.length) {
        files.forEach(file => {
            let filePath = `${directoryPath}/${file}`;

            // Get file size
            let stats = fs.statSync(filePath);
            console.log(file, formatBytes(stats.size));
            //TODO: compress files
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
