

class NeuralNet {
  constructor(sizes) {

    let result = [];
    sizes.forEach((x,i) => {
      if (i !== 0){
        result.push(Array.apply(null, Array(x)).map(function (r) { return Math.random(); }));
      }
    });


    this.sizes = sizes;

    this.layerCount = sizes.length;

    this.biases = result;

    this.weights = result;
  }

  sigmoid (z) {
    return 1.0/(1.0+Math.exp(-z));
  }

  feedForward (a) {
    // """Return the output of the network if "a" is input."""
        for b, w in zip(self.biases, self.weights):
            a = sigmoid(np.dot(w, a)+b)
        return a
  }

}


let arr = [3,5,10];
let penis = new NeuralNet(arr);
console.log(penis.biases);
console.log(penis.weights);
