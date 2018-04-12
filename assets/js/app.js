

//===============ITEM CONTROLLER==================
const ItemCtrl = (function(){

    // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCg1y3fgd8q9vN8TfAuRD6YBsPYn2PlRJU",
    authDomain: "rock-paper-scissors-3b3c4.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-3b3c4.firebaseio.com",
    projectId: "rock-paper-scissors-3b3c4",
    storageBucket: "",
    messagingSenderId: "842386238477"
  };
  firebase.initializeApp(config);
    let players = firebase.database().ref('players');

    
    //Public Methods
    return {
        getPlayers: ()=>{
            return players;
        }
    }

})();



//================UI CONTROLLER==================
const UICtrl = (function(){
    
    const UISelectors = {
        //Buttons
        player1Join: '.player1Join',
        player2Join: '.player2Join',
        pOneName: '#pOneName',
        pTwoName: '#pTwoName',
        p1Buttons: '.p1buttons',
        p2Buttons: '.p2buttons',
        p2Button: '.p2button',
        p1button: '.p1button',
        
        //Inputs
        p1InputGroup: '.p1InputGroup',
        p2InputGroup: '.p2InputGroup',
        
        
        //Selects
        
        //other
        p1Alert: '.p1Alert',
        p2Alert: '.p2Alert',
        p1Container: '.p1Container',
        p2Container: '.p2Container',
        p1Score: '.p1Score',
        p2Score: '.p2Score'
        
        
    }
    
    //Public Methods
    return {
        getSelectors: () => {
            return UISelectors;
        }
    }

})();





