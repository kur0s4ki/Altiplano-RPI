///
///                                                            H2C DEVELOPMENT CONFIDENTIAL
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

////////////////////////////////////////////////////////////////////////////////// PERCHES /////////////////////////////////////////////////////////////////////////////////////////////

/// I/O mappings
/*
INPUT 1: BUTTON 1
INPUT 2: BUTTON 2
INPUT 3: BUTTON 3
INPUT 4: BUTTON 4
INPUT 5: BUTTON 5
INPUT 6: BUTTON 6
INPUT 7: BUTTON 7
INPUT 8: BUTTON 8
INPUT 9: BUTTON 9

OUTPUT 1: LED 1
OUTPUT 2: LED 2
OUTPUT 3: LED 3
OUTPUT 4: LED 4
OUTPUT 5: LED 5
OUTPUT 6: LED 6
OUTPUT 7: LED 7
OUTPUT 8: LED 8
OUTPUT 9: LED 9



Objectives:
Un damier de 9 cases numérotées au plafond. Les joeurs vont devoir trouver les 3 chiffres 
qui déclencheront la libération de la clé. Ces 3 chiffres sont alignés à l'horizontal, 
à la verticale ou en diagonale. Pour cela, chacun va devoir monter à la perche pour appuyer 
sur un bouton correspondant à une case. Si le chiffre s'allume, cela indique que le chiffre est bon. 
Les 3 chiffres trouvés, les 3 candidats doivent appuyer chacun sur leur interrupteur simultanément durant 3 secondes. 


*/

const arduino = require("../arduino.js");

let button_indexes = [
  [1, 2, 3, 7],
  [4, 5, 6, 56],
  [7, 8, 9, 448],
  [1, 5, 9, 273],
  [1, 4, 7, 73],
  [3, 6, 9, 292],
  [3, 5, 7, 84],
  [2, 5, 8, 146],
];

let current_buttons = [];
let Correct_input = 0;
let first = false;
let interpret = false;

let fouras_sentence = "to be defined";
let game_time = 3;
let cell_number = 11;
let game_name = "Perches";
let flag1 = false;

const OUT_ON = "1";
const OUT_OFF = "0";

String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substr(0, index) +
    replacement +
    this.substr(index + replacement.length)
  );
};

const Binarize = (arr) => {
  let base = "00000000";
  let base1 = "00000000";
  for (let i = 0; i < 3; i++) {
    if (arr[i] < 9) {
      base = base.replaceAt(base.length - arr[i], "1");
    } else if (arr[i] == 9) {
      base1 = base1.replaceAt(7, "1");
    }
  }
  return [base, base1];
};

const turn_off_buttons = () => {
  console.log("Turning off all buttons.");
  // for (let i = 5; i <= 14; i++) {
  //   arduino.set_output( i.toString() , OUT_OFF);
  // }
  arduino.set_output(current_buttons[0] + 4, OUT_OFF);
  arduino.set_output(current_buttons[1] + 4, OUT_OFF);
  arduino.set_output(current_buttons[2] + 4, OUT_OFF);
};

const getCurrentButtons = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

arduino.emitter.on("cmdFailedEvent", () => {
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
  //input = ~ input;
  if (interpret == true) {
    console.log(
      "Event = ",
      numEvent,
      " Input = ",
      input,
      " flag:",
      current_buttons.includes(parseInt(numEvent))
    );
    if (current_buttons.includes(parseInt(numEvent))) {
      console.log("gets here...");
      arduino.set_output((parseInt(numEvent) + 4).toString(), OUT_ON);
      setTimeout(() => {
        arduino.set_output((parseInt(numEvent) + 4).toString(), OUT_OFF);
      }, 1500);
    }

    if (input == Correct_input) {
      setTimeout(() => {
        arduino.get_input1().then((value) => {
          //value = ~value;
          console.log("input1 Called , results = ", value);
          if (input == value) {
            flag1 = true;
          }
        });
      }, 3000);
    }
  }
});

arduino.emitter.on("Start", () => {
  console.log("resetting flags ...");
  interpret = false;
  flag1 = false;
  turn_off_buttons();
  // get three random XO number (1,2,3 o4 1,4,7 or 1,5,9 etc ...)
  current_buttons = getCurrentButtons(button_indexes);
  console.log("Current Buttons ", current_buttons);
  // arduino.set_output(current_buttons[0]+4, OUT_ON);
  // arduino.set_output(current_buttons[1]+4, OUT_ON);
  // arduino.set_output(current_buttons[2]+4, OUT_ON);
  Correct_input = current_buttons[3];
  console.log("Correct Input is : ", Correct_input);
  //positions = Binarize(current_buttons);
  //console.log("Positions are ", positions[0], positions[1]);
});

arduino.emitter.on("Reset", () => {
  console.log("resetting flags ...");
  interpret = false;
  flag1 = false;
  turn_off_buttons();
});

function gameWon() {
  if (first && flag1) {
    first = false;
    turn_off_buttons();
  }
  if (flag1) return true;
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
