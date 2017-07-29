'use strict';

import { insertRow } from './library/helper';

var onRun = function(context) {
    // Get table in opening tab
    var table = context.selectedTable();

    // Check undefine
    if (table == null) {
        context.alert('Fill Dummies Data', 'Please select a table first');
        return;
    }
    // Fetch table info
    table.info(function(info) {
        // Get table columns listing
        var columns = info['columns'];
        var primary = info['primary'];

        // Create 10 rows random
        for (var i = 0; i < 10; i++) {
            // Add empty row
            insertRow(table, columns, primary);
        }
        // Reload workspace view
        context.reload();
    });
};

global.onRun = onRun;