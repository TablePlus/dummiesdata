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
            row.setDefault(key, 0);
        }
        if ((dataType == 'int4' || dataType == 'int8') && !primary.includes(key)) {
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
        if (dataType == 'bool') {
            if (Math.random() >= 0.5) {
                row.update(key, 't');
            } else {
                row.update(key, 'f');
            }
            row.setDefault(key, 0);
        }
    });

    // After update row data, add it to table again
    table.addToInsert(row);
}

export { insertRow };