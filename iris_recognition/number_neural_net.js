const _ = require('lodash');
const fs = require('fs');
const Matrix = require('node-matrix');

let scalar = Matrix.multiplyScalar;
let dot = Matrix.multiplyElements;
let multiply = Matrix.multiply;
let subtract = Matrix.subtract;
let add = Matrix.add;

// Attribute Information:
//    1. sepal length in cm
//    2. sepal width in cm
//    3. petal length in cm
//    4. petal width in cm
//    5. class:
//       -- Iris-setosa
//       -- Iris-versicolor
//       -- Iris-virginica

//FUNCTIONS:
function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

function sigmoidPrime(z) {
  return Math.exp(-z) / Math.pow(1 + Math.exp(-z), 2);
}

function htan(z) {
  var y;
  return ((y = Math.exp(2 * z)) - 1) / (y + 1);
}

function htanPrime(z) {
  return 1 - Math.pow((Math.exp(2 * z) - 1) / (Math.exp(2 * z) + 1), 2);
}

function linear(z) {
  return z;
}

function linearPrime(z) {
  return z;
}




//MODULES:
function Mind(opts) {
  if (!(this instanceof Mind)) return new Mind(opts);
  opts = opts || {};

  opts.activator === 'sigmoid'
    ? (this.activate = sigmoid, this.activatePrime = sigmoidPrime)
    : (this.activate = htan, this.activatePrime = htanPrime);

  opts.activator === 'linear'
    ? (this.activate = linear, this.activatePrime = sigmoidPrime)
    : (this.activate = htan, this.activatePrime = htanPrime);

  // hyperparameters
  this.learningRate = opts.learningRate || 0.0001;
  this.iterations = opts.iterations || 150;
  this.hiddenUnits = opts.hiddenUnits || 4;
}







Mind.prototype.forward = function(example) {
  let activate = this.activate;
  let weights = this.weights;
  let ret = {};

  ret.hiddenSum = multiply(weights.inputHidden, example);
  // console.log(`ret.hiddenSum: ${ret.hiddenSum}`);
  ret.hiddenResult = ret.hiddenSum.transform(activate);
  //console.log(`ret.hiddenResult: ${ret.hiddenResult}`);
  ret.outputSum = multiply(weights.hiddenOutput, ret.hiddenResult);
  //console.log(`ret.outputSum: ${ret.outputSum}`);
  ret.outputResult = ret.outputSum.transform(activate);
  //console.log(`ret.outputResult: ${ret.outputResult}`);


  // if (j == 0){
  //   console.log(`ret.hiddenSum: ${result.hiddenSum}`);
  //   console.log(`result.hiddenResult: ${result.hiddenResult}`);
  //   console.log(`result.outputSum: ${result.outputSum}`);
  //   console.log(`result.outputResult: ${result.outputResult}`);
  // }

  return ret;
};






Mind.prototype.back = function(inp, outp, results) {
  let activatePrime = this.activatePrime;
  let learningRate = this.learningRate;
  let weights = this.weights;

  // compute weight adjustments
  let errorOutputLayer = subtract(inp, results.outputResult);

  let deltaOutputLayer = dot(results.outputSum.transform(activatePrime), errorOutputLayer);

  let hiddenOutputChanges = scalar(multiply(deltaOutputLayer, results.hiddenResult.transpose()), learningRate);

  let deltaHiddenLayer = dot(multiply(weights.hiddenOutput.transpose(), deltaOutputLayer), results.hiddenSum.transform(activatePrime));

  let inputHiddenChanges = scalar(multiply(deltaHiddenLayer, outp.transpose()), learningRate);

  weights.inputHidden = add(weights.inputHidden, inputHiddenChanges);
  weights.hiddenOutput = add(weights.hiddenOutput, hiddenOutputChanges);

  return errorOutputLayer;
};



function randomize () {
  return Math.random() * (50 - 0) + 0;
}


Mind.prototype.learn = function(examples) {
  examples = normalize(examples);

  this.weights = {
    inputHidden: Matrix({
      columns: this.hiddenUnits,
      rows: examples.input[0].length,
      values: Math.random
    }),
    hiddenOutput: Matrix({
      columns: examples.output[0].length,
      rows: this.hiddenUnits,
      values: Math.random
    })
  };

  // console.log('weights: ');
  // console.log(this.weights.inputHidden['0']);
  // console.log(this.weights.hiddenOutput);
  // console.log(examples.input.numRows);

  for (var i = 0; i < this.iterations; i++) {
    for (var j = 0; j < examples.input.numRows; j++){
      let matIn = new Matrix([examples.input[j]]);
      let matOut = new Matrix([examples.output[j]]);
      var results = this.forward(matIn);
      var errors = this.back(matOut, matIn, results);
    }
    if ((i+1) % 5 == 0) {
      console.log(`${i} complete`);
      // console.log(`results.hiddenSum:`);
      // console.log(results.hiddenSum);
      // console.log(`results.hiddenResult:`);
      // console.log(results.hiddenResult);
      // console.log(`results.outputSum:`);
      // console.log(results.outputSum);
      // console.log(`results.outputResult:`);
      // console.log(results.outputResult);

      console.log(`error ouput:`);
      console.log(errors);
    }
  }

  return this;
};





