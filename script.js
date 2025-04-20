const fields = {
  "opponent-bench": [],
  "opponent-battle": [],
  "player-battle": [],
  "player-bench": [],
};

const sampleCards = [
  { name: "フシギダネ", type: "grass", hp: 60, kind: "ポケモン", stage: "たね" },
  { name: "ヒトカゲ", type: "fire", hp: 50, kind: "ポケモン", stage: "たね" },
  { name: "ゼニガメ", type: "water", hp: 60, kind: "ポケモン", stage: "たね" },
  { name: "ピカチュウ", type: "electric", hp: 70, kind: "ポケモン", stage: "たね" }
];

const energyColors = {
  grass: "green",
  fire: "red",
  water: "deepskyblue",
  electric: "gold",
  psychic: "purple",
  fighting: "orange",
  dark: "navy",
  steel: "silver"
};

let selectedPosition = null;

window.onload = () => {
  for (let id in fields) {
    const container = document.getElementById(id);
    for (let i = 0; i < 3; i++) {
      const div = document.createElement("div");
      div.className = "card-slot";
      div.addEventListener("click", () => handleSlotClick(id, i));
      container.appendChild(div);
      fields[id].push(null);
    }
  }
};

function handleSlotClick(fieldId, index) {
  const card = fields[fieldId][index];
  selectedPosition = { fieldId, index };

  if (!card) {
    showCardSelector();
  } else {
    showActionMenu();
  }
}

function showCardSelector() {
  const selector = document.getElementById("cardSelector");
  selector.innerHTML = "";
  selector.style.display = "flex";

  sampleCards.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<strong>${card.name}</strong><div class="hp">HP: ${card.hp}</div>`;
    div.onclick = () => {
      placeCard(selectedPosition.fieldId, selectedPosition.index, {
        ...card,
        energy: [],
        currentHp: card.hp
      });
      selector.style.display = "none";
    };
    selector.appendChild(div);
  });
}

function placeCard(fieldId, index, card) {
  fields[fieldId][index] = card;
  updateField();
  logAction(`${card.name} を ${fieldId} に出した`);
}

function updateField() {
  for (let fieldId in fields) {
    const container = document.getElementById(fieldId);
    const slots = container.children;
    fields[fieldId].forEach((card, i) => {
      const slot = slots[i];
      slot.innerHTML = "";
      slot.className = "card-slot";
      if (card) {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
          <strong>${card.name}</strong>
          <div class="hp">HP: ${card.currentHp}</div>
          <div class="energy-icons">
            ${card.energy.map(e => `<div class="energy ${e}" style="background:${energyColors[e]}"></div>`).join("")}
          </div>
        `;
        slot.appendChild(div);
      }
    });
  }
}

function showActionMenu() {
  document.getElementById("actionMenu").style.display = "flex";
}

function showEnergySelector() {
  document.getElementById("actionMenu").style.display = "none";
  const selector = document.getElementById("energySelector");
  selector.innerHTML = "";
  selector.style.display = "flex";

  Object.keys(energyColors).forEach(type => {
    const div = document.createElement("div");
    div.className = `energy ${type}`;
    div.style.background = energyColors[type];
    div.onclick = () => {
      const { fieldId, index } = selectedPosition;
      fields[fieldId][index].energy.push(type);
      updateField();
      logAction(`${fields[fieldId][index].name} に ${type} エネルギーを付けた`);
      selector.style.display = "none";
    };
    selector.appendChild(div);
  });
}

function adjustHP() {
  const newHP = prompt("現在のHPを入力してください");
  if (!newHP) return;
  const { fieldId, index } = selectedPosition;
  fields[fieldId][index].currentHp = parseInt(newHP);
  updateField();
  logAction(`${fields[fieldId][index].name} のHPを ${newHP} に変更`);
  document.getElementById("actionMenu").style.display = "none";
}

function sendToTrash() {
  const { fieldId, index } = selectedPosition;
  const card = fields[fieldId][index];
  fields[fieldId][index] = null;
  updateField();
  logAction(`${card.name} をトラッシュに送った`);
  document.getElementById("actionMenu").style.display = "none";
}

function logAction(text) {
  const timeline = document.getElementById("timeline");
  const p = document.createElement("div");
  p.textContent = text;
  timeline.appendChild(p);
}
