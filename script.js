// Modul 4 - Projekt - Mikael Torndahl

// Konstanta Variabler
const startKnapp = document.getElementById("startKnapp"); // Väljer knapp-elementet och sparar i variabel.
const info = document.getElementById("info"); // Väljer paragraf-elementet och sparar i variabel.
let canvas = document.getElementById("spelCanvas"); // Väljer canvas-elementet och sparar i variabel.
const ctx = canvas.getContext("2d"); // Väljer canvas.getContext-elementet och sparar i variabel.

// Föränderliga Variabler
let hinder = []; // Initierar en tom array för hinder
let missiler = []; // Initierar en tom array för missiler
let score = 0; // Initierar en poänghållare.
let highScore = localStorage.getItem("highScore") || 0; // Hämtar highscore från local-storage och sparar i variabel.
let aktivtSpel = false; // Sätter ursprungsvariabel till att spelet inte är aktivt, ändras till true när spelet är igång.

// Event-lyssnare
window.addEventListener("keydown", pilStyrning); // Event-lyssnare som lyssnar efter nedtryckta tangentknappar och då kör pilStyrning-funktion.

// Klass för spelaren
// Egenskaper för x-position och y-position samt bredd och höjd. Constructorn ser till att nya instanserna av klassen skapas med dessa egenskaper.
// Konstruktorn får 2 parametrar så man kan skicka in valfria argument för x och y-position senare i programmet.
class Spelare {
  constructor(x, y) {
    this.x = x; // Var på skärmen, horisontellt ska spelaren befinna sig.
    this.y = y; // Var på skärmen, vertikalt ska spelaren befinna sig.
    this.bredd = 50; // Vad ska bredden på spelaren(det ritade elementet) vara.
    this.hojd = 50; // Vad ska höjden på spelaren(det ritade elementet) vara.
  }

  // Spelare-klassen får en metod så det kan bli utritad på skärmen(på canvas) funktionen tar in ctx = context som argument för att kunna rita ut egenskaperna över canvasen.
  rita(ctx) {
    ctx.fillStyle = "green"; // Färg på elementet(kontexten)
    ctx.fillRect(this.x, this.y, this.bredd, this.hojd); // Inbyggd metod från Canvas API och använda för att rita ut en fylld rektangel, parametrarna får som argument de egenskaper som finns i klassen: Spelare.
  }
}

// En klass för hinder som ska komma flytande mot spelaren.
// Egenskaper för hinder-klassen är x-position, y-position, bredd, höjd och hastighet.
// Konstruktorn får 3 parametrar så man kan skicka in valfria argument till dessa senare i programmet.
class Hinder {
  constructor(y, hojd, hastighet) {
    this.x = 800; // Var på skärmen, horinsontellt ska hindret skapas ifrån. I detta fall 800 som blir längst till höger på canvasen.
    this.y = y; // Var på skärmen, vertikalt ska hindret skapas ifrån.
    this.bredd = 50; // Bredden på hindrena (Rektanglarna)
    this.hojd = hojd; // Höjden på hindrena (Rektanglarna)
    this.hastighet = hastighet; // Hindernas hastighet
  }

  // Hinder-klassen får en metod så hindret kan förflytta sig
  flyttaSig() {
    this.x -= this.hastighet; // x-position som utgår från 800 -= hastigheten. Det går från 800 ner till 0 för att förflytta hindret till vänster.
  }

  // Hinder-klassen får en metod så att hindret kan bli utritad på skärmen(på canvas) funktionen tar in ctx = context som argument för att kunna rita ut egenskaperna över canvasen.
  rita(ctx) {
    ctx.fillStyle = "red"; // Färg på det utritade hindret.
    ctx.fillRect(this.x, this.y, this.bredd, this.hojd); // Inbyggd metod från Canvas API och använda för att rita ut en fylld rektangel, parametrarna får som argument de egenskaper som finns i klassen: Spelare.
  }
}

