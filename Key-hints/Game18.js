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

///////////////////////////////////////////////////////////////////// BOULETS SUR LA PLANCHE /////////////////////////////////////////////////////////////////////////////////////

const arduino = require("./arduino.js");

/// input mapping
/*
INPUT 1: IR1
INPUT 2: IR2

Objectives:
Les joueurs doivent faire rouler un boulet jusqu'au bout de chacune des 2 planches, tout en évitant les obstacles afin de faire 
tomber le boulet dans un panier à travers un trou. Si ils réussissent à mettre 4 boulets dans les paniers l’épreuve est remportée.
*/

let led = 0;
let barled = 0;
let flag1 = false;
let flag2 = false;
let count = 0;
let interpret = false;

let fouras_sentence = "En équilibre sur la planche le boulet avancera";
let game_time = 3;
let cell_number = 18;
let game_name = "Boulets sur la planche";

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
  if (interpret == true) {
    console.log(numEvent + "..." + input);

    if (numEvent == "1" || numEvent == "2") {
      count += 1;
      for (let i = 1; i <= 4; i++) {
        if (count == i) led = led + 25;
      }

      if (led != barled) {
        barled = led;
        console.log("[RED LEDS] setting barled with value :", barled);
        arduino.set_barled(barled);
      }
    }
    console.log("\nflag states", flag1, flag2, count);
  }
});

arduino.emitter.on("Reset", () => {
  console.log("[TIMEOUT RESET] ... Resetting Flags.");
  interpret = false;
  count = 0;
  barled = 0;
  arduino.set_barled(barled);
});

arduino.emitter.on("Start", () => {
  console.log("resetting flags ...");
  count = 0;
  interpret = false;
  count = 0;
  barled = 0;
  led = 0;
});

function gameWon() {
  if (count >= 4) {
    count = 0;
    interpret = false;
    barled = 0;
    led = 0;
    setTimeout(() => {
      console.log("[ WIN ] ...FLAGS & BARLED RESET.");
      arduino.set_barled(barled);
    }, 5000);
    return true;
  }
}

function gameLost() {
  return false;
}

function cell_info() {
  return { fouras_sentence, game_time, cell_number, game_name };
}

module.exports = { gameWon, gameLost, cell_info };
