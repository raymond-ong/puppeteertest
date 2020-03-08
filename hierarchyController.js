const defaultViewName = "Default";

module.exports = {
    saveHierarchyView: function(req, res) {
        console.log('saveHierarchyView');
        const sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('IsaeApr.db');
        
        db.run(`REPLACE INTO HierarchyView(ViewName, HierarchyJson, NodeSettingsJson) VALUES(?, ?, ?)`, 
            [defaultViewName,
            req.body.hierarchyJson, 
            req.body.nodeSettingsJson], 
            err => {
                if (err) {
                    console.log(err.message)
                    res.status(500).send("[saveHierarchyView] Error in Saving ", err.message);
                }
                else {
                    res.status(200).send("OK");
                }
                res.end();
                db.close();        
            });        
    },
    fetchHierarchyViews: function(req, res) {
        console.log('fetchHierarchyViews');
        const sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('IsaeApr.db');        
        let status = 200;
        db.all(`SELECT * FROM HierarchyView`, [], (err, rows) => {            
            var result = null;
            if (err) {
                console.log("[saveHierarchyView] Err ", err.message);
                result = { 'Error': err.message };     
                status = 500;           
            }
            else if (!rows) {
                console.log('[saveHierarchyView] did not find any more rows');
                result = { 'Error': `No record was found with name ${req.body.name}` };
            }
            else {
                console.log('[fetchHierarchyViews] process results');
                result = [];
                rows.forEach(row => {
                    result.push({
                        viewName: row.ViewName, 
                        hierarchyJson: row.HierarchyJson,
                        nodeSettingsJson: row.NodeSettingsJson,
                    });
                })
            }

            res.status(status).send(result);
            res.end();
            db.close();        
        });
    }
}