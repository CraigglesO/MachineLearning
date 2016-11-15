const Matrix = require('node-matrix');


// var x = new Matrix([[1,2,3,4]]);
//
// console.log(x);
//
//
// var matrix = Matrix({ rows: 3, columns: 2, values: Math.random });
//
// console.log(matrix);



// Matrix {
//   '0':
//    [ -5.1400744820746215e-8,
//      -6.350052152070488e-8,
//      -2.858682838452799e-7 ],
//   numRows: 1,
//   numCols: 3,
//   dimensions: [ 1, 3 ] }
// Matrix {
//   '0': [ 0 ],
//   '1': [ 0 ],
//   '2': [ 1 ],
//   numRows: 3,
//   numCols: 1,
//   dimensions: [ 3, 1 ] }


let x = new Matrix([[ -5.1400744820746215e-8,-6.350052152070488e-8,-2.858682838452799e-7 ]]);

let y = new Matrix([
  [0],
  [0],
  [1]
]);

console.log(x);
console.log();

console.log();

console.log();
console.log(y);

console.log();

console.log();
console.log(Matrix.multiply(x,y));
