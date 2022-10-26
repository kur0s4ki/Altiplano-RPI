const WebSocket = require("ws");

const { NFC } = require("nfc-pcsc");
let events = require("events");
const arduino = require("../arduino.js");
const game = require("./game.js");

let post_index = false;
let item_index = 1;
let badge_check = false;
let badge_out = false;
let exit_signal = false;
let cardUID = "";
let normal_reset = false;
let win_reset = false;
let win = false;
let finished = false;
let playing = false;
let first = true;
let reset_time = 300000;
let reset_time_badge = 20000;
let lost = false;
let setIntervalID;
let setTimeoutID;
let setTimeoutID1;
let { fouras_sentence, game_time, cell_number } = game.cell_info();

const wss = new WebSocket.Server({
  port: 8000,
});
const wss_secondary = new WebSocket.Server({
  port: 8020,
});
const nfc = new NFC();
let em = new events.EventEmitter();

em.on("gameStart", (ws) => {
  arduino.emitter.emit("Start");
  arduino.emitter.emit("interpret");
  console.log(
    `\n[GAME STARTED] Listenning for events ...\n Resetting in ${Math.floor(
      reset_time / 60000
    )} minutes.`
  );
  lost = false;
  setIntervalID = setInterval(() => {
    if (exit_signal || game.gameLost()) {
      console.log("\n [GAME OVER] ...");
      clearInterval(setIntervalID);
      clearTimeout(setTimeoutID);
      arduino.emitter.emit("stop_interpret");
      lost = true;
      get_out1 = setTimeout(() => {
        playing = false;
        badge_check = false;
        badge_out = false;
        exit_signal = false;
        finished = false;
        first = true;
        //lost = true;
        console.log("\n[ARDUINO CALL] Turning ON green indicator.");
        arduino.turn_on_green_light_indicator();
      }, 10000);
    } else if (game.gameWon()) {
      win = true;
      finished = true;
      lost = false;
      if (first) {
        console.log("\n[GAME WON] .. CONGRATS... Badge out to collect points.");
        console.log("\n[ARDUINO CALL] Turning ON green Light Effects.");
        arduino.emitter.emit("stop_interpret");
        arduino.green_light_effect();
      }
      first = false;
    }
  }, 100);
  setTimeoutID = setTimeout(() => {
    console.log("\n[INFO] TIMEOUT , RESITING ...");
    if (win) {
      win_reset = true;
    } else {
      normal_reset = true;
    }
    badge_check = false;
    badge_out = false;
    win = false;
    playing = false;
    finished = false;
    lost = false;
    clearInterval(setIntervalID);
  }, reset_time);
});

em.on("gameExit", () => {
  exit_signal = true;
});

arduino.emitter.on("post_image_index", (image_index) => {
  post_index = true;
  item_index = image_index;
  console.log("Recieved image index : ", item_index);
});

wss_secondary.on("connection", function connection(ws) {
  ws.on("message", (messageReceived) => {
    if (messageReceived.search("image_index_status") !== -1) {
      if (post_index) {
        post_index = false;
        const messageSent = {
          action: "image_index",
          data: item_index,
        };
        ws.send(JSON.stringify(messageSent));
      }
    }

    if (messageReceived.search("secondary_exit_status") !== -1) {
      if (exit_signal || win) {
        const messageSent = {
          action: "secondary_exit_status",
          data: exit_signal,
        };
        ws.send(JSON.stringify(messageSent));
      }
    }
  });
});

wss.on("connection", function connection(ws) {
  ws.on("message", (messageReceived) => {
    if (messageReceived.search("game_status") !== -1 && badge_check) {
      if (win) {
        const messageSent = {
          action: "win_status",
          data: "win",
        };
        ws.send(JSON.stringify(messageSent));
      }
    }

    if (messageReceived.search("normal_reset") !== -1) {
      if (normal_reset) {
        normal_reset = false;
        const messageSent = {
          action: "normal_reset_status",
          data: normal_reset,
        };
        ws.send(JSON.stringify(messageSent));
      }
    }

    if (messageReceived.search("win_reset") !== -1) {
      if (win_reset) {
        win_reset = false;
        const messageSent = {
          action: "win_reset_status",
          data: win_reset,
        };
        ws.send(JSON.stringify(messageSent));
      }
    }

    if (messageReceived.search("is_lost") !== -1) {
      if (lost) {
        const messageSent = {
          action: "loss_status",
          data: "loss",
        };
        ws.send(JSON.stringify(messageSent));
      }
    }

    if (messageReceived.search("badge_in_status") !== -1 && badge_check) {
      clearTimeout(setTimeoutID1);
      const messageSent = {
        action: "badge_in",
        data: cardUID,
      };
      ws.send(JSON.stringify(messageSent));
    }

    if (messageReceived.search("badge_out_status") !== -1 && badge_check) {
      const messageSent = {
        action: "badge_out",
        data: badge_out,
      };
      ws.send(JSON.stringify(messageSent));
    }

    if (messageReceived.search("badge_out_succes") !== -1) {
      if (badge_out) {
        get_out = setTimeout(() => {
          badge_check = false;
          badge_out = false;
          win = false;
          playing = false;
          finished = false;
          first = true;
          //arduino.emitter.emit("Reset");
          game_won = false;
          clearInterval(setIntervalID);
          clearTimeout(setTimeoutID);
          console.log("\n[ARDUINO CALL] Turning ON green indicator.");
          arduino.turn_on_green_light_indicator();
        }, 10000);
      }
    }

    if (messageReceived.search("info") !== -1) {
      const messageSent = {
        action: "info",
        fouras_sentence: fouras_sentence,
        game_time: game_time,
        cell_number: cell_number,
      };
      ws.send(JSON.stringify(messageSent));
    }

    if (messageReceived.search("open") !== -1 && badge_check) {
      console.log("\n[ARDUINO CALL] Opening the door.");
      arduino.open_door();
      console.log("\n[ARDUINO CALL] Turn on Red indicator");
      arduino.turn_off_green_light_indicator();
    }

    if (messageReceived == "error") {
      console.log("\n[ARDUINO CALL] Turn on Red indicator");
      arduino.turn_off_green_light_indicator();
    }

    if (messageReceived.search("start") !== -1 && badge_check) {
      em.emit("gameStart");
      //interpret = true;
    }
    if (messageReceived.search("exit") !== -1 && badge_check) {
      exit_signal = true;
      finished = true;
    }
  });
});

nfc.on("reader", (reader) => {
  console.log(reader.name + " reader attached, waiting for cards ...");

  reader.on("card", (card) => {
    cardUID = card.uid.toString();

    if (reader.name.includes("00 00") && playing == false) {
      console.log("\n[BADGE IN] .. card ID : ", cardUID);
      if (cardUID != "") {
        setTimeoutID1 = setTimeout(() => {
          console.log("\n[INFO] BADGE TIMEOUT , RESETING ...");
          badge_check = false;
          badge_out = false;
          win = false;
          playing = false;
          finished = false;
          clearInterval(setIntervalID);
        }, reset_time_badge);
        playing = true;
        badge_check = true;
      } else {
        badge_check = false;
      }
    } else if (reader.name.includes("03 00") && playing == true) {
      if (badge_check == true && finished == true) {
        if (cardUID != "") {
          console.log("\n[BADGING OUT]");
          //arduino.open_door();
          badge_out = true;
        } else {
          badge_out = false;
        }
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
