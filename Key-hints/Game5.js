///
///                                                                   H2C DEVELOPMENT CONFIDENTIAL
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

/////////////////////////////////////////////////////////////////////////// CYLINDRES /////////////////////////////////////////////////////////////////////////////

const arduino = require("./arduino.js");

/// input mapping

/*
INPUT 1: BUTTON1
INPUT 2: Sensor


Objectives:
Le candidat doit progresser Ã  califourchon sur des cylindres de tailles diffÃ©rentes (au nombre de 5)
qui sont le long d'un axe horizontal au bout duquel se trouve un bouton. Mais ces cylindres tournent 
et en cas de chute il doit recommencer depuis le dÃ©but. Cette Ã©preuve demande du calme et savoir Ã©quilibrer son corps.
*/



let led = 0;
let barled = 0;
let flag1 = false;
let detect = false;
let tries = 0;
let maxTries = 5;
let interpret = false;

let fouras_sentence = "En restant sur les cylindres, la salle tu traverseras";
let game_time = 3;
let cell_number = 5;
let game_name = "Cylindres";

// arduino.emitter.on("cmdFailedEvent", () => {
//   console.log("\nTimeout out command, no answer from arduino");
// });

arduino.emitter.on("interpret", () => {
  console.log("interpret received ...");
  interpret = true;
});
arduino.emitter.on("stop_interpret", () => {
  console.log("stop interpret received ...");
  interpret = false;
});

arduino.emitter.on("EventInput", (numEvent, input) => {
  if (interpret == true) {
    detect = false;
    console.log(numEvent + "..." + input);
    if (numEvent == "2") {
      tries += 1;
      detect = true;

      for (let i = 1; i <= maxTries; i++) {
        if (tries == i) led = led + 100 / maxTries;
      }

      if (led != barled) {
        barled = led;
        console.log("[RED LEDS] setting barled with value :", barled);
        arduino.set_barled(barled);
      }
    }

    if (!detect) {
      if (numEvent == "1") flag1 = true;
    }
    console.log("\nflag states", flag1, detect);
  }
});

arduino.emitter.on("Reset", () => {
  console.log("[TIMEOUT RESET] ... Resetting Flags.");
  flag1 = false;
  detect = false;
  tries = 0;
  interpret = false;
  led = 0;
  barled = 0;
  arduino.set_barled(barled);
});

arduino.emitter.on("Start", () => {
  console.log("resetting flags ...");
  flag1 = false;
  detect = false;
  tries = 0;
  interpret = false;
  led = 0;
  barled = 0;
});

function gameWon() {
  if (flag1) {
    flag1 = false;
    detect = false;
    tries = 0;
    interpret = false;
    led = 0;
    barled = 0;
    setTimeout(() => {
      console.log("[ WIN ] ...FLAGS & BARLED RESET.");
      arduino.set_barled(barled);
    }, 5000);
    return true;
  }
}

function gameLost() {
  if (tries >= maxTries) {
    flag1 = false;
    detect = false;
    tries = 0;
    interpret = false;
    led = 0;
    barled = 0;
    setTimeout(() => {
      console.log("[ LOSS ] ...FLAGS & BARLED RESET.");
      arduino.set_barled(barled);
    }, 5000);
    return true;
  }
}

function cell_info() {
  return { fouras_sentence, game_time, cell_number , game_name};
}

module.exports = { gameWon, gameLost, cell_info };
