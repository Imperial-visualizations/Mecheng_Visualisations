var json = $.getJSON("exampleData.json");
var data = eval("(" +json.responseText + ")");
console.log(data[3][50.1]);