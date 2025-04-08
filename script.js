const sampleCards = [
  { name: "フシギダネ", type: "草", hp: 60, category: "ポケモン", evolution: "たね" },
  { name: "ヒトカゲ", type: "炎", hp: 50, category: "ポケモン", evolution: "たね" },
  { name: "ゼニガメ", type: "水", hp: 50, category: "ポケモン", evolution: "たね" },
  { name: "ピカチュウ", type: "雷", hp: 60, category: "ポケモン", evolution: "たね" },
];

let currentTargetSlot = null;
let fieldState = {}; // slotId => { name, hp, energies: [] }

function openCardModal(slotElement) {
  currentTargetSlot = slotElement;
  const cardList = document.getElementById("card-list");
  cardList.innerHTML = "";

  sampleCards.forEach(card => {
    const div = document.createElement("div");
    div.textContent = `${card.name}（HP: ${card.hp}）`;
    div.onclick = () => {
      setCardInSlot(slotElement, card);
      closeCardModal();
    };
    cardList.appendChild(div);
  });

  document.getElementById("card-modal").classList.remove("hidden");
}

function closeCardModal() {
  document.getElementById("card-modal").classList.add("hidden");
}

function setCardInSlot(slot, card) {
  const slotId = slot.getAttribute("id") || `${slot.dataset.side}-${slot.dataset.index}`;
  fieldState[slotId] = { name: card.name, hp: card.hp, energies: [] };
  renderSlot(slot, slotId);
  logAction(`${slotId} に ${card.name} を配置`);
}

function renderSlot(slot, slotId) {
  const state = fieldState[slotId];
  slot.innerHTML = "";

  const content = document.createElement("div");
  content.className = "card-content";

  const nameEl = document.createElement("div");
  nameEl.textContent = state.name;
  const hpEl = document.createElement("div");
  hpEl.textContent = `HP: ${state.hp}`;
  hpEl.className = "card-hp";

  const energyEl = document.createElement("div");
  energyEl.className = "card-energies";
  state.energies.forEach(type => {
    const circle = document.createElement("div");
    circle.className = `energy-circle ${getEnergyClass(type)}`;
    energyEl.appendChild(circle);
  });

  content.appendChild(nameEl);
  content.appendChild(hpEl);
  content.appendChild(energyEl);
  slot.appendChild(content);

  slot.onclick = () => openEnergyModal(slotId);
}

function openEnergyModal(slotId) {
  currentTargetSlot = slotId;
  document.getElementById("energy-modal").classList.remove("hidden");
}

function closeEnergyModal() {
  document.getElementById("energy-modal").classList.add("hidden");
}

document.querySelectorAll(".bench-slot, .active-slot").forEach(slot => {
  slot.onclick = () => openCardModal(slot);
});

document.querySelectorAll(".energy-options .energy-circle").forEach(btn => {
  btn.onclick = () => {
    const type = btn.dataset.type;
    const state = fieldState[currentTargetSlot];
    if (state) {
      state.energies.push(type);
      const slotEl = document.querySelector(
        `[id="${currentTargetSlot}"], [data-side][data-index="${currentTargetSlot.split("-")[1]}"]`
      );
      renderSlot(slotEl, currentTargetSlot);
      logAction(`${state.name} に ${type}エネルギーを追加`);
    }
    closeEnergyModal();
  };
});

function getEnergyClass(type) {
  return {
    "草": "grass", "炎": "fire", "水": "water", "雷": "lightning",
    "超": "psychic", "闘": "fighting", "悪": "dark", "鋼": "steel"
  }[type] || "";
}

function logAction(text) {
  const log = document.createElement("li");
  log.textContent = text;
  document.getElementById("log-list").appendChild(log);
}
