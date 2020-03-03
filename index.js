const express  = require('express');
const convertHTMLToPDF = require("pdf-puppeteer");
const bodyParser = require('body-parser');
const cors = require('cors');
const puppeteer = require('puppeteer');
const upload = require("express-fileupload");
const fileUploader = require('./fileUploader');

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(upload());

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
        // footerTemplate: `
        //   <div style="color: lightgray; font-size: 10px; padding-top: 5px; text-align: center; width: 100%;">
        //     Page <span class="pageNumber"></span>
        //     of <span class="totalPages"></span>
        //   </div>
        // `,
        footerTemplate: `
        <div style="width: 100%; display: grid; grid-template-columns: 1fr 1fr 1fr; vertical-align: bottom;">
            <img  style="height:15px; padding-left:20px" src="data:image/png;base64,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"/>
            <div style="color: lightgray; font-size: 10px; text-align: center; width: 100%;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>
          </div>
        `,
        printBackground: true,
        margin: {
            top: 25,
            left: 25,
            bottom: 65,
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


app.post('/fileupload', (req, res) => {
    console.log('fileupload');
    fileUploader.handleUpload(req, res);
})

app.post('/getfile', (req, res) => {
    console.log('getfile');
    fileUploader.getFile(req, res);
})

app.get('/files/:name', (req, res) => {
    console.log('getfile');
    fileUploader.getFile2(req.params.name, res);
})

app.get('/getfilelist', (req, res) => {
    console.log('getfilelist');
    fileUploader.getFileList(req, res);
})

app.post('/deletefile', (req, res) => {
    console.log('deleteFile');
    fileUploader.deleteFile(req, res);
})


app.listen(port, () => console.log('Listening on port', port));
