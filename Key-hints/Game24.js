

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



///////////////////////////////////////////////// BOWLING ////////////////////////////////////////////////////////////////////

const arduino = require("./arduino.js");

// mapping IR1 = INPUT1, IR2 = INPUT2, IR3 = INPUT3,IR4 = INPUT4
let flag1 = false; // IR1
let flag2 = false;  //IR2
let flag3 = false;  //IR3
let flag4 = false; //IR4
let count = 0;
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
    if(numEvent == '1') {
        flag1 = true;
        count++;

    }
    else if(numEvent == '2'){
        flag2 = true;
        count++;}
    else if(numEvent == '3') {
        flag3 = true;
        count++;}
    else if(numEvent == '4') {
        flag4 = true;
        count++;}
   
   
    console.log("\nflag states" , flag1 , flag2 , flag3 , flag4 , count);

  }
    
    
});

arduino.emitter.on("Start", () => { 
  console.log("resetting flags ...")
  flag1 = false;
  flag2 = false;
  flag3 = false;
  flag4 = false;
  count = 0;
});


function gameWon() {
    if(count == 8) return true;
}

function gameLost() { 
  return false;
}

function cell_info(){
  return {fouras_sentence , game_time , cell_number};
}

module.exports = {gameWon , gameLost , cell_info}; 