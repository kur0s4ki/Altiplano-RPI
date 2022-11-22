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

/////////////////////////////////////////////////////////////////////////// Vannes /////////////////////////////////////////////////////////////////////////////

const arduino = require("./arduino.js");

/// input mapping
/*

Objectives:
Un faisceau lumineux de couleur différente parcourt les tuyaux et les joueurs doivent l'orienter à l'aide des vannes afin d'allumer 3 LED de chacune des 5 couleurs.
*/

let interpret = false;
let win = false;
let loss = false;
const OUT_ON = "1";
const OUT_OFF = "0";

let fouras_sentence = "To be defined";
let game_time = 3;
let cell_number = 28;
let game_name = "Vannes";

const Turn_On_Game_Indicator = (arg) => {
    console.log("\u001b[1;32m Starting the  GAME: ");
    arduino.set_output(arg, OUT_ON);
  };
  
  const Turn_Off_Game_Indicator = (arg) => {
    console.log("\u001b[1;31m Resetting the  GAME: ");
    arduino.set_output(arg, OUT_OFF);
  };



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
    console.log("result : " ,numEvent);
    if (numEvent == "1") win = true;
    else if (numEvent == "2") loss = true;

  }
});

arduino.emitter.on("Reset", () => {
  console.log("[TIMEOUT RESET] ... Resetting Flags.");
  win = false;
  loss=false;
  interpret = false;
});

arduino.emitter.on("Start", () => {
    win = false;
    loss=false;
    interpret = false;
    Turn_On_Game_Indicator(1);
});

function gameWon() {
    if (win) {
      Turn_Off_Game_Indicator(1);
      win = false;
      loss= false;
      interpret = false;
        return true;
    }
}


function gameLost() {
if (loss) {
  Turn_Off_Game_Indicator(1)
  win = false;
  loss= false;
  interpret = false;
  return true;
}
}

function cell_info() {
  return { fouras_sentence, game_time, cell_number, game_name };
}
module.exports = { gameWon, cell_info, gameLost };
