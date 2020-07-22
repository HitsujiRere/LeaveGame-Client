
let isSave = true;

let beginMSec = 0;

let backMSec = 0;

let point = 0;

const pointRevision = 1000;

let town = [pointRevision];

let playerName = "";

const charactors = [];

window.onload = () => {
    loadCharactors("./data/charactors.json");
    loadGameData();
    makeButtons();
    updateGame();

    setInterval(
        () => {
            updateGame();
        },
        1000
    );
    setInterval(
        () => {
            if (isSave) {
                saveGameData();
            }
        },
        10000
    );
};

class Charactor {
    constructor() {
        this.id = -1;
        this.name = "no-name";
        this.comment = "no-comment";
        this.cost = 0;
        this.get = 0;
    }

    static parse(obj) {
        const charactor = new Charactor();
        charactor.id = obj.id ?? -1;
        charactor.name = obj.name ?? "no-name";
        charactor.comment = obj.comment ?? "no-comment";
        charactor.cost = obj.cost ?? 0;
        charactor.get = obj.get ?? 0;
        return charactor;
    }
}

function loadCharactors(filePath) {
    const req = new XMLHttpRequest();

    req.open("get", filePath, false);
    req.onload = () => {
        const charactorsJSONTxt = req.responseText;
        const charactorsJSON = JSON.parse(charactorsJSONTxt);
        for (const charactorJSON of charactorsJSON) {
            const charactor = Charactor.parse(charactorJSON);
            charactors.push(charactor);
        }
    }
    req.send(null);
}

function makeButtons() {
    const townEl = document.getElementById("Town");
    for (const chara of charactors) {
        const charaEl = document.createElement("li");
        charaEl.setAttribute("id", `Town_${chara.id}`);
        townEl.appendChild(charaEl);

        const charaNameEl = document.createElement("span");
        charaNameEl.setAttribute("id", `Town_${chara.id}_name`);
        charaEl.appendChild(charaNameEl);
        const charaNameNode = document.createTextNode(`${chara.name} `);
        charaNameEl.appendChild(charaNameNode);

        const charaCostEl = document.createElement("span");
        charaCostEl.setAttribute("id", `Town_${chara.id}_cost`);
        charaEl.appendChild(charaCostEl);
        const charaCostNode = document.createTextNode(`buy:${chara.cost}p `);
        charaCostEl.appendChild(charaCostNode);

        const charaGetEl = document.createElement("span");
        charaGetEl.setAttribute("id", `Town_${chara.id}_get`);
        charaEl.appendChild(charaGetEl);
        const charaGetNode = document.createTextNode(`every:${chara.get}p/sec `);
        charaGetEl.appendChild(charaGetNode);

        const charaBuyButton = document.createElement("input");
        charaBuyButton.setAttribute("type", "button");
        charaBuyButton.setAttribute("value", "buy");
        charaBuyButton.setAttribute("onclick", `addTown(${chara.cost}, ${chara.get});`);
        charaEl.appendChild(charaBuyButton);

        const charaAllBuyButton = document.createElement("input");
        charaAllBuyButton.setAttribute("type", "button");
        charaAllBuyButton.setAttribute("value", "all buy");
        charaAllBuyButton.setAttribute("onclick", `addAllTown(${chara.cost}, ${chara.get});`);
        charaEl.appendChild(charaAllBuyButton);
    }
}

function updateElement() {
    document.getElementById("point").innerHTML = `${Math.floor(point / pointRevision * 10) / 10}p`;

    let add = 0;
    town.forEach(
        (val) => {
            add += (val * 1);
        }
    );
    document.getElementById("add").innerHTML = `+${Math.floor(add / pointRevision * 10) / 10}p/sec`;

    document.getElementById("beginTime").innerHTML = toStringDate(new Date(beginMSec));
    document.getElementById("backTime").innerHTML = toStringDate(new Date(backMSec));
    document.getElementById("rawPoint").innerHTML = point;
    document.getElementById("rawTown").innerHTML = `${town.length}[${town}]`;
    document.getElementById("playerNameTest").innerHTML = playerName;
}

function loadGameData() {
    const loadTxtData = localStorage.getItem("game");

    console.log(loadTxtData);

    if (loadTxtData) {
        const loadData = JSON.parse(loadTxtData);

        beginMSec = loadData.beginMSec ?? new Date().getTime();
        backMSec = loadData.backMSec ?? new Date().getTime();
        point = loadData.point ?? 0;
        town = loadData.town ?? [];
        playerName = loadData.name ?? "";

        document.getElementById("rawData").innerHTML = loadTxtData;

        document.getElementById("playerNameInput").value = playerName;
    }
    else {
        beginMSec = backMSec = new Date().getTime();
    }

    updateElement();
}

function saveGameData() {
    const saveData = {
        beginMSec: beginMSec,
        backMSec: backMSec,
        point: point,
        town: town,
        name: playerName,
    };
    const saveTxtData = JSON.stringify(saveData);
    localStorage.setItem("game", saveTxtData);

    document.getElementById("rawData").innerHTML = saveTxtData;

    updateElement();
}

function addPoint(add, update = true) {
    add *= pointRevision;
    point += add;

    if (point < 0) {
        point = 0;
    }

    if (update) {
        updateElement();
    }

    return point;
}

function addRawPoint(add, update = true) {
    point += add;

    if (point < 0) {
        point = 0;
    }

    if (update) {
        updateElement();
    }

    return point;
}

function addTown(cost, add) {
    cost *= pointRevision;
    add *= pointRevision;
    if (point >= cost) {
        addRawPoint(-cost);
        town.push(add);
        return true;
    }
    return false;
}

function addAllTown(cost, add) {
    while (addTown(cost, add)) { }
}

function updateGame() {
    const nextMSec = new Date().getTime();
    const diffMSec = nextMSec - backMSec;

    if (diffMSec <= 0) {
        return;
    }

    town.forEach(
        (val) => {
            addRawPoint(val * diffMSec / pointRevision, false);
        }
    );

    backMSec = nextMSec;

    updateElement();
}

function resetGameData() {
    console.log("reset");
    beginMSec = backMSec = new Date().getTime();
    point = 0;
    town = [pointRevision];

    updateElement();
}

function toStringDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    //const millisecond = date.getMilliseconds();
    return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
}
