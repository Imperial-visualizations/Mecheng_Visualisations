/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//the helper code here implement  inverse laplace function 

//implement inverse Laplace of k/(s*(s^2/w^2 +2*z*s/w +1))   equation 31 page 24
function secondOrder(k,w,z,t){
    var q=Math.acos(z);
    var sinPart=Math.sin(w*Math.sqrt(1-z*z)*t+q);
    var expPart=Math.exp(-z*w*t)/Math.sqrt(1-z*z);
    var result=k*(1-expPart*sinPart);
    return result;
}

//implement inverse Laplace of k/(s*(1+tau*s))  =k[1-e^(-t/tau)]  
function firstOrder(k,tau,t){   
    var result=k*(1-Math.exp(-t/tau));
    return result;
}

//implement inverse Laplace of k/(1+tau*s))   =(k/tau)e^(-t/tau) 
function invlap1(k,tau,t){   
    var result=(k/tau)*Math.exp(-t/tau);
    return result;
}

//implement inverse Laplace of KpKd
function invlapKpKd(alpha, a,b, k, tauD, t) {
    var result = (k/tauD)*(1/(b-a))*((alpha-a)*Math.exp(-a*t)-(alpha-b)*Math.exp(-b*t));
    return result;
}

//implement inver Laplace for KpKi
function invlapKpKi(k, t, alpha, a, b) {
    var phi = Math.atan2(b , (alpha-a))-Math.atan2(b,-a);
    var result = (alpha/ (a*a+b*b))+(1/b)*Math.sqrt((Math.pow((alpha-a),2)+b*b)/(a*a+b*b))*Math.exp(-a*t)*Math.sin(b*t+phi);
    return result;
}

