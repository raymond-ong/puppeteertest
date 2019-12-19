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
    console.log('printPDF start');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/', {waitUntil: 'networkidle0'});
    const pdf = await page.pdf({ format: 'A4' });
   
    await browser.close();
    res.send(pdf);
    console.log('printPDF end');
    return pdf
}

app.post('/createpdf', (req, res) => {
    console.log('post request received', req.body)
    
    printPDF(res)    
})

app.listen(port, () => console.log('Listening on port', port));