Mind.prototype.test = function(examples) {
  examples = normalize(examples);

  // console.log('weights: ');
  // console.log(this.weights.inputHidden['0']);
  // console.log(this.weights.hiddenOutput);
  // console.log(examples.input.numRows);
  var correctCount = 0;
  var total = examples.input.numRows;
  for (var j = 0; j < examples.input.numRows; j++){
    let matIn = new Matrix([examples.input[j]]);
    var results = this.forward(matIn);

    console.log();
    console.log();
    console.log('expected ouput:');
    console.log(examples.output[j]);
    console.log('actual output:');
    results = results.outputResult['0'];
    //results = results.map((x) => { return Math.round(Math.abs(x))});
    console.log(results);
    console.log();
    console.log();
    if (_.isEqual(examples.output[j], results)){
      correctCount++;
    }
  }

  var percTot = (correctCount*100)/total;

  // console.log(`
  //   total number tested: ${examples.input.numRows}
  //   total number correct: ${correctCount}
  //   percetageTotal: ${percTot}`);


};





function sample() {
  return Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
}




function normalize(data) {
  let ret = { input: [], output: [] };

  for (let i = 0; i < data.length; i++) {
    let datum = data[i];
    let datumLast = datum.length - 1;

    let inputer = datum.slice(0,datumLast);
    inputer.push(1);
    ret.output.push(datum[datumLast]);
    ret.input.push(inputer);
    // if (i === 0){
    //   console.log(ret.input);
    //   console.log(ret.output);
    // }
  }

  ret.output = Matrix(ret.output);
  ret.input = Matrix(ret.input);

  return ret;
}










let test_cases = [];
let data = [];

fs.readFile('semeion.data','utf-8',(err,file_data) => {
  if (err) throw err;
  file_data = file_data.split('\n');
  file_data = file_data.map((i,index) => { return i.split(' '); });
  file_data.pop();
  file_data = file_data.map((each) => {
    each.pop();
    each = each.map((i) => {
      if (!isNaN(i)){
        return i = parseInt(i);
      }
      else {
        return i;
      }
    });
    let num_d = each.splice(256,10);
    each.push(num_d);
    return each;
  });
  file_data.forEach((x,i) => {
    if ((i+1) % 150 == 0){
      test_cases.push(x);
    }
    else {
      data.push(x)
    }
  });
  start();
});

function start () {
  shuffle(test_cases);
  shuffle(data);
  //opts = {activator: 'sigmoid'}
  mind = new Mind();
  let resultum = mind.learn(data);
  console.log();
  console.log();
  console.log();
  console.log();
  console.log(resultum.weights.inputHidden);
  console.log(resultum.weights.hiddenOutput);
  console.log();
  console.log();
  console.log();
  console.log('Let\'s test the weights');
  //check my work:
  mind.test(test_cases);
  console.log();
  // let x = new Matrix([1,2,3]);
  // let y = new Matrix([[4],[5],[6]]);
  // let z = Matrix.multiply(y,x);
  // console.log(z);






  // var setosa = [];
  // var versicolor = [];
  // var virginica = [];
  // data.forEach((iris) => {
  //   console.log(iris);
  //   let l = iris[0] * iris[1];
  //   let f = iris[2] * iris[3];
  //   let iris_type = iris[4];
  //   if (iris_type == "Iris-setosa"){
  //     iris_type = 0;
  //     setosa.push([f,l]);
  //   }
  //   if (iris_type == "Iris-versicolor"){
  //     iris_type = 1;
  //     versicolor.push([f,l]);
  //   }
  //   if (iris_type == "Iris-virginica"){
  //     iris_type = 2;
  //     virginica.push([f,l]);
  //   }
  // });
  // setosa.forEach((iris) => {
  //   fs.writeFile('setosa.txt', '',function (err) {});
  //   fs.appendFile('setosa.txt', `{ x: ${iris[1]}, y: ${iris[0]} },\n`, function (err) {});
  // });
  // versicolor.forEach((iris) => {
  //   fs.writeFile('versicolor.txt', '',function (err) {});
  //   fs.appendFile('versicolor.txt', `{ x: ${iris[1]}, y: ${iris[0]} },\n`, function (err) {});
  // });
  // virginica.forEach((iris) => {
  //   fs.writeFile('virginica.txt', '',function (err) {});
  //   fs.appendFile('virginica.txt', `{ x: ${iris[1]}, y: ${iris[0]} },\n`, function (err) {});
  // });
}


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
