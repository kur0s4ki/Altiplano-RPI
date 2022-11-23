
// let keys= [
//     ['C','B','G', 'F', 'J', 'U'],
//     ['Q','T','E', 'L', 'M', 'I'],
//     ['I','A','H', 'O', 'P', 'S'],
//     ['F','V','S', 'N', 'D', 'R'],
//     ['X','C','R', 'U', 'E', 'L'],
//     ['E','N','E', 'A', 'P', 'T'],
//     ];
    
//     let clavier=[0,0,0,0,0,0];
//     let ValEvent1;
//     let ValEvent2;
//     let ValEvent3;
//     let mot='';
    
    function test (numEvent , input){
        
            if (numEvent=='1')
              ValEvent1=input;
            if (numEvent=='2')
              ValEvent2=input;
            if (numEvent=='3')
          {
             ValEvent3=input;
             clavier[0]=ValEvent1/256;
             clavier[1]=ValEvent1%256;
             clavier[2]=ValEvent2/256;
             clavier[3]=ValEvent2%256;
             clavier[4]=ValEvent3/256;
             clavier[5]=ValEvent3%256;
    
              mot='';
                //construction du mot 
              for (i=0;i<6;i++)
              {
                rot=1;
                for (j=0;j<6;j++)
                {
                  if ((rot & clavier[i])>0)
                  {
                    mot=mot+keys[i][j]
                  }
                  rot=rot*2;
                }
              }
    
    //le mot contient la liste des characteres
     return mot;
    
          }
        
        }
    
// console.log(test("1",0x3F3F));
// console.log(test("2",0x3F3F));
// console.log(test("3",0x3F3F));

    
let selected_button=0;
selected_button = Math.floor(Math.random() * 4) + 4;
console.log(selected_button);