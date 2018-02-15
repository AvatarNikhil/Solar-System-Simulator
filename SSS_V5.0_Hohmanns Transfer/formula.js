/*************************
1. Mean Anomaly
2. True Anomaly
3. Distance r to the Sun
4. Cal heliocentric Ecliptic Coordinates - x, y
*/
/*************************
 *STEP 1 - MEAN ANOMALY
 *************************/
var n = function(amajor) {
  var n = (0.9856076686 / (pow(amajor, 3 / 2)));
  return n;
}
//Mean ANOMALY
var M = function(Mo, n, nowday, startday) {
  var temp1 = Mo + n * (nowday - startday);
  var temp2 = temp1 % 360;
  return temp2;
}
/*************************
*STEP 2 - TRUE ANOMALY
http://www.jgiesen.de/kepler/kepler.html
*************************/
//Eccentricity Anomaly
function EccAnom(ec, m, dp) {
  var pi = Math.PI,
    K = pi / 180.0;
  var maxIter = 30,
    i = 0;
  var delta = Math.pow(10, -dp);
  var E, F;
  m = m / 360.0;
  //form.time.value="t/T="+m;
  m = 2.0 * pi * (m - Math.floor(m));
  if (ec < 0.8) E = m;
  else E = pi;
  F = E - ec * Math.sin(m) - m;
  while ((Math.abs(F) > delta) && (i < maxIter)) {
    E = E - F / (1.0 - ec * Math.cos(E));
    F = E - ec * Math.sin(E) - m;
    i = i + 1;
  }
  Nu(ec, E, dp);

  E = E / K;
  if (i == maxIter) str = "" + i + " (max!)";
  else str = "" + i;
  //form.iter.value=str;

  return Math.round(E * Math.pow(10, dp)) / Math.pow(10, dp);
}
//True Anomaly
function Nu(ec, E, dp) {
  K = Math.PI / 180.0;
  S = Math.sin(E);
  C = Math.cos(E);
  fak = Math.sqrt(1.0 - ec * ec);
  phi = Math.atan2(fak * S, C - ec) / K;
  //form.phi.value=Math.round(phi*Math.pow(10,dp))/Math.pow(10,dp);
}
/**************************************/

function TrueAnom(e,M) {
  K=Math.PI/180.0;
  M=M*K;
  e2=Math.pow(e,2);
  e3=Math.pow(e,3);
  e4=0;
  e5=0;
  result3=(M+(2*e-0.25*e3+5/96*e5)*Math.sin(M)+(1.25*e2-11/24*e4)*Math.sin(2*M)+(13/12*e3-43/64*e5)*Math.sin(3*M)+103/96*e4 *Math.sin(4*M)+1097/960*e5*Math.sin(5*M))/K;

  e4=Math.pow(e,4);
  result4=(M+(2*e-0.25*e3+5/96*e5)*Math.sin(M)+(1.25*e2-11/24*e4)*Math.sin(2*M)+(13/12*e3-43/64*e5)*Math.sin(3*M)+103/96*e4 *Math.sin(4*M)+1097/960*e5*Math.sin(5*M))/K;

  e5=Math.pow(e,5);
  result5=(M+(2*e-0.25*e3+5/96*e5)*Math.sin(M)+(1.25*e2-11/24*e4)*Math.sin(2*M)+(13/12*e3-43/64*e5)*Math.sin(3*M)+103/96*e4 *Math.sin(4*M)+1097/960*e5*Math.sin(5*M))/K;
  return result5;
}
/*************************
*STEP 3 - ORIBITAL RADIUS
*************************/
function or (semimajor, eccentricity, angle) {
  var or = ((semimajor) * (1 - sq(eccentricity))) / (1 + (eccentricity * (cos(angle))));
  return or;
}
/************************************
*STEP 4 - HELIOCENTRIC COORDINATES
************************************/
function hx(or, lomega, omega, i, Nu) {
  var hx = or * (cos(lomega)*cos(omega + Nu)) - (sin(lomega)*cos(i)*sin(omega + Nu));
  return hx;
}
function hy(or, lomega, omega, i, Nu) {
  hy = or * (sin(lomega)*cos(omega + Nu)) + (cos(lomega)*cos(i)*sin(omega + Nu));

  return hy;
}



/*********************************************************************/
//Date + No of days = Present Date
/*  var startday = 0;//J200
    var days =6000; //Number of Days to advance */
var newDate = function() {
  for (var args = [], i = 0; i < arguments.length; i++) {
      var a = arguments[i];
      if (typeof a === "string") {
          args.push("'" + a + "'");
      } else if (typeof a === "number") {
          args.push("" + a);
      } else {
          args.push("''");
      }
  }
  args = args.join(",");
  var F = (function(w) { return this[w]; })("Function");
  F = F("dis", "with(dis)return new Date(" +  args + ")");
  return F(this);
}
function DayDiff(startday, days) {
  var dayNames = [
      "Sunday", "Monday", "Tuesday", "Wednesday",
      "Thursday", "Friday", "Saturday"
  ];
  var startDate = newDate("1/1/2000");
  var ms = days*24*60*60*1000;
  var endDate = newDate(startDate.getTime() + ms);
  return endDate;
}
//To find no of days between two specific dates
/*
https://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
*/
function dateDiff( str2 ) {
  var str1 = "1/1/2000"
  var diff =  Math.floor(( Date.parse(str2) - Date.parse(str1) ) / 86400000);
  return diff;
}

//Formula
function b (semimajor, eccentricity) {
  var b = semimajor * sqrt(1 - sq(eccentricity));
  return b;
}
function ecc (semiminor, semimajor) {
  var ecc = 1 - (sq(semiminor) / sq(semimajor));
  return ecc;
}