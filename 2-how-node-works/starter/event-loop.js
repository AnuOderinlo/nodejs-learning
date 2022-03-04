const fs = require('fs');

setTimeout(() => {
    console.log("Timer 1 finished");
}, 0);

setImmediate(()=> console.log("Immediate 1 finished"));

fs.readFile('test-file.txt', 'utf-8', ()=>{
    console.log("Reading file I/O");
})

console.log("Code form top level");