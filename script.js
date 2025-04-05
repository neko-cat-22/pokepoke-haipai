const sampleCards = [
  {
    id: 1,
    name: "フシギダネ",
    type: "草",
    hp: 60,
    category: "ポケモン",
    evolution: "たね"
  },
  {
    id: 2,
    name: "ポケモンいれかえ",
    type: "無",
    hp: 0,
    category: "グッズ"
  }
];

// 現在の状態
let gameState = {
  player: {
    active: sampleCards[0],
    bench: [null, null, null],
    handCount: 5,
    nextEnergy: "草"
  },
  opponent: {
    active: null,
    bench: [null, null, null],
    handCount: 5,
    nextEnergy: "炎"
  },
  logs: []
};

// 表示更新
function renderField() {
  document.getElementById("player-active").textContent =
    gameState.player.active
      ? `${gameState.player.active.name} (HP:${gameState.player.active.hp})`
      : "バトルポケモン（自分）";

  document.getElementById("opponent-active").textContent =
    gameState.opponent.active
      ? `${gameState.opponent.active.name} (HP:${gameState.opponent.active.hp})`
      : "バトルポケモン（相手）";

  document.getElementById("player-hand-count").textContent =
    gameState.player.handCount;
  document.getElementById("opponent-hand-count").textContent =
    gameState.opponent.handCount;

  // ベンチ更新
  ["player", "opponent"].forEach(side => {
    gameState[side].bench.forEach((card, i) => {
      const slot = document.querySelector(
        `.bench-slot[data-side="${side}"][data-index="${i}"]`
      );
      slot.textContent = card ? card.name : "";
    });
  });
}

// 操作ログに追加
function addLogEntry(text) {
  gameState.logs.push(text);
  updateTimeline();
  localStorage.setItem("logs", JSON.stringify(gameState.logs));
}

function updateTimeline() {
  const container = document.getElementById("timeline-container");
  container.innerHTML = "";
  gameState.logs.forEach((entry, i) => {
    const div = document.createElement("div");
    div.className = "timeline-entry";
    div.textContent = `${i + 1}: ${entry}`;
    container.appendChild(div);
  });
}

// イベント
document.getElementById("log-action").addEventListener("click", () => {
  const entry = prompt("操作ログを入力してください:");
  if (entry) addLogEntry(entry);
});

// 初期化
renderField();
updateTimeline();
