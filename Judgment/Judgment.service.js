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
let selected_game = 3; // Select game from 1-6
let barled = 0;
let led = 0;
let interpret = false;
let win = false;
let tries = 0;
let maxTries = 3;
let game_name = "default";
let cell_number = 1;
let game_time = 2;
let game_leds = {
  1: "10", // Mapping game 1 indicator
  2: "11", // Mapping game 2 indicator
  3: "12" // Mapping game 3 indicator
}; //  light up the active game

//

// Game 1 : vars and consts
let start = "1";
let fail = "2";
let end = "3";
let game_state = "success";
//

// Game 2 : vars and consts
let center_led = 5;
let current_led = 1;
let CycleEnded = false;
let inter;
let play = "5";

// Game 3 : vars and consts || functions
let engine1 = ""; // mapping 1
let engine2 = ""; // mapping 2
let engine3 = ""; // mapping 3
let engines_game3 = [engine1, engine2, engine3];

// Game 4 : vars and consts || functions
let engine4 = ""; // mapping 4
let engine5 = ""; // mapping 5
let engine6 = ""; // mapping 6
let engines_game4 = [engine4, engine5, engine6];

// Game 5 : vars and consts || functions
let engine7 = ""; // mapping 7
let engine8 = ""; // mapping 8
let engine9 = ""; // mapping 9
let engines_game5 = [engine7, engine8, engine9];

// Game 6 : vars and consts || functions
let engine10 = ""; // mapping 10
let engine11 = ""; // mapping 11
let engine12 = ""; // mapping 12
let engines_game6 = [engine10, engine11, engine12];

const Turn_On_Game_Indicator = (arg) => {
  console.log("\u001b[1;32m TURNING ON GAME: "+selected_game+" Indicator. (Mapping ="+arg+")");
};

const Turn_Off_Game_Indicator = (arg) => {
  console.log("\u001b[1;31m TURNING OFF GAME: "+selected_game+" Indicator. (Mapping ="+arg+")");
};

const Turn_On_Engines = (arg) => {
  console.log("\u001b[1;32m Turning on the 3 engines ...", ...arg);
};

const Turn_Off_Engines = (arg) => {
  console.log("\u001b[1;31m Turning off the 3 engines ...", ...arg);
};

const Loop = () => {
  // game 2
  let i = 1;
  inter = setInterval(() => {
    if (i > 16) {
      i = 1;
      current_led = 1;
    }
    console.log("\u001b[1;32m turn on :", i);
    current_led = i;
    i += 1;
    setTimeout(() => {
      console.log("\u001b[1;31m turn off:", i - 1);
      console.log("---------");
    }, 500);
  }, 1000);
};
//

