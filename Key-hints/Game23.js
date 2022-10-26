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

///////////////////////////////////////////////////////////////////// QUATRES POULIES /////////////////////////////////////////////////////////////////////////////////////

const arduino = require("../arduino.js");

/// input mapping
/*
INPUT 1: IR1


Objectives:
Un plateau carré en plexiglas transparent posé à terre est enfermé dans une cage. 
Ce plateau est attaché à ses 4 coins par des cordes reliées à des poignées en dehors de la cage. 
Sur le plateau se trouve une boule rouge qu'il va falloir amener jusqu'à une gouttière en hauteur. 
Il faut se synchroniser pour faire monter le plateau sans que la boule ne tombe pas. Une fois le plateau 
amené à sa position la plus haute, ils doivent l'incliner afin d'amener la boule dans la gouttière.

*/

let flag1 = false;
let interpret = false;

let fouras_sentence = "Dans le tube la bille tombera";
let game_time = 3;
let cell_number = 23;
let game_name = "Quatre poulies";

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
  if (interpret == true) {
    if (numEvent == "1") flag1 = true;
    console.log("\nflag states", flag1);
  }
});

arduino.emitter.on("Reset", () => {
  console.log("[TIMEOUT RESET] ... Resetting Flags.");
  interpret = false;
  flag1 = false;
});

arduino.emitter.on("Start", () => {
  console.log("resetting flags ...");
  count = 0;
  interpret = false;
  count = 0;
});

function gameWon() {
  if (flag1) {
    flag1 = false;
    interpret = false;
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
