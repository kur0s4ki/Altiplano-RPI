///
///                                                          H2C DEVELOPMENT CONFIDENTIAL
///
/// Unpublished Copyright (c) 2020 2021 H2C DEVELOPMENT, All Rights Reserved.
///
/// NOTICE:  All information contained herein is, and remains the property of H2C DEVELOPMENT. The intellectual and technical concepts contained
/// herein are proprietary to H2C DEVELOPMENT and may be covered by Maroccan and Foreign Patents, patents in process, and are protected by trade secret or copyright law.
/// Dissemination of this information or reproduction of this material is strictly forbidden unless prior written permission is obtained
/// from H2C DEVELOPMENT.  Access to the source code contained herein is hereby forbidden to anyone except current COMPANY employees, managers or contractors who have executed
/// Confidentiality and Non-disclosure agreements explicitly covering such access.
///
/// The copyright notice above does not evidence any actual or intended publication or disclosure  of  this source code, which includes
/// information that is confidential and/or proprietary, and is a trade secret, of  COMPANY.   ANY REPRODUCTION, MODIFICATION, DISTRIBUTION, PUBLIC  PERFORMANCE,
/// OR PUBLIC DISPLAY OF OR THROUGH USE  OF THIS  SOURCE CODE  WITHOUT  THE EXPRESS WRITTEN CONSENT OF COMPANY IS STRICTLY PROHIBITED, AND IN VIOLATION OF APPLICABLE
/// LAWS AND INTERNATIONAL TREATIES.  THE RECEIPT OR POSSESSION OF  THIS SOURCE CODE AND/OR RELATED INFORMATION DOES NOT CONVEY OR IMPLY ANY RIGHTS
/// TO REPRODUCE, DISCLOSE OR DISTRIBUTE ITS CONTENTS, OR TO MANUFACTURE, USE, OR SELL ANYTHING THAT IT  MAY DESCRIBE, IN WHOLE OR IN PART.
///

///////////////////////////////////////////////// 7 Familles ////////////////////////////////////////////////////////////////////

/// input mapping
/*
INPUT 1: Button 1
INPUT 2: Button 2
INPUT 3: Button 3
INPUT 4: Button 4
INPUT 5: Button 5
INPUT 6: Button 6
INPUT 7: Button 7
INPUT 8: Button 8
INPUT 9: Button 9
INPUT 10: Button 10
INPUT 11: Button 11
INPUT 12: Button 12
INPUT 13: Button 13
INPUT 14: Button 14
INPUT 15: Button 15
INPUT 16: Button 16
INPUT 17: FAKE
INPUT 18: FAKE
INPUT 19: FAKE
INPUT 20: FAKE


Objectives:
Une série de carte s'affiche sur l'écran. Les joueurs devront retrouver ces cartes
dans la pièce et appuyer simultanément sur les boutons correspondants.


*/

/*
image 1 : [1]
image 2 : [2]
image 3 : [3 , 4]
image 4 : [5 , 6]
image 5 : [7 , 8]
Image 6 : [6 , 10 , 9]
image 7 : [2 , 4 , 8]
image 8 : [8 , 9 , 11]
image 9 : [6 , 5 , 7]
image 10 : [2 , 4 , 11]
image 11 : [10 , 8 , 9]
image 12 : [1 , 3 , 7]
image 13 : [5 , 7 , 10]
image 14 : [5 , 9 , 8]
image 15 : [11 , 1 , 3]
image 16 : [3 , 9 , 10]

India     : Button 1
UK        : Button 2
France    : Button 3
USA       : Button 4
Australia : Button 5
Egypt     : Button 6
China     : Button 7
Kenya     : Button 8
Italy     : Button 9
Mexico    : Button 10
Brazil    : Button 11


*/

const arduino = require("./arduino.js");

let unshuffled_images = Array.from({ length: 16 }, (_, i) =>
  (i + 1).toString()
);

let go = 0;
let interpret = false;
let max_score = 2;
let current_image = "1";

let fouras_sentence = "La bonne destination tu trouveras";
let game_time = 3;
let cell_number = 34;
let game_name = "7 familles";

