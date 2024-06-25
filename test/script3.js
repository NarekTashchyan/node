console.log('Start of script');

setTimeout(() => {
    console.log('setTimeout callback');
}, 0);

setImmediate(() => {
    console.log('setImmediate callback');
});

console.log('End of script');
