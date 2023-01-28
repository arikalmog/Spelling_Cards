var gameComponent = function () {
    this.lastAns;
	this.numberWords = ["אפס","אחד","שתיים","שלוש","ארבע","חמש","שש","שבע","שמונה","תשע"];
	this.currentWord = "";
	this.scoreLetters = {};
	this.scoreNum = 0;
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
	
	
	var SpeechRecognition = window.webkitSpeechRecognition;
	var recognition = new SpeechRecognition();
	this.startSpeech = function() {
		this.recstat = document.getElementById("recstatus");
		this.instructions = document.getElementById("instructions");
		
		this.img = document.getElementById("img-word");
		
	
		//this.word.innerText = words[0];
		this.speech();
		recognition.lang = "he-IL";
		recognition.start();
	}
	
	this.speech  = function() {
		this.card = document.getElementById("current");
		var _recstat = this.recstat;
		var _instructions = this.instructions;

		var _this = this;
		var Content = '';
		
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.onresult = function(event) {
		  var current = event.resultIndex;
		  var transcript = event.results[current][0].transcript;
			_this.pauseTimer();
			console.log(transcript);
			
			transcript = transcript.trim();
			if (_this.lastAns != transcript)
				_this.lastAns = transcript
			else
				return;
			transcript = _this.numberWords.indexOf(transcript) > -1 ? _this.numberWords.indexOf(transcript) : transcript;
			transcript = transcript * 1;
			if (Number.isInteger(transcript))
				_this.expression = _this.x + " X " + _this.y + " = " + transcript;
			
			_this.card.innerHTML = _this.expression;
			if (_this.x * _this.y == transcript){
				console.log("good");
				_this.lastAns = "";
				_this.addScore();
				setTimeout(()=>{
					console.log("correct answer");
					
					_this.game();
				},2000);
				
			}
			else  {
				console.log("wrong");
				//_this.expression = _this.x + " X " + _this.y + " = ?";
				_this.card.innerHTML = _this.expression;
				
					console.log("keep counting " + _this.timeLeft);
					console.log(_this.timeoutObj);
					setTimeout(() => {
					_this.startTimer(_this.timeLeft);
					}, 2000);
				
			}
			
			Content = transcript;
	
			
		  
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
			//_instructions.innerHTML = 'Try again.';  
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
	
	
	this.isGaming = false;
	this.startMathGame = function() {
		if (!this.isGaming)
			this.startSpeech();
		this.drawBoard();
		this.isGaming = true;
		this.game = this.nextMathTurn;
		this.gameBoard = document.getElementById("engGame");
		this.card = document.getElementById("current");
		this.card.style.fontSize = "50px";
		this.nextMathTurn();
		
	}
	this.mathBoard = {};
	this.drawBoard = function() {
		var gameBoard = document.getElementById("mathBoard");
		gameBoard.innerHTML = "";
		var rowNum = this.randomY ? this.maxY+1 : 2;
		var colNum = this.randomX ? this.maxX+1 : 2;
		for (var y = 0; y < rowNum; y++)
		{
			var rowEelem = document.createElement("div");
			rowEelem.className = "math-row";
			gameBoard.appendChild(rowEelem)
			for (var x = 0; x< colNum; x++)
			{
				let colTitle = this.randomX ? x : this.maxX;
				let rowTitle = this.randomY ? y : this.maxY;
				var colElem = document.createElement("div");
				colElem.className = (x == 0) || (y == 0) ? "math-col math-header" : "math-col";
				if ((x > 0) && (y > 0)) 
					colElem.setAttribute("id", "exp-" + colTitle + "-" + rowTitle);
				
				colElem.innerHTML = (y == 0) && (x > 0) ? colTitle : (x == 0) && (y > 0) ? rowTitle : ""; 
				rowEelem.appendChild(colElem);
				
			}
		}
	}
	this.maxX = 10;
	this.randomX = true;
	this.maxY = 10;
	this.randomY = true;
	this.nextMathTurn = function() {
		console.log("next turn");
		
		this.x = this.randomX ? Math.floor(Math.random() * this.maxX)+1 : this.maxX;
		this.y = this.randomY ? Math.floor(Math.random() * this.maxY)+1 : this.maxY;
		this.mathBoard[this.x] = this.mathBoard[this.x] || []; 
		if (!this.mathBoard[this.x].find(x => x.y == this.y)) {
				this.mathBoard[this.x].push({
					y : this.y,
					c : 0,
					f : 0
				});
		}
		this.expression = this.x + " X " + this.y + " = ?";
		this.currentWord = this.expression.replace(" = ?","");
		this.card.innerHTML = this.expression;
		
		this.timeLeft = 10;
		this.timeLeft = (this.x + this.y) > 10 ? this.timeLeft + 2 : this.timeLeft;
		this.startTimer(this.timeLeft);
	}
	

	this.timerId;
	this.timeLeft = 10;
	this.timerState = 0; // 0 idle, 1 running, 2 paused
	this.startTimer = function(timer) {
		if (this.timerState == 1) return;
		let iTimer = timer;
		this.timer = document.getElementById("timer");
		this.timer.innerHTML = iTimer;
		console.log("new timer");
		
		this.timerId = setInterval(() => {
			iTimer--;
			this.timeLeft = iTimer;
			console.log(this.timerState);
			this.timer.innerHTML = iTimer;
			if (iTimer == 0){
				this.subScore();
				console.log("counter timer 0");
				this.game();
			}
			
		},1000);
		this.timerState = 1;
		console.log(this.timerId);
	}
	
	this.pauseTimer = function() {
		if (this.timerState != 1) return; 
		console.log("clear " + this.timerId + " timer");
		clearInterval(this.timerId);
		this.timerState = 2;
	}
	
	this.drawMathRes = function(x, y, resXY, isCorrect) {
		debugger;
		let resCell = document.getElementById("exp-" + x + "-" + y);
		if (resCell) {
			resCell.classList.remove("fail");
			resCell.classList.remove("correct");
			if (isCorrect)
				resCell.classList.add("correct");
			else
				resCell.classList.add("fail");
		}
	}
	
	this.letterScoreFun = function(isCorrect) {
		this.lettersScoreObj = document.getElementById("letters");
		if (this.mathBoard){
			
			let xyRes = this.mathBoard[this.x].find(x => x.y == this.y);
			if (xyRes){
				if (isCorrect)
					xyRes.c++;
				else
					xyRes.f++;
				
			}
			this.drawMathRes(this.x, this.y, xyRes, isCorrect);
		}
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
		this.pauseTimer();
		
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
		this.pauseTimer();
		
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
		
		
		
		
		
	}
	
	
	
	
		

}

var gamePlay = new gameComponent();


