
let isSave = true;

let beginMSec = 0;

let backMSec = 0;

let point = 0;

let town = [];

let playerName = "";

window.onload = () => {
    loadGameData();

    setInterval(
        () => {
            if (isSave) {
                saveGameData();
            }
        },
        10000
    );

    setInterval(
        () => {
            updateGame();
        },
        1000
    );
};

function updateElement() {
    document.getElementById("beginTime").innerHTML = toStringDate(new Date(beginMSec));
    document.getElementById("backTime").innerHTML = toStringDate(new Date(backMSec));
    document.getElementById("point").innerHTML = `${point / 1000}p`;

    let add = 1;
    town.forEach(
        (val) => {
            add += (val * 1);
        }
    );
    document.getElementById("add").innerHTML = `+${add}p/sec`;

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
    cost *= 1000;
    if (point >= cost) {
        addPoint(-cost);
        town.push(add);
    }
}

function updateGame() {
    const nextMSec = new Date().getTime();
    const diffMSec = nextMSec - backMSec;

    if (diffMSec <= 0) {
        return;
    }

    point += diffMSec;

    town.forEach(
        (val) => {
            addPoint(val * diffMSec);
        }
    );

    backMSec = nextMSec;

    updateElement();
}

function resetGameData() {
    console.log("reset");
    beginMSec = backMSec = new Date().getTime();
    point = 0;

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
