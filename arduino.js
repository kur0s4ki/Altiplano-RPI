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
///
///

// get the reference of EventEmitter class of events module
var events = require("events");


//MAPING OUTPUTS
const OUTPUT_DOOR = "01";
const OUTPUT_LED_DOOR_GREEN= "02";

const OUTPUT_LED_DOOR_RED = "03";

const OUTPUT_LED_EFFECT = "04";

//OUTPUT state
const OUT_ON = "1";
const OUT_OFF = "0";

//Door open time 
const DURATION_DOOR = 5000; //3s
const DURATION_LED_EFFECT = 4000; //4s


var SerialPort = require("serialport");
var arduinoCOMPort_1 ;
var arduinoSerialPort_1;
var arduinoCOMPort_2;
var arduinoSerialPort_2;
//serial reception buffer
var tempBuffer1 = "";
var tempBuffer2 = "";

var statusCmd1 = "";
var statusCmd2 = "";

let input1=0;
let input2=0;

//timer timeout output command ID
var timeoutId;
//used to manage timeout in case of several commands in very short time
var nbrOfComdOngoing = 0;

let fAnswerReceived1=false;
let fAnswerReceived2=false;

let timeoutIdTab2=[];
let timeoutIdTab1=[];
let comptCmd1=0;
let comptCmd2=0;


//found port coms
function managePorts() {
  SerialPort.list().then(ports => {
  ports.map(port => {
    if ( (port.path.indexOf("COM")>=0)) { //detect only USB port
      if (arduinoCOMPort_1 == null)
      {
        arduinoCOMPort_1 = port.path; //modfied 2-->1
        console.log("first board" +arduinoCOMPort_1);
      }
      // else 
      // {
      //   arduinoCOMPort_2 = port.path; //modfied 1-->2
      //   console.log("second board" +arduinoCOMPort_2);
      //   return;
      // }
    }
});
});
}

//list available ports
managePorts();

//create an object of EventEmitter class by using above reference
let emitter = new events.EventEmitter();

// async function sendCmd2(mes) {

//   statusCmd2="";
//   fAnswerReceived2=false;

//   let promise = new Promise((resolve, reject) =>{ 
//     //    setTimeout(() => , 1000)
//     if (arduinoSerialPort_2)
//         arduinoSerialPort_2.write(mes);
//       else
//         {
//           emitter.emit("cmdFailedEvent","no serial port 2");
//           return;
//         }

//     nbrOfComdOngoing++;
//     //console.log("cmd2: " + mes + ", "+nbrOfComdOngoing.toString());

//     let intervalId = setInterval(() => {
     
//       if (fAnswerReceived2)
//       {
//       //  console.log("fAnswerReceived" + input1.toString());
//         clearInterval(intervalId);
//         comptCmd2--;
//        // console.log("Clear Timeout 2: " + comptCmd2.toString());  
//         //case of several command sent in the same timeout 
//        clearTimeout(timeoutIdTab2[comptCmd2]); 

//         resolve(input2);
//       }
//     }, 100);

//     timeoutId = setTimeout(() => {
//       emitter.emit("cmdFailedEvent", "no answer from arduino2");
//       reject
//     }, 1000);
//     timeoutIdTab2[comptCmd2++]=timeoutId;

//   });

//   let result = await promise; // wait until the promise resolves (*)

//   return input2;
// }



async function sendCmd1(mes) {

  statusCmd1="";
  fAnswerReceived1=false;

  let promise = new Promise((resolve, reject) =>{ 
    //    setTimeout(() => , 1000)
    if (arduinoSerialPort_1){
      arduinoSerialPort_1.write(mes);
    }
      else
        {
          emitter.emit("cmdFailedEvent","no serial port 1");
          return;
        }
    nbrOfComdOngoing++;
    //console.log("cmd1: " + mes + ", "+nbrOfComdOngoing.toString());

    let intervalId = setInterval(() => {
     
      if (fAnswerReceived1)
      {
      //  console.log("fAnswerReceived" + input1.toString());
        clearInterval(intervalId);
        comptCmd1--;
       // console.log("Clear Timeout 1: " + comptCmd1.toString());
        //case of several command sent in the same timeout 
        clearTimeout(timeoutIdTab1[comptCmd1]); 

        resolve(input1);
      }
    }, 100);

    timeoutId = setTimeout(() => {
      emitter.emit("cmdFailedEvent", "no answer from arduino1");
      reject
    }, 1000);
    timeoutIdTab1[comptCmd1++]=timeoutId;
  });


  let result = await promise; // wait until the promise resolves (*)

  return input1;
}




