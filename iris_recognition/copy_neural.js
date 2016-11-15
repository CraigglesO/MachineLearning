// // every Unit corresponds to a wire in the diagrams
// var Unit = function(value, grad) {
//   // value computed in the forward pass
//   this.value = value;
//   // the derivative of circuit output w.r.t this unit, computed in backward pass
//   this.grad = grad;
// }
//
// var multiplyGate = function(){ };
// multiplyGate.prototype = {
//   forward: function(u0, u1) {
//     // store pointers to input Units u0 and u1 and output unit utop
//     this.u0 = u0;
//     this.u1 = u1;
//     this.utop = new Unit(u0.value * u1.value, 0.0);
//     return this.utop;
//   },
//   backward: function() {
//     // take the gradient in output unit and chain it with the
//     // local gradients, which we derived for multiply gate before
//     // then write those gradients to those Units.
//     this.u0.grad += this.u1.value * this.utop.grad;
//     this.u1.grad += this.u0.value * this.utop.grad;
//   }
// }
//
// var addGate = function(){ };
// addGate.prototype = {
//   forward: function(u0, u1) {
//     this.u0 = u0;
//     this.u1 = u1; // store pointers to input units
//     this.utop = new Unit(u0.value + u1.value, 0.0);
//     return this.utop;
//   },
//   backward: function() {
//     // add gate. derivative wrt both inputs is 1
//     this.u0.grad += 1 * this.utop.grad;
//     this.u1.grad += 1 * this.utop.grad;
//   }
// }
//
// var sigmoidGate = function() {
//   // helper function
//   this.sig = function(x) { return 1 / (1 + Math.exp(-x)); };
// };
// sigmoidGate.prototype = {
//   forward: function(u0) {
//     this.u0 = u0;
//     this.utop = new Unit(this.sig(this.u0.value), 0.0);
//     return this.utop;
//   },
//   backward: function() {
//     var s = this.sig(this.u0.value);
//     this.u0.grad += (s * (1 - s)) * this.utop.grad;
//   }
// }
//
// // create input units
// var a = new Unit(1.0, 0.0);
// var b = new Unit(2.0, 0.0);
// var c = new Unit(-3.0, 0.0);
// var x = new Unit(-1.0, 0.0);
// var y = new Unit(3.0, 0.0);
//
// // create the gates
// var mulg0 = new multiplyGate();
// var mulg1 = new multiplyGate();
// var addg0 = new addGate();
// var addg1 = new addGate();
// var sg0 = new sigmoidGate();
//
// // do the forward pass
// var forwardNeuron = function() {
//   ax = mulg0.forward(a, x); // a*x = -1
//   by = mulg1.forward(b, y); // b*y = 6
//   axpby = addg0.forward(ax, by); // a*x + b*y = 5
//   axpbypc = addg1.forward(axpby, c); // a*x + b*y + c = 2
//   s = sg0.forward(axpbypc); // sig(a*x + b*y + c) = 0.8808
// };
// forwardNeuron();
//
// // console.log('circuit output: ' + s.value); // prints 0.8808
// //
// // s.grad = 1.0;
// // sg0.backward(); // writes gradient into axpbypc
// // addg1.backward(); // writes gradients into axpby and c
// // addg0.backward(); // writes gradients into ax and by
// // mulg1.backward(); // writes gradients into b and y
// // mulg0.backward(); // writes gradients into a and x
// //
// //
// // var step_size = 0.01;
// // a.value += step_size * a.grad; // a.grad is -0.105
// // b.value += step_size * b.grad; // b.grad is 0.315
// // c.value += step_size * c.grad; // c.grad is 0.105
// // x.value += step_size * x.grad; // x.grad is 0.105
// // y.value += step_size * y.grad; // y.grad is 0.210
// //
// // forwardNeuron();
// // console.log('circuit output after one backprop: ' + s.value); // prints 0.8825
// //
// //
// //
// // var forwardCircuitFast = function(a,b,c,x,y) {
// //   return 1/(1 + Math.exp( - (a*x + b*y + c)));
// // };
// // var a = 1, b = 2, c = -3, x = -1, y = 3;
// // var h = 0.0001;
// // var a_grad = (forwardCircuitFast(a+h,b,c,x,y) - forwardCircuitFast(a,b,c,x,y))/h;
// // var b_grad = (forwardCircuitFast(a,b+h,c,x,y) - forwardCircuitFast(a,b,c,x,y))/h;
// // var c_grad = (forwardCircuitFast(a,b,c+h,x,y) - forwardCircuitFast(a,b,c,x,y))/h;
// // var x_grad = (forwardCircuitFast(a,b,c,x+h,y) - forwardCircuitFast(a,b,c,x,y))/h;
// // var y_grad = (forwardCircuitFast(a,b,c,x,y+h) - forwardCircuitFast(a,b,c,x,y))/h;
// //
// //
// // console.log(`gradients [a,b,c,x,y]: [${a_grad},${b_grad},${c_grad},${x_grad},${y_grad},]`)
// //
//
//
//
//
//
//
//
//
//
//
// //training example:
// // A circuit: it takes 5 Units (x,y,a,b,c) and outputs a single Unit
// // It can also compute the gradient w.r.t. its inputs
// var Circuit = function() {
//   // create some gates
//   this.mulg0 = new multiplyGate();
//   this.mulg1 = new multiplyGate();
//   this.addg0 = new addGate();
//   this.addg1 = new addGate();
// };
// Circuit.prototype = {
//   forward: function(x,y,a,b,c) {
//     this.ax = this.mulg0.forward(a, x); // a*x
//     this.by = this.mulg1.forward(b, y); // b*y
//     this.axpby = this.addg0.forward(this.ax, this.by); // a*x + b*y
//     this.axpbypc = this.addg1.forward(this.axpby, c); // a*x + b*y + c
//     return this.axpbypc;
//   },
//   backward: function(gradient_top) { // takes pull from above
//     this.axpbypc.grad = gradient_top;
//     this.addg1.backward(); // sets gradient in axpby and c
//     this.addg0.backward(); // sets gradient in ax and by
//     this.mulg1.backward(); // sets gradient in b and y
//     this.mulg0.backward(); // sets gradient in a and x
//   }
// }
//
// // SVM class
// var SVM = function() {
//
//   // random initial parameter values
//   this.a = new Unit(1.0, 0.0);
//   this.b = new Unit(-2.0, 0.0);
//   this.c = new Unit(-1.0, 0.0);
//
//   this.circuit = new Circuit();
// };
// SVM.prototype = {
//   forward: function(x, y) { // assume x and y are Units
//     this.unit_out = this.circuit.forward(x, y, this.a, this.b, this.c);
//     return this.unit_out;
//   },
//   backward: function(label) { // label is +1 or -1
//
//     // reset pulls on a,b,c
//     this.a.grad = 0.0;
//     this.b.grad = 0.0;
//     this.c.grad = 0.0;
//
//     // compute the pull based on what the circuit output was
//     var pull = 0.0;
//     if(label === 1 && this.unit_out.value < 1) {
//       pull = 1; // the score was too low: pull up
//     }
//     if(label === -1 && this.unit_out.value > -1) {
//       pull = -1; // the score was too high for a positive example, pull down
//     }
//     this.circuit.backward(pull); // writes gradient into x,y,a,b,c
//
//     // add regularization pull for parameters: towards zero and proportional to value
//     this.a.grad += -this.a.value;
//     this.b.grad += -this.b.value;
//   },
//   learnFrom: function(x, y, label) {
//     this.forward(x, y); // forward pass (set .value in all Units)
//     this.backward(label); // backward pass (set .grad in all Units)
//     this.parameterUpdate(); // parameters respond to tug
//   },
//   parameterUpdate: function() {
//     var step_size = 0.01;
//     this.a.value += step_size * this.a.grad;
//     this.b.value += step_size * this.b.grad;
//     this.c.value += step_size * this.c.grad;
//   }
// };
//

