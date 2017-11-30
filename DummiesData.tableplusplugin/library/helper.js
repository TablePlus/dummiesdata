'use strict';

import randomSentence from 'random-sentence';

var insertRow = function(table, columns, primary) {
    // Add empty row
    var row = table.addEmptyRow(columns);

    var keys = Object.keys(columns);

    // Random value
    keys.forEach(function(key) {
        var dataType = columns[key]['typeString'];
        if (dataType == 'varchar' || dataType == 'text') {
            var sentence = randomSentence();
            row.update(key, sentence);
            row.setConstant(key, "");
        }
        if ((dataType == 'int4' || dataType == 'int8') && !primary.includes(key)) {
            var number = Math.floor(Math.random() * 1000000);
            row.update(key, number);
            row.setConstant(key, "");
        }
        if (dataType == 'timestamp') {
            var t = new Date();
            var formatted = t.toISOString();
            row.update(key, formatted);
            row.setConstant(key, "");
        }
        if (dataType == 'bool') {
            if (Math.random() >= 0.5) {
                row.update(key, 't');
            } else {
                row.update(key, 'f');
            }
            row.setConstant(key, "");
        }
    });

    // After update row data, add it to table again
    table.addToInsert(row);
}

export { insertRow };