// Modul 4 - Projekt - Mikael Torndahl

let spelare;
const hinder = [];
let canvasBredd;
let canvasHojd;

class SpelarEnhet {
  constructor(bredd, hojd, farg, posX, posY) {
    this.bredd = bredd;
    this.hojd = hojd;
    this.farg = farg;
    this.hastighetX = 1;
    this.hastighetY = 0;
    this.posX = posX;
    this.posY = posY;
  }
  uppdatera(enhet) {
    enhet.fillStyle = this.farg;
    enhet.fillRect(this.posX, this.posY, this.bredd, this.hojd);
  }

  nyPos() {
    this.nyPosX = this.posX + this.hastighetX;
    this.nyPosY = this.posY + this.hastighetY;

    if (this.nyPosY < 0) {
      this.posY = 0;
    } else if (this.nyPosY > canvasHojd - this.hojd) {
      this.posY = canvasHojd - this.hojd;
    } else {
      this.posY = this.nyPosY;
    }

    if (this.nyPosX >= 0 && this.nyPosX <= canvasBredd - this.bredd) {
      this.posX = this.nyPosX;
    }
  }
}

const spelRuta = document.getElementById("spelRuta");

const spelMiljo = {
  canvas: document.createElement("canvas"),

  starta: function () {
    this.context = this.canvas.getContext("2d");
    spelRuta.append(this.canvas);

    window.addEventListener("keydown", pilStyrning);

    this.frameNo = 0;
    this.intervall = setInterval(uppdateraSpelMiljo, 10);
  },
  rensa: function () {
    this.context.clearRect(
      spelare.posX,
      spelare.posY,
      spelare.bredd,
      spelare.hojd
    );
  },
  stop: function () {
    clearInterval(this.intervall);
  },
};

function uppdateraSpelMiljo() {
  spelMiljo.rensa();
  spelare.nyPos();
  spelare.uppdatera(spelMiljo.context);
}

function pilStyrning(event) {
  if (event.key === "ArrowUp") {
    spelare.hastighetY = -2;
  } else if (event.key === "ArrowDown") {
    spelare.hastighetY = 2;
  }
}

const startKnapp = document.getElementById("startKnapp");
const info = document.getElementById("info");

startKnapp.addEventListener("click", () => {
  startaSpel();
  startKnapp.style.display = "none";
  info.style.display = "none";
});

function startaSpel() {
  canvasBredd = window.innerWidth;
  canvasHojd = spelRuta.clientHeight;
  spelMiljo.canvas.width = canvasBredd;
  spelMiljo.canvas.height = canvasHojd;
  spelare = new SpelarEnhet(50, 40, "#019ba3f7", 60, 60);
  spelMiljo.starta();
}
