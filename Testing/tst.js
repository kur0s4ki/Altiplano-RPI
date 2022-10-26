// // // const getShuffledArr = (arr) => {
// // //     if (arr.length === 1) {
// // //       return arr;
// // //     }
// // //     const rand = Math.floor(Math.random() * arr.length);
// // //     return [arr[rand], ...getShuffledArr(arr.filter((_, i) => i != rand))];
// // //   };

// // // let unshuffled = Array.from({ length: 10 }, (_, i) =>
// // //   (i + 1)
// // // );

// // // console.log(unshuffled);

// // // let = random_buttons = getShuffledArr(unshuffled);

// // // console.log(random_buttons.slice(0,5));

// // // const turn_sequence_buttons = arr => {
// // //     let i = 0;
// // //     const interval = setInterval(function() {
// // //         console.log((arr[i]+3));
// // //         i+=1;
// // //         if(i==arr.length) clearInterval(interval);
// // //     }, 2000);
// // //   };

// // // turn_sequence_buttons(random_buttons);

// // let Explorer1 = "Cristopher Colombus";
// // let Explorer2 = "Marco Polo";
// // let Explorer3 = "Ibn Battuta";
// // let Explorer4 = "Vasco Da Gama";
// // let Explorer5 = "Ferdinand Magellan";

// // let sequence1 = [7, 1, 2, 3, 4, 5];
// // let sequence2 = [4, 5, 7, 8, 3, 6];
// // let sequence3 = [2, 5, 7, 4, 1, 5, 8];
// // let sequence4 = [2, 4, 11, 13, 14, 2, 7, 8, 1];
// // let sequence5 = [11, 1, 15, 3, 8, 9];

// // let explorers = new Map([
// //   [Explorer1, sequence1],
// //   [Explorer2, sequence2],
// //   [Explorer3, sequence3],
// //   [Explorer4, sequence4],
// //   [Explorer5, sequence5],
// // ]);

// // const getRandomItem = (map) => {
// //   let keys = Array.from(map);
// //   return keys[Math.floor(Math.random() * keys.length)];
// // }

// // console.log(explorers.get("Cristopher Colombus"));

// // console.log(explorers.get("Cristopher Colombus").length)

// // let flags = Array.from({ length: 15 }, (_, i) =>
// //   false
// // );

// // const reset_flags = (except) => {
// //   flags.fill(false , 0 , except-1);
// //   flags.fill(false , except , flags.length);

// //   return flags;
// // };

// // flags[0] = true;
// // console.log(reset_flags(1));

// // let score = 12;
// // let max_score = 20;

// // const turn_on_sequence1 = (arr) => {
// //   let j = 0;

// //   let first_interval = setInterval(() => {
// //     console.log("turning on ..", arr[j]);
// //     //arduino.set_output((arr[j]+4) , OUT_ON);
// //     let st1 = setTimeout(() => {
// //       console.log("turning off ..", arr[j]);
// //       //arduino.set_output((arr[j]+4) , OUT_OFF);
// //       clearTimeout(st1);
// //       j += 1;
// //       if (j == arr.length){
// //         j = 0;
// //         clearInterval(first_interval);
// //       };
// //     if ( score >= max_score) clearInterval(first_interval);
// //     }, 500);

// //   }, 2000);

// //   let outer_interval = setInterval(() => {

// //     if ( score >= max_score) clearInterval(outer_interval);

// //     let led_interval = setInterval(() => {
// //       console.log("turning on ..", arr[j]);
// //       //arduino.set_output((arr[j]+4) , OUT_ON);
// //       let st1 = setTimeout(() => {
// //         console.log("turning off ..", arr[j]);
// //         //arduino.set_output((arr[j]+4) , OUT_OFF);
// //         clearTimeout(st1);
// //         j += 1;
// //         if (j == arr.length){
// //           j = 0;
// //           clearInterval(led_interval);
// //           console.log("---------------------")
// //         };
// //       if ( score >= max_score) clearInterval(outer_interval);
// //       }, 500);

// //     }, 2000);
// //    }, 15000);
// // };

// // const turn_on_sequence = arr => {
// //   let j = 0;
// //   let led_interval = setInterval(() => {
// //     console.log("turning on .." , arr[j]);
// //     let st1 = setTimeout(()=>{
// //       console.log("turning off .." , arr[j]);
// //       clearTimeout(st1);
// //       j+=1;
// //     }, 500);
// //     if(j == arr.length-1) clearInterval(led_interval);
// //   }, 2000);
// // };

// // // let arr = [];
// // // let i = 1;

// // arr = Array.from({length: 5}, () => Math.floor(Math.random() * 10));
// //   console.log(arr);
// //   turn_on_sequence1(arr);
// //   i+=1;

// // let interval = setInterval(() => {

// //   arr = Array.from({length: i}, () => Math.floor(Math.random() * 10));
// //   console.log(arr);
// //   turn_on_sequence(arr);
// //   i+=1;

// //   if(i>10) i=1;
// // }, 15000);

// // let arr = [];
// // arr = Array.from({length: 10}, () => Math.floor(Math.random() * 10));
// // console.log(arr);

// let arr = [];

// // const generate_sequence = arg => {
// //   var i = 0;
// //   do {
// //     var val = Math.floor(Math.random() * 10) + 1;
// //     if (val !== arr[arr.length - 1] && val !== arr[0] ) {
// //       arr.push(val);
// //       i++;
// //     }

// //   } while (i < arg.size);
// //   return arr;
// // }

// // arr = generate_sequence({ size: 10 });

// // console.log(arr);

// // let double_click_flags = Array.from({ length: 10 }, (_, i) => true);

// // const reset_click_flags = () => {
// //   double_click_flags.fill(false, 0 , double_click_flags.length);
// //   console.log("Resetting flags ...");
// //   return double_click_flags;
// // };

// // console.log(reset_click_flags(double_click_flags));

// // let amine = "yoyoyo";

// // if(amine.search("yoyoyo")!==-1) console.log("lick");

// let item = 1;
// const Loop = () => {
//   let i = 1;
//   let inter = setInterval(() => {
//     if(i>16){
//       i = 1;
//       item = 1;
//     };
//     console.log("item :",i);
//     item = i;
//     i+=1;
    
//   }, 500);
// };
// const Loop1 = () => {
//   let inter = setInterval(() => {
//     console.log("original value:",item);

//   }, 500);
// };

// Loop();
// Loop1();

console.log( "\u001b[1;31m Red message \u001b[1;32m in green" );
console.log( "\u001b[1;32m Green message" );
console.log( "\u001b[1;33m Yellow message" );
console.log( "\u001b[1;34m Blue message" );
console.log( "\u001b[1;35m Purple message" );
console.log( "\u001b[1;36m Cyan message" );