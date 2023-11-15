export default function minuteDiff(dt2, dt1) 
 {

  var diff =(new Date(dt2).getTime() - new Date(dt1).getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
  
 }