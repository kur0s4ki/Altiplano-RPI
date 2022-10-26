///
///                                                       H2C DEVELOPMENT CONFIDENTIAL
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

//////////////////////////////////////////////////////////////////// MEMORY ////////////////////////////////////////////////////////////////////

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

OUTPUT 1 : LED 1
OUTPUT 2 : LED 2
OUTPUT 3 : LED 3
OUTPUT 4 : LED 4
OUTPUT 5 : LED 5
OUTPUT 6 : LED 6
OUTPUT 7 : LED 7
OUTPUT 8 : LED 8
OUTPUT 9 : LED 9
OUTPUT 10 : LED 10




Objectives:
Les boutons s'illuminent les uns après les autres, les joueurs doivent reproduire les séquences qui se succèdent.

*/

const arduino = require("../arduino.js");

let interpret = false;
let led = 0;
let barled = 0;
let fouras_sentence = "La bonne séquence tu te rappellera";
let game_time = 3;
let cell_number = 11;
let game_name = "Memory";


let current_Sequence = [];
let Sequence_time = 30000;
let between_leds_time = 2000;
let sequence = 5;
let validated_sequences = 0;
let flag_win = 0;
let count_sequence = false;
let i = 1;

let flags = Array.from({ length: 10 }, (_, i) => false);
let double_click_flags = Array.from({ length: 10 }, (_, i) => false);

const OUT_ON = "1";
const OUT_OFF = "0";

const reset_flags = (except) => {
  flags.fill(false, 0, except - 1);
  flags.fill(false, except, flags.length);
  if (except == flags.length) flags.fill(false, 0, flags.length);
  //console.log("Resetting flags ...");
};

const reset_click_flags = () => {
  double_click_flags.fill(false, 0 , double_click_flags.length);
  //console.log("Resetting flags ...");
};

const generate_sequence = (arg) => {
  let arr = [];
  let t = 0;
  do {
    let val = Math.floor(Math.random() * 10) + 1;
    if (val !== arr[arr.length - 1] && val !== arr[0]) {
      arr.push(val);
      t++;
    }
  } while (t < arg.size);
  return arr;
};

