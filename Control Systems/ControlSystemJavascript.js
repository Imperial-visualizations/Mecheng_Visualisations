/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var sampleGraph = {
  x: [1, 2, 3, 4, 5],
  y: [2, 9, 11, 12, 13],
  mode: 'lines+markers',
  type: 'scatter'
};

var data = [sampleGraph] 

var layout = {
  title: 'Step Response Graph',
  xaxis: {
    title: 'Time',
    showgrid: false,
    zeroline: false
  },
  yaxis: {
    title: 'Output',
    showline: false
  }
};

Plotly.newPlot('myDiv', data, layout);


function plotStepResponse() {
    var x, text;

    // Get the value of the input field with id="numb"
    x = document.getElementById("numb").value;

    // checking if x is a number
    if (isNaN(x)) {
        text = "Input not valid";
    } else {
        text = "Input OK";
    }
    document.getElementById("numb").innerHTML = text;
}