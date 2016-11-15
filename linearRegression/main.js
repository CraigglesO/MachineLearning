document.addEventListener('DOMContentLoaded',function(){


  var rl_data = [[65,105],[65,125],[62,110],[67,120],[69,140],[65,135],[61,95],[67,130]]

  //y-hat = b0 + (b1 * x)
  //b1 = slope; b0 = intercept; y-hat = y;


  //total x,y pairs
  let n = rl_data.length;
  // console.log(`n: ${n}`);
  //sum of x's
  let x_bar = 0;
  rl_data.forEach((d) => { return x_bar += d[0]; });
  // console.log(`sum(x): ${x_bar}`);
  //sum of y's
  let y_bar = 0;
  rl_data.forEach((d) => { return y_bar += d[1]; });
  // console.log(`sum(y): ${y_bar}`);
  //sum of (x*y)'s
  let x_y_bar = 0;
  rl_data.forEach((d) => { return x_y_bar += d[0]*d[1]; });
  // console.log(`sum(x*y): ${x_y_bar}`);
  //sum of (x^2)'s
  let x_sqr_bar = 0;
  rl_data.forEach((d) => { return x_sqr_bar += Math.pow(d[0],2); });
  // console.log(`sum(x^2): ${x_sqr_bar}`);

  // b1 = ( sum(x*y) - (sum(x)*sum(y)/n) ) / ( sum(x^2) - ((sum(x)^2)/n) );
  let b_one = ( x_y_bar - (x_bar*y_bar/n) ) / ( x_sqr_bar - (Math.pow(x_bar,2)/n) );
  // console.log(`b1: ${b_one}`);

  let b_zero = (y_bar - (b_one*x_bar))/n;
  // console.log(`b0: ${b_zero}`);

  $('.about-chart-1').text(
    `       Regression Line: y = (${b_one})x + (${b_zero})
       R^2 value: something`);


  function y_hat(x) {
    //y-hat = b0 + (b1 * x)
    // console.log(Array.isArray(x));
    if (Array.isArray(x)){
      return x.map((d) => { return b_zero + (b_one * d);});
    }
    else {
      return b_zero + (b_one * x);
    }

  }

  new Chartist.Line('#chart1', {
    labels: ['60m','61m','62m','63m','64m','65m','66m','67m','68m','69m','70m'],
    series: [
      [, 95, 110, , ,105, , 120, , 140,],
      [, , , , , 125, , 130, , ,],
      [, , , , , 135, , , , ,]
    ]
  }, {
    showLine: false,
    high: 145,
    low: 90,
    fullWidth: true,
    width: 600,
    height: 400,
    // As this is axis specific we need to tell Chartist to use whole numbers only on the concerned axis
    axisY: {
      onlyInteger: true,
      offset: 20
    }
  });
  new Chartist.Line('#chart2', {
    labels: ['60m','61m','62m','63m','64m','65m','66m','67m','68m','69m','70m'],
    series: [
      y_hat([60,61,62,63,64,65,66,67,68,69,70])
    ]
  }, {
    high: 145,
    low: 90,
    fullWidth: true,
    width: 600,
    height: 400,
    // As this is axis specific we need to tell Chartist to use whole numbers only on the concerned axis
    axisY: {
      onlyInteger: true,
      offset: 20
    }
  });
});
