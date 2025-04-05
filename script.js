const gameState = {
  player: {
    active: null,
    bench: [null, null, null],
    handCount: 5,
  },
  opponent: {
    active: null,
    bench: [null, null, null],
    handCount: 5,
  },
  log: [],
  cardPlacementTarget: null,
};

const sampleCards = [
  { id: 1, name: "フシギダネ", type: "草", hp: 60, category: "ポケモン", evolution: "たね" },
  { id: 2, name: "ヒトカゲ", type: "炎", hp: 50, category: "ポケモン", evolution: "たね" },
  { id: 3, name: "ゼニガメ", type: "水", hp: 70, category: "ポケモン", evolution: "たね" },
  { id: 4, name: "モンスターボール", type: "無", hp: 0, category: "グッズ" }
];

function renderField() {
  document.getElementById("player-active").textContent =
    gameState.player.active
      ? `${gameState.player.active.name} (HP:${gameState.player.active.hp})`
      : "バトルポケモン（自分）";

  document.getElementById("opponent-active").textContent =
    gameState.opponent.active
      ? `${gameState.opponent.active.name} (HP:${gameState.opponent.active.hp})`
      : "バトルポケモン（相手）";

  document.getElementById("player-hand-count").textContent = gameState.player.handCount;
  document.getElementById("opponent-hand-count").textContent = gameState.opponent.handCount;

  ["player", "opponent"].forEach(side => {
    gameState[side].bench.forEach((card, i) => {
      const slot = document.querySelector(`.bench-slot[data-side="${side}"][data-index="${i}"]`);
      slot.textContent = card ? card.name : "";
      if (side === "player") {
        slot.onclick = () => openCardModal(side, "bench", i);
      }
    });

    const activeEl = document.getElementById(`${side}-active`);
    if (side === "player") {
      activeEl.onclick = () => openCardModal(side, "active");
    }
  });
}

function openCardModal(side, area, index = null) {
  gameState.cardPlacementTarget = { side, area, index };
  const cardList = document.getElementById("card-list");
  cardList.innerHTML = "";

  sampleCards.forEach(card => {
    const div = document.createElement("div");
    div.textContent = `${card.name} (${card.type})`;
    div.onclick = () => selectCard(card);
    cardList.appendChild(div);
  });

  document.getElementById("card-modal").classList.remove("hidden");
}

function closeCardModal() {
  document.getElementById("card-modal").classList.add("hidden");
  gameState.cardPlacementTarget = null;
}

function selectCard(card) {
  const { side, area, index } = gameState.cardPlacementTarget;
  if (area === "bench") {
    gameState[side].bench[index] = card;
    addLogEntry(`${side === "player" ? "自分" : "相手"}のベンチ${index + 1}に${card.name}を配置`);
  } else if (area === "active") {
    gameState[side].active = card;
    addLogEntry(`${side === "player" ? "自分" : "相手"}のバトル場に${card.name}を配置`);
  }

  closeCardModal();
  renderField();
}

function addLogEntry(text) {
  gameState.log.push(text);
  const logList = document.getElementById("log-list");
  const li = document.createElement("li");
  li.textContent = text;
  logList.appendChild(li);
}

// 初期表示
renderField();
