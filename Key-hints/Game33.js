

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



///////////////////////////////////////////////// RADIATIONS ////////////////////////////////////////////////////////////////////

const arduino = require("../arduino.js");

// mapping btn1 = INPUT1, btn2 = INPUT2, detector = INPUT3
let flag1 = false; // btn1
let flag2 = false;  //btn2
let detect = false;   //detector
let interpret = false;

let fouras_sentence ='test';

let game_time = 3;
let cell_number = 1;


arduino.emitter.on("cmdFailedEvent", () => {
  console.log("\nTimeout out command, no answer from arduino");
});

arduino.emitter.on("interpret", () => { 
  console.log("interpret received ...");
  interpret = true;
});


arduino.emitter.on("EventInput", (numEvent , input) => {
  //console.log(numEvent +"..."+interpret + "..."+input);
  if(interpret == true){ 
    console.log(numEvent + "..." + input);
    if(numEvent=='3')
      detect = true;  
    else if(numEvent == '1') 
      flag1 = true;  //btn1 is pressed
    else if(numEvent == '2') 
      flag2 = true;  //btn2 is pressed 
   
    console.log("\nflag states" , flag1 , flag2 , flag3);

  }
    
    
});

arduino.emitter.on("Start", () => { 
  console.log("resetting flags ...")
  flag1 = false;
  flag2 = false;
  detect = false ;
});


function gameWon() {
  if ((!detect) && flag1 && flag2 )
      return true;
}

function gameLost() { 
  return false;
}

function cell_info(){
  return {fouras_sentence , game_time , cell_number};
}

module.exports = {gameWon , gameLost , cell_info}; 