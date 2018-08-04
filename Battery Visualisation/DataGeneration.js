let current;
let soc;
let exportData;
// for (current = -10; current<10.5; current += 0.5) {
//     exportData[current] = {};
//     for (soc = 0; soc < 100.1; soc += 0.1) {
//         exportData[current][soc] = -0.05 * current + 4.2 - 0.037 * soc;
//     }
// }
exportData = [4.19330830928672,-0.0127201842105800,-0.000625938577852004,-0.000171517745926117,
    8.08129863878882e-05,-1.19718299176456e-05,9.68038403508205e-07,-4.93818733617536e-08,1.69682312038018e-09,
    -4.05858298573674e-11,6.84730179880260e-13,-8.12370593060948e-15,6.63471674421775e-17,-3.55205161076871e-19,
    1.12236392174576e-21,-1.58668725017118e-24];
var jsonString = JSON.stringify(exportData);
var fs = require('fs');
fs.writeFile("exampleData.json", jsonString);