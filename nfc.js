

const { NFC} = require('nfc-pcsc');


const nfc = new NFC();

nfc.on('reader', reader => {


        // THIS ONE DOESN"T WORK
        reader.autoProcessing = false;
        console.log('reader detected', reader.name);
        // APDU Transmit logic
        // FROM DOCS THIS IS THE APDU MSG
        // const apdu = 'E000003300';
        // const data = Buffer.from(apdu, 'hex');

        // try {
        //     const uid = await reader.transmit(data, 12); // 12 bytes = 24 hex digits (update according to your needs)
        //     console.log(`Serial : `, uid.toString('hex'));
        // } catch (err) {
        //     console.log(err);
        // }

        reader.on('card', async card => {


                // THIS ONE WORKS
                // APDU Transmit logic
                console.log('card detected');
                const apdu = '00a4040007d276000085010100';
                const data = Buffer.from(apdu, 'hex');

                try {
                    const uid = await reader.transmit(data,408); // 12 bytes = 24 hex digits (update according to your needs)
                    console.log(`UID`, uid.toString('hex'));
                } catch (err) {
                    console.log(err);
                }


        });


});

