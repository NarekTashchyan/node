const fs = require('fs');

try {
    const dataSync = fs.readFileSync('example.txt', 'utf8');
    console.log('Synchronous file read completed:', dataSync);
} catch (err) {
    console.error(err);
}

fs.readFile('example.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Asynchronous file read completed:', data);
});
