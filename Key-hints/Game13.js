///
///                                                             H2C DEVELOPMENT CONFIDENTIAL
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


/////////////////////////////////////////////////////////////////////////  TONNEAUX  ////////////////////////////////////////////////////////////////////////////

const arduino = require("./arduino.js");

let fouras_sentence = 'To be defined';
let game_time = 3;
let cell_number = 13;

let go = 0;
let tries = 0;
let maxTries = 20; // numbeer of tries
let interpret = false;
let game_name = "Tonneaux";
let sequence = 0; // required number of sequences to win [PS: MAX 5]
let Maxsequence = 5;
let unshuffled = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let shuffled_array = [];
let chunk1, chunk2, chunk3, chunk4, chunk5 = [];

const OUT_ON = "1";
const OUT_OFF = "0";

/*
Objectives:
Ambiance entrepôt marine marchande. Il existe des tonneaux et des caisses et des sacs de grain. 
Sur chaque tonneau se trouve un bouton, au total 10. Des boutons s’allument en simultané. 
Il faut appuyer sur tous les boutons allumés en même temps. Difficulté il faut rester en hauteur.
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
OUTPUT 1 : LED 1
OUTPUT 2 : LED 2
OUTPUT 3 : LED 3
OUTPUT 4 : LED 4
OUTPUT 5 : LED 5
OUTPUT 6 : LED 6
OUTPUT 7 : LED 7
OUTPUT 8 : LED 8
OUTPUT 9 : LED 9
OUTPUT 10 : LED 10
*/

String.prototype.replaceAt = function (index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

let outputs = Array.from({ length: 10 }, (_, i) => (i + 1)
);

const getShuffledArr = arr => {
  if (arr.length === 1) {
    return arr
  };
  const rand = Math.floor(Math.random() * arr.length);
  return [arr[rand], ...getShuffledArr(arr.filter((_, i) => i != rand))];
};

const Binarize = arr => {
  let base = "0000000000000000";
  for (let i = 0; i < 3; i++) {
      base = base.replaceAt(base.length - arr[i], "1");
};
return parseInt(base,2 );
}

// turn on the 3 random chosen button leds 
const turn_on_button_leds = arr => {
  for (var i in arr) {
    arduino.set_output(arr[i]+4 , OUT_ON);
}
};

//turn off all the button leds
const turn_off_button_leds = arr => {
  for (var i in arr) {
    arduino.set_output(arr[i]+4 , OUT_OFF);
}
};

arduino.emitter.on("interpret", () => {
  console.log("interpret received ...")
  interpret = true;
});

// arduino.emitter.on("cmdFailedEvent", (msg) => {
//   console.log("\nTimeout out command, no answer from arduino");
// });

arduino.emitter.on("EventInput", (numEvent, input) => {
  //input = ~ input;
  if (interpret == true) {
    console.log(
      "Event = ", numEvent, " Input = ", input);

    if (input == winning_buttons) {
      sequence+=1;
      // console.log("Gets here, sequence = ", sequence);
      if (sequence < Maxsequence) {
        // turn off current leds
        console.log("turning off this ,",outputs);
        turn_off_button_leds(outputs);
        console.log("next chunk is ", chunks[sequence]);
        winning_buttons = Binarize(chunks[sequence]);
        console.log("After being binarized ", winning_buttons);
        // turn on next random 3 leds.
        turn_on_button_leds(chunks[sequence]);

        // console.log("WINNING BUTTONS ", chunks[sequence]);
        // console.log("Binarized verison "  , winning_buttons);
      }

    }

    if (input & 0xFC00){
      console.log("Loss Checker Triggered.");
      tries += 1; // mask 1111 1100 0000 0000 check if one the sensors is ON
      console.log(maxTries-tries+" tries left.");
    }
      
    
  }
});

arduino.emitter.on("Start", () => {
  sequence = 0;
  maxTries = 20;
  shuffled_array = getShuffledArr(unshuffled);
  chunk1 = shuffled_array.slice(0, 3);
  chunk2 = shuffled_array.slice(3, 6);
  chunk3 = shuffled_array.slice(6, 9);
  chunk4 = shuffled_array.slice(9).concat(shuffled_array.slice(0, 2));
  chunk5 = shuffled_array.slice(2, 5);
  chunks = [chunk1, chunk2, chunk3, chunk4, chunk5];
  winning_buttons = Binarize(chunk1);
  turn_off_button_leds(outputs);
  console.log("chunk1 & positions ", chunk1 , winning_buttons);
  turn_on_button_leds(chunk1);

} );

arduino.emitter.on("Reset", () => {
  console.log("[TIMEOUT RESET] ... Resetting Flags." , outputs);
  interpret = false;
  turn_off_button_leds(outputs);
});


function gameWon() {
  if (sequence >= Maxsequence) {
    sequence = 0;
    interpret=false;
    turn_off_button_leds(outputs);
    return true;
  }
}

function gameLost() {
  if (tries >= maxTries) {
    console.log("lost the game , ", tries , maxTries);
    sequence = 0;
    interpret=false;
    turn_off_button_leds(outputs);
    return true;}
}

function cell_info() {
  return {
    fouras_sentence,
    game_time,
    cell_number,
    game_name
  };
}
module.exports = {
  gameWon,
  cell_info,
  gameLost
};