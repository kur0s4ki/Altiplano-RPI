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

/////////////////////////////////////////////////////////////////////////// Alerte Rouge /////////////////////////////////////////////////////////////////////////////

const arduino = require("./arduino.js");

/// input mapping
/*
INPUT 1:Photorésistances 1 
INPUT 2:Photorésistances 2 
INPUT 3:Photorésistances 3
INPUT 4:Photorésistances 4
INPUT 5:Capteur volumétrique
INPUT 6:Button (Win)
INPUT 7:Button 2 (disable Photoresistance )


Objectives:
La clé se trouve au fond de la cellule sur son présentoir(input6), protégé par un système de faisceaux lumineux.
Il faut passer au travers en essayant de toucher le moins possible les rayons (input 1,2,3,4).
Parallèlement un joueur peut avoir accès à un couloir avec prises sur le mur.
Il pourra ainsi si il réussi désactiver le système d’alarme et couper les faisceaux(Input 7)
Il peut chuter au maximum 3 fois(input5). 
Si les candidats touchent trop de faisceaux(3), ou tombent trop plus de 3 fois l'alarme retenti.

*/

let barled = 0;
let led = 0;
let noSensor = false;
let error1 = 0;
let error2 = 0;
let win = false;
let interpret = false;

let fouras_sentence = "Pour éliminer le dernier rempart, l'interrupteur tu couperas";
let game_time = 3;
let cell_number = 4;
let game_name = "Alerte Rouge";

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

arduino.emitter.on("EventInput", (numEvent) => {
  //led = 0;
  if (interpret == true) {
    if (numEvent == "1") {
      //le joueur passe devant la Photorésistances 1
      if (noSensor == false) {
        error1 += 1;
        console.log("touché" + error1 + "fois");
      }
    } else if (numEvent == "2") {
      //le joueur passe devant la Photorésistances 2
      if (noSensor == false) {
        error1 += 1;
        console.log("touché" + error1 + "fois");
      }
    } else if (numEvent == "3") {
      //le joueur passe devant la Photorésistances 3
      if (noSensor == false) {
        error1 += 1;
        console.log("touché" + error1 + "fois");
      }
    } else if (numEvent == "4") {
      //le joueur passe devant la Photorésistances 4
      if (noSensor == false) {
        error1 += 1;
        console.log("touché" + error1 + "fois");
      }
      //modified
    } else if (numEvent == "5") {
      //chute du joueur 2
      if (noSensor == false) {
        error2 += 1;
        console.log("tombé" + error2 + "fois");
      }
    } else if (numEvent == "6") {
      //Bouton victoire pressé
      win = true;
    } else if (numEvent == "7") {
      noSensor = true; //bouton désactivation systeme alarme
      console.log("désactivation du systeme alarmes");
    }

    for (let i = 1; i <= 4; i++) {
      if ((Math.max(error1,error2)==i)&&noSensor == false) led = led + 25;
      // if (error1 == i && noSensor==false) led = led + 25;

    }

    if (led != barled) {
      barled = led;
      console.log("[RED LEDS] setting barled with value :", barled);
      arduino.set_barled(barled);
    }
  }
});

arduino.emitter.on("Reset", () => {
  console.log("[TIMEOUT RESET] ... Resetting Flags.");
  win = false;
  error2 = 0;
  error1 = 0;
  interpret = false;
  noSensor = false;
  barled = 0;
  arduino.set_barled(barled);
});

arduino.emitter.on("Start", () => {
  //console.log("resetting flags ...")
  win = false;
  error2 = 0;
  error1 = 0;
  interpret = false;
  noSensor = false;
  barled = 0;
  led = 0;
});

function gameWon() {
  if (
    (win == true && error2 < 4 && error1 < 4) ||
    (win == true && noSensor == true)
  ) {
    win = false;
    error2 = 0;
    error1 = 0;
    interpret = false;
    noSensor = false;
    barled = 0;
    led = 0;
    setTimeout(() => {
      console.log("[ WIN ] ...FLAGS & BARLED RESET.");
      arduino.set_barled(barled);
    }, 5000);
    return true;
  }
}

function gameLost() {
  console.log("====" , error1 , error2);
  if (noSensor == false && (error2 > 3 || error1 > 3)) {
    win = false;
    error2 = 0;
    error1 = 0;
    noSensor = false;
    interpret = false;
    barled = 0;
    led = 0;
    setTimeout(() => {
      console.log("[ LOSS ] ...FLAGS & BARLED RESET.");
      arduino.set_barled(barled);
    }, 5000);
    return true;
  }
}

function cell_info() {
  return { fouras_sentence, game_time, cell_number, game_name };
}
module.exports = { gameWon, cell_info, gameLost };