// En klass för Missiler som ska komma skjutandes mot spelaren.
// Egenskaper för Missil-klassen är x-position, y-position, bredd, höjd, hastighet både för x och y då det ska förflytta sig slumpmässigt och likna en missil. Även en egenskap: missilTrail för att missilen ska få ett spår/rök efter sig.
// Konstruktorn får 3 parametrar så man kan skicka in valfria argument till dessa senare i programmet
// This pekar/hänvisar till de egenskaper och metoder som tillhör den specifika instansen av klassen.
class Missil {
  constructor(y, hastighetX, hastighetY) {
    this.x = 800; // Vart ska missilen utgå ifrån, 800. Längst till höger på canvasen.
    this.y = y; // Vart ska missilen utgå ifrån vertikalt.
    this.bredd = 10; // Bredd på missilen.
    this.hojd = 30; // Höjd på missilen.
    this.hastighetX = hastighetX; // Hastighet sidled.
    this.hastighetY = hastighetY; // Hastighet vertikalt.
    this.missilTrail = []; // En array där missil-spåren ska sparas i.
  }

  // Missilen får en metod för att kunna förflytta sig
  flyttaSig() {
    this.x -= this.hastighetX; // sidledsposition - sidledshastighet för förflyttning horisontellt.
    this.y += this.hastighetY; // vertikalposition - vertikalhastighet för förflyttning vertikalt.

    // Slumpmässig längd på missilspåren (Mellan 1 till 100, floor för avrundning till heltal)
    const trailLangd = Math.floor(Math.random() * 100) + 1;

    // Missil-spåren ska läggas till i arrayen som skapades tidigare. Missilspåret läggs till arrayen med sina tillhörande egenskaper x och y.
    this.missilTrail.push({ x: this.x, y: this.y });

    // Loop som körs så länge Array-längden är större än det slumpmässiga talet som vi genererar tidigare.
    while (this.missilTrail.length > trailLangd) {
      this.missilTrail.shift(); // Det första elementet i arrayen tas bort så länge loop-påståendet stämmer. Detta skapar en effekt som gör att missilen ser mer ut som ja en missil
    }

    // If-sats som kollar om missilens vertikala position är mindre än 0 eller mer än cavas-höjden.
    // Om det är så ska missilen genom Math.Random-metod slumpmässigt få en ny vertikal position. Detta för att missilen inte ska skjutas utanför canvasen.
    if (this.y < 0 || this.y > canvas.height) {
      this.y = Math.random() * canvas.height;
      this.x = canvas.width; // Placerar objektet vid canvas-bredden.
      this.hastighetY = -this.hastighetY; // Rörelseriktningen ändras om vertikalt.
    }
  }

  // Den inbbygda Canvas API metoden hjälper till att rita ut missilen
  rita(ctx) {
    ctx.fillStyle = "orange"; // Missilen färgas
    ctx.fillRect(this.x, this.y, this.bredd, this.hojd); // Ritas ut med argument från missil-klassen

    ctx.fillStyle = "rgba(252, 189, 0, 0.2)"; // Missil-spåren färgas.

    // Med en for loop ritas missil-spåren ut med hjälp av positionerna från missilTrail(spår) arrayen.
    for (let point of this.missilTrail) {
      ctx.fillRect(point.x, point.y, this.bredd, this.hojd);
    }
  }
}

// Funktion för tangentstyrning (Upp och ner)
// funktionen kallas på med tidigare eventlyssnare.
// Om händelse sker(event) och det motsvarar ArrowUp(pil upp) och spelarens vertikala position är mer än 0 ska spelarens position reduceras med 20(förlyttning)
// Annars om händelse sker(event) och tangent motsvarar ArrowDown och spelarens höjd inte är mindre än canvas-höjden så ska spelarens vertikala position plussas på med 20.
function pilStyrning(event) {
  if (event.key === "ArrowUp" && spelare.y > 0) {
    spelare.y -= 20;
  } else if (
    event.key === "ArrowDown" &&
    spelare.y + spelare.hojd < canvas.height
  ) {
    spelare.y += 20;
  }
}

// Lägger till en event-lyssnare på startKnapps-elementet och om den klickas på triggas en funktion innehållande:
// Sätter knappens display-stil: none (Knappen syns inte längre)
// Sätter info-paragrafens display-stil: none (Info-paragrafen syns inte längre)
// Canvas display-stil blir: block, nu syns canvasen.
// Boleska variabeln aktivtSpe sätts till true för nu är spelet igång.
// startaSpel() funktionen körs.
document.getElementById("startKnapp").addEventListener("click", function () {
  startKnapp.style.display = "none";
  info.style.display = "none";
  canvas.style.display = "block";
  aktivtSpel = true;
  startaSpel();
});

