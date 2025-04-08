const timeline = [];
const playerBench = ["", "", ""];
const opponentBench = ["", "", ""];
let playerBattle = "";
let opponentBattle = "";
let selectedSlot = null;

function renderField() {
  const pb = document.getElementById("player-bench");
  const ob = document.getElementById("opponent-bench");
  const pbattle = document.getElementById("player-battle");
  const obattle = document.getElementById("opponent-battle");

  pb.innerHTML = "";
  ob.innerHTML = "";

  playerBench.forEach((card, i) => {
    const slot = createSlot(card, "player-bench", i);
    pb.appendChild(slot);
  });

  opponentBench.forEach((card, i) => {
    const slot = createSlot(card, "opponent-bench", i);
    ob.appendChild(slot);
  });

  pbattle.innerHTML = "";
  obattle.innerHTML = "";

  pbattle.appendChild(createSlot(playerBattle, "player-battle", 0));
  obattle.appendChild(createSlot(opponentBattle, "opponent-battle", 0));
}

function createSlot(cardData, area, index) {
  const slot = document.createElement("div");
  slot.className = "slot";
  slot.onclick = (e) => onSlotClick(e, area, index);

  if (cardData && cardData.name) {
    slot.innerHTML = `<strong>${cardData.name}</strong><br/>HP: ${cardData.hp}`;
    const energyRow = document.createElement("div");
    (cardData.energy || []).forEach(type => {
      const circle = document.createElement("div");
      circle.className = "energy-icon";
      circle.style.background = getEnergyColor(type);
      energyRow.appendChild(circle);
    });
    slot.appendChild(energyRow);
  }

  return slot;
}

function getEnergyColor(type) {
  return {
    "草": "green", "炎": "red", "水": "skyblue", "雷": "yellow",
    "超": "purple", "闘": "orange", "悪": "darkblue", "鋼": "silver"
  }[type] || "gray";
}

function onSlotClick(event, area, index) {
  event.stopPropagation();
  const target = getCardInArea(area, index);

  if (!target || !target.name) {
    openCardSelector(area, index);
  } else {
    selectedSlot = { area, index };
    showContextMenu(event.pageX, event.pageY);
  }
}

function getCardInArea(area, index) {
  if (area === "player-bench") return playerBench[index];
  if (area === "opponent-bench") return opponentBench[index];
  if (area === "player-battle") return playerBattle;
  if (area === "opponent-battle") return opponentBattle;
}

function setCardInArea(area, index, card) {
  if (area === "player-bench") playerBench[index] = card;
  else if (area === "opponent-bench") opponentBench[index] = card;
  else if (area === "player-battle") playerBattle = card;
  else if (area === "opponent-battle") opponentBattle = card;
}

function openCardSelector(area, index) {
  const selector = document.getElementById("card-selector");
  selector.innerHTML = "<h3>カードを選択</h3>";
  allCards.forEach(card => {
    const btn = document.createElement("button");
    btn.textContent = card.name;
    btn.onclick = () => {
      const newCard = { ...card, energy: [] };
      setCardInArea(area, index, newCard);
      logTimeline(`${card.name} を ${area} に配置`);
      selector.style.display = "none";
      renderField();
    };
    selector.appendChild(btn);
  });
  selector.style.display = "block";
}

function showContextMenu(x, y) {
  const menu = document.getElementById("context-menu");
  menu.style.display = "block";
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
}

function selectAction(action) {
  const { area, index } = selectedSlot;
  const card = getCardInArea(area, index);

  if (action === "energy") {
    showEnergySelector();
  }

  if (action === "trash") {
    setCardInArea(area, index, "");
    logTimeline(`${card.name} をトラッシュ`);
    renderField();
  }

  document.getElementById("context-menu").style.display = "none";
}

function showEnergySelector() {
  const selector = document.getElementById("energy-selector");
  selector.innerHTML = "";
  ["草", "炎", "水", "雷", "超", "闘", "悪", "鋼"].forEach(type => {
    const btn = document.createElement("button");
    btn.textContent = type;
    btn.onclick = () => {
      const card = getCardInArea(selectedSlot.area, selectedSlot.index);
      if (!card.energy) card.energy = [];
      card.energy.push(type);
      logTimeline(`${card.name} に ${type}エネルギーを付けた`);
      selector.style.display = "none";
      renderField();
    };
    selector.appendChild(btn);
  });
  selector.style.display = "flex";
}

function logTimeline(text) {
  timeline.push(text);
  const log = document.getElementById("timeline-log");
  const item = document.createElement("li");
  item.textContent = text;
  log.appendChild(item);
}

renderField();
