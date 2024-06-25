const fs = require('fs');

fs.readFile('example.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('File read completed');

    setImmediate(() => {
        console.log('setImmediate callback');
    });

    setTimeout(() => {
        console.log('setTimeout callback');
    }, 0);

    process.nextTick(() => {
        console.log('process.nextTick callback');
    });

    console.log('Reading file asynchronously');
});
