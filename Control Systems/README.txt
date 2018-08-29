Creator: Lee Yan
Collaborating lecturer: Dr Nicolas Cinosi
Subject: Mechatronics (Control Systems)
Department: Mechanical Engineering
Date: 4/7/2018 - 28/8/2018

This is a README text file for Control Systems Visualisation.
The purpose of this files is to assist students visualizing the effects of proportional, integral and differential controls on first and second order system.

This visualisation contains 5 pages.

1) index.html explains about the concepts of control systems.

2) laplace.html plots all first order graphs simultaneously on a plotly scatter chart. (backbone for FirstOrderWaterTank.html)
This html file calls functions in firstOrderHsV2.js. 
firstOrderHsV2.js calls functions in the laplaceHelper.js due to long overlapping maths equations.

3) laplace2nd.html plots all second order graphs simulataneously on a plotly scatter chart. (backbone for SecondOrderPositionControl.html)
This html file calls functions in secondOrderHsV2.js. 
secondOrderHsV2.js uses functions in polynomial.js and laplaceHelper2.js due to the complicated maths functions.
polynomial.js is used to finds roots of the equations.

4) FirstOrderWaterTank.html is the visualisation page where the water level in the tank corresponds to the output of the control system. 
p5.js is used to animate the water tank, plotly is used to plot the graph. 
MathJax and jQuery is used in the text section. 
The html file uses the same .js files as laplace.html.

5) SecondOrderPositionControl.html is the visualisation page where the position of the lift corresponds to the output of the second order control system.
p5.js is used to animate the water tank, plotly is used to plot the graph. 
MathJax and jQuery is used in the text section. 
The html file uses the same .js files as laplace.html.


Possible improvements:
-Improve aesthetics of the visualisations
-Shorten the code by introducing objects
-include more second order concepts
