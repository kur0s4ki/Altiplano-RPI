String.prototype.replaceAt = function (index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

const Binarize = arr => {
    let base = "0000000000000000";
    for (let i = 0; i < 3; i++) {
        base = base.replaceAt(base.length - arr[i], "1");
    
  };
  return parseInt(base,2 );
}
console.log(Binarize([5,6,7]));