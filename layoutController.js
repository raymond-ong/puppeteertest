module.exports = {
    createUpdateLayout: function(req, res) {
        console.log('createUpdateLayout');
        const sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('IsaeApr.db');
        db.run(`REPLACE INTO Layouts(Name, LayoutJson, NumRows, NumCols, PageFilterFields) VALUES(?, ?, ?, ?, ?)`, 
            [req.body.name,
            req.body.layoutJson, 
            req.body.numRows,
            req.body.numCols,
            req.body.pageFilterFields], 
            err => {
                if (err) {
                    console.log(err.message)
                    res.status(500).send("[fetchSavedLayouts] Error in Saving ", err.message);
                }
                else {
                    res.status(200).send("OK");
                }
                res.end();
                db.close();        
            });        
    },

    fetchSavedLayouts: function(req, res) {
        console.log('fetchSavedLayouts');
        const sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('IsaeApr.db');        
        let status = 200;
        db.all(`SELECT * FROM layouts `, [], (err, rows) => {            
            var result = null;
            if (err) {
                console.log("[fetchSavedLayouts] Err ", err.message);
                result = { 'Error': err.message };     
                status = 500;           
            }
            else if (!rows) {
                console.log('[fetchSavedLayouts] did not find any more rows');
                result = { 'Error': `No record was found with name ${req.body.name}` };
            }
            else {
                console.log('[fetchSavedLayouts] process results');
                result = [];
                rows.forEach(row => {
                    result.push({
                        name: row.Name, 
                        layoutJson: row.LayoutJson,
                        lastUpdateDate: row.LastUpdateDate,
                        numRows: row.NumRows,
                        numCols: row.NumCols,
                        pageFilterFields: row.PageFilterFields
                    });
                })
            }

            res.status(status).send(result);
            res.end();
            db.close();        
        });
    }
}