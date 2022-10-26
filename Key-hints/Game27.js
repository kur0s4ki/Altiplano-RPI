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

///////////////////////////////////////////////////////////////////// L'ASIETTE /////////////////////////////////////////////////////////////////////////////////////

/// input mapping
/*
INPUT 1: BUTTON

Objectives:
une grande assiette horizontale au dessus de laquelle est accrochée la clé. Une seule solution pour l'atteindre : monter
sur l'assiette. Seulement cette assiette pivote en son centre et sa surface est ultra graissée. Le joueur va devoir
jouer les équilibristes afin d'essayer de trouver le point d'équilibre de l'assiette pour pouvoir tenir debout dessus
et ainsi appuyer sur un bouton au plafond pendant 3 secondes.
*/

const arduino = require("../arduino.js");

let flag1 = false;
let id = 0;
let interpret = false;

let fouras_sentence = "En équilibre debout tu te mettras";
let game_time = 3;
let cell_number = 27;
let game_name = "L'asiette";

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

arduino.emitter.on("EventInput", (numEvent, input) => {
  if (interpret == true) {
    console.log(numEvent + "..." + input);
    if (input==1) {
      id = setTimeout(() => {
        arduino.get_input1().then((val) => {
          console.log("After 3 seconds: " + val.toString());
          // val = ~val;
          if (val==1) {
            flag1 = true;
            console.log("HELD FOR 3S");
          } else console.log("NOT HELD FOR 3S");
        });
      }, 3000);
    }
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
  flag1 = false;
  id = 0;
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
  return { fouras_sentence, game_time, cell_number , game_name };
}

module.exports = { gameWon, gameLost, cell_info };
