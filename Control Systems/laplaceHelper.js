/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global w */

/* global w */

//the helper code here implement  inverse laplace function 

//implement inverse Laplace of k/(s*(s^2/w^2 +2*z*s/w +1))   equation 31 page 24
function secondOrder(k, w, z, t) {
    var q = Math.acos(z);
    var sinPart = Math.sin(w * Math.sqrt(1 - z * z) * t + q);
    var expPart = Math.exp(-z * w * t) / Math.sqrt(1 - z * z);
    var result = k * (1 - expPart * sinPart);
    return result;
}

//implement inverse Laplace of k/(s*(1+tau*s))  =k[1-e^(-t/tau)]  
function firstOrder(k, tau, t) {
    var result = k * (1 - Math.exp(-t / tau));
    return result;
}

//implement inverse Laplace of k/(1+tau*s))   =(k/tau)e^(-t/tau) 
function invlap1(k, tau, t) {
    var result = (k / tau) * Math.exp(-t / tau);
    return result;
}

//implement inverse Laplace of KpKd
function invlapKpKd(alpha, a, b, k, tauD, t) {
    var result = (k / tauD) * (1 / (b - a)) * ((alpha - a) * Math.exp(-a * t) - (alpha - b) * Math.exp(-b * t));
    return result;
}

//implement inver Laplace for KpKi
function invlapKpKi(k, t, alpha, a, b) {
    var phi = Math.atan2(b, (alpha - a)) - Math.atan2(b, -a);
    var result = (alpha / (a * a + b * b)) + (1 / b) * Math.sqrt((Math.pow((alpha - a), 2) + b * b) / (a * a + b * b)) * Math.exp(-a * t) * Math.sin(b * t + phi);
    return result;
}
function invlap28a(alpha, w, z, t) {
    var root1mZ2 = Math.sqrt(1 - z * z);  
    var realonly= parseFloat(root1mZ2);
    var phi = Math.atan2(w * realonly , alpha - w * z) - Math.atan2(realonly, -z);
    var sinpart = Math.sin(w * root1mZ2 * t + phi);
    var exppart = Math.sqrt(Math.pow(alpha / w - z, 2) + 1 - z * z) * Math.exp(-z * w * t) / (w * root1mZ2);
    var result = alpha / (w * w) + sinpart * exppart;
    return result;
}
function invlap11(a, b, alpha, t) {
    var part1 = b * (alpha - a) * Math.exp(-alpha * t) / (b - 1);
    var part2 = a * (alpha - b) * Math.exp(-b * t) / (b - a);
    var r = (alpha - part1 + part2) / (a * b);
    return r;
}

function invlap36a(alpha0, alpha1, z, w, t) {
    var wsq=w*w;   
    var root_1_zsq = Math.sqrt(1-z*z);
    var zw=z*w;
    var bigone=zw*zw-wsq*(1-z*z)-alpha1*z*w+alpha0;
    var phi = Math.atan2(w*root_1_zsq*(alpha1-2*z*w),bigone) - Math.atan2(w*root_1_zsq,-z*w);
    var sinpart=Math.exp(-z*w*t)*Math.sin(w*root_1_zsq*t+phi);
    var rootpart = Math.sqrt(Math.pow(bigone,2)+wsq*(1-z*z)*Math.pow(alpha1-2*zw,2));    
    var result = alpha0 / wsq + (rootpart * sinpart)/(wsq*root_1_zsq);
    return result;
}
function invlap35(alpha0, alpha1, a, b, t) {
    var asq = a * a;
    var bsq = b * b;
    var part1 = alpha0 / (a * b);
    var part2 = (asq - alpha1 * a + alpha0) * Math.exp(-a * t) / (a * (a - b));
    var part3 = (bsq - alpha1 * b + alpha0) * Math.exp(-b * t) / (b * (a - b));
    var result = part1 + part2 - part3;
    return result;
}
function invlap39(alpha,  a, b, t) {
    var c=a*a+b*b;
    var phi=2*Math.atan2(b,a)+Math.atan2(b,alpha-a);
    var part1=(alpha*t+1-(2*alpha*a/c))/c;
    var part2=Math.sqrt(b*b+Math.pow(alpha-a,2))*Math.exp(-a*t)*Math.sin(b*t+phi)/(b*c);
    var result=part1+part2;
    return result;    
}
function invlap40(alpha0,alpha1,  a, b, t) {
    var part1=(alpha1+alpha0*t)/(a*b);
    var part2=alpha0*(a+b)/Math.pow(a*b,2);
    var part3=(1-alpha1/a+alpha0/Math.pow(a*a,2))*Math.exp(-a*t)/(a-b);
    var part4=(1-alpha1/b+alpha0/Math.pow(b*b,2))*Math.exp(-b*t)/(b-a);
    var result=part1-part2-part3-part4;
    return result;
}

function invlap26(alpha, a, b, t) {   
    var phi=Math.atan2(b,alpha-a);    
    var bsq=b*b;
   // console.log("phi,bsq",phi,bsq);
    var result=Math.sqrt(Math.pow(alpha-a,2)+bsq)/b;  
    console.log("result1",result);
    result=result*Math.exp(-a*t)*Math.sin(b*t+phi);
   //   console.log("result2",result);
    return result;
}
function invlap31(alpha, a, b, c, t){
    var phi=Math.atan2(b,alpha-a)-Math.atan2(b,-a)-Math.atan2(b,c-a);
    var bsq=b*b;
    var part1=alpha/(c*(a*a+bsq));
    var part2=(c-alpha)*Math.exp(-c*t)/(c*(Math.pow(c-a,2)+bsq));
    var part3=Math.sqrt(Math.pow(alpha-a,2)+bsq)/(b*Math.sqrt(a*a+bsq)*Math.sqrt(Math.pow(c-a,2)+bsq));
    var part4=Math.exp(-a*t)*Math.sin(b*t+phi);
    var result=part1+part2+part3*part4;
    return result;
}