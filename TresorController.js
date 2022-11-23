const WebSocket = require("ws");
const { NFC } = require("nfc-pcsc");
let events = require("events");
let randomWords = require("random-words");
const arduino = require("./arduino.js");

let badge_check = false;
let cardUID = "";
let finished = true;
let playing = false;
let share_boyards = false;
let boyards_picked = 0;
let reset_time_badge = 30000;
let badge_game_check = false;
let setIntervalID;
let setTimeoutID1;
let selected_button = "4";
let guess = "dummy";
let interpret = false;
let coins_falling_audio_signal = false;
let contestants_running_audio_signal = false;

let keys = [
  ['C', 'B', 'G', 'F', 'J', 'U'],
  ['Q', 'T', 'E', 'L', 'M', 'I'],
  ['I', 'A', 'H', 'O', 'P', 'S'],
  ['F', 'V', 'S', 'N', 'D', 'R'],
  ['X', 'C', 'R', 'U', 'E', 'L'],
  ['E', 'N', 'E', 'A', 'P', 'T'],
];

let keyboard = [0, 0, 0, 0, 0, 0];
let ValEvent1;
let ValEvent2;
let ValEvent3;
let word = '';

const OUT_ON = "1";
const OUT_OFF = "0";

const wss = new WebSocket.Server({
  port: 8000,
});

const wss_pc_games = new WebSocket.Server({
  port: 8005,
});

const nfc = new NFC();
let event = new events.EventEmitter();

const get_word = () => {
  return randomWords();
};

const turn_on_random_button = () => {
  selected_button = Math.floor(Math.random() * 4) + 4;
  console.log("Turning on button " + selected_button);
  arduino.set_output(selected_button, OUT_ON);
  return selected_button;
};

const turn_off_random_button = (rand) => {
  console.log("Turning off button " + rand);
  arduino.set_output(rand, OUT_OFF);
};


arduino.emitter.on("EventInput", (numEvent, input) => {
  if (interpret) {
    console.log("clicked recieved at : ", numEvent);
    if (numEvent == selected_button) {
      console.log("Right Button clicked ...");
      turn_off_random_button(selected_button);
      event.emit("Empty");
      interpret = false;
    }

    if (numEvent == '1')
      ValEvent1 = input;
    if (numEvent == '2')
      ValEvent2 = input;
    if (numEvent == '3') {
      ValEvent3 = input;
      keyboard[0] = ValEvent1 / 256;
      keyboard[1] = ValEvent1 % 256;
      keyboard[2] = ValEvent2 / 256;
      keyboard[3] = ValEvent2 % 256;
      keyboard[4] = ValEvent3 / 256;
      keyboard[5] = ValEvent3 % 256;

      word = '';
      //construction du mot 
      for (i = 0; i < 6; i++) {
        rot = 1;
        for (j = 0; j < 6; j++) {
          if ((rot & keyboard[i]) > 0) {
            mot = mot + keys[i][j]
          }
          rot = rot * 2;
        }
      }
      //le mot contient la liste des characteres
      console.log("final guess format is : ",word);
      guess = word;

    }

  }
});

event.on("start", () => {
  console.log("second Sequence started ...");
  event.emit("start_animation");
  coins_falling_audio_signal = true;
  //finished = false;
});

event.on("exit", () => {
  // Reset everything
  // Turn Off everything
  console.log("Resetting everything ...");
  //finished = true;
});

event.on("Turn_on", () => {
  console.log("[Animation Paused ...]");
  selected_button = turn_on_random_button();
});

