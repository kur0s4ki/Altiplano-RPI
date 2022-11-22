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

////////////////////////////////////////////////////////////// EXPLORATEURS ////////////////////////////////////////////////////////////////////

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
INPUT 11: Button 11
INPUT 12: Button 12
INPUT 13: Button 13
INPUT 14: Button 14
INPUT 15: Button 15


Objectives:
On trouve dans la pièce un grand planisphère. Sur le mur on trouve des Biographies de grands explorateurs. 
Les joueurs devront reconstituer leus voyages. Ils devront ensuite valider leur chemin sur la carte.

*/

const arduino = require("./arduino.js");

let interpret = false;
let fouras_sentence = "Le bon trajet tu effectueras";
let game_time = 3;
let cell_number = 35;
let game_name = "Explorateurs";
let current_Sequence = [];
let Current_Explorer = [];
let flag_win = 0 ;

let flags = Array.from({ length: 15 }, (_, i) =>
  false
);

let Explorer1 = "Cristopher Colombus";
let Explorer2 = "Marco Polo";
let Explorer3 = "Ibn Battuta";
let Explorer4 = "Vasco Da Gama";
let Explorer5 = "Ferdinand Magellan";

let sequence1 = [7, 1, 2, 3, 4];
let sequence2 = [4, 5, 7, 8, 3, 6];
let sequence3 = [2, 5, 7, 4, 1, 5, 8];
let sequence4 = [2, 4, 11, 13, 14, 2, 7, 8, 1];
let sequence5 = [11, 1, 15, 3, 8, 9];

let explorers = new Map([
  [Explorer1, sequence1],
  [Explorer2, sequence2],
  [Explorer3, sequence3],
  [Explorer4, sequence4],
  [Explorer5, sequence5],
]);

const getRandomItem = (map) => {
  let keys = Array.from(map);
  return keys[Math.floor(Math.random() * keys.length)];
};

const reset_flags = (except) => {
  flags.fill(false , 0 , except-1);
  flags.fill(false , except , flags.length);
  if(except == flags.length) flags.fill(false , except , flags.length);
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

arduino.emitter.on("EventInput", (numEvent, input) => {
  console.log("Event received ", numEvent);
  input = ~input;
  if (interpret == true) {
    if (current_Sequence.includes(parseInt(numEvent)) == false) {
      reset_flags(flags.length);
      console.log("Reset ...", flags);
      arduino.set_barled(0);
    }

    if (numEvent == current_Sequence[0]) {
      flags[0] = true;
      console.log("1st travel validated ...");
      console.log("Button states...", flags);
      arduino.set_barled((1/(flag_win+1)) * 100);
    }

    if (numEvent == current_Sequence[1]) {
      if (flags[0]) {
        console.log("2nd travel validated ...");
        flags[1] = true;
        reset_flags(2);
        console.log("Button states...", flags);
        arduino.set_barled((2/(flag_win+1)) * 100);
      }
    }

    if (numEvent == current_Sequence[2]) {
      if (flags[1]) {
        console.log("3rd travel validated ...");
        flags[2] = true;
        reset_flags(3);
        console.log("Button states...", flags);
        arduino.set_barled((3/(flag_win+1)) * 100);
      }
    }

    if (numEvent == current_Sequence[3]) {
      if (flags[2]) {
        console.log("4th travel validated ...");
        flags[3] = true;
        reset_flags(4);
        console.log("Button states...", flags);
        arduino.set_barled((4/(flag_win+1)) * 100);
      }
    }

    if (numEvent == current_Sequence[4]) {
      if (flags[3]) {
        console.log("5th travel validated ...");
        flags[4] = true;
        reset_flags(5);
        console.log("Button states...", flags);
        arduino.set_barled((5/(flag_win+1)) * 100);
      }
    }

    if (numEvent == current_Sequence[5]) {
      if (flags[4]) {
        console.log("6th travel validated ...");
        flags[5] = true;
        reset_flags(6);
        console.log("Button states...", flags);
        arduino.set_barled((6/(flag_win+1)) * 100);
      }
    }

    if (numEvent == current_Sequence[6]) {
      if (flags[5]) {
        console.log("7th travel validated ...");
        flags[6] = true;
        reset_flags(7);
        console.log("Button states...", flags);
        arduino.set_barled((7/(flag_win+1)) * 100);
      }
    }

    if (numEvent == current_Sequence[7]) {
      if (flags[6]) {
        console.log("8th travel validated ...");
        flags[7] = true;
        reset_flags(8);
        console.log("Button states...", flags);
        arduino.set_barled((8/(flag_win+1)) * 100);
      }
    }

    if (numEvent == current_Sequence[8]) {
      if (flags[7]) {
        console.log("9th travel validated ...");
        flags[8] = true;
        reset_flags(9);
        console.log("Button states...", flags);
        arduino.set_barled((9/(flag_win+1)) * 100);
      }
    }

    if (numEvent == current_Sequence[9]) {
      if (flags[8]) {
        console.log("10th travel validated ...");
        flags[9] = true;
        reset_flags(10);
        console.log("Button states...", flags);
        arduino.set_barled((10/(flag_win+1)) * 100);
      }
    }

    if (numEvent == current_Sequence[10]) {
      if (flags[9]) {
        console.log("11th travel validated ...");
        flags[10] = true;
        reset_flags(11);
        console.log("Button states...", flags);
        arduino.set_barled((11/(flag_win+1)) * 100);
      }
    }

    if (numEvent == current_Sequence[11]) {
      if (flags[10]) {
        console.log("12th travel validated ...");
        flags[11] = true;
        reset_flags(12);
        console.log("Button states...", flags);
        arduino.set_barled((12/(flag_win+1)) * 100);
      }
    }

    if (numEvent == current_Sequence[12]) {
      if (flags[11]) {
        console.log("13th travel validated ...");
        flags[12] = true;
        reset_flags(13);
        console.log("Button states...", flags);
        arduino.set_barled((13/(flag_win+1)) * 100);
      }
    }

    if (numEvent == current_Sequence[13]) {
      if (flags[12]) {
        console.log("14th travel validated ...");
        flags[13] = true;
        reset_flags(14);
        console.log("Button states...", flags);
        arduino.set_barled((14/(flag_win+1)) * 100);
      }
    }

    if (numEvent == current_Sequence[14]) {
      if (flags[13]) {
        console.log("15th travel validated ...");
        flags[14] = true;
        //reset_flags(15);
        console.log("Button states...", flags);
        arduino.set_barled((15/(flag_win+1)) * 100);
      }
    }
  }
});

arduino.emitter.on("Reset", () => {
  console.log("[TIMEOUT RESET] ... Resetting Flags.");
  reset_flags(flags.length);
  interpret = false;
});

arduino.emitter.on("Start", () => {
  console.log(flags);
  reset_flags(flags.length);
  Current_Explorer = getRandomItem(explorers);
  current_Sequence = Current_Explorer[1];
  flag_win = current_Sequence.length-1;
  console.log(current_Sequence);
  console.log("flag win = ",flag_win+1);
  arduino.emitter.emit("Explorer", Current_Explorer);

});

function gameWon() {
  if (flags[flag_win]) {
    interpret = false;
    reset_flags(flags.length);
    setTimeout(() => {
      console.log("[ WIN ] ...FLAGS & BARLED RESET.");
      arduino.set_barled(0);
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
    game_name,
  };
}

module.exports = {
  gameWon,
  gameLost,
  cell_info,
};
