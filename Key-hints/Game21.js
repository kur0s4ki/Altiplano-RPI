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

/////////////////////////////////////////////////////////////////////////// MARINE /////////////////////////////////////////////////////////////////////////////

/// input mapping
/*
INPUT 1: Button 1
INPUT 2: Button 2
INPUT 3: Button 3
INPUT 4: Button 4
INPUT 5: Button 5
INPUT 6: Button 6
INPUT 7: Button 7
INPUT 8: Button 8
INPUT 9: Button 9
INPUT 10: Button 10




Objectives:
Dans la pièce se trouvent des photos sous lesquelles se trouvent des boutons. 
Sur un écran des indices photos ou texte défilent. Il s’agit pour les joueurs 
d’associer les échantillons des tableaux et valider à l'aide du bouton correspondant. 
Si les joueurs valident la séquence dans le temps imparti, ils remportent l’épreuve.


*/

const arduino = require("../arduino.js");

let led = 0;
let barled = 0;
let unshuffled_hints = Array.from({length: 10}, (_, i) => (i + 7).toString());
let interpret = false;
let max_score = 12;

let fouras_sentence = 'Les bons navires sauras tu retrouver';
let game_time = 3;
let cell_number = 21;
let game_name = "Marine";


const getShuffledArr = arr => {
    if (arr.length === 1) {
      return arr
    };
    const rand = Math.floor(Math.random() * arr.length);
    return [arr[rand], ...getShuffledArr(arr.filter((_, i) => i != rand))];
  };

  

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
  console.log("input is : ", numEvent);
  //input = ~ input;
  if (interpret == true) {
    if (numEvent == current_hint){
        score +=1;
        console.log("score is : ", score);

        //console.log("index of current hint " + random_hints.indexOf(current_hint) + " len = ",random_hints.length - 1);
        
        if(random_hints.indexOf(current_hint) < random_hints.length - 1 ) {
            current_hint = random_hints[random_hints.indexOf(current_hint)+1];
            arduino.emitter.emit("post_image_index", current_hint);
        }else{
            current_hint = random_hints[0];
            arduino.emitter.emit("post_image_index", current_hint);
        }

        //console.log("new hint is : ", current_hint);
        //console.log("-----------------------");
        for (let i = 1; i <= max_score; i++) {
          if (score == i) led = led + 100 / max_score;
        }
  
        if (led != barled) {
          barled = led;
          console.log("[Green LEDS] setting barled with value :", barled);
          arduino.set_barled(barled);
        }
        
    }
  }

});

arduino.emitter.on("Reset", () => {
  console.log("[TIMEOUT RESET] ... Resetting Flags.");
  score = 0;
  interpret = false;
  led = 0;
  barled = 0;
  arduino.set_barled(barled);
});

arduino.emitter.on("Start", () => {
  console.log("resetting flags ...");
  score = 0;
  interpret = false;
  led = 0;
  barled = 0;
  random_hints = getShuffledArr(unshuffled_hints);
  console.log(random_hints);
  current_hint = random_hints[0];
  arduino.emitter.emit("post_image_index", current_hint);

});




function gameWon() {
  if (score >= max_score) {
    score = 0;
    interpret = false;
    led = 0;
    barled = 0;
    setTimeout(() => {
      console.log("[ WIN ] ...FLAGS & BARLED RESET.");
      arduino.set_barled(barled);
    }, 5000);
    return true;
  }
}

function gameLost() {
  return false;
}

function cell_info() {
  return {
    fouras_sentence,
    game_time,
    cell_number,
    game_name
  };
}

module.exports = {
  gameWon,
  gameLost,
  cell_info,
};