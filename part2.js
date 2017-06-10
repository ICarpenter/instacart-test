var sqlite3 = require('sqlite3').verbose();
var moment = require('moment');
var db = new sqlite3.Database('applicants.sqlite3');
var csv = require('csv-write-stream');
var fs = require('fs');

const format = "YYYY-MM-DD";
const results = [];

function writeCSV(err, count) {
    if (err) {
        console.log(err);
        return;
    }

    if (count === 0) {
        console.log("No applicants were found!");
        return;
    }

    var csvWriter = new csv({
      separator: ',',
      newline: '\n',
      headers: Object.keys(results[0]),
      sendHeaders: true
    });

    csvWriter.pipe(fs.createWriteStream('results.csv'));

    results.forEach(function(result) {
        csvWriter.write(result);
    });

    csvWriter.end();
}

function readParams() {
    var defaultParams = {
        first: "1900-01-01",
        last: moment().format(format),
    };

    var rawCommandInput = process.argv.slice(2);

    var userParams = {
        first: rawCommandInput[0],
        last: rawCommandInput[1],
    };

    return Object.assign({}, defaultParams, userParams);
}

function performQuery() {
    var params = readParams();
    var query = 'SELECT count(a.id) as count, strftime(\'%Y-%m-%d\', a.created_at) as week, a.workflow_state '
        + 'from `applicants` a '
        + 'WHERE created_at BETWEEN "' + params.first + '" AND "' + params.last + '" '
        + 'GROUP BY strftime(\'%W\', a.created_at) '
        + 'ORDER BY week';

    var data = db.each(query, {}, function(err, row) {
        results.push(row);
    }, writeCSV);

    db.close();
}

performQuery();