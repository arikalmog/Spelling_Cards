var gameComponent = function () {
	this.pairs = 10;
	this.pairsFound = 0;
	this.turns = 0;
	this.gameCards = [];
	this.gameBoard;
	this.pairsFoundElement;
	this.firstCard;
	this.secondCard;
	this.cardsInline = 7;
	this.rowsElements = [];
	this.scoreNum = 0;
	this.x = 0;
	this.y = 0;
	this.game = () => { };
	this.expression = "";
	var _this = this;
	this.t;
	this.startTimer = new Date();
	this.leftTime = 0;

	this.resetGame = function () {

		this.gameCards = [];
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
		if (selectedCards == 2) {
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

	this.record = function () {
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
	this.startSpeech = function () {
		this.recstat = document.getElementById("recstatus");
		this.instructions = document.getElementById("instructions");
		this.word = document.getElementById("word");
		this.img = document.getElementById("img-word");
		this.text = "חג החנוכה בא.  הלכה טליה לסבתא.";
		this.speechElement = document.getElementById("speech");
		//this.word.innerText = words[0];
		this.speech();
		recognition.lang = "en-US";
		recognition.start();
	}
	this.lastAns;
	this.speech = function () {
		this.card = document.getElementById("current");
		var _recstat = this.recstat;
		var _instructions = this.instructions;
		var _this = this;

		/*var Textbox = $('#textbox');*/


		var Content = '';

		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.onresult = function (event) {

			var current = event.resultIndex;
			var transcript = event.results[current][0].transcript;
			if (_this.timeLeft > 0)
				clearTimeout(_this.timeoutObj);


			transcript = transcript.trim();
			if (_this.lastAns != transcript)
				_this.lastAns = transcript
			else
				return;


			if (_this.currentWord.en == transcript) {
				console.log("good");
				_this.addScore();

			}
			else {
				//_this.card.innerHTML = _this.expression;
				if (_this.gameSettings.enableTimer)
					setTimeout(() => {
						_this.counter(_this.timeLeft);
					}, 2000);
			}

			Content = transcript;



		};

		recognition.onstart = function () {
			_recstat.innerHTML = 'מקליט';
			console.log("start recording");
		}

		recognition.onspeechend = function () {
			_recstat.innerHTML = 'הסתיים';
			console.log("end");
			_this.startSpeech();
		}

		recognition.onerror = function (event) {
			console.log(event.error);
			if (event.error == 'no-speech') {
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



	this.scoreLetters = {};
	this.words = [
		{ he: 'עץ', en: '', image: 'https://media.istockphoto.com/id/543052538/photo/tree.jpg?b=1&s=170667a&w=0&k=20&c=mSP8NiJYT5qBEzOwkMFWE-qIeJpKThwLNlob6H0cGJI=', category: '' },
		{ he: 'גזע', en: '', image: 'https://bshare-group.co.il/images/detailed/8/3049671766.webp', category: '' },
		{ he: 'ענף', en: '', image: 'https://cdn.w600.comps.canstockphoto.co.il/%D7%99%D7%A8%D7%95%D7%A7-%D7%A2%D7%95%D7%96%D7%91-%D7%95%D7%A7%D7%98%D7%95%D7%A8-%D7%A2%D7%A0%D7%A3-%D7%A9%D7%9C-%D7%A2%D7%A5-%D7%95%D7%A7%D7%98%D7%95%D7%A8-%D7%90%D7%99%D7%A4%D7%A1%D7%90%D7%A1_csp51743647.jpg', category: '' },
		{ he: 'עלה', en: '', image: 'https://img.lovepik.com/free-png/20211228/lovepik-green-leaf-png-image_400953250_wh300.png', category: '' },
		{ he: 'גבעול', en: '', image: 'https://lcp.co.il/wp-content/uploads/2022/03/1051364-gfk2sa-3-700x700.jpg', category: '' },
		{ he: 'קרקע', en: '', image: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Duerre.jpg', category: '' },
		{ he: 'ערוגה', en: '', image: 'https://www.tokeep.co.il/images/article-pictures/5b8d03090f053a7b7e8b4568/assossss_1_thumb.jpg', category: '' },
		{ he: 'סלע', en: '', image: 'https://d15djgxczo4v72.cloudfront.net/s3fs-public/styles/inner_page_header/public/legacy_files/Rock_0.jpg?itok=Qm_f-AxY', category: '' },
		{ he: 'נטיעות', en: '', image: 'https://img.lovepik.com/photo/40010/7911.jpg_wh860.jpg', category: '' },
		{ he: 'עציץ', en: '', image: 'https://www.irit-flowers.co.il/wp-content/uploads/2021/11/file_1_3.jpg', category: '' },
		{ he: 'יער', en: '', image: 'https://images1.ynet.co.il/PicServer5/2017/02/27/7615640/76156180100892640360no.jpg', category: '' },
		{ he: 'עדר', en: '', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/FarmingZambia.jpg/150px-FarmingZambia.jpg', category: '' },


	]




	this.currentWord = "";
	this.currentCard = {};
	this.isGaming = false;
	this.gameSettings = {
		enableTimer: false
	}
	this.startGame = function () {
		if (!this.isGaming)
			this.startSpeech();
		if (this.gameCards.length == 0)
			this.words.forEach((w, i) => {
				this.gameCards.push(new card(i, w.he, w.image, w));


			})

		this.game = this.startGame;
		this.gameBoard = document.getElementById("engGame");
		this.card = document.getElementById("current");
		this.isGaming = true;
		let foundCard = false;
		while (!foundCard && this.gameCards.filter(c => c.state == "" || c.state == "fail").length > 0) {
			let currentIndex = Math.floor(Math.random() * this.gameCards.length);
			this.currentCard = this.gameCards[currentIndex];

			if (this.currentCard.state == "" || this.currentCard.state == "fail")
				foundCard = true;
		}

		if (this.gameCards.filter(c => c.state == "" || c.state == "fail") == 0) {
			alert(1);
			return;
		}






		this.currentCard.current();
		this.currentWord = this.currentCard.word;
		this.deck = document.getElementById("deck");
		this.deck.innerHTML = this.gameCards.filter(c => c.state == "").length;
		this.gameBoard.appendChild(this.currentCard.get());
		//this.card.innerHTML = this.currentWord.he;
		let iTimer = 5;
		if (this.gameSettings.enableTimer)
			this.counter(iTimer);

	}



	this.timeoutObj;
	this.timeLeft = 5;
	this.counter = function (timer) {
		let iTimer = timer;
		this.timer = document.getElementById("timer");
		this.timer.innerHTML = iTimer;
		this.timeoutObj = setTimeout(() => {
			iTimer--;
			this.timeLeft = iTimer;
			this.timer.innerHTML = iTimer;
			if (iTimer == 0) {
				this.subScore();

			}
			else
				this.counter(iTimer);
		}, 1000);
	}



	this.subScore = function () {
		this.currentCard.fail();
		this.game();
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
	this.addScore = function () {
		this.currentCard.success();
		this.game();
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


