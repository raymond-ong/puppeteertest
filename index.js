const express  = require('express');
const convertHTMLToPDF = require("pdf-puppeteer");
const bodyParser = require('body-parser');
const cors = require('cors');
const upload = require("express-fileupload");
const fileUploader = require('./fileUploader');
const pdfGenerator = require('./pdfGenerator');
const layoutController = require('./layoutController');
const hierarchyController = require('./hierarchyController');

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

/* START: PDF */
app.post('/createpdfbyhtml', (req, res) => {
    console.log('post request received', req.body)
    
    convertHTMLToPDF(req.body.html, callbackConvertByHtml.bind(this, res));
})

app.post('/createpdf', (req, res) => {
    console.log('post request received', req.body)
    
    pdfGenerator.printPDF(req, res)    
})

app.get('/createpdf', (req, res) => {
    console.log('get request received')
    
    pdfGenerator.printPDF(req, res);
})
/* END: PDF */

/* START: File/Image */
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
/* END: File/Image */

/* START: Layout */
app.post('/createupdatelayout', (req, res) => {
    console.log('create/update layout');
    layoutController.createUpdateLayout(req, res);
})

app.get('/fetchSavedLayouts', (req, res) => {
    console.log('fetchSavedLayouts');
    layoutController.fetchSavedLayouts(req.params.name, res);
})

/* END: Layout */


/* START: Hierarchy */
/* END: Hierarchy */

app.listen(port, () => console.log('Listening on port', port));
