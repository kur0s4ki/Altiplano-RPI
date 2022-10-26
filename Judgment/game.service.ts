import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
let arduino = require("arduino.service");

let selected_game = 5; // Select game from 1-6
let barled = 0;
let led = 0;
let interpret = false;
let win = false;
let tries = 0;
let maxTries = 3;
//

// Game 1 : vars and consts
const start = "1";
const fail = "2";
const end = "3";
let game_state = "success";
//

// Game 2 : vars and consts
const center_led = 5;
let current_led = 1;
let CycleEnded = false;
let inter: any = null;
const play = "5";

// Game 3 : vars and consts || functions
let engine1 = ""; // mapping 1
let engine2 = ""; // mapping 2
let engine3 = ""; // mapping 3
let engines_game3 = [engine1, engine2, engine3];
// Game 4 : vars and consts || functions
const engine4 = ""; // mapping 4
const engine5 = ""; // mapping 5
const engine6 = ""; // mapping 6
const engines_game4 = [engine4, engine5, engine6];

// Game 5 : vars and consts || functions
const engine7 = ""; // mapping 7
const engine8 = ""; // mapping 8
const engine9 = ""; // mapping 9
const engines_game5 = [engine7, engine8, engine9];

// Game 6 : vars and consts || functions
const engine10 = ""; // mapping 10
const engine11 = ""; // mapping 11
const engine12 = ""; // mapping 12
const engines_game6 = [engine10, engine11, engine12];

@Injectable()
export class GameService implements OnModuleInit { 

    onModuleInit() { 
        arduino.emitter.on("selected_game", (arg) => {
            console.log("Selected game received ...");
            selected_game = arg;
          });
          
          arduino.emitter.on("cmdFailedEvent", () => {
            //console.log("\nTimeout out command, no answer from arduino");
          });
          
          arduino.emitter.on("interpret", () => {
            console.log("interpret received ...");
            interpret = true;
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
          
          arduino.emitter.on("Reset", () => {
            // TO DO
            // turn off every led.
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
                current_led = 1;
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
                this.Loop();
                win = false;
                barled = led = 0;
                interpret = false;
                current_led = 1;
                CycleEnded = false;
                break;
              case 3:
                console.log("\u001b[1;32m [SIMU] ==TURNING ON BARLED 1==");
                this.Turn_On_Engines(engines_game3);
                win = false;
                tries = 0;
                barled = led = 0;
                interpret = false;
                break;
              case 4:
                console.log("\u001b[1;32m [SIMU] ==TURNING ON BARLED 1==");
                this.Turn_On_Engines(engines_game4);
                win = false;
                tries = 0;
                barled = led = 0;
                interpret = false;
                break;
              case 5:
                console.log("\u001b[1;32m [SIMU] ==TURNING ON BARLED 1==");
                this.Turn_On_Engines(engines_game5);
                win = false;
                tries = 0;
                barled = led = 0;
                interpret = false;
                break;
              case 6:
                console.log("\u001b[1;32m [SIMU] ==TURNING ON BARLED 1==");
                this.Turn_On_Engines(engines_game6);
                win = false;
                tries = 0;
                barled = led = 0;
                interpret = false;
                break;
            }
          });
    }
    Turn_On_Engines(arg:any): void {
        console.log("\u001b[1;32m Turning on the 3 engines ...", ...arg);
      };
    Turn_Off_Engines(arg:any): void {
        console.log("\u001b[1;31m Turning off the 3 engines ...", ...arg);
      };
      
    Loop(): void {
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

    gameWon(): boolean {
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
            console.log("\u001b[1;31m [ LOSS ] ... BARLED RESET.");
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
          current_led = 1;
          CycleEnded = false;
          //console.log("\u001b[1;32m [ WIN ] ...");
  
          // Turn OFF ADVANCEMENT BARLED -COUNTING TRIES-
          setTimeout(() => {
            console.log("\u001b[1;31m [ LOSS ] ... BARLED RESET.");
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
            console.log("\u001b[1;31m [ LOSS ] ... BARLED RESET.");
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
          this.Turn_Off_Engines(engines_game3);
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
            console.log("\u001b[1;31m [ LOSS ] ... BARLED RESET.");
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
          this.Turn_Off_Engines(engines_game4);
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
            console.log("\u001b[1;31m [ LOSS ] ... BARLED RESET.");
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
          this.Turn_Off_Engines(engines_game5);
  
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
            console.log("\u001b[1;31m [ LOSS ] ... BARLED RESET.");
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
          this.Turn_Off_Engines(engines_game6);
  
          ////////////////////////////////
  
          return true;
        }
        break;
    }
  }

   gameLost(): boolean {
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
          this.Turn_Off_Engines(engines_game3);
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
          this.Turn_Off_Engines(engines_game4);
  
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
          this.Turn_Off_Engines(engines_game5);
  
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
          this.Turn_Off_Engines(engines_game6);
  
          ////////////////////////////////
          return true;
        }
        break;
    }
  }
  


}