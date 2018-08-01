let current;
let soc;
let exportData = {};
for (current = -10; current<10.5; current += 0.5) {
    exportData[current] = {};
    for (soc = 0; soc < 100.1; soc += 0.1) {
        exportData[current][soc] = -0.05 * current + 4.2 - 0.037 * soc;
    }
}
var jsonString = JSON.stringify(exportData);
var fs = require('fs');
fs.writeFile("exampleData.json", jsonString);