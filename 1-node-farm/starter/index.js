const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/templateReplace');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const temp = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const dataObj = JSON.parse(data);





//////////////////
//FILE HANDLING
/*
// Blocking and synchronous way
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');

const textOut = `Some fact about avocado I know about: \n${textIn} \ncreated at: ${Date.now()}`;

fs.writeFileSync('./txt/output.txt', textOut);

// console.log('Created file and write in it');

// console.log(textIn);


// Non-Blocking and asynchronous way

fs.readFile('./txt/start.txt', 'utf-8', (err, data)=>{
    fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, data2)=>{
        // console.log(data2);
        fs.readFile('./txt/append.txt', 'utf-8', (err, data3)=>{
            // console.log(data3);
            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`,'utf-8', err=>{
                console.log('File has been written...');
            })
        })
    })
})

console.log('Reading file......');
*/

//////////////////
//SERVER



// create server
const server = http.createServer((req, res)=>{

    const {query, pathname} = url.parse(req.url, true);

    // console.log(pathname, query.id); 

    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html',
        });

        const cardHtml = dataObj.map(el=> replaceTemplate(temp, el)).join('');
        const output = tempOverview.replace(/{%TEMPLATE-CARD%}/g, cardHtml)

        res.end(output);
    }else if(pathname === '/product' && query.id < dataObj.length){
        res.writeHead(200, {
            'Content-type': 'text/html',
        });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }else if(pathname === '/api'){
        res.writeHead(200, {
            'Content-type': 'application/json',
        })
        res.end(data);
    }
    else{
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'Hello world'
        })
        res.end('<h1>Page not found</h1>')
    }
})

// listen to server
server.listen(8000, '127.0.0.1', ()=>{
    console.log('Listening from port:8000');
})