// Funktion för att starta spel
function startaSpel() {
  spelare = new Spelare(50, 175); // En ny instans av klassen Spelare skapas, argument för var på skärmen spelaren ska befinna sig.
  rita(); // rita() funktionen körs för att rita ut spel-detaljer.
  hinder = []; // hinder-arrayen sätts till en tom array.
  missiler = []; // missiler-arrayen sätts till en tom array.

  let score = 0; // Poäng är 0 (ny spel-omgång)
}

// Funktion för att rita ut spel-miljö och spel-detaljer.
function rita() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Rensar canvasen
  spelare.rita(ctx); // Ritar ut spelaren.

  // Loop som för varje hinder i hinder-arrayen kallar på flyttaSig() och rita() metoderna.
  for (let hindret of hinder) {
    hindret.flyttaSig();
    hindret.rita(ctx);

    // If-sats som kollar om spelaren har kolliderat med ett hinder.
    if (kollaKollision(spelare, hindret)) {
      gameOver(); // Kallar på gameOver-funktionen vid krock
      return; // Går tillbaka, börjar om, spelet är slut.
    }
  }
  // Loop som för varje missil i missil-arrayen kallar på flyttaSig() och rita() metoderna.
  for (let missil of missiler) {
    missil.flyttaSig();
    missil.rita(ctx);

    // If-sats som kollar om spelaren har kolliderat med en missil.
    if (kollaKollision(spelare, missil)) {
      gameOver(); // Kallar på gameOver-funktionen vid krock
      return; //Går tillbaka, börjar om, spelet är slut.
    }
  }

  score++; // Uppdaterar poängen, plussar på.
  ritaScore(); // Ritar ut poängen på canvasen.

  // Om poängen är större en highscore ska dem poängen uppdateras till ny highScore
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore); // Sparar det nya highscoret till localStorage
    let highScores = JSON.parse(localStorage.getItem("highScore")) || []; // Hämtar tidigare highscores, konverterar från JSON till en javascript-array

    // Om det sparade inte är en array(om det inte finns tidigare poäng) sätts highScores till en tom array.
    if (!Array.isArray(highScores)) {
      highScores = [];
    }

    highScores.push(score); // De nya poängen läggs till i arrayen med metoden .push.
    localStorage.setItem("highScores", JSON.stringify(highScores)); // För att konvertera arrayen till en JSON-sträng, localStorage kan bara lagra data som strängar.
  }

  uppdateraHighScoreLista(); // Kallar på funktion för att uppdatera highscore

  // If-sats för att se om ett nytt hinder ska skapas(ny instans av klassen Hinder) pushas in i hinder-arrayen med olika argument för dess egenskaper. Math.random används och gångras mot canvas och nummer-värden för att få ett visst sätt att bete sig på.
  if (Math.random() < 0.02) {
    hinder.push(
      new Hinder(
        Math.random() * canvas.width,
        50 + Math.random() * 20,
        Math.random() * 10
      )
    );
  }

  // If-sats för att se om en ny missil ska skapas(ny instans av klassen Missil) pushas in i missiler-arrayen med olika argument för dess egenskaper. Math.random används och gångras mot canvas och nummer-värden för att få ett visst sätt att bete sig på.
  if (Math.random() < 0.02) {
    const missilRiktning = Math.random() < 0.5 ? 1 : -1; // 50% chans att missilens riktning börjar uppe eller nedifrån.
    missiler.push(
      new Missil(
        Math.random() * canvas.width,
        2 + Math.random() * 5,
        missilRiktning
      )
    );
  }

  // Om den boleska variabeln aktivtSpel är true så ska det få ritas på canvasen.
  if (aktivtSpel) {
    requestAnimationFrame(rita);
  }
}

