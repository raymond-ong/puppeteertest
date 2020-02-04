const express  = require('express');
const convertHTMLToPDF = require("pdf-puppeteer");
const bodyParser = require('body-parser');
const cors = require('cors');
const puppeteer = require('puppeteer')

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

// [1] using convertHTMLToPDF
// So far so good with simple HTML pages, but might be cumbersome in the end because we need to reconstruct the HTML Page
var callbackConvertByHtml = function (res, pdf) {
    // do something with the PDF like send it as the response
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdf);
}

app.post('/createpdfbyhtml', (req, res) => {
    console.log('post request received', req.body)
    
    convertHTMLToPDF(req.body.html, callbackConvertByHtml.bind(this, res));
})

// [2] Using Puppeteer to create the headless chrome
// https://blog.risingstack.com/pdf-from-html-node-js-puppeteer/
async function printPDF(res) {
    //const url = 'https://uwmxm.csb.app/';
    const url = 'http://localhost:3000/reporting';
    console.log('printPDF start', url);
        
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // await page.emulateMedia("screen");
    await page.setViewport({ width: 1190, height: 1684 }); // assuming 144dpi, that is a4 size
    //await page.setViewport({width: 794, height: 1122, deviceScaleFactor: 2});

    await page.goto(url, {waitUntil: 'networkidle0'});
    const pdf = await page.pdf({ 
        format: 'A4', 
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        //footerTemplate: `<div style="font-size: 8px; display: inline-block; border: 1px solid red">Page <span class="pageNumber"/><span> of </span><span class="totalPages"/></div>`,
        footerTemplate: `
          <div style="color: lightgray; font-size: 10px; padding-top: 5px; text-align: center; width: 100%;">
            Page <span class="pageNumber"></span>
            of <span class="totalPages"></span>
          </div>
        `,
        printBackground: true,
        margin: {
            top: 60,
            left: 25,
            bottom: 50,
            right: 25,
            
        } });
   
    await browser.close();
    res.send(pdf);
    console.log('printPDF end');
    return pdf
}

app.post('/createpdf', (req, res) => {
    console.log('post request received', req.body)
    
    printPDF(res)    
})

app.get('/createpdf', (req, res) => {
    console.log('get request received')
    
    printPDF(res)    
})

app.listen(port, () => console.log('Listening on port', port));
