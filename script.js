// Modul 4 - Projekt - Mikael Torndahl

let spelare; // Initierar spelaren som en variabel
let hinder = []; // Skapar en tom array som sedan slumpmässiga hinder ska få sparas ner i.
let canvasBredd; // Initierar canvas-bredden, spelytan.
let canvasHojd; // Initierar canvas-höjden, spelytan.

// Klass med konstruktor för spelaren(enheten)
// Parametrar för egenskaperna hos enheten för att kunna bestämma hur stor rektangeln(spelaren) ska vara, vilken färg och vilken position på spelytan den ska ha.
class SpelarEnhet {
  constructor(bredd, hojd, farg, posX, posY) {
    this.bredd = bredd; // Rektangelns(spelarens) bredd.
    this.hojd = hojd; // Rek----- höjd.
    this.farg = farg; // Rek----- färg.
    this.hastighetX = 1; // Rek--- hastighet, horisontellt.
    this.hastighetY = 0; // Rek--- hastighet, vertikalt.
    this.posX = posX; // Rek------ position horisontellt.
    this.posY = posY; // Rek------ position, vertikalt.
  }

  //Metod för att kunna uppdatera(ge spelaren dess egenskaper)
  uppdatera(enhet) {
    enhet.fillStyle = this.farg; // Användning av HTML5 Canvas API för att fylla en rektangel
    enhet.fillRect(this.posX, this.posY, this.bredd, this.hojd); // Användning av HTML5 Canvas API för att rita en rektangel på en cavas. Parametrarna pekar mot SpelarEnhetens egenskaper som vi byggde via consructorn tidigare, argumenten fylls senare i när en instans av klassen skapas.
  }

  //Metod för förflyttning, ny position för rektangeln/spelaren.
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

class Hinder {
  constructor(bredd, hojd, farg, posX, posY, hastighetX) {
    this.bredd = bredd;
    this.hojd = hojd;
    this.farg = farg;
    this.posX = posX;
    this.posY = posY;
    this.hastighetX = hastighetX;
  }

  uppdatera() {
    this.posX -= this.hastighetX;
    spelMiljo.context.fillStyle = this.farg;
    spelMiljo.context.fillRect(this.posX, this.posY, this.bredd, this.hojd);
  }
}

const hinderHastighet = 5;
const hinderfrekvens = 200;
let hinderRaknare = 0;
let hinderIntervall;

const spelRuta = document.getElementById("spelRuta");

const spelMiljo = {
  canvas: document.createElement("canvas"),

  starta: function () {
    this.context = this.canvas.getContext("2d");
    spelRuta.append(this.canvas);

    window.addEventListener("keydown", pilStyrning);

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
    clearInterval(hinderIntervall);
  },
};

function uppdateraSpelMiljo() {
  spelMiljo.rensa();
  spelare.nyPos();
  spelare.uppdatera(spelMiljo.context);

  hinder.forEach((hinder) => {
    hinder.uppdatera();
  });

  hinderRaknare++;

  if (hinderRaknare >= hinderfrekvens) {
    const hinderHojd = 10;
    const slumpadPosition = Math.floor(
      Math.random() * (canvasBredd - canvasHojd)
    );
    const nyttHinder = new Hinder(
      10,
      hinderHojd,
      "red",
      canvasBredd,
      slumpadPosition,
      hinderHastighet
    );
    hinder.push(nyttHinder);
    hinderRaknare = 0;
  }
  hinder = hinder.filter((hinder) => hinder.posX + hinder.bredd > 0);
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
  canvasBredd = spelRuta.clientWidth;
  canvasHojd = spelRuta.clientHeight;
  spelMiljo.canvas.width = canvasBredd;
  spelMiljo.canvas.height = canvasHojd;
  spelare = new SpelarEnhet(50, 40, "#019ba3f7", 10, 200);
  spelMiljo.starta();

  hinder = [];
}