// Funktion som hålle reda på kollision med objekt1 och objekt som parametrar
// Med return får vi ut jämförelser mellan objekten för att se om de korsats på olika sätt.
function kollaKollision(objekt1, objekt2) {
  return (
    objekt1.x < objekt2.x + objekt2.bredd &&
    objekt1.x + objekt1.bredd > objekt2.x &&
    objekt1.y < objekt2.y + objekt2.hojd &&
    objekt1.y + objekt1.hojd > objekt2.y
  );
}

// Funktion för att rita ut poängen
function ritaScore() {
  ctx.fillStyle = "#000"; // Färg
  ctx.font = "1rem monospace"; // Font-stil/storlek
  ctx.textAlign = "left"; // Vart ska texten aligneras
  ctx.fillText(`Poäng: ${score}`, 10, 20); // Vad ska det stå och vart. Literal templates för att ta med variablar
  ctx.fillText(`High Score: ${highScore}`, 10, 40); // --
}

// Funktion vid gameOver (kollision)
function gameOver() {
  aktivtSpel = false; // Spelet är inte aktivt.
  ritaGameOverMeddelande(); // Rita ut game-over genom att kalla på funktio.nen.
  setTimeout(startaOmSpel, 2000); // Börja om spelet om 2 sek
}

// Funktion för att starta om spelet
function startaOmSpel() {
  spelare = new Spelare(50, 175); // Ny instans med argument för vart spelaren ska utgå ifrån.
  hinder = []; // tom array för hinder.
  missiler = []; // tomm array för missiler.
  score = 0; // Poäng sätts till +
  aktivtSpel = true; // Nu är spelet igång, det är sant.
  rita(); // Kalla på rita funktionen som ritar ut miljön och detaljerna.
}

// Funktion som ritar ut game-over-meddelandet
function ritaGameOverMeddelande() {
  ctx.fillStyle = "white"; // Färg
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Vart ska det ritas ut.

  ctx.fillStyle = "black"; // Färg
  ctx.font = "1rem monospace"; // Font-stil, storlek.
  ctx.textAlign = "center"; // Vart ska texten aligneras.
  ctx.textBaseline = "middle"; // Vart är bas-linjen.

  const centerX = canvas.width / 2; // På hälften av bredden.
  const centerY = canvas.height / 2; // På hälften av höjden.

  ctx.fillStyle = "red"; // Färg
  ctx.fillText(`GAME OVER! Poäng: ${score}`, centerX, centerY); // Vad och vart ska det ritas ut
}

// Funktion för att visa top-score
function visaTopScore() {
  const highScoreTavla = document.getElementById("highScoreTavla"); // highScore-elementet väljs.
  highScoreTavla.style.display =
    highScoreTavla.style.display == "none" ? "block" : "none"; // Toggla mellan att visa och inte visa high-scoren när knappen trycks på.
}

// Funktion för att uppdatera highscorelistan
function uppdateraHighScoreLista() {
  const highScoreLista = document.getElementById("highScoreLista"); // Väljer listan

  // Try catch för att kolla fel, hann inte klart att få det exakt som jag vill utseendemässigt, men try och catch hjälpte att få bort flera fel iallafall.
  try {
    const highScoresData = localStorage.getItem("highScores"); // Hämta den lokalt sparade datan.

    // if-sats som kollar om highScoresData finns och isåfall parsear det från json till en array.
    if (highScoresData) {
      const highScores = JSON.parse(highScoresData) || [];

      // Om highscore inte är en array kastas ett nytt error-meddelande ut med tillhörande text-sträng.
      if (!Array.isArray(highScores)) {
        throw new Error("Invalid highScores data");
      }

      // Visar genom metoderna slice och map 5 högsta poängen, i en lista
      const listPunkter = highScores.slice(0, 5).map((score, index) => {
        return `<li>#${index + 1}: ${score}</li>`;
      });

      highScoreLista.innerHTML = listPunkter.join("");
    } else {
      highScoreLista.innerHTML = "<li>Inga highscore tillgängligae</li > "; // Informerar om inga highscore är tillgängliga.
    }
    // Hanterar fel om något med parsing etc strular. Då skrivs en listpunkt med error ut istället.
  } catch (error) {
    console.error("Error parsing JSON:", error);
    highScoreLista.innerHTML = "<li>Error loading high scores</li>";
  }
}

// Mikael Torndahl