arduino.emitter.on("selected_game", (arg) => {
  console.log("Selected game received ... : "+arg);
  selected_game = arg;
  Turn_On_Game_Indicator(game_leds[selected_game]);
  switch (arg) {
    case 1:
      game_time = 3;
      cell_number = 1;
      game_name = "fil chaud";
    case 2:
      game_time = 3;
      cell_number = 2;
      game_name = "Cyclone";
    case 3:
      game_time = 3;
      cell_number = 3;
      game_name = "Balle sur la planche";
    case 4:
      game_time = 3;
      cell_number = 4;
      game_name = "3 niveaux";
    case 5:
      game_time = 3;
      cell_number = 5;
      game_name = "Volcan";
    case 6:
      game_time = 3;
      cell_number = 6;
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
    console.log("clicked recieved at : ", numEvent);
    switch (selected_game) {
      case 1:
        switch (game_state) {
          case "in progress":
            if (numEvent == end) {
              game_state = "success";
              win = true;
              //console.log("[win] : ");
            } else if (numEvent == fail) {
              game_state = "success";
              tries += 1;
              console.log("\u001b[1;31m [you failed try again] : ");

              // Turn on BARLED 2 [RED]
              console.log(
                "\u001b[1;32m [SIMU] ==TURNING ON BARLED 2 \u001b[1;31m #RED# =="
              );

              // ADVANCMENT BARLED [RED] ... COUNTING TRIES
              for (let i = 1; i <= maxTries; i++) {
                if (tries == i) led = led + 100 / maxTries;
              }
              if (led != barled) {
                barled = led;
                console.log(
                  "\u001b[1;31m [RED LEDS] setting barled with value :",
                  barled
                );
                arduino.set_barled(barled);
              }
              /////////////////////////////////////////
            }
            break;
          case "success":
            if (numEvent == start) {
              game_state = "in progress";
              console.log("\u001b[1;33m [new game started] : ");
              // NEW GAME
              // Turn OFF BARLED 2
              console.log(" \u001b[1;31m [SIMU] ==TURNING OFF BARLED 2==");
            }
            break;
          case "failed":
            break;
        }
        break;
      case 2:
        if (numEvent == play) {
          CycleEnded = !CycleEnded;
        }
        // turn off all leds
        // turn on center led (RED)
        // turn on first led (Green)
        if (CycleEnded) {
          console.log("\u001b[1;33m check if win");
          if (center_led == current_led) {
            win = true;
            clearInterval(inter);
            console.log("\u001b[1;33m win ... stoping loop");
          } else {
            CycleEnded = false;
            console.log("\u001b[1;33m no win ...try again");
            tries += 1;
            // Turn on BARLED 2 [RED]
            console.log(
              "\u001b[1;32m [SIMU] ==TURNING ON BARLED 2 \u001b[1;31m #RED# =="
            );

            // ADVANCMENT BARLED [RED] ... COUNTING TRIES
            for (let i = 1; i <= maxTries; i++) {
              if (tries == i) led = led + 100 / maxTries;
            }
            if (led != barled) {
              barled = led;
              console.log(
                "\u001b[1;31m [RED LEDS] setting barled with value :",
                barled
              );
              arduino.set_barled(barled);
            }
            /////////////////////////////////////////
          }
        }

        break;
      case 3:
        if (numEvent == "1") win = true;
        else if (numEvent == "2") {
          tries += 1;
          // ADVANCMENT BARLED [RED] ... COUNTING TRIES
          for (let i = 1; i <= maxTries; i++) {
            if (tries == i) led = led + 100 / maxTries;
          }
          if (led != barled) {
            barled = led;
            console.log(
              "\u001b[1;31m [RED LEDS] setting barled with value :",
              barled
            );
            arduino.set_barled(barled);
          }
          /////////////////////////////////////////
        }
        break;
      case 4:
        if (numEvent == "1") win = true;
        else if (numEvent == "2") {
          tries += 1;
          // ADVANCMENT BARLED [RED] ... COUNTING TRIES
          for (let i = 1; i <= maxTries; i++) {
            if (tries == i) led = led + 100 / maxTries;
          }
          if (led != barled) {
            barled = led;
            console.log(
              "\u001b[1;31m [RED LEDS] setting barled with value :",
              barled
            );
            arduino.set_barled(barled);
          }
          /////////////////////////////////////////
        }
        break;
      case 5:
        if (numEvent == "1") win = true;
        else if (numEvent == "2") {
          tries += 1;
          // ADVANCMENT BARLED [RED] ... COUNTING TRIES
          for (let i = 1; i <= maxTries; i++) {
            if (tries == i) led = led + 100 / maxTries;
          }
          if (led != barled) {
            barled = led;
            console.log(
              "\u001b[1;31m [RED LEDS] setting barled with value :",
              barled
            );
            arduino.set_barled(barled);
          }
          /////////////////////////////////////////
        }
        break;
      case 6:
        if (numEvent == "1") win = true;
        else if (numEvent == "2") {
          tries += 1;
          // ADVANCMENT BARLED [RED] ... COUNTING TRIES
          for (let i = 1; i <= maxTries; i++) {
            if (tries == i) led = led + 100 / maxTries;
          }
          if (led != barled) {
            barled = led;
            console.log(
              "\u001b[1;31m [RED LEDS] setting barled with value :",
              barled
            );
            arduino.set_barled(barled);
          }
          /////////////////////////////////////////
        }
        break;
      default:
    }
  }
});

