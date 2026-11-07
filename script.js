// =========================================
// MOBILNÉ MENU
// =========================================

// 1. Nájdi na stránke tlačidlo ☰ a menu
const tlacidlo = document.querySelector(".menu-tlacidlo");
const menu = document.querySelector("nav");

// 2. Keď niekto klikne na tlačidlo, spusti túto funkciu
tlacidlo.addEventListener("click", function () {

    // 3. Pridaj menu triedu "otvorene", alebo ju odober, ak tam už je
    menu.classList.toggle("otvorene");

    // 4. Zmeň ikonku: ak je menu otvorené, ukáž ✕, inak ☰
    if (menu.classList.contains("otvorene")) {
        tlacidlo.textContent = "✕";
    } else {
        tlacidlo.textContent = "☰";
    }
});


// =========================================
// GALÉRIA – FILTROVANIE PODĽA KATEGÓRIE
// =========================================

// querySelectorAll nájde VŠETKY prvky (vráti zoznam, ako list v Pythone)
const filtre = document.querySelectorAll(".filter");
const fotky = document.querySelectorAll(".galeria img");

// pre každé tlačidlo (ako "for filter in filtre:" v Pythone)
filtre.forEach(function (filter) {
    filter.addEventListener("click", function () {
        const vybrana = filter.dataset.kategoria;   // napr. "20ft"

        // zvýrazni kliknuté tlačidlo, ostatné odznač
        filtre.forEach(function (f) {
            f.classList.remove("aktivny");
        });
        filter.classList.add("aktivny");

        // ukáž fotky z vybranej kategórie, ostatné skry
        fotky.forEach(function (fotka) {
            if (vybrana === "vsetko" || fotka.dataset.kategoria === vybrana) {
                fotka.classList.remove("skryta");
            } else {
                fotka.classList.add("skryta");
            }
        });
    });
});


// =========================================
// ZVÄČŠENIE FOTKY PO KLIKNUTÍ (lightbox) + LISTOVANIE
// =========================================

// Vytvoríme čierne pozadie s obrázkom, šípkami a počítadlom
const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.innerHTML =
    '<button class="lightbox-zavriet" aria-label="Zavrieť">✕</button>' +
    '<button class="lightbox-sipka vlavo" aria-label="Predchádzajúca">‹</button>' +
    '<img src="" alt="">' +
    '<button class="lightbox-sipka vpravo" aria-label="Ďalšia">›</button>' +
    '<div class="lightbox-pocet"></div>';
document.body.appendChild(lightbox);

const velkaFotka = lightbox.querySelector("img");
const pocitadlo = lightbox.querySelector(".lightbox-pocet");

let zoznam = [];     // fotky, ktorými sa dá listovať (ako list v Pythone)
let aktualna = 0;    // index práve zobrazenej fotky

// ukáže fotku s daným indexom
function ukaz(index) {
    // keď prejdeme za koniec, skočíme na začiatok (a naopak)
    if (index < 0) {
        index = zoznam.length - 1;
    }
    if (index >= zoznam.length) {
        index = 0;
    }
    aktualna = index;
    velkaFotka.src = zoznam[index].src;
    velkaFotka.alt = zoznam[index].alt;
    pocitadlo.textContent = (index + 1) + " / " + zoznam.length;
}

function otvor(fotky, index) {
    zoznam = fotky;
    ukaz(index);
    lightbox.classList.add("otvoreny");
    // šípky schováme, ak je len jedna fotka
    lightbox.classList.toggle("jedna", fotky.length === 1);
}

function zavri() {
    lightbox.classList.remove("otvoreny");
}

// Klik na fotku v galérii: listovať sa dá len vo fotkách,
// ktoré sú práve viditeľné (napr. len 20 FT, ak je zapnutý filter)
document.querySelectorAll(".galeria").forEach(function (galeria) {
    galeria.querySelectorAll("img").forEach(function (fotka) {
        fotka.addEventListener("click", function () {
            const viditelne = Array.from(galeria.querySelectorAll("img:not(.skryta)"));
            const fotkyNaListovanie = viditelne.map(function (f) {
                return { src: f.src, alt: f.alt };
            });
            otvor(fotkyNaListovanie, viditelne.indexOf(fotka));
        });
    });
});

// Klik na certifikát: listuje sa medzi certifikátmi
const certifikaty = Array.from(document.querySelectorAll(".certifikat"));
certifikaty.forEach(function (odkaz, index) {
    odkaz.addEventListener("click", function (udalost) {
        udalost.preventDefault();          // zruší bežné správanie odkazu
        const zoznamCert = certifikaty.map(function (c) {
            return { src: c.href, alt: c.querySelector("img").alt };
        });
        otvor(zoznamCert, index);
    });
});

