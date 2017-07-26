'use strict';

var randomSentence = require('random-sentence');

// Get table in opening tab
var table = Workspace.currentTable();

var onRun = function(context) {
    // Fetch table info
    table.info(function(info) {
        // Get table columns listing
        var columns = info['columns'];
        
        for (var i = 0; i < 10; i++) {
            // Add empty row
            var row = table.addEmptyRow(columns); 

            var keys = Object.keys(columns);

            // Random value
            keys.forEach(function(key) {
                var dataType = columns[key]['typeString'];
                if (dataType == 'varchar' || dataType == 'text') {
                    var sentence = randomSentence();
                    row.update(key, sentence);
                    row.setDefault(key, 0);            
                }
                if (dataType == 'int4' && key != 'id') {
                    var number = Math.floor(Math.random() * 1000000);
                    row.update(key, number);
                    row.setDefault(key, 0);               
                }
                if (dataType == 'timestamp') {
                    var t = new Date();
                    var formatted = t.toISOString();
                    row.update(key, formatted);
                    row.setDefault(key, 0);               
                }
            });

            table.addToInsert(row);
        }
        // Reload workspace view
        Workspace.reload();  
    });
};

global.onRun = onRun;