function manageInputEvent(mes, input ) {
  var a = parseInt(Number("0x"+input), 10); //attention 10 ? il faut un mot de 16bits

  if (mes=="21") //answer to getinput 1
  {
     input1=a;
     fAnswerReceived1=true;
     return;
  }

/*  if (mes=="22") //answer to getinput 2
  {
    input2=a;
    fAnswerReceived2=true;
    return;
  }
*/

  if (mes[0] == "0"){
    mes = mes.substring(1);
  }
  //console.log("mes = ", mes , " a= ",a);
  if (mes.length > 0) {
    //console.log("event:" + mes+" dec:"+a.toString());
    emitter.emit("EventInput", mes,a);
  }
}

//manageSerialPorts1

function manageSerialPort1() {
  //Expected format Inn
  //Expected format On
  //if I is missing, remove unused data
  while (true) {
    var offsetO = tempBuffer1.indexOf("O");
    var offsetI = tempBuffer1.indexOf("I");

    //return if nothing to do
    if (offsetO < 0 && offsetI < 0) break;

    //check if answer to Output command
    if (offsetO > offsetI) {
      //manage frame 0
      if (offsetO >= 0) {
        //remove unused data => in case of error or frame not well formatted
        tempBuffer1 = tempBuffer1.substring(offsetO);
        if (tempBuffer1.length > 1) {
          statusCmd1 = tempBuffer1.substring(1, 2);
          // If statusCmd1 == 1 then send an Succes event else Failed event
          if (statusCmd1 != "1")
            emitter.emit("cmdFailedEvent");
          fAnswerReceived1=true;
          //answer received, stop timer
          if (nbrOfComdOngoing > 1) {
            nbrOfComdOngoing--;
          }
          else {
            clearTimeout(timeoutId);
            timeoutId = 0;
            nbrOfComdOngoing = 0;
          }
          //remove string processed
          tempBuffer1 = tempBuffer1.substring(2);
        }
        else
          break; //string too short, end of processing
      }
    }
    //check if input event
    if (offsetI >= 0) {
      //remove unused data => in case of error or frame not well formatted
      tempBuffer1 = tempBuffer1.substring(offsetI);
     // console.log("message debug:" + tempBuffer1);
      //event I01x
      if (tempBuffer1.length > 6) { // new format I21xxyy 
        //case of get input answer
          if (nbrOfComdOngoing > 1) {
            nbrOfComdOngoing--;
          }
          else {
            clearTimeout(timeoutId);
            timeoutId = 0;
            nbrOfComdOngoing = 0;
          }

        //just to detect answer
        statusCmd1=tempBuffer1.substring(0, 1);

		
		        //just to detect answer
        statusCmd1=tempBuffer1.substring(1, 3);

        manageInputEvent(tempBuffer1.substring(1,3),tempBuffer1.substring(3, 7)); //a verifier
        tempBuffer1 = tempBuffer1.substring(5);
      }
      else
        break;  //string too short, end of processing
    }
  }
}

// //manageSerialPorts2
// function manageSerialPort2() {
//   //Expected format Inn
//   //Expected format On
//   //if I is missing, remove unused data
//   while (true) {
//     var offsetO = tempBuffer2.indexOf("O");
//     var offsetI = tempBuffer2.indexOf("I");

//     //return if nothing to do
//     if (offsetO < 0 && offsetI < 0) break;

//     //check if answer to Output command
//     if (offsetO > offsetI) {
//       //manage frame 0
//       if (offsetO >= 0) {
//         //remove unused data => in case of error or frame not well formatted
//         tempBuffer2 = tempBuffer2.substring(offsetO);
//         if (tempBuffer2.length > 1) {
//           statusCmd2 = tempBuffer2.substring(1, 2);
//           // If statusCmd2 == 1 then send an Succes event else Failed event
//           if (statusCmd2 != "1")
//             emitter.emit("cmdFailedEvent");
//             fAnswerReceived2=true;
//           //answer received, stop timer
//           if (nbrOfComdOngoing > 1) {
//             nbrOfComdOngoing--;
//           }
//           else {
//             clearTimeout(timeoutId);
//             timeoutId = 0;
//             nbrOfComdOngoing = 0;
//           }

//           //just to detect answer
//           statusCmd2=tempBuffer2.substring(1, 3);

