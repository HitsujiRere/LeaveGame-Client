
let isSave = true;

let beginMSec = 0;

let backMSec = 0;

let point = 0;

const pointRevision = 1000;

let town = [pointRevision];

let playerName = "";

//const charactors = [];

window.onload = () => {
    //loadCharactors("./data/charactors.json");
    loadGameData();

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

/*
class Charactor {
    constructor() {
        this.id = -1;
        this.name = "no-name";
        this.comment = "no-comment";
    }

    static parse(obj) {
        const charactor = new Charactor();
        charactor.id = obj.id ?? -1;
        charactor.name = obj.name ?? "no-name";
        charactor.comment = obj.comment ?? "no-comment";
        return charactor;
    }
}

function loadCharactors(filePath) {
    const req = new XMLHttpRequest();

    const charactorsJSONTxt = "";
    req.open("get", filePath, false);
    req.onload = function () {
        charactorsJSONTxt = req.responseText;
    }
    req.send(null);

    const charactorsJSON = JSON.parse(charactorsJSONTxt);
    console.log(charactorsJSON);
    for (const charactorJSON of charactorsJSON) {
        const charactor = Charactor.parse(charactorJSON);
        charactors.push(charactor);
    }
    console.log(charactors);
}
*/

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

function addPoint(add) {
    point += add;

    if (point < 0) {
        point = 0;
    }

    updateElement();

    return point;
}

function addTown(cost, add) {
    cost *= pointRevision;
    add *= pointRevision;
    if (point >= cost) {
        addPoint(-cost);
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
            addPoint(val * diffMSec / pointRevision);
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