wss.on("connection", function connection(ws) {
  ws.on("message", (messageReceived) => {
    messageReceived = messageReceived.toString();

    if (messageReceived.search("game_status") !== -1) {
      const messageSent = {
        action: "game_status_sent_successfully",
      };
      ws.send(JSON.stringify(messageSent));

      win_status = JSON.parse(JSON.parse(messageReceived)).data;
      if (win_status == "win") {
        event.emit("start");
      } else {
        event.emit("exit");
      }
    }

    if (messageReceived.search("badge_in_status") !== -1 && badge_check) {
      clearTimeout(setTimeoutID1);
      const messageSent = {
        action: "badge_in",
        cardUID: cardUID,
      };
      ws.send(JSON.stringify(messageSent));
    }

    if (messageReceived.search("boyards_picked_status") !== -1) {
      if(share_boyards){
        share_boyards=false;
        const messageSent = {
          action: "boyards_picked",
          data: boyards_picked,
        };
        ws.send(JSON.stringify(messageSent));
      }
      
    }

    if (messageReceived.search("game_badge_status") !== -1 && badge_check) {
      const messageSent = {
        action: "game_badge",
        data: badge_game_check,
      };
      ws.send(JSON.stringify(messageSent));
    }

    if (messageReceived.search("debug") !== -1) {
      const messageSent = {
        badge_game_check: badge_game_check,
        badge_check: badge_check,
        // finished:finished,
        // playing:playing,
        selected_button: selected_button,
        interpret: interpret,
        coins_falling_audio_signal: coins_falling_audio_signal,
        contestants_running_audio_signal: contestants_running_audio_signal,
      };
      ws.send(JSON.stringify(messageSent));
    }

    if (messageReceived.search("open") !== -1 && badge_check) {
      console.log("\n[ARDUINO CALL] Opening the door.");
      arduino.open_door();
      arduino.turn_off_green_light_indicator();
    }

    if (messageReceived.search("error") !== -1) {
      console.log("\n[ARDUINO CALL] Turn on Red indicator");
      arduino.turn_off_green_light_indicator();
      badge_check = false;
      badge_game_check = false;
    }

    if (
      messageReceived.search("phase_finished") !== -1 &&
      badge_check &&
      badge_game_check
    ) {
      finish = setTimeout(() => {
        console.log("[INFO] Phase Finished , Resetting Everything.");
        badge_check = false;
        badge_game_check = false;
        interpret = false;
        boyards_picked=0;
        share_boyards=false;
        coins_falling_audio_signal = false;
        contestants_running_audio_signal = false;
        turn_off_random_button(selected_button);
        arduino.turn_on_green_light_indicator();
        arduino.turn_off_green_light_indicator;
      }, 100);
    }

    if (
      messageReceived.search("winning_word_status") !== -1 &&
      badge_check &&
      badge_game_check
    ) {
      const messageSent = {
        action: "guess",
        data: guess,
      };
      ws.send(JSON.stringify(messageSent));
    }


    if (
      messageReceived.search("go") !== -1 &&
      badge_check &&
      badge_game_check
    ) {
      arduino.set_output(24, OUT_ON);
    }
    if (
      messageReceived.search("start_animation_simulation") !== -1 &&
      badge_check &&
      badge_game_check
    ) {
      const messageSent = {
        action: "Simulation__Triggered",
      };
      ws.send(JSON.stringify(messageSent));
      event.emit("start_animation");
      interpret = false;
    }

    if (
      messageReceived.search("exit") !== -1 &&
      badge_check &&
      badge_game_check
    ) {
      const messageSent = {
        action: "exit_signal_recieved",
      };
      ws.send(JSON.stringify(messageSent));
      event.emit("exit");
      //finished = true;
      badge_check = false;
      badge_game_check = false;
      interpret = false;
      coins_falling_audio_signal = false;
      contestants_running_audio_signal = false;
    }

    if (
      messageReceived.search("audio_status") !== -1 &&
      badge_check &&
      badge_game_check
    ) {
      const messageSent = {
        action: "audio_status",
        coins_falling_audio_signal: coins_falling_audio_signal,
        contestants_running_audio_signal: contestants_running_audio_signal,
      };
      ws.send(JSON.stringify(messageSent));
    }
  });
});

wss_pc_games.on("connection", function connection(ws) {

  console.log("Partie Unity connectée !");

  event.on("start_animation", () => {
    console.log("[Animation Starting ...]");

    const messageSent = {
      action: "Start",
      data: 40
    };
    ws.send(JSON.stringify(messageSent));


    contestants_running_audio_signal = false;
    coins_falling_audio_signal = true;
  });

  event.on("Empty", () => {
    console.log("[Animation re-Starting after collect...]");

    const messageSent = {
      action: "Empty",
    };
    ws.send(JSON.stringify(messageSent));


    contestants_running_audio_signal = false;
    coins_falling_audio_signal = true;
  });

  ws.on("message", (messageReceived) => {

    console.log(messageReceived);

    if (messageReceived.search("BoyardPicked") !== -1) {
      let data = parseInt(messageReceived.toString().split(":")[1]);
      boyards_picked+=data;
    }


    if (messageReceived.search("PeriodEnd") !== -1) {
      console.log(messageReceived);
      event.emit("Turn_on");
      interpret = true;
      contestants_running_audio_signal = true;
      coins_falling_audio_signal = false;
    }

    if (messageReceived.search("ChronoEnd") !== -1) {
      console.log("ChronoEnd recieved");
      share_boyards = true;
    }

  });
});

nfc.on("reader", (reader) => {
  // console.log(reader.name + " reader attached, waiting for cards ...");
  // console.log(reader + " reader ID");

  reader.on("card", (card) => {
    cardUID = card.uid.toString();
    cardUID = "00000000" + cardUID.toUpperCase();

    if (reader.name.includes("PICC 0") && !badge_check) {
      console.log("\n[BADGE IN] .. card ID : ", cardUID);
      if (cardUID != "") {
        setTimeoutID1 = setTimeout(() => {
          console.log("\n[INFO] BADGE TIMEOUT , RESETING ...");
          badge_check = false;
          badge_game_check = false;
          //playing = false;
          //finished = true;
          clearInterval(setIntervalID);
        }, reset_time_badge);
        //playing = true;
        badge_check = true;
      } else {
        badge_check = false;
      }
    } else if (
      reader.name.includes("ACS ACR122") &&
      !badge_game_check &&
      badge_check
    ) {
      if (cardUID != "") {
        console.log("\n[Game Badge]");
        badge_game_check = true;
      } else {
        badge_game_check = false;
      }
    }
  });

  reader.on("error", (err) => {
    console.error("reader error", err);
  });

  reader.on("end", () => {
    console.log(reader.name + " reader disconnected.");
  });
});

nfc.on("error", (err) => {
  console.error(err);
});
