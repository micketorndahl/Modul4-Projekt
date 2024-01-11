// Modul 4 - Projekt - Mikael Torndahl

let spelare;
const hinder = [];

class SpelarEnhet {
  constructor(bredd, hojd, farg, posX, posY) {
    this.bredd = bredd;
    this.hojd = hojd;
    this.hastighetX = 0;
    this.hastighetY = 0;
    this.posX = posX;
    this.posY = posY;
    this.uppdatera = function (enhet) {
      spelMiljo.context;
      enhet.fillStyle = farg;
      enhet.fillRect(this.posX, this.posY, this.bredd, this.hojd);
    };
    this.nyPos = function () {
      this.posX += this.hastighetX;
      this.posY += this.hastighetY;
    };
  }
}

const spelRuta = document.getElementById("spelRuta");

const spelMiljo = {
  canvas: document.createElement("canvas"),
  starta: function () {
    this.canvasBredd = 1200;
    this.canvasHojd = 800;
    this.context = this.canvas.getContext("2d");
    spelRuta.append(this.canvas);
    this.frameNo = 0;
    this.intervall = setInterval(uppdateraSpelMiljo, 10);
  },
  rensa: function () {
    this.context.clearRect(0, 0, this.canvasBredd, this.canvasHojd);
  },
  stop: function () {
    clearInterval(this.intervall);
  },
};

const uppdateraSpelMiljo = () => {
  spelMiljo.rensa();
  spelare.nyPos();
  spelare.uppdatera(spelMiljo.context);
};

const startKnapp = document.getElementById("startKnapp");
const projektHeader = document.getElementById("projektHeader");
const info = document.getElementById("info");
startKnapp.addEventListener("click", () => {
  startaSpel();
  startKnapp.style.display = "none";
  projektHeader.style.display = "none";
  info.style.display = "none";
});

function startaSpel() {
  spelare = new SpelarEnhet(20, 20, "blue", 10, 70);
  spelMiljo.starta();
}
