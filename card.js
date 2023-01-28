var card = function (cardNumber, backText, frontText, word) {
    this.id =
        this.number = cardNumber;
    this.cardElement;
    this.selected = new customEvent();
    this.unselected = new customEvent();
    this.isOpen = false;
    this.backText = backText;
    this.frontText = frontText;
    this.state = "";
    this.word = word;
    this.success = function () {
        this.state = "success";
        if (this.cardElement.classList.contains("current"))
            this.cardElement.classList.remove("current");
        this.cardElement.classList.add("success");
    }
    this.fail = function () {
        this.state = "fail";
        if (this.cardElement.classList.contains("current"))
            this.cardElement.classList.remove("current");
        this.cardElement.classList.add("fail");
    }
    this.current = function () {
        this.state = "";
        if (this.cardElement.classList.contains("fail"))
            this.cardElement.classList.remove("fail");
        if (this.cardElement.classList.contains("success"))
            this.cardElement.classList.remove("success");

        this.cardElement.classList.add("current");

    }
    this.select = function () {
        this.isOpen = !this.isOpen;
        this.flip();
        if (this.isOpen)
            this.selected.next(this);
        else
            this.unselected.next(this);
    };

    this.flip = function () {
        if (this.cardElement.classList.contains("flip-me"))
            this.cardElement.classList.remove("flip-me");
        else
            this.cardElement.classList.add("flip-me");
    };
    this.set = function () {

        this.cardElement = document.createElement("div");
        this.cardElement.classList.add("flip-card");
        this.cardElement.onclick = () => { this.select() };
        this.cardElement.innerHTML =
            '<div id="c' + this.id + '" class="flip-card-inner">' +
            '<div class="flip-card-front">' +
            '<div id="front-text">' + this.frontText + '</div>' +
            '</div>' +
            '<div class="flip-card-back">' +
            '<div id="back-text">' + this.backText + '</div>' +
            '</div>' +
            '</div>';


    }

    this.get = function () {
        return this.cardElement;
    }

    this.set();
}