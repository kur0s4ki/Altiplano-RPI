///
///                           H2C DEVELOPMENT CONFIDENTIAL
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


//////////////////////////////////////////////////////  PROJECTEUR  ////////////////////////////////////////////////////////////////////////////

const arduino = require("./arduino.js");


let first = true;
let target = 0;
let temp = 0;
let interpret = false;

let fouras_sentence = 'to be defined';

let game_time = 3;
let cell_number = 25;
let game_name = "Projecteur";




/// input mapping
/*
INPUT 1: Photoresistance 1
INPUT 2: Photoresistance 2
INPUT 3: Photoresistance 3


OUTPUT 1: LED 1
OUTPUT 2: LED 2
OUTPUT 3: LED 3



Objectives:
Dans la pièce se trouve un projecteur. Les joueurs doivent positionner des miroirs 
sur pieds afin de pouvoir illuminer la cible désignée. Pour réussir à guider le laser, 
ils devront orienter les miroirs de façon à créer un flux de lumière constant. 
Ils devront également contourner les obstacles. Trois cibles vont successivement s ’allumer, 
les joueurs devront les viser pour réussir l’épreuve.


*/

const OUT_ON = "1";
const OUT_OFF = "0";

const Laser = "2"; //laser

const turn_off_laser = (arg) =>{
  console.log("turning off : ",arg);
}

const turn_on_laser = (arg) =>{
  console.log("turning on : ",arg);
}

//turn off all the button leds
const turn_off_button_leds = () => {
  for (let i = 3; i < 6; i++) {
    arduino.set_output((i + 1) ,  OUT_OFF);
  }
};


const rand_Led = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}


arduino.emitter.on("interpret", () => {
  console.log("interpret received ...")
  interpret = true;
});

arduino.emitter.on("stop_interpret", () => {
  console.log("stop interpret received ...");
  interpret = false;
});


arduino.emitter.on("EventInput", (numEvent) => {
  console.log("Event received ", numEvent);
  
  if (interpret == true) {
    if (numEvent == target.toString()) {
      score += 1;
      //arduino.set_output(Leds[leds.indexOf(numEvent)], OUT_OFF);
      arduino.set_output(target.toString(), OUT_OFF);
      do {
        temp = target;
        target = rand_Led(4, 6);
      }
      while (temp == target)
      //arduino.set_output(Leds[leds.indexOf(target)], OUT_ON);
      turn_off_button_leds();
      arduino.set_output(target.toString(), OUT_ON);
      console.log("Score is ", score);
      console.log("New Target is ", target);
    }
  }
});

arduino.emitter.on("Start", () => {
  turn_on_laser(Laser);
  turn_off_button_leds();
  score = 0;
  target = rand_Led(4, 6);
  temp = target;
  //arduino.set_output(leds[leds.indexOf(temp)], OUT_ON);
  arduino.set_output(temp.toString(), OUT_ON);
  console.log("Target is ", temp);
} );

arduino.emitter.on("Reset", () => {
  console.log("Reset Received ... The Game has been reset ");
  turn_off_laser(Laser);
  turn_off_button_leds();
  score = 0;
  interpret = false;
});

function gameWon() {
  if(first && score >=3) {
    first = false;
    turn_off_button_leds();
    turn_off_laser(Laser);
  }
  if (score >=3) return true;
}

function gameLost() {
  turn_off_laser(laser);
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
  cell_info,
  gameLost
};