//           //remove string processed
//           tempBuffer2 = tempBuffer2.substring(2);
//         }
//         else
//           break; //string too short, end of processing
//       }
//     }
//     //check if input event
//     if (offsetI >= 0) {
//       //remove unused data => in case of error or frame not well formatted
//       tempBuffer2 = tempBuffer2.substring(offsetI);
//       //event I01 + input state
//       if (tempBuffer2.length > 4) {
//         //case of get input answer
//         if (tempBuffer1.substring(1, 3)=="22")
//         {
//           if (nbrOfComdOngoing > 1) {
//             nbrOfComdOngoing--;
//           }
//           else {
//             clearTimeout(timeoutId);
//             timeoutId = 0;
//             nbrOfComdOngoing = 0;
//           }
//         }
//         manageInputEvent(tempBuffer2.substring(1, 3), tempBuffer2.substring(3, 5));
//         tempBuffer2 = tempBuffer2.substring(5);
//       }
//       else
//         break;  //string too short, end of processing
//     }
//   }
// }

setTimeout(() => {

  if (arduinoCOMPort_1)
  {
    console.log("Init port com 1: " + arduinoCOMPort_1);
    arduinoSerialPort_1 = new SerialPort(arduinoCOMPort_1, {
      baudRate: 9600,
      autoOpen: false,
    });
    arduinoSerialPort_1.open();
      arduinoSerialPort_1.on("data", function (data) {
      tempBuffer1 += data;
      //console.log("reception1: " + data);
      manageSerialPort1();
    });
  }
 
  // if (arduinoCOMPort_2)
  // {
  //   console.log("init port com 2: " + arduinoCOMPort_2);
  //   arduinoSerialPort_2 = new SerialPort(arduinoCOMPort_2, {
  //     baudRate: 9600,
  //     autoOpen: false,
  //   });

  //   arduinoSerialPort_2.open();
  //   arduinoSerialPort_2.on("data", function (data) {
  //     tempBuffer2 += data;
  //     //console.log("reception2: " + data);
  //     manageSerialPort2();
  //   });
  // }

}, 5000);




/////////////////////// Interfaces for game managment /////////////////////////

 function open_door() {
  //open OUT_OFF
  sendCmd1("O" + OUTPUT_DOOR + OUT_OFF); // modified
  //setTimeout(sendCmd("O"+OUTPUT_DOOR+OUT_OFF),DURATION_DOOR);
  //close after duration
  setTimeout(() => {
    sendCmd1("O" + OUTPUT_DOOR + OUT_ON); //modified
  }, DURATION_DOOR);
}



 function turn_on_green_light_indicator() {
  sendCmd1("O" + OUTPUT_LED_DOOR_GREEN + OUT_ON);
  sendCmd1("O" + OUTPUT_LED_DOOR_RED + OUT_OFF); 
}

 function turn_off_green_light_indicator() {
  //ligth off
  sendCmd1("O" + OUTPUT_LED_DOOR_RED + OUT_ON);
  sendCmd1("O" + OUTPUT_LED_DOOR_GREEN  + OUT_OFF); 
}

//wait 10s and close the door at start-up
setTimeout(() => {
    sendCmd1("O" + OUTPUT_DOOR + OUT_ON);
    turn_on_green_light_indicator();
}, 10000);

 function green_light_effect(val) {
  //ligth on
  if (val){
    //console.log("triggered here");
    sendCmd1("O" + OUTPUT_LED_EFFECT + OUT_ON); 
  }
    
  else{
    sendCmd1("O" + OUTPUT_LED_EFFECT + OUT_OFF);
    //console.log("triggered else");
  }
    
  /*setTimeout(() => {
    sendCmd1("O" + OUTPUT_LED_EFFECT + OUT_OFF);
  }, DURATION_LED_EFFECT);
  * */

}

//set output state
function set_output(num,val) {
// to be deleted
//console.log("turning led : ",num , "|| ", val);
var n=num.toString();
var v=val.toString();

if (n.length==1)
  n='0'+n;

// if(num<=9)
  sendCmd1("O" + n + v);
// else
//   sendCmd2("O" + n + v);
}


async function  get_input1() {
  //get inputs values
  input1=0;
  return sendCmd1("I").then((val)=>{return val});
  
}

async function get_input2() {
  //get inputs values
  input2=0;
  return 
  //sendCmd2("I").then((val)=>{return val});

}

//Power led bar from 0% to 100%
function set_barled(val) {
  if (val==0) //0 is end of string, prefere to remove it
    val=1;
  console.log("BARLED : ", val);
  sendCmd1("L01" + String.fromCharCode(val))
  // if(col == "green"){
  //   sendCmd1("L01G" + String.fromCharCode(val));
  // }else if(col=="red"){
  //   sendCmd1("L01R" + String.fromCharCode(val));
  // }
  
}


module.exports = { open_door ,turn_on_green_light_indicator, turn_off_green_light_indicator , green_light_effect, emitter, get_input1,get_input2,set_output, set_barled };