const turn_on_sequence = (arr) => {
  let j = 0;
  let led_interval = setInterval(() => {
    //console.log("turning on ..", arr[j]);
    //arduino.set_output((arr[j]+4) , OUT_ON);
    let st1 = setTimeout(() => {
      //console.log("turning off ..", arr[j]);
      //arduino.set_output((arr[j]+4) , OUT_OFF);
      clearTimeout(st1);
      j += 1;
    }, 500);
    if (j == arr.length - 1) clearInterval(led_interval);
  }, between_leds_time);
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
  console.log("-----------------------------------");
  console.log("Event received ", numEvent);
  console.log("Current Sequence ", current_Sequence);

  //input = ~input;
  if (interpret == true) {
    sequence_has_changed = false;
    if (current_Sequence.includes(parseInt(numEvent)) == false) {
      reset_flags(flags.length);
      validated_sequences = 0;
      sequence_has_changed = true;
      console.log("Reset ...", flags);
      console.log("Reset sequence score ...", validated_sequences);
    }

    if (numEvent == current_Sequence[0]) {

      if (double_click_flags[0]) {
        reset_flags(flags.length);
        double_click_flags[0] = false;
        count_sequence = true;
        validated_sequences = 0;
        sequence_has_changed = true;
      }

      if (!flags[0]) {
        flags[0] = true;
        double_click_flags[0] = true;
        

        console.log("1st button validated ...");
        console.log("flag states...", flags);
        if (flag_win == 1 && count_sequence) {
          validated_sequences += 1;
          sequence_has_changed = true;
          count_sequence = false;
          console.log("validated sequences .. ", validated_sequences);
          
        }
      }

    }

    if (numEvent == current_Sequence[1]) {
      if (flags[0]) {
        if (double_click_flags[1]) {
          reset_flags(flags.length);
          double_click_flags[1] = false;
          count_sequence = true;
          validated_sequences = 0;
          sequence_has_changed = true;
        }

        
        console.log("2nd button validated ...");
        flags[1] = true;
        double_click_flags[1] = true;
        reset_flags(2);
        console.log("flag states...", flags);
        if (flag_win == 2 && count_sequence) {
          validated_sequences += 1;
          sequence_has_changed = true;
          count_sequence = false;
          reset_flags(flags.length);
          console.log("validated sequences .. ", validated_sequences);
          
        }
      }
    }

    if (numEvent == current_Sequence[2]) {
      if (flags[1]) {
        if (double_click_flags[2]) {
          reset_flags(flags.length);
          double_click_flags[2] = false;
          count_sequence = true;
          validated_sequences = 0;
          sequence_has_changed = true;
        }

        
        console.log("3rd button validated ...");
        flags[2] = true;
        double_click_flags[2] = true;
        reset_flags(3);
        console.log("flag states...", flags);
        if (flag_win == 3 && count_sequence) {
          validated_sequences += 1;
          sequence_has_changed = true;
          count_sequence = false;
          reset_flags(flags.length);
          console.log("validated sequences .. ", validated_sequences);
          
        }
      }
    
    }

    if (numEvent == current_Sequence[3]) {
      if (flags[2]) {
        if (double_click_flags[3]) {
          reset_flags(flags.length);
          double_click_flags[3] = false;
          count_sequence = true;
          validated_sequences = 0;
          sequence_has_changed = true;
        }

        
        console.log("4th button validated ...");
        flags[3] = true;
        double_click_flags[3] = true;
        reset_flags(4);
        console.log("flag states...", flags);
        if (flag_win == 4 && count_sequence) {
          validated_sequences += 1;
          sequence_has_changed = true;
          count_sequence = false;
          reset_flags(flags.length);
          console.log("validated sequences .. ", validated_sequences);
          
        }
      }
    }

    if (numEvent == current_Sequence[4]) {
      if (flags[3]) {
        if (double_click_flags[4]) {
          reset_flags(flags.length);
          double_click_flags[4] = false;
          count_sequence = true;
          validated_sequences = 0;
          sequence_has_changed = true;
        }

        
        console.log("5th button validated ...");
        flags[4] = true;
        double_click_flags[4] = true;
        reset_flags(5);
        console.log("flag states...", flags);
        if (flag_win == 5 && count_sequence) {
          validated_sequences += 1;
          sequence_has_changed = true;
          count_sequence = false;
          reset_flags(flags.length);
          console.log("validated sequences .. ", validated_sequences);
          
        }
      }
    }

    if (numEvent == current_Sequence[5]) {
      if (flags[4]) {
        if (double_click_flags[5]) {
          reset_flags(flags.length);
          double_click_flags[5] = false;
          count_sequence = true;
          validated_sequences = 0;
          sequence_has_changed = true;
        }

        
        console.log("6th button validated ...");
        flags[5] = true;
        double_click_flags[5] = true;
        reset_flags(6);
        console.log("flag states...", flags);
        if (flag_win == 6 && count_sequence) {
          validated_sequences += 1;
          sequence_has_changed = true;
          count_sequence = false;
          reset_flags(flags.length);
          console.log("validated sequences .. ", validated_sequences);
          
        }
      }
    }

    if (numEvent == current_Sequence[6]) {
      if (flags[5]) {
        if (double_click_flags[6]) {
          reset_flags(flags.length);
          double_click_flags[6] = false;
          count_sequence = true;
          validated_sequences = 0;
          sequence_has_changed = true;
        }

        
        console.log("7th button validated ...");
        flags[6] = true;
        double_click_flags[6] = true;
        reset_flags(7);
        console.log("flag states...", flags);
        if (flag_win == 7 && count_sequence) {
          validated_sequences += 1;
          sequence_has_changed = true;
          count_sequence = false;
          reset_flags(flags.length);
          console.log("validated sequences .. ", validated_sequences);
          
        }
      }
    }

    if (numEvent == current_Sequence[7]) {
      if (flags[6]) {
        if (double_click_flags[7]) {
          reset_flags(flags.length);
          double_click_flags[7] = false;
          count_sequence = true;
          validated_sequences = 0;
          sequence_has_changed = true;
        }

        
        console.log("8th button validated ...");
        flags[7] = true;
        double_click_flags[7] = true;
        reset_flags(8);
        console.log("flag states...", flags);
        if (flag_win == 8 && count_sequence) {
          validated_sequences += 1;
          sequence_has_changed = true;
          count_sequence = false;
          reset_flags(flags.length);
          console.log("validated sequences .. ", validated_sequences);
          
        }
      }
    }

    if (numEvent == current_Sequence[8]) {
      if (flags[7]) {
        if (double_click_flags[8]) {
          reset_flags(flags.length);
          double_click_flags[8] = false;
          count_sequence = true;
          validated_sequences = 0;
          sequence_has_changed = true;
        }

        
        console.log("9th button validated ...");
        flags[8] = true;
        double_click_flags[8] = true;
        reset_flags(9);
        console.log("flag states...", flags);
        if (flag_win == 9 && count_sequence) {
          validated_sequences += 1;
          sequence_has_changed = true;
          count_sequence = false;
          reset_flags(flags.length);
          console.log("validated sequences .. ", validated_sequences);
          
        }
      }
    }

    if (numEvent == current_Sequence[9]) {
      if (flags[8]) {
        if (double_click_flags[9]) {
          reset_flags(flags.length);
          double_click_flags[9] = false;
          count_sequence = true;
          validated_sequences = 0;
          sequence_has_changed = true;
        }

        console.log("10th button validated ...");
        flags[9] = true;
        double_click_flags[9] = true;
        reset_flags(10);
        console.log("flag states...", flags);
        if (flag_win == 10 && count_sequence) {
          validated_sequences += 1;
          sequence_has_changed = true;
          count_sequence = false;
          console.log("validated sequences .. ", validated_sequences);
          
        }
      }

    }
   // if validated_sequence has changed
   // set barled to validated sequence
    if(sequence_has_changed) {
      console.log("Change detected , setting barled ...")
      arduino.set_barled(validated_sequences/sequence * 100);}

  }
  console.log("-----------------------------------");
});