var data = []; var labels = [];
data.push([1.2, 0.7]); labels.push(1);
data.push([-0.3, -0.5]); labels.push(-1);
data.push([3.0, 0.1]); labels.push(1);
data.push([-0.1, -1.0]); labels.push(-1);
data.push([-1.0, 1.1]); labels.push(-1);
data.push([2.1, -3]); labels.push(1);
//var svm = new SVM();

var a = 1, b = -2, c = -1; // initial parameters
for(var iter = 0; iter < 200; iter++) {
  // pick a random data point
  var i = Math.floor(Math.random() * data.length);
  var x = data[i][0];
  var y = data[i][1];
  var label = labels[i];

  // compute pull
  var score = a*x + b*y + c;
  var pull = 0.0;
  if(label === 1 && score < 1) pull = 1;
  if(label === -1 && score > -1) pull = -1;

  // compute gradient and update parameters
  var step_size = 0.01;
  a += step_size * (x * pull - a); // -a is from the regularization
  b += step_size * (y * pull - b); // -b is from the regularization
  c += step_size * (1 * pull);
  console.log(`a: ${a}, b: ${a}, c: ${c}`);
  let z = (0.6269209716142944*1.2) + (0.6269209716142944*0.7) - 0.8399999999999999;
  console.log(z);
}
