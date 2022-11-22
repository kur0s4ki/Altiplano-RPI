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

/////////////////////////////////////////////////////////////////////////// JINGBILLE /////////////////////////////////////////////////////////////////////////////

/* 


Objectives:
Les joueurs trouvent dans la cellule une grande boîte ronde pivotante appelée Jingbille 
dans laquelle se trouvent 3 billes. Le but est de manipuler ce Jingbille afin de faire 
rentrer les 3 billes dans les 3 emplacements. Ce n'est qu'une fois les 3 billes placées 
dans les 3 emplacements que la clé est libérée. Le plus difficile n'est pas vraiment de 
faire rentrer une bille dans un emplacement mais de l'y laisser tout en essayant de faire 
rentrer les autres billes.

Mapping:
INPUT1: entrée 1
INPUT1: entrée 2
INPUT1: entrée 2

*/

const arduino = require("./arduino.js");
let game_won = false;
let game_lost = false;
let interpret = false;

let fouras_sentence = "Dans les 3 trous en simultané les billes tu porteras";
let game_time = 3;
let cell_number = 12;
let game_name = "jingbille";

arduino.emitter.on("cmdFailedEvent", () => {
  //console.log("\nTimeout out command, no answer from arduino");
});

arduino.emitter.on("interpret", () => {
  console.log("interpret received ...");
  interpret = true;
});

arduino.emitter.on("stop_interpret", () => {
  console.log("interpret received ...");
  interpret = false;
});

arduino.emitter.on("EventInput", (numEvent, input) => {
  input = ~input;
  console.log("event and input received, ", numEvent, input);
  if (interpret) {
    // if ((input & 0x07) == 0x07) {
    if (input==7) {
      game_won = true;
      console.log("Same time Click.");
    }
    if (input==24) {
      game_lost = true;
      console.log("sensor activated.");
    }
  }
});

arduino.emitter.on("Reset", () => {
  console.log("[TIMEOUT RESET] ... Resetting Flags.");
  game_won = false;
  game_lost = false;
  interpret = false;
});

arduino.emitter.on("Start", () => {
  game_won = false;
  game_lost = false;
});

function gameWon() {
  if (game_won) {
    game_won = false;
    game_lost = false;
    interpret = false;
    return true;
  }
}

function gameLost() {
  if (game_lost) {
    game_won = false;
    game_lost = false;
    interpret = false;
    return true;
  }
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
  cell_info,
  gameLost,
};
