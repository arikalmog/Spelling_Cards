var gameComponent = function () {
    this.pairs = 10;
    this.pairsFound = 0;
	this.turns = 0;
    this.gameCards = new Array(this.pairs * 2);
    this.gameBoard;
    this.pairsFoundElement;
    this.firstCard;
    this.secondCard;
    this.cardsInline = 7;
    this.rowsElements = [];
	this.scoreNum = 0;
	this.x = 0;
	this.y = 0;
	this.game = () =>{};
	this.expression = "";
	var _this = this;
	this.t;
	this.startTimer = new Date();
	this.leftTime = 0;
    this.resetGame = function () {

        this.gameCards = new Array(this.pairs * 2);
        this.gameBoard = document.getElementById("gameBody");
        this.gameBoard.innerHTML = "";
        this.pairsFoundElement = document.getElementById("pairsFound");
		
		this.turnsElement = document.getElementById("turns");
        this.gameWon = document.getElementById("gameWon");
        this.cardsInline = this.getCardsInLine(this.gameCards.length, 1);
        var rows = this.gameCards.length / this.cardsInline;
        for (r = 0; r < rows; r++) {
            var rowElement = document.createElement("div");
            rowElement.classList.add("card-row");
            this.gameBoard.appendChild(rowElement);

            this.rowsElements.push(rowElement);

        }

        this.pairsFound = 0;
    }
    this.startGame = function () {
        this.resetGame();
        for (var c = 0; c < this.pairs; c++) {
            for (var i = 0; i < 2; i++) {
                this.setCard(c);
            }
        }

        this.gameCards.forEach((card, index) => {
            var rowNumber = Math.floor(index / this.cardsInline);
            this.rowsElements[rowNumber].appendChild(card.get());
        });


    };
    this.getCardsInLine = function (total, divisorA) {
        var divisorB = total;
        while (!(divisorA > divisorB && Math.floor(divisorA) * Math.floor(divisorB) == total)) {
            divisorA++;
            divisorB = total / divisorA;

        }
        return divisorA;
    }
    this.onCardUnselected = function (cardSelected) {
        
    }
    this.onCardSelected = function (cardSelected) {
		var openCards = this.gameCards.filter(c => c.isOpen).length;
		var selectedCards = openCards - (this.pairsFound * 2);
		if (selectedCards == 1)
			this.firstCard = cardSelected;
        if( selectedCards == 2) {
            this.secondCard = cardSelected;
			this.turns++;
            if (this.firstCard.number == this.secondCard.number) {
                this.pairsFound++;
				
                this.pairsFoundElement.innerHTML = this.pairsFound + " cards";
				this.turnsElement.innerHTML = this.turns + " turns";
                if (this.pairs == this.pairsFound)
                    this.gameWon.classList.add("done");
            }
            else {
                setTimeout(() => {
					
                    this.firstCard.select();
                    this.secondCard.select();
                }, 1000);
            }
        }
    }
    this.setCard = function (cardNumber) {
        var index = this.getPosition();
        if (this.gameCards[index] == undefined) {
            this.gameCards[index] = new card(cardNumber);
            this.gameCards[index].selected.subscribe(d => {
                this.onCardSelected(d);
            });
            this.gameCards[index].unselected.subscribe(d => {
                this.onCardUnselected(d);
            })
        }
        else
            this.setCard(cardNumber);
    };
    this.getPosition = function () {
        var position = Math.random(0, 5);
        position = position * this.gameCards.length;
        position = Math.floor(position);
        return position;
    }
    this.setCardRow = function () {

    }

	this.record = function() {
		navigator.mediaDevices.getUserMedia({ audio: true })
		  .then(stream => {
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorder.start();

			const audioChunks = [];
			mediaRecorder.addEventListener("dataavailable", event => {
			  audioChunks.push(event.data);
			});

			mediaRecorder.addEventListener("stop", () => {
			  const audioBlob = new Blob(audioChunks);
			  const audioUrl = URL.createObjectURL(audioBlob);
			  const audio = new Audio(audioUrl);
			  audio.play();
			});

			setTimeout(() => {
			  mediaRecorder.stop();
			}, 3000);
		  });
	}
	
	let words = ["boy","Sister","Mom", "Father"];
	var SpeechRecognition = window.webkitSpeechRecognition;
	var recognition = new SpeechRecognition();
	this.startSpeech = function() {
		this.recstat = document.getElementById("recstatus");
		this.instructions = document.getElementById("instructions");
		this.word = document.getElementById("word");
		this.img = document.getElementById("img-word");
		this.text = "חג החנוכה בא.  הלכה טליה לסבתא.";
		this.speechElement = document.getElementById("speech");
		//this.word.innerText = words[0];
		this.speech();
		recognition.lang = "he-IL";
		recognition.start();
	}
	this.lastAns;
	this.speech  = function() {
		this.card = document.getElementById("current");
		var _recstat = this.recstat;
		var _instructions = this.instructions;
		var _word = this.word;
		var _img = this.img;
		var word = words[0];
		var _this = this;
		
		/*var Textbox = $('#textbox');*/
		

		var Content = '';
		
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.onresult = function(event) {
			
		  var current = event.resultIndex;
	
		
	
		  var transcript = event.results[current][0].transcript;
			if (_this.timeLeft > 0)
			clearTimeout(_this.timeoutObj);
			console.log(transcript);
			
			transcript = transcript.trim();
			if (_this.lastAns != transcript)
				_this.lastAns = transcript
			else
				return;
			transcript = _this.numberWords.indexOf(transcript) > -1 ? _this.numberWords.indexOf(transcript) : transcript;
			_this.expression = _this.x + " + " + _this.y + " = " + transcript;
			_this.card.innerHTML = _this.expression;
			if (_this.x + _this.y == transcript){
				console.log("good");
				_this.addScore();
				this.game();
			}
			else  {
				
				_this.expression = _this.x + " + " + _this.y + " = ?";
				_this.card.innerHTML = _this.expression;
				setTimeout(() => {
					_this.counter(_this.timeLeft);
				}, 2000);
			}
			
			Content = transcript;
	/*			_this.speechElement.innerHTML += "<br>";
				_this.speechElement.innerHTML += Content;
			_this.speechElement.scrollTop = _this.speechElement.scrollHeight;
			//_img.setAttribute("src", "./images/" + Content.trim() + ".jpg");
			if (Content == word)
				//_instructions.innerHTML = "VERY GOOD";
			setTimeout(() => {
				//_instructions.innerHTML = "";
				Content = "";
				word = words[1];
				_word.innerText = word;
				
			},2000);
			*/
			
		  
		};

		recognition.onstart = function() { 
		  _recstat.innerHTML = 'מקליט';
		  console.log("start recording");
		}

		recognition.onspeechend = function() {
		  _recstat.innerHTML = 'הסתיים';
		  console.log("end");
		  _this.startSpeech();
		}

		recognition.onerror = function(event) {
			console.log(event.error);
		  if(event.error == 'no-speech') {
			_instructions.innerHTML = 'Try again.';  
		  }
		}

		/*$('#start-btn').on('click', function(e) {
		  if (Content.length) {
			Content += ' ';
		  }
		  
		});*/

		/*Textbox.on('input', function() {
		  Content = $(this).val();
		})*/
	}
	this.letters = ["H","h","A","a","B","b","D","d","I","i","N","n","E","e","P","p","G","g","T","t"];
	this.lettersPatrial = ["א","ב","ג","ד","ה","ו","ז","ח","ט","י","כ","ל","מ","נ","ס","ע","פ","צ","ק","ר","ש","ת"];
	this.lettersShortPatrial = ["ט","כ","ק","ת"];
	this.wordsHe = ["אבא","מיטה","דנה","מחשב","בית"];
	this.numberWords = ["אפס","אחד","שתיים","שלוש","ארבע","חמש","שש","שבע","שמונה","תשע"];
	this.scoreLetters = {};
	this.words = [
	{ en : "house", he : "בית" },
	{ en : "desk", he : "שולחן עבודה" },
	{ en : "sad", he : "עצוב" },
	{ en : "bed", he : "מיטה" },
	{ en : "gray", he : "אפור" },
	]
	
	this.isGaming = false;
	this.startMathGame = function() {
		if (!this.isGaming)
			this.startSpeech();
		this.isGaming = true;
		this.game = this.nextMathTurn;
		this.gameBoard = document.getElementById("engGame");
		this.card = document.getElementById("current");
		this.card.style.fontSize = "50px";
		this.nextMathTurn();
		
	}
	
	this.nextMathTurn = function() {
		this.x = Math.floor(Math.random() * 10);
		this.y = Math.floor(Math.random() * 10);
		
		this.expression = this.x + " + " + this.y + " = ?";
		this.card.innerHTML = this.expression;
		
		this.timeLeft = 10;
		this.timeLeft = (this.x + this.y) > 10 ? this.timeLeft + 2 : this.timeLeft;
		this.counter(this.timeLeft);
	}
	
	this.currentWord = "";
	this.startEngGame = function() {
		debugger;
		this.game = this.startEngGame;
		this.gameBoard = document.getElementById("engGame");
		this.card = document.getElementById("current");
		
		let currentIndex = Math.floor(Math.random() * this.lettersShortPatrial.length);
		
		this.currentWord = this.lettersShortPatrial[currentIndex];
		this.card.innerHTML = this.currentWord;
		let iTimer = 3;
		this.counter(iTimer);
		
	}
	this.timeoutObj;
	this.timeLeft = 5;
	this.counter = function(timer) {
		let iTimer = timer;
		this.timer = document.getElementById("timer");
		this.timer.innerHTML = iTimer;
		this.timeoutObj = setTimeout(() => {
			iTimer--;
			this.timeLeft = iTimer;
			this.timer.innerHTML = iTimer;
			if (iTimer == 0){
				this.subScore();
				this.game();
			}
			else 
				this.counter(iTimer);
		},1000);
	}
	
	this.letterScoreFun = function(isCorrect) {
		this.lettersScoreObj = document.getElementById("letters");
		if (!this.scoreLetters[this.currentWord]){
			this.scoreLetters[this.currentWord] = {c: 0, f: 0};
			let letterObj = document.createElement("div");
			letterObj.setAttribute("id",this.currentWord+"-letter");
			this.lettersScoreObj.appendChild(letterObj);
			
		}
		let letterObj = document.getElementById(this.currentWord+"-letter");
		
		if (isCorrect)
			this.scoreLetters[this.currentWord].c++;
		else
			this.scoreLetters[this.currentWord].f++;
		letterObj.innerHTML = this.currentWord + "| Good: " + this.scoreLetters[this.currentWord].c + "     Not Good: " + this.scoreLetters[this.currentWord].f;
		
	}
	
	this.subScore = function() {
		this.letterScoreFun(false);
		this.score = document.getElementById("score-res");
		this.scoreNum--;
		this.score.innerHTML = this.scoreNum;
		if (this.scoreNum >= 0)
			this.score.className = "good";
		else
			this.score.className = "not-good";
		if (this.scoreNum > 5)
			this.score.innerHTML += "   טוב מאוד";
		if (this.scoreNum > 10)
			this.score.innerHTML += "   אלופה!!!!";
		if (this.scoreNum > 20)
			this.score.innerHTML += "   וואו את יודעת הכל!!!!";
		if (this.scoreNum > 25)
			this.score.innerHTML += "    ניצחת את המחשב     ";
		
	}
	this.addScore = function() {
		this.letterScoreFun(true);
		this.score = document.getElementById("score-res");
		this.scoreNum++;
		
		this.score.innerHTML = this.scoreNum;
		if (this.scoreNum > 5)
			this.score.innerHTML += "   טוב מאוד";
		if (this.scoreNum > 10)
			this.score.innerHTML += "   אלופה!!!!";
		if (this.scoreNum > 20)
			this.score.innerHTML += "   וואו את יודעת הכל!!!!";
		if (this.scoreNum > 25)
			this.score.innerHTML += "    ניצחת את המחשב     ";
		
		if (this.timeoutObj)
			clearTimeout(this.timeoutObj);
		
		
		
	}
	
		

}

var gamePlay = new gameComponent();


