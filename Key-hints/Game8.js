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

/////////////////////////////////////////////////////////////////////////// BOITE A BILLE /////////////////////////////////////////////////////////////////////////////

const arduino = require("../arduino.js");

/// input mapping
/*
INPUT 1: Sensor IR1
INPUT 2: Sensor IR2
INPUT 3: Sensor IR3
INPUT 4: Sensor IR4

OUTPUT 1 : LED 1
OUTPUT 2 : LED 2
OUTPUT 3 : LED 3
OUTPUT 4 : LED 4



Objectives:
Une  boîte à bille carrée se trouve dans la bibliothèque du fort. 
Chaque candidat se place de part et d'autre de la boîte afin de pouvoir la manipuler . 
Le binôme va devoir se coordonner pour faire avancer une boule à travers un labyrinthe 
pour amener la bille sur l'emplacement allumé. Au bout de 3 parcours,
 la boule enclenche la libération de la clé.


*/

let barled = 0;
let led = 0;

let flag1 = false;
let flag2 = false;
let flag3 = false;
let flag4 = false;
let interpret = false;

const OUTPUT_LED1 = "05";
const OUTPUT_LED2 = "06";
const OUTPUT_LED3 = "07";
const OUTPUT_LED4 = "08";
let LED1 = (LED2 = LED3 = LED4 = false);

const OUT_ON = "1";
const OUT_OFF = "0";

let fouras_sentence = "D'un endroit à l'autre la bille tu achemineras";

let game_time = 3;
let cell_number = 8;
let game_name = "boite a bille";



arduino.emitter.on("interpret", () => {
  console.log("interpret received ...");
  interpret = true;
});

arduino.emitter.on("EventInput", (numEvent) => {
  led = 0;
  console.log("Event  received, ", numEvent);
  if (interpret == true) {
    if (numEvent == "1") {
      console.log("Event 1 outside");
      if (LED1) {
        console.log("Event 1 inside");
        flag1 = true;
        LED1 = false;
        LED2 = true;
        arduino.set_output(OUTPUT_LED1, OUT_OFF);
        arduino.set_output(OUTPUT_LED2, OUT_ON);
      }
    } else if (numEvent == "2") {
      console.log("Event 2 outside");
      if (LED2) {
        console.log("Event 2 inside");
        flag2 = true;
        LED2 = false;
        LED3 = true;
        arduino.set_output(OUTPUT_LED2, OUT_OFF);
        arduino.set_output(OUTPUT_LED3, OUT_ON);
      }
    } else if (numEvent == "3") {
      console.log("Event 3 outside");
      if (LED3) {
        console.log("Event 3 inside");
        flag3 = true;
        LED3 = false;
        LED4 = true;
        arduino.set_output(OUTPUT_LED3, OUT_OFF);
        arduino.set_output(OUTPUT_LED4, OUT_ON);
      }
    } else if (numEvent == "4") {
      console.log("Event 4 outside");
      if (LED4) {
        console.log("Event 4 inside");
        flag4 = true;
        LED4 = false;
        arduino.set_output(OUTPUT_LED4, OUT_OFF);
      }
    }

    if (flag1) led = led + 25;
    if (flag2) led = led + 25;
    if (flag3) led = led + 25;
    if (flag4) led = led + 25;

    if (led != barled) {
      barled = led;
      console.log("setting barled with value :", barled);
      arduino.set_barled(barled);
    }
  }
});

arduino.emitter.on("Reset", () => {
  console.log("[TIMEOUT RESET] ... Resetting Flags.");
  flag1 = false;
  flag2 = false;
  flag3 = false;
  flag4 = false;
  led = 0;
  barled = 0;
  interpret = false;
  LED1 = LED2 = LED3 = LED4 = false;
  arduino.set_output(OUTPUT_LED1, OUT_OFF);
  arduino.set_output(OUTPUT_LED2, OUT_OFF);
  arduino.set_output(OUTPUT_LED3, OUT_OFF);
  arduino.set_output(OUTPUT_LED4, OUT_OFF);
  arduino.set_barled(barled);
});

arduino.emitter.on("Start", () => {
  flag1 = false;
  flag2 = false;
  flag3 = false;
  flag4 = false;
  led = 0;
  barled = 0;
  interpret = false;
  arduino.set_output(OUTPUT_LED1, OUT_ON);
  LED1 = true;
  LED2 = LED3 = LED4 = false;
  arduino.set_output(OUTPUT_LED2, OUT_OFF);
  arduino.set_output(OUTPUT_LED3, OUT_OFF);
  arduino.set_output(OUTPUT_LED4, OUT_OFF);
});

function gameWon() {
  if (flag1 && flag2 && flag3 && flag4) {
  flag1 = false;
  flag2 = false;
  flag3 = false;
  flag4 = false;
  led = 0;
  barled = 0;
  interpret = false;
  LED1 = LED2 = LED3 = LED4 = false;
  arduino.set_output(OUTPUT_LED1, OUT_OFF);
  arduino.set_output(OUTPUT_LED2, OUT_OFF);
  arduino.set_output(OUTPUT_LED3, OUT_OFF);
  arduino.set_output(OUTPUT_LED4, OUT_OFF);
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
module.exports = { gameWon, cell_info, gameLost };