arduino.emitter.on("Reset", () => {
  console.log("[TIMEOUT RESET] ... Resetting Flags.");
  led = 0;
  barled = 0;
  interpret = false;
  validated_sequences = 0;
  sequence_has_changed = false;
  reset_click_flags(flags.length);
  reset_flags(flags.length);
  arduino.set_barled(barled);
});

arduino.emitter.on("Start", () => {
  led = 0;
  barled = 0;
  interpret = false;
  validated_sequences = 0;
  sequence_has_changed = false;
  let i = 1;
  reset_click_flags(flags.length);
  reset_flags(flags.length);
  current_Sequence = generate_sequence({ size: 1 });
  console.log(current_Sequence);
  turn_on_sequence(current_Sequence);
  count_sequence = true;
  validated_sequences = 0;
  flag_win = 1;
  i += 1;

  let interval = setInterval(() => {
    reset_click_flags(flags.length);
    reset_flags(flags.length);
    current_Sequence = generate_sequence({ size: i });
    console.log(current_Sequence);
    flag_win += 1;
    count_sequence = true;
    turn_on_sequence(current_Sequence);
    i += 1;
    if (i > 10) {
      i = 1;
      flag_win = 1;
    }
    if (validated_sequences >= sequence - 1) clearInterval(interval);
  }, Sequence_time);

  // flag_win = 6;
  // current_Sequence = [8, 6, 4, 7, 4, 10];
  // validated_sequences = 0;
  // count_sequence = true;
});

function gameWon() {
  if (validated_sequences >= sequence) {
    validated_sequences = 0;
    interpret = false;
    led = 0;
    barled = 0;
    sequence_has_changed = false;
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
