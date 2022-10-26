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

/////////////////////////////////////////////////////////////////////////// BOULETS /////////////////////////////////////////////////////////////////////////////

const arduino = require("../arduino.js");

/// input mapping
/*
INPUT 1: CONTACTOR1
INPUT 2: CONTACTOR2
INPUT 3: CONTACTOR3
INPUT 4: CONTACTOR4

Objectives:
En entrant dans cette cellule, le candidat fait face à une grille. Derrière cette grille se trouve un plan incliné au haut
 duquel se trouvent plusieurs cibles. Le candidat va devoir éteindre les cibles à l'aide des boulets qui sont à sa disposition
  derrière la grille. Le plus difficile dans cette épreuve est que les cibles sont protégées derrière 2 canons. La méthode 
  consiste à faire rebondir les boulets sur les rebords de la cellule afin de l'atteindre. 
*/

let flag1 = false;
let flag2 = false;
let flag3 = false;
let flag4 = false;
let interpret = false;

let fouras_sentence = "En t'aidant des côté les cibles tu toucheras";
let game_time = 3;
let cell_number = 9;
let game_name = "Boulets";

arduino.emitter.on("cmdFailedEvent", () => {
  //console.log("\nTimeout out command, no answer from arduino");
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
  if (interpret) {
    led = 0;
    console.log(numEvent + "..." + input);

    if (numEvent == "1") flag1 = true;
    else if (numEvent == "2") flag2 = true;
    else if (numEvent == "3") flag3 = true;
    else if (numEvent == "4") flag4 = true;

    console.log("\nflag states", flag1, flag2, flag3, flag4);

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
