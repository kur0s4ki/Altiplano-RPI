const WebSocket = require("ws");
const { NFC } = require("nfc-pcsc");

var ws = new WebSocket('wss://vmi693601.contaboserver.net:4500/');

const nfc = new NFC();

let badgeIn = false;
let badgeUID = '';


nfc.on("reader", (reader) => {
    console.log(reader.name + " reader attached, waiting for cards ...");

    reader.on("card", (card) => {
        badgeUID = card.uid.toString();
        console.log("\n[BADGE IN] .. Badge ID : ", badgeUID);
        badgeIn = true;
    });

    reader.on("error", (err) => {
        console.error("reader error", err);
    });

    reader.on("end", () => {
        console.log(reader.name + " reader disconnected.");
    });
});

ws.on('open', () => {
    setInterval(() => {
        if (badgeIn) {
            badgeIn = false;
            const messageSent = {
                action: "badge_in",
                data: badgeUID,
            };
            ws.send(JSON.stringify(messageSent));
        }
    }, 100);
});