// let image_to_countries = new Map([
//   ["1", ["00000001", "00000000"]],
//   ["2", ["00000010", "00000000"]],
//   ["3", ["00001100", "00000000"]],
//   ["4", ["00110000", "00000000"]],
//   ["5", ["11000000", "00000000"]],
//   ["6", ["00100000", "00000011"]],
//   ["7", ["10001010", "00000000"]],
//   ["8", ["10000000", "00000101"]],
//   ["9", ["11100000", "00000000"]],
//   ["10", ["00001010", "00000100"]],
//   ["11", ["10000000", "00000011"]],
//   ["12", ["01000101", "00000000"]],
//   ["13", ["01010000", "00000010"]],
//   ["14", ["10010000", "00000001"]],
//   ["15", ["00000101", "00000100"]],
//   ["16", ["00000100", "00000011"]],
// ]);

let image_to_countries = new Map([
  ["1", 1],
  ["2", 2],
  ["3", 12],
  ["4", 48],
  ["5", 192],
  ["6", 800],
  ["7", 138],
  ["8", 1408],
  ["9", 224],
  ["10", 1034],
  ["11", 896],
  ["12", 69],
  ["13", 592],
  ["14", 400],
  ["15", 1029],
  ["16", 772],
]);

let image_to_countries_helper = new Map([
  ["1", [1]],
  ["2", [2]],
  ["3", [3, 4]],
  ["4", [5, 6]],
  ["5", [7, 8]],
  ["6", [6, 10, 9]],
  ["7", [2, 4, 8]],
  ["8", [8, 9, 11]],
  ["9", [6, 5, 7]],
  ["10", [2, 4, 11]],
  ["11", [10, 8, 9]],
  ["12", [1, 3, 7]],
  ["13", [5, 7, 10]],
  ["14", [5, 9, 8]],
  ["15", [11, 1, 3]],
  ["16", [3, 9, 10]],
]);

const getShuffledArr = (arr) => {
  if (arr.length === 1) {
    return arr;
  }
  const rand = Math.floor(Math.random() * arr.length);
  return [arr[rand], ...getShuffledArr(arr.filter((_, i) => i != rand))];
};

arduino.emitter.on("cmdFailedEvent", (msg) => {
  console.log("\nTimeout out command, no answer from arduino");
});

arduino.emitter.on("interpret", () => {
  console.log("interpret received ...");
  interpret = true;
});

arduino.emitter.on("stop_interpret", () => {
  console.log("stop interpret received ...");
  interpret = false;
});

arduino.emitter.on("EventInput", (numEvent, input) => {
  console.log("Event received " + numEvent);
  //input = ~input;
  console.log(
    "WINNING BUTTONS : ",
    image_to_countries_helper.get(current_image)
  );

  if (interpret) {
    if (input == winning_button_input) {
      score+=1;
      if (random_images.indexOf(current_image) < random_images.length - 1) {
        current_image = random_images[random_images.indexOf(current_image) + 1];
        winning_button_input = image_to_countries.get(current_image);
        arduino.emitter.emit("post_image_index", parseInt(current_image));
        console.log("This is the new image index " + current_image);
        console.log(
          "WINNING BUTTONS : ",
          image_to_countries_helper.get(current_image)
        );
      } else {
        current_image = random_images[0];
        winning_button_input = image_to_countries.get(current_image);
        arduino.emitter.emit("post_image_index", parseInt(current_image));
        console.log("This is the new image index " + current_image);
        console.log(
          "WINNING BUTTONS : ",
          image_to_countries_helper.get(current_image)
        );
      }
    }
  }
});

arduino.emitter.on("Start", () => {
  console.log("resetting flags ...");
  interpret = false;
  score = 0;
  random_images = getShuffledArr(unshuffled_images);
  current_image = random_images[0];
  //current_image = "2";
  //positions = image_to_countries.get(current_image);
  winning_button_input = image_to_countries.get(current_image);
  console.log("------------------------------------------------");
  //console.log("Random images " + parseInt(current_image));
  console.log("starting index " + parseInt(current_image));
  arduino.emitter.emit("post_image_index", parseInt(current_image));
  console.log(
    "WINNING BUTTONS : ",
    image_to_countries_helper.get(current_image)
  );
});

function gameWon() {
  if (score >= max_score) return true;
}

function gameLost() {
  return false;
}

function cell_info() {
  return {
    fouras_sentence,
    game_time,
    cell_number,
    game_name,
  };
}

module.exports = {
  gameWon,
  gameLost,
  cell_info,
};
