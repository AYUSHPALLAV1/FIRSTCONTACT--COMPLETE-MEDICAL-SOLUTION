const pdf = require('pdf-parse');
console.log('Type of pdf export:', typeof pdf);
console.log('Is pdf a function?', typeof pdf === 'function');
console.log('pdf exports:', pdf);

if (typeof pdf !== 'function' && typeof pdf.default === 'function') {
    console.log('It has a default export which is a function.');
}
