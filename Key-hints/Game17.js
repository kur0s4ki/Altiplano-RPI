///
///                                                               H2C DEVELOPMENT CONFIDENTIAL
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

///////////////////////////////////////////////// Lotterie ////////////////////////////////////////////////////////////////////

/// input mapping
/*

INPUT 1: Photoresistance 1


Objectives:
Dans la pièce on trouve une roue de loterie qui tourne sur un plan incliné. 
Cette roue comporte 8 trous et les joueurs doivent viser ces derniers avec des balles. 
Lorsque 10 balles sont entrées dans le cercle, l’épreuve est remportée.

*/

const arduino = require("./arduino.js");

let score = 0;
let maxScore = 10;
let interpret = false;
let fouras_sentence = "test";
let game_time = 3;
let cell_number = 17;
let game_name = "lotterie";
let engine = "2"; // mouteur

const turn_off_engine = (arg) =>{
  console.log("turning off : ",arg);
}

const turn_on_engine = (arg) =>{
  console.log("turning on : ",arg);
}

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


arduino.emitter.on("EventInput", (numEvent) => {
  console.log("Event received ", numEvent);
  if (interpret == true) {
    if (numEvent == "1") score += 1;
  }
});

arduino.emitter.on("Start", () => {
  console.log("resetting flags ...");
  score = 0;
  turn_on_engine(engine);
});

arduino.emitter.on("Reset", () => {
  console.log("Reset Received ... The Game has been reset ");
  turn_off_engine(engine);
  score = 0;
  interpret = false;
});

function gameWon() {
  if (score >= maxScore) {
    turn_off_engine(engine);
    return true;
  }
}

function gameLost() {
  turn_off_engine(engine);
  return false;
}

function cell_info() {
  return { fouras_sentence, game_time, cell_number, game_name };
}

module.exports = { gameWon, gameLost, cell_info };
