String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

const getShuffledArr = arr => {
    if (arr.length === 1) {
        return arr
    };
    const rand = Math.floor(Math.random() * arr.length);
    return [arr[rand], ...getShuffledArr(arr.filter((_, i) => i != rand))];
};

const Binarize = arr => {
    for (let i = 0; i < 3; i++) {
        if (arr[i] < 9) {
            base = base.replaceAt(base.length - arr[i], "1");
        } else if (arr[i] == 9) {
            base1 = base1.replaceAt(7, "1");
        } else if (arr[i] == 10) {
            base1 = base1.replaceAt(6, "1");
        }

    }
    return [base, base1];
};

const OUT_ON = "1";
const OUT_OFF = "0";
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let base = "00000000";
let base1 = "00000000";


shuffled_array = getShuffledArr(arr);
console.log(shuffled_array);
// bases = Binarize(shuffled_array);

// console.log(bases[0]);
// console.log(bases[1]);
//   var hexa = parseInt(base, 2).toString(16).toUpperCase();
//   console.log(typeof hexa);

chunk1 = shuffled_array.slice(0,3);
chunk2 = shuffled_array.slice(3,6);
chunk3 = shuffled_array.slice(6,9);
chunnk4 = shuffled_array.slice(9).concat(shuffled_array.slice(0,2));
chunk5 = shuffled_array.slice(2,5);

console.log(chunk1 , chunk2 , chunk3 , chunnk4 , chunk5);

bases = Binarize(chunk1);

console.log(bases);

// console.log(parseInt(bases[0],2 ).toString(16), parseInt(bases[1],2).toString(16));
// console.log(bases[0], bases[1]);

const turn_on_button_leds = arr => {
      for (let i = 0; i < arr[0].length; i++) {
        if (arr[0][i] == "1") {
          //arduino.sendCmd("O" + (arr[0].length - i) + OUT_ON);
          console.log("First RElay");
          console.log("O" + (arr[0].length - i+3) + OUT_ON);
        }
      }
      let len = arr[1].length;
      for (let i = 1; i < 3; i++) {
          if((arr[1][len - i] ) == "1"){
            //arduino.sendCmd("O" + ((i+8).toString()) + OUT_ON);
            console.log("Second RElay");
            //console.log("O" + ((i+8).toString()) + OUT_ON);
            console.log("O" + (i+11) + OUT_ON);
          }
        
      }

  };

turn_on_button_leds(bases);


const turn_off_button_leds = () => {
    for (let i = 3; i < 13; i++) {
      console.log("O" + ((i + 1).toString()) + OUT_OFF);
    }
  };

  console.log("--------------");

turn_off_button_leds();

// let myarr = [[1,2,3] , [4,5,6] , [7,8,9] , [1,4,7]]
// const getCurrentButtons = arr => {
//     return arr[Math.floor((Math.random()*arr.length))];
//   };

// console.log(getCurrentButtons(myarr));

// const rand_Led = (min, max) =>  { // min and max included 
//     return Math.floor(Math.random() * (max - min + 1) + min)
//   }

// console.log(rand_Led(7,9));



// myarr = Array.from({length: 16}, (_, i) => (i+1).toString());
// console.log(myarr);



// random_images = getShuffledArr(myarr);
// console.log(random_images);

// current_image = random_images[0];

// console.log(current_image);
// image_idx = myarr.indexOf(current_image) + 1;

// console.log(image_idx);


// let image_to_countries = new Map([
//     ["1", ["00000001", "00000000"]],
//     ["2", ["00000010", "00000000"]],
//     ["3", ["00001100", "00000000"]],
//     ["4", ["00110000", "00000000"]],
//     ["5", ["11000000", "00000000"]],
//     ["6", ["00100000", "00000011"]],
//     ["7", ["10001010", "00000000"]],
//     ["8", ["10000000", "00000101"]],
//     ["9", ["11100000", "00000000"]],
//     ["10", ["00001010", "00000100"]],
//     ["11", ["10000000", "00000011"]],
//     ["12", ["01000101", "00000000"]],
//     ["13", ["01010000", "00000010"]],
//     ["14", ["10010000", "00000001"]],
//     ["15", ["00000101", "00000100"]],
//     ["16", ["00000100", "00000011"]],
//   ]);

//   let positions = ["10000000", "00000011"];


//   function getValue(key) {
//     return [...image_to_countries].find(([key, val]) => key.toString() == key.toString())[0];
//   }
  
//   console.log(image_to_countries.get("14"));



// let button_indexes = [
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9],
//   [1, 5, 9],
//   [1, 4, 7],
//   [3, 6, 9],
//   [3, 5, 7],
//   [2, 5, 8]
// ];

// const getCurrentButtons = arr => {
//   return arr[Math.floor((Math.random() * arr.length))];
// };


// console.log(getCurrentButtons(button_indexes));




