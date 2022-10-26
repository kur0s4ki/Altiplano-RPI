// const compareImages = require("resemblejs/compareImages");
// const fs = require("mz/fs");

// // async function getDiff() {
// //     const options = {
// //         output: {
// //             errorColor: {
// //                 red: 255,
// //                 green: 0,
// //                 blue: 255
// //             },
// //             errorType: "movement",
// //             transparency: 0.3,
// //             largeImageThreshold: 1200,
// //             useCrossOrigin: false,
// //             outputDiff: true
// //         },
// //         scaleToSameSize: true,
// //         ignore: "antialiasing"
// //     };

// //     const data = await compareImages(await fs.readFile("spammer.jpg"), await fs.readFile("spammer.jpg"), options);

// //     await fs.writeFile("./output.png", data.getBuffer());
// // }

// const compare = require("resemblejs").compare;
// let threshold = 25;
// async function getDiff() {
//     test_object = await fs.readFile("sample2.jpg");
//     await compare(test_object, "sample2.jpg", function (err, data) {
//         if (err) {
//             console.log("An error!");
//         } else {
//             console.log(data["misMatchPercentage"]);

//             if(data["misMatchPercentage"] <= threshold ){
//                 console.log("Match.");
//             }else{
//                 console.log("No match.");
//             }
//         }
//     });
// }

// getDiff();


// resemble = require("node-resemble-js");

// var diff = resemble("test1.jpg").compareTo("orig1.jpg").ignoreNothing().onComplete(function(data){
//     console.log(data);
//     /*
//     {
//       misMatchPercentage : 100, // %
//       isSameDimensions: true, // or false
//       dimensionDifference: { width: 0, height: -1 }, // defined if dimensions are not the same
//       getImageDataUrl: function(){}
//     }
//     */
// });

// const { imgDiff } = require("img-diff-js");

// imgDiff({
//   actualFilename: "",
//   expectedFilename: "",
//   diffFilename: "diff.png",
// }).then(result => console.log(result));




compare();

async function compare()
{
	const Jimp = require("jimp");

	const original = await Jimp.read("orig.jpg");
	const original_copy = await Jimp.read("orig1.jpg");
	const test_subject = await Jimp.read("reference.jpg");
	


	console.log("original_copy.jpg\n=======================");
	console.log(`distance       ${Jimp.distance(original, original_copy)}`);
	console.log(`diff.percent   ${Jimp.diff(original, original_copy).percent}\n`);

	console.log("test_subject.jpg\n================");
	console.log(`distance       ${Jimp.distance(original, test_subject)}`);
	console.log(`diff.percent   ${Jimp.diff(original, test_subject).percent}\n`);

}