arduino.emitter.on("reset", () => {
  // TO DO
  // turn off every led.
  console.log("Reset Triggered ...");
  switch (selected_game) {
    case 1:
      game_state = "success";
      tries = 0;
      win = false;
      barled = led = 0;
      interpret = false;
      break;
    case 2:
      win = false;
      barled = led = 0;
      interpret = false;
      center_led = 5;
      current_led = 1;
      playing = false;
      CycleEnded = false;
      break;
    case 3:
      win = false;
      tries = 0;
      barled = led = 0;
      interpret = false;
      break;
    case 4:
      win = false;
      tries = 0;
      barled = led = 0;
      interpret = false;
      break;
    case 5:
      win = false;
      tries = 0;
      barled = led = 0;
      interpret = false;
      break;
    case 6:
      win = false;
      tries = 0;
      barled = led = 0;
      interpret = false;
      break;
  }
});

arduino.emitter.on("Start", () => {
  switch (selected_game) {
    case 1:
      console.log("\u001b[1;32m [SIMU] ==TURNING ON BARLED 1==");
      game_state = "success";
      tries = 0;
      win = false;
      barled = led = 0;
      interpret = false;
      break;
    case 2:
      console.log("\u001b[1;32m [SIMU] ==TURNING ON BARLED 1==");
      Loop();
      win = false;
      barled = led = 0;
      interpret = false;
      center_led = 5;
      current_led = 1;
      playing = false;
      CycleEnded = false;
      break;
    case 3:
      console.log("\u001b[1;32m [SIMU] ==TURNING ON BARLED 1==");
      Turn_On_Engines(engines_game3);
      win = false;
      tries = 0;
      barled = led = 0;
      interpret = false;
      break;
    case 4:
      console.log("\u001b[1;32m [SIMU] ==TURNING ON BARLED 1==");
      Turn_On_Engines(engines_game4);
      win = false;
      tries = 0;
      barled = led = 0;
      interpret = false;
      break;
    case 5:
      console.log("\u001b[1;32m [SIMU] ==TURNING ON BARLED 1==");
      Turn_On_Engines(engines_game5);
      win = false;
      tries = 0;
      barled = led = 0;
      interpret = false;
      break;
    case 6:
      console.log("\u001b[1;32m [SIMU] ==TURNING ON BARLED 1==");
      Turn_On_Engines(engines_game6);
      win = false;
      tries = 0;
      barled = led = 0;
      interpret = false;
      break;
  }
});

