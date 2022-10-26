// // if (numEvent == "1" || numEvent == "2" || numEvent == "3" || numEvent == "4" || numEvent == "5" || numEvent == "6" || numEvent == "7" || numEvent == "8") {
// //     let v = arduino.get_input2().then((val) => {
// //       val = ~val;
// //       // input = input.toString(2);
// //       // val = val.toString(2);
// //       console.log("input(1st relay) || val(2nd relay)" + input  ,  val);
// //       console.log("positions states " +  positions[0]  ,  positions[1]);
// //       if (((input &  parseInt(positions[0],2)) ==  parseInt(positions[0],2)) && ((val &  parseInt(positions[1],2)) ==  parseInt(positions[1],2))) {
// //         console.log("Inside , wait 3 seconds ...");
// //         id=setTimeout(() => {
// //           let x =  arduino.get_input1().then((val1)=>{ 
// //             val1=~val1;
// //             console.log("3 sec finished...");
// //             if (((input &  parseInt(positions[0],2)) ==  parseInt(positions[0],2)) && ((val1 &  parseInt(positions[1],2)) ==  parseInt(positions[1],2))) {
// //               console.log("Still Clicking ...");
// //               flag1 = true;
// //             };
// //           });
// //       }, 3000);

// //       }

// //     });
    
    
// //   } else if (numEvent == "9" || numEvent == "10") {
// //     let v = arduino.get_input1().then((valn) => {
// //       valn= ~valn;
// //       // input = input.toString(2);
// //       // val = val.toString(2);
// //       console.log("input(2nd relay) || val(1st relay)" + input  ,  valn);
// //       console.log("positions states " +  positions[0]  ,  positions[1]);

// //       if (((valn & parseInt(positions[0],2)) == parseInt(positions[0],2)) && ((input &  parseInt(positions[1],2)) == parseInt(positions[1],2))) {
// //         console.log("Inside , wait 3 seconds ...");
// //         id=setTimeout(() => {
// //           let x =  arduino.get_input1().then((val2)=>{ 
// //             val2=~val2;
// //             console.log("3 sec finished...");
// //             if (((val2 & parseInt(positions[0],2)) == parseInt(positions[0],2)) && ((input &  parseInt(positions[1],2)) == parseInt(positions[1],2))){
// //               console.log("Still Clicking ...");
// //               flag1 = true;
// //             } 
// //           });
// //       }, 3000);
// //       }
// //     });
    
// //   }

// ////////////////////////////////////////////////////////////////////////////////


// if (interpret == true) {
//   if (
//     numEvent == "1" ||
//     numEvent == "2" ||
//     numEvent == "3" ||
//     numEvent == "4" ||
//     numEvent == "5" ||
//     numEvent == "6" ||
//     numEvent == "7" ||
//     numEvent == "8"
//   ) {
//     if (current_image == "1" || current_image == "2") {
//       go = 2;
//     } else {
//       go += 1;
//     }

//     let v = arduino.get_input2().then((val) => {
//       val = ~val;
//       input = input.toString(2);
//       val = val.toString(2);
//       console.log("input(1st relay) || val(2nd relay)" + input  ,  val);
//       console.log("positions states " +  positions[0]  ,  positions[1]);
//       if (
//         (input & parseInt(positions[0], 2)) == parseInt(positions[0], 2) &&
//         (val & parseInt(positions[1], 2)) == parseInt(positions[1], 2) &&
//         go >= 2
//       ) {
//         go = 0;
//         //console.log("GETS HERE");
//         if (random_images.indexOf(current_image) < random_images.length - 1) {
//           current_image =
//             random_images[random_images.indexOf(current_image) + 1];
//           positions = image_to_countries.get(current_image);
//           arduino.emitter.emit("post_image_index", parseInt(current_image));
//           console.log("This is the new image index " + current_image);
//           console.log(
//             "WINNING BUTTONS : ",
//             image_to_countries_helper.get(current_image)
//           );
//         } else {
//           current_image = random_images[0];
//           positions = image_to_countries.get(current_image);
//           arduino.emitter.emit("post_image_index", parseInt(current_image));
//           console.log("This is the new image index " + current_image);
//           console.log(
//             "WINNING BUTTONS : ",
//             image_to_countries_helper.get(current_image)
//           );
//         }
//       }
//     });
//   } else if (numEvent == "9" || numEvent == "10" || numEvent == "11") {
//     go += 1;
//     let v = arduino.get_input1().then((val) => {
//       val = ~val;
//       input = input.toString(2);
//       val = val.toString(2);
//       console.log("input(2nd relay) || val(1st relay) " + input  ,  val);
//       console.log("positions states " +  positions[0]  ,  positions[1]);
//       if (
//         (val & parseInt(positions[0], 2)) == parseInt(positions[0], 2) &&
//         (input & parseInt(positions[1], 2)) == parseInt(positions[1], 2) &&
//         go >= 2
//       ) {
//         go = 0;
//         // console.log("GETS HERE");
//         if (random_images.indexOf(current_image) < random_images.length - 1) {
//           current_image =
//             random_images[random_images.indexOf(current_image) + 1];
//           positions = image_to_countries.get(current_image);
//           arduino.emitter.emit("post_image_index", parseInt(current_image));
//           console.log("This is the new image index " + current_image);
//           console.log(
//             "WINNING BUTTONS : ",
//             image_to_countries_helper.get(current_image)
//           );
//         } else {
//           current_image = random_images[0];
//           positions = image_to_countries.get(current_image);
//           arduino.emitter.emit("post_image_index", parseInt(current_image));
//           console.log("This is the new image index " + current_image);
//           console.log(
//             "WINNING BUTTONS : ",
//             image_to_countries_helper.get(current_image)
//           );
//         }
//       }
//     });
//   }
// }

String.prototype.replaceAt = function (index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

const Binarize = arr => {
  let base = "00000000";
  let base1 = "00000000";
  let result="";
  for (let i = 0; i < 3; i++) {
    if (arr[i] < 9) {
      base = base.replaceAt(base.length - arr[i], "1");
    } else if (arr[i] == 9) {
      base1 = base1.replaceAt(7, "1");
    } else if (arr[i] == 10) {
      base1 = base1.replaceAt(6, "1");
    }
  }
  return parseInt(result.concat(base1,base),2 );
};

console.log(Binarize([1,2,3]));