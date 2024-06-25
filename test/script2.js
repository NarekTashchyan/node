console.log('Script start');

process.nextTick(() => {
    console.log('process.nextTick callback');
});

Promise.resolve().then(() => {
    console.log('Promise resolved callback');
});

setImmediate(() => {
    console.log('setImmediate callback');
});

console.log('Script end');
