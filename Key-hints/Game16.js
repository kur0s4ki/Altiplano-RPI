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

/////////////////////////////////////////////////////////////////////////// KETCHUPERIE /////////////////////////////////////////////////////////////////////////////

/// input mapping
/*
INPUT 1: Button 1 player 1
INPUT 2: Button 2 player 2
INPUT 3: Sensor 1 Detect player 1's fall
INPUT 4: Sensor 2 Detect player 2's fall


Objectives:
Dans la cellule, une machine permettant de produire du ketchup. Dans la salle se trouvent 2 cuves. 
Les joueurs devront traverser ces dernières à l’aide de plan inclinés. Arrivé de l’autre coté , 
ils pourront appuyer sur leur bouton respectif et valider l’épreuve. S’ils tombent dans une des cuves, 
le jeu est perdu.


*/

const arduino = require("./arduino.js");

let flag1 = false;
let flag2 = false;
let sensor1 = false;
let sensor2 = false;
let interpret = false;

let fouras_sentence = "Sans tomber dans le ketchup la salle tu traverseras";

let game_time = 3;
let cell_number = 16;
let game_name = "Ketchuperie";

arduino.emitter.on("interpret", () => {
  console.log("interpret received ...");
  interpret = true;
});

arduino.emitter.on("stop_interpret", () => {
  console.log("stop interpret received ...");
  interpret = false;
});

arduino.emitter.on("EventInput", (numEvent) => {
  led = 0;
  if (interpret == true) {
    if (numEvent == "1") flag1 = true;
    else if (numEvent == "2") flag2 = true;
    else if (numEvent == "3") sensor1 = true;
    else if (numEvent == "4") sensor2 = true;

    if (flag1) led = led + 50;
    if (flag2) led = led + 50;
    if (sensor1 || sensor2) led = 0;

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
  sensor1 = false;
  sensor2 = false;
  interpret = false;
  led = 0;
  barled = 0;
  arduino.set_barled(barled);
});

arduino.emitter.on("Start", () => {
  flag1 = false;
  flag2 = false;
  sensor1 = false;
  sensor2 = false;
  interpret = false;
  led = 0;
  barled = 0;
});


function gameWon() {
  if (flag1 && flag2) {
    flag1 = false;
    flag2 = false;
    sensor1 = false;
    sensor2 = false;
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
  if (sensor1 == true || sensor2 == true) {
    flag1 = false;
    flag2 = false;
    sensor1 = false;
    sensor2 = false;
    interpret = false;
    led = 0;
    barled = 0;
    arduino.set_barled(barled);
    return true;
  }
}

function cell_info() {
  return { fouras_sentence, game_time, cell_number, game_name };
}
module.exports = { gameWon, cell_info, gameLost };