//==============APP CONTROLLER=================
const AppCtrl = (function(ItemCtrl, UICtrl){
    //Get UI selectors
    const UISelectors = UICtrl.getSelectors();
    const players = ItemCtrl.getPlayers();
    
    let p1Container = document.querySelector(UISelectors.p1Container),
        p2Container = document.querySelector(UISelectors.p2Container),
        p2button = Array.from(document.querySelectorAll(UISelectors.p2Button)),
        p1button = Array.from(document.querySelectorAll(UISelectors.p1button));

    let loadingSpinner = `<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
      <path fill="#FF6700" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z" transform="rotate(200 25 25)">
        <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"></animateTransform>
        </path>
      </svg>`;
    
    const loadEventListeners = ()=>{

        /*----------------CLICK Events-----------------*/ 
        //Player1 JOIN
        document.querySelector(UISelectors.player1Join).addEventListener('click', function(){
           let player1Name =  document.querySelector(UISelectors.pOneName).value;
            players.child('player1').set({
                Name: player1Name,
                wins: 0,
                loses: 0,
                disabled: false
            });
            
            player1Join();
            
        });
        
        
        //Player2 JOIN
        document.querySelector(UISelectors.player2Join).addEventListener('click', function(){
           let player2Name =  document.querySelector(UISelectors.pTwoName).value;
            players.child('player2').set({
                Name: player2Name,
                wins: 0,
                loses: 0,
                disabled: true
            });
            
            
            player2Join();
            
        });
        
        
        
        //Player 1 RPS button click
        document.querySelector(UISelectors.p1Buttons).addEventListener('click', (e)=>{
            let p1Choice = e.target.textContent;
            
            player1ButtonClick(p1Choice);
        });
        

        //Player 2 RPS button click
        document.querySelector(UISelectors.p2Buttons).addEventListener('click', (e)=>{
            let p2Choice = e.target.textContent;
                    console.log(p2Choice);  
            player2ButtonClick(p2Choice);
            
            
            
        });
     
    }//End Event Listeners
    
    
    
    const player1Join = ()=>{

        players.child('player1').on('value', (p1Data)=>{
         
            players.child('player2').on('value', (p2Data)=>{
                
                if(p1Data.val()){
                    
                    players.child('player1').on('value', (p1Data)=>{
                        p1button.forEach((button)=>{
                            button.disabled = p1Data.val().disabled;    
                        });
                    });
                
                    let p1Alert = document.querySelector(UISelectors.p1Alert);
                    p1Alert.classList = 'p1Alert d-flex justify-content-center mb-3';
                    p1Alert.innerHTML = `<h3 class='text-center'>Player 1: ${p1Data.val().Name}</h3>`;
                    
                    let p2Alert = document.querySelector(UISelectors.p2Alert);

                    if(p1Data.val() && p2Data.val()){
                        p2Alert.innerHTML = `<h3 class='text-center'>Player 2: ${p2Data.val().Name}</h3>`;
                        p1Container.classList = 'col-md-4 border border-success p1Container p-4';
                    }else{
                        p2Alert.innerHTML = `${loadingSpinner}
                                        <p>Waiting for player 2...`;
                        p2Alert.classList = `p2Alert d-flex justify-content-center flex-column align-items-center my-5`;    
                    }

                    document.querySelector(UISelectors.p1Buttons).style.display = 'block';
                    let p1InputGroup = document.querySelector(UISelectors.p1InputGroup);
                    p1InputGroup.style.display = 'none';
                    
                }
                
            });
            
            
        });
    }
    
    const player2Join = ()=>{
            
        players.child('player2').on('value', (p2Data)=>{
            
            players.child('player1').on('value', (p1Data)=>{
                
                if(p2Data.val()){
                
                    players.child('player2').on('value', (p2Data)=>{
                        p2button.forEach((button)=>{
                            button.disabled = p2Data.val().disabled;    
                        });
                    }); 
                    
                    let p2Alert = document.querySelector(UISelectors.p2Alert);

                    p2Alert.classList = 'p2Alert d-flex justify-content-center mb-3';
                    p2Alert.innerHTML = `<h3 class='text-center'>Player 2: ${p2Data.val().Name}</h3>`;

                    let p1Alert = document.querySelector(UISelectors.p1Alert),
                        p1Container = document.querySelector(UISelectors.p1Container);
                    
                    if(p2Data.val() && p1Data.val()){
                        p1Alert.innerHTML = `<h3 class='text-center'>Player 1: ${p1Data.val().Name}</h3>`;
                        p1Container.classList = 'col-md-4 border p1Container p-4';
                         
                        
                    } else {
                        p1Alert.innerHTML = `${loadingSpinner}
                                        <p>Waiting for player 1...`;
                        p1Alert.classList = `p1Alert d-flex justify-content-center flex-column align-items-center my-5`;    
                    }
                    
                    document.querySelector(UISelectors.p2Buttons).style.display = 'block';
                    let p2InputGroup = document.querySelector(UISelectors.p2InputGroup);
                    p2InputGroup.style.display = 'none';
                }
                
            })
           
        });
        
    }
    
    
    const player1ButtonClick = (p1Choice)=>{
        console.log(`Player1 Choice ${p1Choice}`);

                players.child('player1').child('choice').set(p1Choice);

                players.child('player2').child('disabled').set(false);

                players.child('player2').on('value', (p2Data)=>{
                    p2button.forEach((button)=>{
                        button.disabled = p2Data.val().disabled;    
                    });
                });

                players.child('player1').child('disabled').set(true);

                players.child('player1').on('value', (p1Data)=>{
                    p1button.forEach((button)=>{
                        button.disabled = p1Data.val().disabled;    
                    });
                }); 

    }
    
    const player2ButtonClick = (p2Choice)=>{
        console.log(`Player2 Choice ${p2Choice}`);

                players.child('player2').child('choice').set(p2Choice);

                players.child('player2').child('disabled').set(true);

                players.child('player2').on('value', (p2Data)=>{
                    p2button.forEach((button)=>{
                        button.disabled = p2Data.val().disabled;    
                    });
                });

                players.child('player1').child('disabled').set(false);

                players.child('player1').on('value', (p1Data)=>{
                    p1button.forEach((button)=>{
                        button.disabled = p1Data.val().disabled;    
                    });
                });
        
        checkWinner();
        
    }
    
    
    let p1Wins = 0,
        p1Loses = 0,
        p2Wins = 0,
        p2Loses = 0;
    
    const checkWinner = ()=>{
        let p2Choice,
            p1Choice;
         players.child('player2').on('value', (p2Data)=>{
             p2Choice = p2Data.val().choice;

         });  
        
        
        players.child('player1').on('value', (p1Data)=>{
                p1Choice = p1Data.val().choice;
            });
        console.log(p2Choice, p1Choice);
        if(p1Choice == p2Choice){
                    //console.log('Draw');
        }else if(p1Choice == 'ROCK' && p2Choice == 'SCISSORS'){
            players.child('player1').child('wins').set(p1Wins + 1);
            players.child('player2').child('loses').set(p2Loses + 1);
            resetChoices();
            displayScore();
        }else if(p1Choice == 'ROCK' && p2Choice == 'PAPER'){
            players.child('player1').child('loses').set(p1Loses + 1);
            players.child('player2').child('wins').set(p2Wins + 1);
            resetChoices();
            displayScore();
        }else if(p1Choice == 'SCISSORS' && p2Choice == 'ROCK'){
            players.child('player1').child('loses').set(p1Loses + 1);
            players.child('player2').child('wins').set(p2Wins + 1);
            resetChoices();
            displayScore();
        }else if(p1Choice == 'SCISSORS' && p2Choice == 'PAPER'){
            players.child('player1').child('wins').set(p1Wins + 1);
            players.child('player2').child('loses').set(p2Loses + 1);
            resetChoices();
            displayScore();
        }else if(p1Choice == 'PAPER' && p2Choice == 'ROCK'){
            players.child('player1').child('wins').set(p1Wins + 1);
            players.child('player2').child('loses').set(p2Loses + 1);
            resetChoices();
            displayScore();
        }else if (p1Choice == 'PAPER' && p2Choice == 'SCISSORS'){
            players.child('player1').child('loses').set(p1Loses + 1);
            players.child('player2').child('wins').set(p2Wins + 1);
            resetChoices();
            displayScore();
        }
        p2Choice ='';
        p1Choice = '';
        console.log(p2Choice, p1Choice);
    }
    
    
    const displayScore = ()=>{
        let p1Score = document.querySelector(UISelectors.p1Score),
            p2Score = document.querySelector(UISelectors.p2Score);
        players.child('player1').on('value', (p1Data)=>{
            let p1Wins = p1Data.val().wins,
                p1Loses = p1Data.val().loses;
            
            p1Score.innerHTML = `<p>Total Wins: ${p1Wins}  Total Loses: ${p1Loses}</p>`;
            
        });
        
        players.child('player2').on('value', (p2Data)=>{
            let p2Wins = p2Data.val().wins,
                p2Loses = p2Data.val().loses;
            
            p2Score.innerHTML = `<p>Total Wins: ${p2Wins}  Total Loses: ${p2Loses}</p>`;
            
        });
        
    }
            
    
    const resetChoices = ()=>{
            players.child('player1').child('choice').set('');
            players.child('player2').child('choice').set('');
 
        }
    
    
 

    //Public Methods
    return {
        init: () => {
            loadEventListeners();
            player1Join();
            player2Join();

            
        }
    }

})(ItemCtrl, UICtrl);


AppCtrl.init();