function gameWon() {
  switch (selected_game) {
    case 1:
      if (win) {
        game_state = "success";
        win = false;
        tries = 0;
        barled = led = 0;
        interpret = false;
        //console.log("\u001b[1;32m [ WIN ] ...");

        // Turn OFF ADVANCEMENT BARLED -COUNTING TRIES-
        setTimeout(() => {
          console.log("\u001b[1;31m [ WIN ] ... BARLED RESET.");
          arduino.set_barled(barled);
        }, 5000);

        //SIMULATION
        // Turn Off BARLED 1
        console.log("\u001b[1;31m [SIMU] ==TURNING OFF BARLED 1==");
        // Turn On BARLED 2 [GREEN]
        console.log(
          "\u001b[1;32m [SIMU] ==TURNING ON BARLED 2 \u001b[1;32m #GREEN# =="
        );
        setTimeout(() => {
          // Turn On BARLED 2 [GREEN] -Timeout-
          console.log(
            "\u001b[1;31m [SIMU] ==TURNING OFF BARLED 2 \u001b[1;32m #GREEN# =="
          );
        }, 5000);
        ////////////////////////////////

        return true;
      }
      break;
    case 2:
      if (win) {
        win = false;
        tries = 0;
        interpret = false;
        barled = led = 0;
        interpret = false;
        center_led = 5;
        current_led = 1;
        playing = false;
        CycleEnded = false;
        //console.log("\u001b[1;32m [ WIN ] ...");

        // Turn OFF ADVANCEMENT BARLED -COUNTING TRIES-
        setTimeout(() => {
          console.log("\u001b[1;31m [ WIN ] ... BARLED RESET.");
          arduino.set_barled(barled);
        }, 5000);

        //SIMULATION
        // Turn Off BARLED 1
        console.log("\u001b[1;31m [SIMU] ==TURNING OFF BARLED 1==");
        // Turn On BARLED 2 [GREEN]
        console.log(
          "\u001b[1;32m [SIMU] ==TURNING ON BARLED 2 \u001b[1;32m #GREEN# =="
        );
        setTimeout(() => {
          // Turn On BARLED 2 [GREEN] -Timeout-
          console.log(
            "\u001b[1;31m [SIMU] ==TURNING OFF BARLED 2 \u001b[1;32m #GREEN# =="
          );
        }, 5000);
        ////////////////////////////////
        return true;
      }
      break;
    case 3:
      if (win) {
        win = false;
        interpret = false;
        barled = led = 0;

        // Turn OFF ADVANCEMENT BARLED -COUNTING TRIES-
        setTimeout(() => {
          console.log("\u001b[1;31m [ WIN ] ... BARLED RESET.");
          arduino.set_barled(barled);
        }, 5000);

        //SIMULATION
        // Turn Off BARLED 1
        console.log("\u001b[1;31m [SIMU] ==TURNING OFF BARLED 1==");
        // Turn On BARLED 2 [GREEN]
        console.log(
          "\u001b[1;32m [SIMU] ==TURNING ON BARLED 2 \u001b[1;32m #GREEN# =="
        );
        setTimeout(() => {
          // Turn On BARLED 2 [GREEN] -Timeout-
          console.log(
            "\u001b[1;31m [SIMU] ==TURNING OFF BARLED 2 \u001b[1;32m #GREEN# =="
          );
        }, 5000);
        Turn_Off_Engines(engines_game3);
        ////////////////////////////////
        return true;
      }
      break;
    case 4:
      if (win) {
        win = false;
        interpret = false;
        barled = led = 0;

        // Turn OFF ADVANCEMENT BARLED -COUNTING TRIES-
        setTimeout(() => {
          console.log("\u001b[1;31m [ WIN ] ... BARLED RESET.");
          arduino.set_barled(barled);
        }, 5000);

        //SIMULATION
        // Turn Off BARLED 1
        console.log("\u001b[1;31m [SIMU] ==TURNING OFF BARLED 1==");
        // Turn On BARLED 2 [GREEN]
        console.log(
          "\u001b[1;32m [SIMU] ==TURNING ON BARLED 2 \u001b[1;32m #GREEN# =="
        );
        setTimeout(() => {
          // Turn On BARLED 2 [GREEN] -Timeout-
          console.log(
            "\u001b[1;31m [SIMU] ==TURNING OFF BARLED 2 \u001b[1;32m #GREEN# =="
          );
        }, 5000);
        Turn_Off_Engines(engines_game4);
        ////////////////////////////////

        return true;
      }
      break;
    case 5:
      if (win) {
        win = false;
        interpret = false;
        barled = led = 0;

        // Turn OFF ADVANCEMENT BARLED -COUNTING TRIES-
        setTimeout(() => {
          console.log("\u001b[1;31m [ WIN ] ... BARLED RESET.");
          arduino.set_barled(barled);
        }, 5000);

        //SIMULATION
        // Turn Off BARLED 1
        console.log("\u001b[1;31m [SIMU] ==TURNING OFF BARLED 1==");
        // Turn On BARLED 2 [GREEN]
        console.log(
          "\u001b[1;32m [SIMU] ==TURNING ON BARLED 2 \u001b[1;32m #GREEN# =="
        );
        setTimeout(() => {
          // Turn On BARLED 2 [GREEN] -Timeout-
          console.log(
            "\u001b[1;31m [SIMU] ==TURNING OFF BARLED 2 \u001b[1;32m #GREEN# =="
          );
        }, 5000);
        Turn_Off_Engines(engines_game5);

        ////////////////////////////////

        return true;
      }
      break;
    case 6:
      if (win) {
        win = false;
        interpret = false;
        barled = led = 0;

        // Turn OFF ADVANCEMENT BARLED -COUNTING TRIES-
        setTimeout(() => {
          console.log("\u001b[1;31m [ WIN ] ... BARLED RESET.");
          arduino.set_barled(barled);
        }, 5000);

        //SIMULATION
        // Turn Off BARLED 1
        console.log("\u001b[1;31m [SIMU] ==TURNING OFF BARLED 1==");
        // Turn On BARLED 2 [GREEN]
        console.log(
          "\u001b[1;32m [SIMU] ==TURNING ON BARLED 2 \u001b[1;32m #GREEN# =="
        );
        setTimeout(() => {
          // Turn On BARLED 2 [GREEN] -Timeout-
          console.log(
            "\u001b[1;31m [SIMU] ==TURNING OFF BARLED 2 \u001b[1;32m #GREEN# =="
          );
        }, 5000);
        Turn_Off_Engines(engines_game6);

        ////////////////////////////////

        return true;
      }
      break;
  }
}

