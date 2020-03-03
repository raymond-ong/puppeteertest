module.exports = {
    handleUpload: function(req, res) {
        console.log('handleUpload', req.files.uploadedFile.name);
        const sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('IsaeApr.db');
        db.run(`REPLACE INTO FileUploads(Name, Fileblob) VALUES(?, ?)`, req.files.uploadedFile.name, req.files.uploadedFile.data);
        res.send("OK");
        res.end();
        db.close();
    },

    getFile: function(req, res) {
        const sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('IsaeApr.db');
        var result = {};
        // get will only return the first result
        db.get(`SELECT * FROM FileUploads WHERE Name=? LIMIT 1`, [req.body.name], (err, row) => {            
            if (err) {
                console.log("Err", err.message);
                result = { 'Error': err.message };
            }
            else if (!row) {
                console.log('did not find any more rows');
                result = { 'Error': `No record was found with name ${req.body.name}` };
            }
            else {
                console.log('curr result', row);
                result = row.Fileblob;
            }

            res.send(result);
            res.end();
            db.close();        
        });
    },

    getFile2: function(name, res) {
        const sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('IsaeApr.db');
        var result = {};
        // get will only return the first result
        db.get(`SELECT * FROM FileUploads WHERE Name=? LIMIT 1`, [name], (err, row) => {            
            if (err) {
                console.log("Err", err.message);
                result = { 'Error': err.message };
            }
            else if (!row) {
                console.log('did not find any more rows');
                result = { 'Error': `No record was found with name ${name}` };
            }
            else {
                console.log('curr result', row);
                result = row.Fileblob;
            }

            res.send(result);
            res.end();
            db.close();        
        });
    },

    getFileList: function(req, res) {
        const sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('IsaeApr.db');        
        db.all(`SELECT Name FROM FileUploads `, [], (err, rows) => {            
            var result = null;
            if (err) {
                console.log("Err", err.message);
                result = { 'Error': err.message };
                
            }
            else if (!rows) {
                console.log('did not find any more rows');
                result = { 'Error': `No record was found with name ${req.body.name}` };
            }
            else {
                console.log('process results');
                result = [];
                rows.forEach(row => {
                    result.push(row.Name);
                })
            }

            res.send(result);
            res.end();
            db.close();        
        });
    },

    deleteFile: function(req, res) {
        console.log('deleteFile');
        const sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('IsaeApr.db');
        db.run(`DELETE FROM FileUploads WHERE Name=?`, req.body.name);
        res.send("OK");
        res.end();
        db.close();
    }
}