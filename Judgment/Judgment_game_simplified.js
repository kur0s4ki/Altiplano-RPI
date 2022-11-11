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

/////////////////////////////////////////////////////////////////////////// JUDGMENT GAMES /////////////////////////////////////////////////////////////////////////////

const arduino = require("../arduino.js");

// GLOBALS
let selected_game = 1; // Select game from 1-6 - Simulation
let interpret = false;
let win = false;
const OUT_ON = "1";
const OUT_OFF = "0";
let game_name = "fil chaud"; //Default name
let cell_number = 36;
let game_time = 2;
let game_leds = {
  1: "5", // Mapping game 1 indicator
  2: "6", // Mapping game 2 indicator
  3: "7" // Mapping game 3 indicator
}; //  light up the active game


const Turn_On_Game_Indicator = (arg) => {
  console.log("\u001b[1;32m TURNING ON GAME: "+selected_game+" Indicator. (Mapping ="+arg+")");
  arduino.set_output(arg, OUT_ON);
};

const Turn_Off_Game_Indicator = (arg) => {
  console.log("\u001b[1;31m TURNING OFF GAME: "+selected_game+" Indicator. (Mapping ="+arg+")");
  arduino.set_output(arg, OUT_OFF);
};

arduino.emitter.on("selected_game", (arg) => {
  console.log("Selected game received ... : " + arg);
  selected_game = arg;
  Turn_On_Game_Indicator(game_leds[selected_game]);
  switch (arg) {
    case 1:
      game_time = 3;
      cell_number = 36;
      game_name = "fil chaud";
    case 2:
      game_time = 3;
      cell_number = 36;
      game_name = "Cyclone";
    case 3:
      game_time = 3;
      cell_number = 36;
      game_name = "Balle sur la planche";
    case 4:
      game_time = 3;
      cell_number = 37;
      game_name = "3 niveaux";
    case 5:
      game_time = 3;
      cell_number = 37;
      game_name = "Volcan";
    case 6:
      game_time = 3;
      cell_number = 37;
      game_name = "Essuie glaces";
  }
});

arduino.emitter.on("cmdFailedEvent", () => {
  //console.log("\nTimeout out command, no answer from arduino");
});

arduino.emitter.on("interpret", () => {
  console.log("interpret received ...");
  interpret = true;
});

arduino.emitter.on("stop_interpret", () => {
  console.log("Stop interpret received ...");
  interpret = false;
  Turn_Off_Game_Indicator(game_leds[selected_game]);

});

arduino.emitter.on("EventInput", (numEvent, input) => {
  if (interpret == true) {
    console.log("click recieved at : ", numEvent);
    if(numEvent==1){
      win=true;
    }else if(numEvent==2){
      loss=true;
    }
  }
});

arduino.emitter.on("reset", () => {
  console.log("Reset Triggered ...");
  win = false;
  loss= false;
  interpret = false;
  Turn_Off_Game_Indicator(game_leds[selected_game]);


});

arduino.emitter.on("Start", () => {
  win = false;
  loss = false;
  interpret = false;
});

function gameWon() {
      if (win) {
        Turn_Off_Game_Indicator(game_leds[selected_game]);
        win = false;
        loss= false;
        interpret = false;
          return true;
      }
 }


function gameLost() {
  if (loss) {
    Turn_Off_Game_Indicator(game_leds[selected_game])
    win = false;
    loss= false;
    interpret = false;
    return true;
  }
}

function cell_info() {
  return { game_time, cell_number , game_name };
}

module.exports = { gameWon, gameLost, cell_info };



