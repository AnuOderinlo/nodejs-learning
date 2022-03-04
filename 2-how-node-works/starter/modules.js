

const Cal = require('./module-1.js');

const calc = new Cal();

// console.log(calc.add(5,6));


const calc2 = require('./module-2.js');
const {add, subtract, divide} = calc2;

console.log(divide(10, 5));