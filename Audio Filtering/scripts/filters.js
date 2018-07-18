var a = 200;
const a1 = 200;
var b = 5000;
const b1 = 5000;
var c = 10000;
const c1 = 10000;

// Update the current slider value when drag the slider handle)
    function sliderChange() {
        let slider = document.getElementById("myRange").value;
        document.getElementById("sliderValue").innerHTML = slider;
        if (slider > a1) {
            a = 0;
        }
        if (slider < a1) {
            a = a1;
        }
        if (slider > b1) {
            b = 0;
        }
        if (slider < b1) {
            b = b1;

        }
        if (slider > c1) {
            c = 0;
        }
        if (slider < c1) {
            c = c1;

        }
    }







