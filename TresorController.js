const WebSocket = require("ws");

const { NFC } = require("nfc-pcsc");
let events = require("events");
let randomWords = require("random-words");
const arduino = require("./arduino.js");

let badge_check = false;
let cardUID = "";
let finished = true;
let playing = false;
let reset_time_badge = 30000;
let badge_game_check = false;
let setIntervalID;
let setTimeoutID1;
let selected_button = "1";
let guess = "test";
let interpret = false;
let coins_falling_audio_signal = false;
let contestants_running_audio_signal = false;

const OUTPUT_LED1 = "05";
const OUTPUT_LED2 = "06";
const OUTPUT_LED3 = "07";
const OUTPUT_LED4 = "08";
let LEDS = [OUTPUT_LED1,OUTPUT_LED2,OUTPUT_LED3,OUTPUT_LED4];

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
  selected_button = Math.floor(Math.random() * 4) + 1;
  console.log("Turning on button " + selected_button);
  arduino.set_output(LEDS[selected_button-1], OUT_ON);
  return selected_button;
};

const turn_off_random_button = (rand) => {
  console.log("Turning off button " + rand);
  arduino.set_output(LEDS[rand-1], OUT_OFF);
};


arduino.emitter.on("EventInput", (numEvent , val) => {
  if (interpret) {
    console.log("clicked recieved at : ", numEvent);

    // let v = arduino.get_input1().then((value) => {
    //       //value = ~value;
    //       console.log("input1 Called , results = ", value);
    // })

    if (numEvent == selected_button) {
      console.log("Right Button clicked ...");
      turn_off_random_button(selected_button);
      event.emit("Empty");
      interpret = false;
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

      win_status = JSON.parse(messageReceived).data;
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
        coins_falling_audio_signal = false;
        contestants_running_audio_signal = false;
        turn_off_random_button(selected_button);
        arduino.turn_on_green_light_indicator();
        arduino.turn_off_green_light_indicator;
      }, 100);
    }

    if (
      messageReceived.search("go") !== -1 &&
      badge_check &&
      badge_game_check
    ) {
      guess = get_word();
      const messageSent = {
        action: "guess",
        data: guess,
      };
      ws.send(JSON.stringify(messageSent));
      //add
      //arduino.set_barled(50);
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

    if (messageReceived.search("boyardPicked") !== -1) {
      console.log(messageReceived);
      const messageSent = {
        action: "pause_animation_recieved",
      };
      ws.send(JSON.stringify(messageSent));
      event.emit("Turn_on");
      interpret = true;
      contestants_running_audio_signal = true;
      coins_falling_audio_signal = false;
    }

    if (messageReceived.search("ChronoEnd") !== -1) {
      console.log("ChronoEnd recieved");

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