// šípky na obrazovke
lightbox.querySelector(".vlavo").addEventListener("click", function (udalost) {
    udalost.stopPropagation();     // aby klik na šípku lightbox nezavrel
    ukaz(aktualna - 1);
});
lightbox.querySelector(".vpravo").addEventListener("click", function (udalost) {
    udalost.stopPropagation();
    ukaz(aktualna + 1);
});

// klik na fotku = ďalšia fotka, klik vedľa = zavrieť
velkaFotka.addEventListener("click", function (udalost) {
    udalost.stopPropagation();
    ukaz(aktualna + 1);
});
lightbox.addEventListener("click", zavri);

// klávesnica: šípky listujú, Escape zatvára
document.addEventListener("keydown", function (udalost) {
    if (!lightbox.classList.contains("otvoreny")) {
        return;
    }
    if (udalost.key === "ArrowLeft") {
        ukaz(aktualna - 1);
    } else if (udalost.key === "ArrowRight") {
        ukaz(aktualna + 1);
    } else if (udalost.key === "Escape") {
        zavri();
    }
});

// mobil: potiahnutie prstom doľava / doprava
let zaciatokX = 0;
lightbox.addEventListener("touchstart", function (udalost) {
    zaciatokX = udalost.touches[0].clientX;
});
lightbox.addEventListener("touchend", function (udalost) {
    const posun = udalost.changedTouches[0].clientX - zaciatokX;
    if (posun > 50) {
        ukaz(aktualna - 1);
    } else if (posun < -50) {
        ukaz(aktualna + 1);
    }
});


// =========================================
// STROJOVÝ PARK – ZÁLOŽKY NA ÚVODNEJ STRÁNKE
// =========================================
const taby = document.querySelectorAll(".park-tab");
const panely = document.querySelectorAll(".park-panel");

taby.forEach(function (tab) {
    tab.addEventListener("click", function () {
        const index = Number(tab.dataset.index);   // "2" -> 2 (ako int() v Pythone)

        taby.forEach(function (t) { t.classList.remove("aktivny"); });
        panely.forEach(function (p) { p.classList.remove("aktivny"); });

        tab.classList.add("aktivny");
        panely[index].classList.add("aktivny");
    });
});


// =========================================
// GALÉRIA – POČÍTADLO FOTIEK V HLAVIČKE
// =========================================
const pocet = document.querySelector("#pocet");
if (pocet) {
    // len.(...) v Pythone = .length v JavaScripte
    pocet.textContent = document.querySelectorAll(".galeria img").length;
}


// =========================================
// GALÉRIA – POČET FOTIEK PRI FILTROCH
// =========================================
filtre.forEach(function (filter) {
    const kat = filter.dataset.kategoria;
    let n = 0;                                  // počítadlo, ako n = 0 v Pythone
    fotky.forEach(function (fotka) {
        if (kat === "vsetko" || fotka.dataset.kategoria === kat) {
            n = n + 1;
        }
    });
    filter.insertAdjacentHTML("beforeend", '<span class="pocet-kat">' + n + '</span>');
});


// =========================================
// STRÁNKA MODELU – PDF VÝKRES
// Ak PDF ešte nie je nahraté na webe, tlačidlo zosivie.
// (Pri otvorení súboru priamo z počítača to prehliadač nevie overiť, preto sa nič nezmení.)
// =========================================
document.querySelectorAll(".tlacidlo-pdf").forEach(function (tlacidloPdf) {
    if (location.protocol === "file:") {
        return;
    }
    fetch(tlacidloPdf.href, { method: "HEAD" })
        .then(function (odpoved) {
            if (!odpoved.ok) {
                tlacidloPdf.classList.add("nedostupne");
                tlacidloPdf.lastChild.textContent = " Výkres pripravujeme";
            }
        })
        .catch(function () {});
});


// =========================================
// KONTAKT – PREDVYPLNENIE SPRÁVY PODĽA MODELU
// kontakt.html?model=20FT%20Klasik -> do správy sa napíše záujem o model
// =========================================
const sprava = document.querySelector("#sprava");
const model = new URLSearchParams(location.search).get("model");
if (sprava && model) {
    sprava.value = "Dobrý deň, mám záujem o septik " + model + ". Prosím o cenovú ponuku.";
}


// Ochrana osobných údajov: keď adresa končí napr. #formular, rozbalí sa príslušná časť
var castGdpr = location.hash ? document.querySelector('details' + location.hash) : null;
if (castGdpr) {
    castGdpr.open = true;
}
