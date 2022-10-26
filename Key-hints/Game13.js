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


//////////////////////////////////////////////////////  TONNEAUX  ////////////////////////////////////////////////////////////////////////////

const arduino = require("../arduino.js");

let fouras_sentence = 'To be defined';
let game_time = 3;
let cell_number = 1;

let go = 0;
let tries = 0;
let maxTries = 20;
let interpret = false;
let game_name = "Tonneaux";
let sequence = 0;
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

const getShuffledArr = arr => {
  if (arr.length === 1) {
    return arr
  };
  const rand = Math.floor(Math.random() * arr.length);
  return [arr[rand], ...getShuffledArr(arr.filter((_, i) => i != rand))];
};

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

// turn on the 3 random chosen button leds 
const turn_on_button_leds = arr => {
  for (let i = 0; i < arr[0].length; i++) {
    if (arr[0][i] == "1") {
      arduino.set_output((arr[0].length - i+3) , OUT_ON);
    }
  }
  let len = arr[1].length;
  for (let i = 1; i < 3; i++) {
      if((arr[1][len - i] ) == "1"){
        arduino.set_output((i+11) , OUT_ON);
      }
  }

};

//turn off all the button leds
const turn_off_button_leds = () => {
  for (let i = 3; i < 13; i++) {
    console.log("turning off leds");
    arduino.set_output((i + 1) ,  OUT_OFF);
  }
};

arduino.emitter.on("interpret", () => {
  console.log("interpret received ...")
  interpret = true;
});

arduino.emitter.on("cmdFailedEvent", (msg) => {
  console.log("\nTimeout out command, no answer from arduino");
});

arduino.emitter.on("EventInput", (numEvent, input) => {
  console.log("Event received ", numEvent);
  input = ~input;

  // positions[0] contains the states of the randomly chosen first 8 buttons.
  // positions[1] contains the states of the 9th and 10th randomly chosen buttons.
  if (interpret == true) {
    // compare the states of the input with randomly chosen 3 buttons.

    // if (numEvent == "1" || numEvent == "2" || numEvent == "3" || numEvent == "4" || numEvent == "5" || numEvent == "6" || numEvent == "7" || numEvent == "8") {
    //   go +=1;
    //   console.log("go = ",go);
    //   let v = arduino.get_input2().then((val) => {
    //     val = ~val;
    //     console.log("input2 Called , results = ", val);
    //     if (((input & parseInt(positions[0],2)) == parseInt(positions[0],2)) && ((val & parseInt(positions[1],2)) == parseInt(positions[1],2)) && go >= 2) {
    //       go = 0;
    //       // if the right buttons are pressed , augment the sequence by 1.
    //       sequence += 1;
    //       console.log("Gets here, sequence = ", sequence);
    //       // while the sequence hasn't reached 5 , chose the next random 3 buttons.
    //       if (sequence < 5) {
    //         // turn off current leds
    //         turn_off_button_leds();

    //         console.log("next chunk is ", chunks[sequence]);
    //         positions = [];
    //         positions = Binarize(chunks[sequence]);
    //         console.log("After being binarized ", positions);
    //         // turn on next random 3 leds.
    //         turn_on_button_leds(positions);

    //         console.log("WINNING BUTTONS ", chunks[sequence]);
    //         console.log("positions states " +  positions[0]  ,  positions[1]);
    //       }
    //     }
    //   });

      
    // } else if (numEvent == "9" || numEvent == "10") {
    //   go +=1;
    //   console.log("go = ",go);
    //   let v = arduino.get_input1().then((val) => {
    //     val = ~val;
    //     console.log("input1 Called , results = ", val);
    //     if (((val & parseInt(positions[0],2)) == parseInt(positions[0],2)) && ((input & parseInt(positions[1],2)) == parseInt(positions[1],2)) && go >=2) {
    //       go = 0;
    //       // if the right buttons are pressed , augment the sequence by 1.
    //       sequence += 1;
    //       console.log("Gets here, sequence = ", sequence);
    //       // while the sequence hasn't reached 5 , chose the next random 3 buttons.
    //       if (sequence < 5) {
    //         // turn off current leds
    //         turn_off_button_leds();

    //         console.log("next chunk is ", chunks[sequence]);
    //         positions = [];
    //         positions = Binarize(chunks[sequence]);
    //         console.log("After being binarized ", positions);
    //         // turn on next random 3 leds.
    //         turn_on_button_leds(positions);

    //         console.log("WINNING BUTTONS ", chunks[sequence]);
    //         console.log("positions states " +  positions[0]  ,  positions[1]);
    //       }
    //     }
    //   });

    // }

    // if one or more sensors are HIGH , count it as a failed try.
    //arduino.get_input1().then((val) => {console.log("teeeeeest",val)} );
    arduino.get_input2().then((val) => {
      val = ~val;
      console.log("[LOSS CHECKER] , value = ", val);
      console.log("states of the 2nd relay card inputs ", val);
      if (val & 0xFC) tries += 1; // mask 1111 1100 check if one the sensors is ON
      console.log(maxTries-tries+" tries left.");
    });
  }
});

arduino.emitter.on("Start", () => {
  lost = false;
  sequence = 0;
  maxTries = 20;
  shuffled_array = getShuffledArr(unshuffled);
  chunk1 = shuffled_array.slice(0, 3);
  chunk2 = shuffled_array.slice(3, 6);
  chunk3 = shuffled_array.slice(6, 9);
  chunk4 = shuffled_array.slice(9).concat(shuffled_array.slice(0, 2));
  chunk5 = shuffled_array.slice(2, 5);
  chunks = [chunk1, chunk2, chunk3, chunk4, chunk5];
  positions = Binarize(chunk1);
  turn_off_button_leds();
  turn_on_button_leds(positions);

  console.log("WINNING BUTTONS ", chunk1);
  console.log("positions states " +  positions[0]  ,  positions[1]);

} );


function gameWon() {
  if (sequence >= 5) return true;
}

function gameLost() {
  if (tries >= maxTries) {
    console.log("lost the game , ", tries , maxTries);
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