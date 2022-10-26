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

/////////////////////////////////////////////////////////////////////////// Filet Boulet /////////////////////////////////////////////////////////////////////////////

const arduino = require("../arduino.js");

/// input mapping
/*
INPUT 1: IR1
INPUT 2: IR2
INPUT 3: IR3

Objectives:
Dans la cellule se trouve un filet incliné. Les joueurs doivent monter dessus et prendre  
un boulet au pied du filet. Le but est d'emmener 3 boulets en haut du filet. Pour cela, les joueurs
 doivent passer leurs mains au travers du filet,  et le monter progressivement.
 Une fois en haut, ils les passent dans une ouverture qui permet de récupérer la clé. Si le boulet tombe il faut tout recommencer.
*/

let flag1 = false;
let flag2 = false;
let flag3 = false;

let barled = 0;
let led = 0;
let interpret = false;

let fouras_sentence = "Au sommet les 3 boulets tu porteras";
let game_time = 3;
let cell_number = 3;
let game_name = "Filet Boulet";


arduino.emitter.on("cmdFailedEvent", () => {
 // console.log("\nTimeout out command, no answer from arduino");
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
  if (interpret == true) {
    led = 0;
    console.log(numEvent + "..." + input);
    if (numEvent == "1") flag1 = true;
    else if (numEvent == "2") flag2 = true;
    else if (numEvent == "3") flag3 = true;

    console.log("\nflag states", flag1, flag2, flag3);

    if (flag1) led = led + 33;
    //console.log("led1 = ", led);
    if (flag2) led = led + 33;
    //console.log("led2 = ", led);
    if (flag3) led = led + 34;
    //console.log("led3 = ", led);

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
  interpret = false;
  barled = 0;
  arduino.set_barled(barled);
});

arduino.emitter.on("Start", () => {
  console.log("[Start Recieved]... Resetting Flags.");
  flag1 = false;
  flag2 = false;
  flag3 = false;
  interpret = false;
  barled = 0;
});

function gameWon() {
  if (flag1 && flag2 && flag3) {
    flag1 = false;
    flag2 = false;
    flag3 = false;
    interpret = false;
    barled = 0;
    setTimeout(() => {
      console.log("[ WIN ] ...FLAGS & BARLED RESET.");
      arduino.set_barled(barled);
    }, 5000);

    return true;
  }
}

function gameLost() {
  return false ;
}

function cell_info() {
  return { fouras_sentence, game_time, cell_number, game_name };
}

module.exports = { gameWon, gameLost, cell_info };