function gameLost() {
  switch (selected_game) {
    case 1:
      if (tries >= maxTries) {
        game_state = "success";
        tries = 0;
        win = false;
        barled = led = 0;
        interpret = false;
        //console.log("\u001b[1;31m [ LOSS ] ...");

        // Turn OFF ADVANCEMENT BARLED -COUNTING TRIES-
        setTimeout(() => {
          console.log("\u001b[1;31m [ LOSS ] ... BARLED RESET.");
          arduino.set_barled(barled);
        }, 5000);

        //SIMULATION
        // Turn Off BARLED 1
        console.log("\u001b[1;31m [SIMU] ==TURNING OFF BARLED 1==");
        // Turn On BARLED 2 [RED]
        console.log(
          "\u001b[1;32m [SIMU] ==TURNING ON BARLED 2 \u001b[1;31m #RED# =="
        );
        setTimeout(() => {
          // Turn On BARLED 2 [RED] -Timeout-
          console.log(
            "\u001b[1;31m [SIMU] ==TURNING OFF BARLED 2 \u001b[1;31m #RED# =="
          );
        }, 5000);
        ////////////////////////////////
        return true;
      }
      break;
    case 2:
      if (tries >= maxTries) {
        clearInterval(inter);
        tries = 0;
        win = false;
        barled = led = 0;
        interpret = false;
        //console.log("\u001b[1;31m [ LOSS ] ...");

        // Turn OFF ADVANCEMENT BARLED -COUNTING TRIES-
        setTimeout(() => {
          console.log("\u001b[1;31m [ LOSS ] ... BARLED RESET.");
          arduino.set_barled(barled);
        }, 5000);

        //SIMULATION
        // Turn Off BARLED 1
        console.log("\u001b[1;31m [SIMU] ==TURNING OFF BARLED 1==");
        // Turn On BARLED 2 [RED]
        console.log(
          "\u001b[1;32m [SIMU] ==TURNING ON BARLED 2 \u001b[1;31m #RED# =="
        );
        setTimeout(() => {
          // Turn On BARLED 2 [RED] -Timeout-
          console.log(
            "\u001b[1;31m [SIMU] ==TURNING OFF BARLED 2 \u001b[1;31m #RED# =="
          );
        }, 5000);
        ////////////////////////////////
        return true;
      }
      break;
    case 3:
      if (tries >= maxTries) {
        tries = 0;
        win = false;
        barled = led = 0;
        interpret = false;
        //console.log("\u001b[1;31m [ LOSS ] ...");

        // Turn OFF ADVANCEMENT BARLED -COUNTING TRIES-
        setTimeout(() => {
          console.log("\u001b[1;31m [ LOSS ] ... BARLED RESET.");
          arduino.set_barled(barled);
        }, 5000);

        //SIMULATION
        // Turn Off BARLED 1
        console.log("\u001b[1;31m [SIMU] ==TURNING OFF BARLED 1==");
        // Turn On BARLED 2 [RED]
        console.log(
          "\u001b[1;32m [SIMU] ==TURNING ON BARLED 2 \u001b[1;31m #RED# =="
        );
        setTimeout(() => {
          // Turn On BARLED 2 [RED] -Timeout-
          console.log(
            "\u001b[1;31m [SIMU] ==TURNING OFF BARLED 2 \u001b[1;31m #RED# =="
          );
        }, 5000);
        Turn_Off_Engines(engines_game3);
        ////////////////////////////////
        return true;
      }
      break;
    case 4:
      if (tries >= maxTries) {
        tries = 0;
        win = false;
        barled = led = 0;
        interpret = false;
        //console.log("\u001b[1;31m [ LOSS ] ...");

        // Turn OFF ADVANCEMENT BARLED -COUNTING TRIES-
        setTimeout(() => {
          console.log("\u001b[1;31m [ LOSS ] ... BARLED RESET.");
          arduino.set_barled(barled);
        }, 5000);

        //SIMULATION
        // Turn Off BARLED 1
        console.log("\u001b[1;31m [SIMU] ==TURNING OFF BARLED 1==");
        // Turn On BARLED 2 [RED]
        console.log(
          "\u001b[1;32m [SIMU] ==TURNING ON BARLED 2 \u001b[1;31m #RED# =="
        );
        setTimeout(() => {
          // Turn On BARLED 2 [RED] -Timeout-
          console.log(
            "\u001b[1;31m [SIMU] ==TURNING OFF BARLED 2 \u001b[1;31m #RED# =="
          );
        }, 5000);
        Turn_Off_Engines(engines_game4);

        ////////////////////////////////
        return true;
      }
      break;
    case 5:
      if (tries >= maxTries) {
        tries = 0;
        win = false;
        barled = led = 0;
        interpret = false;
        //console.log("\u001b[1;31m [ LOSS ] ...");

        // Turn OFF ADVANCEMENT BARLED -COUNTING TRIES-
        setTimeout(() => {
          console.log("\u001b[1;31m [ LOSS ] ... BARLED RESET.");
          arduino.set_barled(barled);
        }, 5000);

        //SIMULATION
        // Turn Off BARLED 1
        console.log("\u001b[1;31m [SIMU] ==TURNING OFF BARLED 1==");
        // Turn On BARLED 2 [RED]
        console.log(
          "\u001b[1;32m [SIMU] ==TURNING ON BARLED 2 \u001b[1;31m #RED# =="
        );
        setTimeout(() => {
          // Turn On BARLED 2 [RED] -Timeout-
          console.log(
            "\u001b[1;31m [SIMU] ==TURNING OFF BARLED 2 \u001b[1;31m #RED# =="
          );
        }, 5000);
        Turn_Off_Engines(engines_game5);

        ////////////////////////////////
        return true;
      }
      break;
    case 6:
      if (tries >= maxTries) {
        tries = 0;
        win = false;
        barled = led = 0;
        interpret = false;
        //console.log("\u001b[1;31m [ LOSS ] ...");

        // Turn OFF ADVANCEMENT BARLED -COUNTING TRIES-
        setTimeout(() => {
          console.log("\u001b[1;31m [ LOSS ] ... BARLED RESET.");
          arduino.set_barled(barled);
        }, 5000);

        //SIMULATION
        // Turn Off BARLED 1
        console.log("\u001b[1;31m [SIMU] ==TURNING OFF BARLED 1==");
        // Turn On BARLED 2 [RED]
        console.log(
          "\u001b[1;32m [SIMU] ==TURNING ON BARLED 2 \u001b[1;31m #RED# =="
        );
        setTimeout(() => {
          // Turn On BARLED 2 [RED] -Timeout-
          console.log(
            "\u001b[1;31m [SIMU] ==TURNING OFF BARLED 2 \u001b[1;31m #RED# =="
          );
        }, 5000);
        Turn_Off_Engines(engines_game6);

        ////////////////////////////////
        return true;
      }
      break;
  }
}

function cell_info() {
  return { game_time, cell_number , game_name };
}

module.exports = { gameWon, gameLost, cell_info };



