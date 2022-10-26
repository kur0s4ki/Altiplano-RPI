///
///                                                   H2C DEVELOPMENT CONFIDENTIAL
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

////////////////////////////////////////////////////////////// VIKINGS ////////////////////////////////////////////////////////////////////

/// input mapping
/*
INPUT 1: Button 1
INPUT 2: Button 2
INPUT 3: Button 3
INPUT 4: Button 4
INPUT 5: Button 5


OUTPUT 1 : LED 1
OUTPUT 2 : LED 2
OUTPUT 3 : LED 3
OUTPUT 4 : LED 4
OUTPUT 5 : LED 5



Objectives:
Les joueurs doivent à l'aide des lances pierre viser avec des balles, 
les cibles qui s'allument selon une séquence aléatoire. Si toutes 
les cibles de la séquence sont touchées l'épreuve est remportée.

*/

const arduino = require("../arduino.js");

let unshuffled_sequence = Array.from({length: 5}, (_, i) => (i + 1));
let interpret = false;
let max_score = 5;
let score = 0;
let first_interval;
let led_interval;
let outer_interval;
let between_leds_time = 2000;
const OUT_ON = "1";
const OUT_OFF = "0";

let fouras_sentence = 'to be defined';
let game_time = 3;
let cell_number = 11;
let game_name = "Vikings";


const getShuffledArr = arr => {
    if (arr.length === 1) {
      return arr
    };
    const rand = Math.floor(Math.random() * arr.length);
    return [arr[rand], ...getShuffledArr(arr.filter((_, i) => i != rand))];
  };

  // const turn_on_sequence = (arr) => {
  //   let j = 0;
  //   let led_interval = setInterval(() => {
  //     console.log("turning on ..", arr[j]);
  //     //arduino.set_output((arr[j]+4) , OUT_ON);
  //     let st1 = setTimeout(() => {
  //       console.log("turning off ..", arr[j]);
  //       //arduino.set_output((arr[j]+4) , OUT_OFF);
  //       clearTimeout(st1);
  //       j += 1;
  //       if (j == arr.length - 1) j = 0;
  //     if ( score >= max_score) clearInterval(led_interval);
  //     }, 500);
      
  //   }, between_leds_time);

  
  // };

  const turn_on_sequence = (arr) => {
    let j = 0;
  
    first_interval = setInterval(() => {
      console.log("turning on ..", arr[j]);
      arduino.set_output((arr[j]+4) , OUT_ON);
      let st1 = setTimeout(() => {
        console.log("turning off ..", arr[j]);
        arduino.set_output((arr[j]+4) , OUT_OFF);
        clearTimeout(st1);
        j += 1;
        if (j == arr.length){ 
          j = 0;
          clearInterval(first_interval);
          console.log("---------------------")

        };
      if ( score >= max_score) clearInterval(first_interval);
      }, 500);
      
    }, 2000);
  
    outer_interval = setInterval(() => {
  
      if ( score >= max_score) clearInterval(outer_interval);
  
      led_interval = setInterval(() => {
        console.log("turning on ..", arr[j]);
        arduino.set_output((arr[j]+4) , OUT_ON);
        let st1 = setTimeout(() => {
          console.log("turning off ..", arr[j]);
          arduino.set_output((arr[j]+4) , OUT_OFF);
          clearTimeout(st1);
          j += 1;
          if (j == arr.length){ 
            j = 0;
            clearInterval(led_interval);
            console.log("---------------------")
          };
        if ( score >= max_score){
          clearInterval(outer_interval);
          clearInterval(led_interval);
        } 
        }, 500);
        
      }, 2000);
     }, 15000);
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
  //added
  clearInterval(outer_interval);
  clearInterval(led_interval);
});

arduino.emitter.on("EventInput", (numEvent) => {
  if (interpret == true) {
    console.log("Input is : ", numEvent);
    if (numEvent == current_target){
        score +=1;
        if(random_sequence.indexOf(current_target) < random_sequence.length) {
            if (random_sequence.indexOf(current_target)+1 < random_sequence.length){
            current_target = random_sequence[random_sequence.indexOf(current_target)+1];
            console.log("New target is : ", current_target);
            }
            
        }
    }else{
      console.log("Invalid Input ... Resetting score.");
      score = 0;
      current_target = random_sequence[0];
    }
    console.log("score is ", score);
  }

});

arduino.emitter.on("Start", () => {
  console.log("resetting flags ... score = ", score);
  interpret = false;
  score = 0;
  random_sequence = getShuffledArr(unshuffled_sequence);
  console.log(random_sequence);
  current_target = random_sequence[0];
  console.log("current target is : ", current_target);

  turn_on_sequence(random_sequence);
});

arduino.emitter.on("Reset", () => {
  console.log("Reset Received ... The Game has been reset ");
  clearInterval(outer_interval);
  clearInterval(led_interval);
  score = 0;
  interpret = false;
});




function gameWon() {
  if (score >= max_score) return true;
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