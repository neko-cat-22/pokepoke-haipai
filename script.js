const field = document.querySelector('.field');
const cardList = document.getElementById('cardList');
const actionMenu = document.getElementById('actionMenu');
const energySelect = document.getElementById('energySelect');
const logList = document.getElementById('logList');

let selectedSlot = null;
let boardState = {};  // スロットごとの状態記録

const energyColors = {
  "草": "green", "炎": "red", "水": "deepskyblue", "雷": "gold",
  "超": "purple", "闘": "orange", "悪": "darkblue", "鋼": "silver"
};

function initializeField() {
  document.querySelectorAll('.bench-row, .battle-row').forEach(row => {
    for (let i = 0; i < 3; i++) {
      if (row.classList.contains('battle-row') && i > 0) continue;
      const slot = document.createElement('div');
      slot.classList.add('slot');
      slot.dataset.owner = row.dataset.owner;
      slot.addEventListener('click', () => handleSlotClick(slot));
      row.appendChild(slot);
    }
  });
}
function handleSlotClick(slot) {
  selectedSlot = slot;
  if (!slot.dataset.cardId) {
    showCardSelection();
  } else {
    openActionMenu();
  }
}
function showCardSelection() {
  cardList.innerHTML = '';
  cardList.classList.remove('hidden');
  cardDatabase.forEach(card => {
    const div = document.createElement('div');
    div.textContent = `${card.name}(${card.hp})`;
    div.addEventListener('click', () => selectCard(card));
    cardList.appendChild(div);
  });
}
function selectCard(card) {
  cardList.classList.add('hidden');
  selectedSlot.dataset.cardId = card.id;
  boardState[selectedSlot.dataset.slotId] = {
    ...card,
    energies: [],
    currentHP: card.hp
  };
  renderSlot(selectedSlot, card);
  logAction(`${card.name} を場に出した`);
}
function renderSlot(slot, card) {
  slot.innerHTML = `
    <div class="name">${card.name}</div>
    <div class="hp">HP: ${card.hp}</div>
    <div class="energy"></div>
  `;
  const energyArea = slot.querySelector('.energy');
  boardState[slot.dataset.slotId]?.energies.forEach(type => {
    const dot = document.createElement('div');
    dot.className = 'energy-icon';
    dot.style.background = energyColors[type];
    energyArea.appendChild(dot);
  });
}
function openActionMenu() {
  actionMenu.classList.remove('hidden');
}
function closeActionMenu() {
  actionMenu.classList.add('hidden');
}
function openEnergySelect() {
  closeActionMenu();
  energySelect.innerHTML = '';
  for (let type in energyColors) {
    const btn = document.createElement('button');
    btn.textContent = type;
    btn.style.background = energyColors[type];
    btn.addEventListener('click', () => addEnergyToCard(type));
    energySelect.appendChild(btn);
  }
  const cancel = document.createElement('button');
  cancel.textContent = 'キャンセル';
  cancel.onclick = () => energySelect.classList.add('hidden');
  energySelect.appendChild(cancel);
  energySelect.classList.remove('hidden');
}
function addEnergyToCard(type) {
  energySelect.classList.add('hidden');
  const cardId = selectedSlot.dataset.cardId;
  const slotKey = selectedSlot.dataset.slotId;
  if (!boardState[slotKey]) return;
  boardState[slotKey].energies.push(type);
  renderSlot(selectedSlot, boardState[slotKey]);
  logAction(`${boardState[slotKey].name} に ${type} エネルギーを付けた`);
}
function adjustHP() {
  closeActionMenu();
  const newHP = prompt("HPを設定してください:");
  const slotKey = selectedSlot.dataset.slotId;
  if (boardState[slotKey]) {
    boardState[slotKey].currentHP = Number(newHP);
    renderSlot(selectedSlot, boardState[slotKey]);
    logAction(`${boardState[slotKey].name} のHPを${newHP}に変更`);
  }
}
function sendToTrash() {
  const slotKey = selectedSlot.dataset.slotId;
  if (boardState[slotKey]) {
    logAction(`${boardState[slotKey].name} をトラッシュに送った`);
    delete boardState[slotKey];
    selectedSlot.innerHTML = '';
    delete selectedSlot.dataset.cardId;
    closeActionMenu();
  }
}
function logAction(text) {
  const li = document.createElement('li');
  li.textContent = text;
  logList.appendChild(li);
}

initializeField();
