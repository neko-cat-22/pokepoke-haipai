let cards = [];
let selectedSlot = null;

// カードデータを外部から読み込み
fetch('cards.json')
  .then(res => res.json())
  .then(data => {
    cards = data;
    initBoard();
    setupEvents();
  });

function initBoard() {
  const playerBench = document.getElementById("player-bench");
  const playerBattle = document.getElementById("player-battle");
  const opponentBench = document.getElementById("opponent-bench");
  const opponentBattle = document.getElementById("opponent-battle");

  playerBench.innerHTML = '';
  playerBattle.innerHTML = '';
  opponentBench.innerHTML = '';
  opponentBattle.innerHTML = '';

  for (let i = 0; i < 3; i++) {
    playerBench.appendChild(createCardSlot('player-bench', i));
    opponentBench.appendChild(createCardSlot('opponent-bench', i));
  }

  playerBattle.appendChild(createCardSlot('player-battle', 0));
  opponentBattle.appendChild(createCardSlot('opponent-battle', 0));
}

function createCardSlot(area, index) {
  const slot = document.createElement("div");
  slot.classList.add("card-slot");
  slot.dataset.area = area;
  slot.dataset.index = index;
  slot.addEventListener("click", () => {
    selectedSlot = slot;
    openCardList();
  });
  return slot;
}

function openCardList() {
  const modal = document.getElementById("card-list-modal");
  const list = document.getElementById("card-list");
  list.innerHTML = '';

  cards.forEach((card, idx) => {
    const div = document.createElement("div");
    div.textContent = `${card.name} (${card.hp})`;
    div.style.cursor = 'pointer';
    div.style.margin = '5px 0';
    div.addEventListener("click", () => {
      setCardToSlot(selectedSlot, card);
      logAction(`${selectedSlot.dataset.area} に ${card.name} を配置`);
      closeCardList();
    });
    list.appendChild(div);
  });

  modal.classList.remove("hidden");
}

function closeCardList() {
  document.getElementById("card-list-modal").classList.add("hidden");
}

function setCardToSlot(slot, card) {
  slot.innerHTML = '';
  const name = document.createElement("div");
  name.textContent = card.name;
  name.className = "card-name";
  slot.appendChild(name);

  const hp = document.createElement("div");
  hp.textContent = `HP: ${card.hp}`;
  slot.appendChild(hp);

  const energyBar = document.createElement("div");
  energyBar.className = "energy-icons";
  slot.appendChild(energyBar);

  const types = ['grass', 'fire', 'water', 'electric', 'psychic', 'fighting', 'dark', 'steel'];
  types.forEach(type => {
    const dot = document.createElement("div");
    dot.classList.add("energy", type);
    dot.addEventListener("click", () => {
      const clone = dot.cloneNode();
      energyBar.appendChild(clone);
      logAction(`${card.name} にエネルギー(${type})を追加`);
    });
    slot.appendChild(dot);
  });

  slot.dataset.cardId = card.id;
}

function setupEvents() {
  document.getElementById("open-card-list").addEventListener("click", () => {
    selectedSlot = null;
    openCardList();
  });

  document.getElementById("close-card-list").addEventListener("click", () => {
    closeCardList();
  });
}

function logAction(text) {
  const logList = document.getElementById("log-list");
  const li = document.createElement("li");
  li.textContent = text;
  logList.appendChild(li);
}
