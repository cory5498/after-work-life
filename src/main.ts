import "./styles.css";

type LifeBackground =
  | "golden_spoon"
  | "in_debt"
  | "salary_worker"
  | "paycheck_to_paycheck"
  | "family_property"
  | "out_of_towner";

type HousingType =
  | "apartment_complex"
  | "rental_studio"
  | "old_walkup"
  | "mixed_use_building"
  | "family_owned_home"
  | "temporary_stay";

type FinanceState = "comfortable" | "stable" | "tight" | "debt_pressure" | "payday_waiting";

type Personality = "cheerful" | "calm" | "shy" | "particular" | "whimsical";

type RelationshipTag =
  | "stranger"
  | "acquaintance"
  | "friend"
  | "close_friend"
  | "crush"
  | "ambiguous"
  | "dating"
  | "ex"
  | "awkward"
  | "conflict"
  | "third_party_rumor";

type LocationId = "residence" | "convenience" | "bar" | "park" | "station";

type ViewId = "map" | "residents" | "events" | "items" | "settings";

interface Resident {
  id: string;
  name: string;
  job: string;
  avatar: string;
  personality: Personality;
  lifeBackground: LifeBackground;
  housingType: HousingType;
  financeState: FinanceState;
  mood: number;
  energy: number;
  hunger: number;
  socialNeed: number;
  likes: string[];
  dislikes: string[];
  location: LocationId;
  memoryLog: string[];
}

interface Relationship {
  fromResidentId: string;
  toResidentId: string;
  tag: RelationshipTag;
  score: number;
  trust: number;
  awkwardness: number;
  note: string;
  lastInteractionAt: number;
}

interface Choice {
  label: string;
  summary: string;
  apply: (state: GameState, event: ActiveEvent) => void;
}

interface EventTemplate {
  id: string;
  title: string;
  type: string;
  location: LocationId;
  description: (state: GameState, residents: Resident[]) => string;
  candidates: (state: GameState) => Resident[][];
  choices: Choice[];
}

interface ActiveEvent {
  id: string;
  templateId: string;
  title: string;
  type: string;
  location: LocationId;
  residentIds: string[];
  message: string;
  choices: Choice[];
  createdAt: number;
  resolvedAt?: number;
  result?: string;
}

interface GameState {
  version: number;
  tick: number;
  activeView: ViewId;
  selectedResidentId: string;
  selectedEventId: string | null;
  residents: Resident[];
  relationships: Relationship[];
  events: ActiveEvent[];
  resolvedEventTypes: string[];
  metrics: {
    communityActivity: number;
    gossipHeat: number;
  };
}

const labels = {
  lifeBackground: {
    golden_spoon: "含著金湯匙",
    in_debt: "背債務",
    salary_worker: "普通上班族",
    paycheck_to_paycheck: "月光族",
    family_property: "家裡有房",
    out_of_towner: "外地打拚",
  } satisfies Record<LifeBackground, string>,
  housingType: {
    apartment_complex: "社區大樓",
    rental_studio: "出租套房",
    old_walkup: "老公寓",
    mixed_use_building: "住商混合大樓",
    family_owned_home: "家裡提供的房子",
    temporary_stay: "臨時借住",
  } satisfies Record<HousingType, string>,
  financeState: {
    comfortable: "寬裕",
    stable: "穩定",
    tight: "吃緊",
    debt_pressure: "債務壓力",
    payday_waiting: "等發薪",
  } satisfies Record<FinanceState, string>,
  personality: {
    cheerful: "開朗",
    calm: "冷靜",
    shy: "害羞",
    particular: "講究",
    whimsical: "奇想",
  } satisfies Record<Personality, string>,
  relationshipTag: {
    stranger: "陌生",
    acquaintance: "認識",
    friend: "朋友",
    close_friend: "好朋友",
    crush: "暗戀",
    ambiguous: "曖昧",
    dating: "交往中",
    ex: "前任",
    awkward: "尷尬",
    conflict: "爭執中",
    third_party_rumor: "第三者傳聞",
  } satisfies Record<RelationshipTag, string>,
  location: {
    residence: "住宅區",
    convenience: "便利商店",
    bar: "餐酒館",
    park: "公園河堤",
    station: "捷運公車站",
  } satisfies Record<LocationId, string>,
};

const locationDescriptions: Record<LocationId, string> = {
  residence: "租屋、老公寓、住商混合大樓都擠在這一帶。",
  convenience: "買宵夜、咖啡、繳帳單，也常撞見不該撞見的人。",
  bar: "下班聚會熱點，曖昧升溫和修羅場都很常見。",
  park: "適合談心、告白、分手，也適合假裝只是散步。",
  station: "末班車、錯過、一起回家，都是關係轉折點。",
};

const initialResidents: Resident[] = [
  {
    id: "rina",
    name: "林莉娜",
    job: "行銷企劃",
    avatar: "莉",
    personality: "cheerful",
    lifeBackground: "paycheck_to_paycheck",
    housingType: "mixed_use_building",
    financeState: "payday_waiting",
    mood: 68,
    energy: 55,
    hunger: 72,
    socialNeed: 64,
    likes: ["餐酒館", "拍照", "甜點"],
    dislikes: ["被放鴿子", "月底帳單"],
    location: "convenience",
    memoryLog: ["月底前的每一杯飲料都像重大投資。"],
  },
  {
    id: "hao",
    name: "張浩",
    job: "工程師",
    avatar: "浩",
    personality: "calm",
    lifeBackground: "salary_worker",
    housingType: "apartment_complex",
    financeState: "stable",
    mood: 58,
    energy: 42,
    hunger: 48,
    socialNeed: 52,
    likes: ["便利商店咖啡", "河堤散步"],
    dislikes: ["臨時聚會", "八卦"],
    location: "station",
    memoryLog: ["他說只是順路，其實已經繞路三站。"],
  },
  {
    id: "yuci",
    name: "陳予慈",
    job: "設計助理",
    avatar: "予",
    personality: "shy",
    lifeBackground: "out_of_towner",
    housingType: "rental_studio",
    financeState: "tight",
    mood: 46,
    energy: 50,
    hunger: 39,
    socialNeed: 75,
    likes: ["公園", "手作禮物", "安靜聊天"],
    dislikes: ["高消費局", "被催促"],
    location: "park",
    memoryLog: ["她還不太熟這座城市，但記得每一盞晚歸的路燈。"],
  },
  {
    id: "sheng",
    name: "周盛",
    job: "業務",
    avatar: "盛",
    personality: "particular",
    lifeBackground: "golden_spoon",
    housingType: "family_owned_home",
    financeState: "comfortable",
    mood: 62,
    energy: 61,
    hunger: 33,
    socialNeed: 58,
    likes: ["餐酒館", "精緻禮物", "人脈"],
    dislikes: ["被說靠家裡"],
    location: "bar",
    memoryLog: ["他習慣買單，但不習慣被看成只會買單。"],
  },
  {
    id: "minjie",
    name: "吳敏傑",
    job: "自由接案",
    avatar: "敏",
    personality: "whimsical",
    lifeBackground: "in_debt",
    housingType: "temporary_stay",
    financeState: "debt_pressure",
    mood: 40,
    energy: 66,
    hunger: 69,
    socialNeed: 47,
    likes: ["宵夜", "捷運口偶遇", "便宜好物"],
    dislikes: ["催繳", "比較收入"],
    location: "residence",
    memoryLog: ["他總說下個案子會翻身，但今晚先吃特價飯糰。"],
  },
];

const initialRelationships: Relationship[] = [
  relationship("rina", "hao", "ambiguous", 45, "常在便利商店遇到。", 44, 12),
  relationship("hao", "rina", "crush", 35, "不太會主動。", 50, 8),
  relationship("yuci", "rina", "friend", 30, "莉娜常揪予慈出門。", 55, 5),
  relationship("sheng", "rina", "acquaintance", 20, "曾在餐酒館同桌。", 35, 10),
  relationship("minjie", "sheng", "awkward", -10, "敏傑不喜歡盛的金錢觀。", 18, 46),
  relationship("yuci", "minjie", "acquaintance", 15, "都是租屋壓力族。", 38, 12),
];

function relationship(
  fromResidentId: string,
  toResidentId: string,
  tag: RelationshipTag,
  score: number,
  note: string,
  trust: number,
  awkwardness: number,
): Relationship {
  return { fromResidentId, toResidentId, tag, score, note, trust, awkwardness, lastInteractionAt: 0 };
}

const eventTemplates: EventTemplate[] = [
  {
    id: "hunger_after_work",
    title: "宵夜抉擇",
    type: "飢餓",
    location: "convenience",
    candidates: (state) => state.residents.filter((resident) => resident.hunger > 60).map((resident) => [resident]),
    description: (_state, [resident]) => `${resident.name} 下班後餓到開始認真比較飯糰折扣。`,
    choices: [
      choice("買宵夜", "飢餓下降，心情上升。", (state, event) => {
        adjustResident(state, event.residentIds[0], { hunger: -28, mood: 8, energy: 3 });
        bumpMetrics(state, 4, 0);
      }),
      choice("約人吃飯", "社交需求下降，可能升溫關係。", (state, event) => {
        adjustResident(state, event.residentIds[0], { hunger: -18, socialNeed: -15, mood: 5 });
        nudgeBestRelationship(state, event.residentIds[0], 6, 4, -2);
        bumpMetrics(state, 8, 2);
      }),
      choice("忍一下", "省錢但心情下降。", (state, event) => {
        adjustResident(state, event.residentIds[0], { hunger: 8, mood: -8 });
      }),
    ],
  },
  {
    id: "low_mood_chat",
    title: "今晚有點悶",
    type: "心情低落",
    location: "park",
    candidates: (state) => state.residents.filter((resident) => resident.mood < 52).map((resident) => [resident]),
    description: (_state, [resident]) => `${resident.name} 在河堤滑手機，訊息打了又刪。`,
    choices: [
      choice("安排聊天", "心情回升，關係升溫。", (state, event) => {
        adjustResident(state, event.residentIds[0], { mood: 14, socialNeed: -12 });
        nudgeBestRelationship(state, event.residentIds[0], 7, 6, -4);
        bumpMetrics(state, 8, 1);
      }),
      choice("送小禮物", "心情上升，但八卦略升。", (state, event) => {
        adjustResident(state, event.residentIds[0], { mood: 11 });
        bumpMetrics(state, 4, 3);
      }),
      choice("讓他獨處", "能量上升，社交需求增加。", (state, event) => {
        adjustResident(state, event.residentIds[0], { energy: 9, socialNeed: 7 });
      }),
    ],
  },
  {
    id: "first_meeting",
    title: "第一次同路",
    type: "初次認識",
    location: "station",
    candidates: (state) => pairCandidates(state, (rel) => rel.tag === "stranger"),
    description: (_state, [a, b]) => `${a.name} 和 ${b.name} 在公車站躲同一場雨。`,
    choices: [
      choice("安排打招呼", "建立認識關係。", (state, event) => {
        setRelationship(state, event.residentIds[0], event.residentIds[1], "acquaintance", 15, 34, 5, "在公車站正式說上話。");
        bumpMetrics(state, 7, 0);
      }),
      choice("製造偶遇", "好感增加，八卦也升溫。", (state, event) => {
        setRelationship(state, event.residentIds[0], event.residentIds[1], "acquaintance", 22, 38, 8, "這個偶遇自然到有點刻意。");
        bumpMetrics(state, 7, 3);
      }),
      choice("先觀察", "事件被記錄，但不改變關係。", (state) => bumpMetrics(state, 2, 0)),
    ],
  },
  {
    id: "ambiguous_invite",
    title: "下班後要不要喝一杯",
    type: "曖昧邀約",
    location: "bar",
    candidates: (state) => pairCandidates(state, (rel) => rel.tag === "crush" || rel.tag === "ambiguous"),
    description: (_state, [a, b]) => `${a.name} 想約 ${b.name} 去餐酒館，但又怕太明顯。`,
    choices: [
      choice("答應邀約", "關係升溫，八卦升高。", (state, event) => {
        nudgeRelationship(state, event.residentIds[0], event.residentIds[1], 12, 6, -2, "下班喝一杯之後，話題多了很多。");
        bumpMetrics(state, 12, 8);
      }),
      choice("找朋友同行", "尷尬降低，升溫較慢。", (state, event) => {
        nudgeRelationship(state, event.residentIds[0], event.residentIds[1], 5, 4, -5, "不是約會，但也不完全不是。");
        bumpMetrics(state, 7, 3);
      }),
      choice("婉拒", "好感下降，尷尬上升。", (state, event) => {
        nudgeRelationship(state, event.residentIds[0], event.residentIds[1], -8, -2, 10, "訊息停在一個很客氣的句點。");
      }),
    ],
  },
  {
    id: "ex_appears",
    title: "前任也在",
    type: "前任出現",
    location: "bar",
    candidates: (state) => pairCandidates(state, (rel) => rel.tag === "ex"),
    description: (_state, [a, b]) => `${a.name} 到餐酒館才發現 ${b.name} 也在同一桌附近。`,
    choices: [
      choice("裝沒看到", "心情下降，尷尬上升。", (state, event) => {
        adjustResident(state, event.residentIds[0], { mood: -8 });
        nudgeRelationship(state, event.residentIds[0], event.residentIds[1], -2, -3, 12, "大家都在假裝沒看到。");
        bumpMetrics(state, 2, 7);
      }),
      choice("安排談清楚", "信任可能回升，社區活躍增加。", (state, event) => {
        nudgeRelationship(state, event.residentIds[0], event.residentIds[1], 3, 8, -7, "至少把話說完了。");
        bumpMetrics(state, 10, 2);
      }),
      choice("轉移話題", "暫時降溫。", (state, event) => {
        nudgeRelationship(state, event.residentIds[0], event.residentIds[1], 0, 1, -4, "話題被轉走，但空氣沒有完全恢復。");
      }),
    ],
  },
  {
    id: "third_party_rumor",
    title: "傳聞開始跑",
    type: "第三者傳聞",
    location: "convenience",
    candidates: (state) =>
      pairCandidates(state, (rel) => (rel.tag === "ambiguous" || rel.tag === "dating") && state.metrics.gossipHeat > 25),
    description: (_state, [a, b]) => `有人說 ${a.name} 最近常和別人在便利商店碰面，${b.name} 聽到了。`,
    choices: [
      choice("查證", "降低八卦，可能提升信任。", (state, event) => {
        nudgeRelationship(state, event.residentIds[0], event.residentIds[1], 1, 9, -4, "至少不是只靠想像判斷。");
        bumpMetrics(state, 3, -8);
      }),
      choice("安撫", "心情回升，八卦小降。", (state, event) => {
        adjustResident(state, event.residentIds[1], { mood: 7 });
        nudgeRelationship(state, event.residentIds[0], event.residentIds[1], 0, 5, -2, "有人願意安撫，比答案本身重要。");
        bumpMetrics(state, 5, -3);
      }),
      choice("放任發酵", "八卦大升，關係受損。", (state, event) => {
        nudgeRelationship(state, event.residentIds[0], event.residentIds[1], -8, -8, 13, "傳聞長出了自己的腳。");
        bumpMetrics(state, 1, 14);
      }),
    ],
  },
  {
    id: "debt_pressure",
    title: "催繳訊息",
    type: "債務壓力",
    location: "residence",
    candidates: (state) => state.residents.filter((resident) => resident.lifeBackground === "in_debt").map((resident) => [resident]),
    description: (_state, [resident]) => `${resident.name} 收到催繳訊息，手上的宵夜突然變得很奢侈。`,
    choices: [
      choice("接兼職", "金錢壓力下降，能量下降。", (state, event) => {
        adjustResident(state, event.residentIds[0], { energy: -12, mood: 2 });
        setFinance(state, event.residentIds[0], "tight");
        bumpMetrics(state, 5, 0);
      }),
      choice("借錢", "壓力下降，但關係可能變尷尬。", (state, event) => {
        adjustResident(state, event.residentIds[0], { mood: 4 });
        nudgeBestRelationship(state, event.residentIds[0], -3, -2, 10);
        setFinance(state, event.residentIds[0], "tight");
        bumpMetrics(state, 3, 5);
      }),
      choice("取消聚會", "省錢但社交需求上升。", (state, event) => {
        adjustResident(state, event.residentIds[0], { mood: -6, socialNeed: 12 });
      }),
    ],
  },
  {
    id: "payday_waiting",
    title: "月底生存術",
    type: "月光族月底",
    location: "convenience",
    candidates: (state) => state.residents.filter((resident) => resident.financeState === "payday_waiting").map((resident) => [resident]),
    description: (_state, [resident]) => `${resident.name} 站在便利商店架前，正在計算今天還能不能加茶葉蛋。`,
    choices: [
      choice("吃便利商店", "飢餓下降，心情小升。", (state, event) => {
        adjustResident(state, event.residentIds[0], { hunger: -24, mood: 4 });
        bumpMetrics(state, 3, 0);
      }),
      choice("找朋友請客", "飢餓下降，八卦升溫。", (state, event) => {
        adjustResident(state, event.residentIds[0], { hunger: -26, mood: 6 });
        nudgeBestRelationship(state, event.residentIds[0], 3, 2, 4);
        bumpMetrics(state, 6, 6);
      }),
      choice("早點回家", "能量回升，心情下降。", (state, event) => {
        adjustResident(state, event.residentIds[0], { energy: 10, mood: -4, hunger: 4 });
      }),
    ],
  },
  {
    id: "golden_spoon_misread",
    title: "靠家裡的誤會",
    type: "金湯匙誤會",
    location: "bar",
    candidates: (state) => state.residents.filter((resident) => resident.lifeBackground === "golden_spoon").map((resident) => [resident]),
    description: (_state, [resident]) => `${resident.name} 又被說什麼都能用錢解決，笑容有點僵。`,
    choices: [
      choice("解釋", "心情回升，八卦降低。", (state, event) => {
        adjustResident(state, event.residentIds[0], { mood: 8 });
        bumpMetrics(state, 3, -4);
      }),
      choice("請客", "社區活躍上升，誤會可能更深。", (state, event) => {
        adjustResident(state, event.residentIds[0], { mood: 2 });
        bumpMetrics(state, 10, 7);
      }),
      choice("保持距離", "尷尬降低但社交下降。", (state, event) => {
        adjustResident(state, event.residentIds[0], { socialNeed: 8, mood: -3 });
      }),
    ],
  },
  {
    id: "last_train",
    title: "末班車前",
    type: "末班車",
    location: "station",
    candidates: (state) => pairCandidates(state, (rel) => rel.score > 10),
    description: (_state, [a, b]) => `末班車快到了，${a.name} 和 ${b.name} 還站在捷運口。`,
    choices: [
      choice("一起回家", "關係升溫，八卦升溫。", (state, event) => {
        nudgeRelationship(state, event.residentIds[0], event.residentIds[1], 9, 5, -2, "一起走過最後一段路。");
        bumpMetrics(state, 8, 8);
      }),
      choice("錯過車", "事件收集增加，能量下降。", (state, event) => {
        event.residentIds.forEach((id) => adjustResident(state, id, { energy: -8, mood: 3 }));
        bumpMetrics(state, 7, 4);
      }),
      choice("各自離開", "安全收尾。", (state, event) => {
        event.residentIds.forEach((id) => adjustResident(state, id, { energy: 2 }));
      }),
    ],
  },
];

function choice(label: string, summary: string, apply: Choice["apply"]): Choice {
  return { label, summary, apply };
}

function createInitialState(): GameState {
  return {
    version: 1,
    tick: 1,
    activeView: "map",
    selectedResidentId: "rina",
    selectedEventId: null,
    residents: structuredClone(initialResidents),
    relationships: structuredClone(initialRelationships),
    events: [],
    resolvedEventTypes: [],
    metrics: {
      communityActivity: 18,
      gossipHeat: 18,
    },
  };
}

const saveKey = "after-work-life-save-v1";
let state = loadState();
const appElement = document.querySelector<HTMLDivElement>("#app");

if (!appElement) {
  throw new Error("App root not found.");
}

const app = appElement;

render();

function loadState(): GameState {
  const raw = localStorage.getItem(saveKey);
  if (!raw) return createInitialState();

  try {
    const parsed = JSON.parse(raw) as GameState;
    if (parsed.version !== 1) return createInitialState();
    return parsed;
  } catch {
    return createInitialState();
  }
}

function saveState(): void {
  localStorage.setItem(saveKey, JSON.stringify(state));
}

function render(): void {
  const selectedResident = getResident(state.selectedResidentId);
  const selectedEvent = state.selectedEventId ? state.events.find((event) => event.id === state.selectedEventId) ?? null : null;

  app.innerHTML = `
    <main class="game-shell">
      <aside class="side-nav" aria-label="主要導覽">
        <div class="brand">
          <span class="brand-mark">下</span>
          <div>
            <strong>下班要做什麼?</strong>
            <small>第 ${state.tick} 晚</small>
          </div>
        </div>
        ${navButton("map", "社區")}
        ${navButton("residents", "居民")}
        ${navButton("events", "事件")}
        ${navButton("items", "物品")}
        ${navButton("settings", "設定")}
      </aside>

      <section class="map-panel">
        <header class="top-bar">
          <div>
            <p>下班生活圈</p>
            <h1>${labels.location[selectedResident.location]}有人正在猶豫</h1>
          </div>
          <button class="primary-action" data-action="advance">推進下班時間</button>
        </header>

        <div class="metrics" aria-label="社區指標">
          ${metricCard("社區活躍度", state.metrics.communityActivity)}
          ${metricCard("事件收集率", eventCollectionRate())}
          ${metricCard("八卦熱度", state.metrics.gossipHeat)}
        </div>

        ${renderMap()}
      </section>

      <aside class="detail-panel">
        ${renderDetailPanel(selectedResident, selectedEvent)}
      </aside>
    </main>
    <div class="portrait-warning">請將手機轉為橫向遊玩</div>
  `;

  bindEvents();
}

function navButton(view: ViewId, label: string): string {
  return `<button class="nav-button ${state.activeView === view ? "active" : ""}" data-view="${view}">${label}</button>`;
}

function metricCard(label: string, value: number): string {
  return `
    <div class="metric-card">
      <span>${label}</span>
      <strong>${clamp(Math.round(value), 0, 100)}%</strong>
    </div>
  `;
}

function renderMap(): string {
  const locations: LocationId[] = ["residence", "convenience", "bar", "park", "station"];
  return `
    <div class="pixel-map" role="list" aria-label="像素風下班生活圈">
      ${locations
        .map((location) => {
          const residents = state.residents.filter((resident) => resident.location === location);
          return `
            <button class="location-tile ${location}" data-location="${location}" role="listitem">
              <span class="location-sign">${labels.location[location]}</span>
              <span class="location-note">${locationDescriptions[location]}</span>
              <span class="resident-row">
                ${residents.map(renderResidentToken).join("")}
              </span>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderResidentToken(resident: Resident): string {
  return `
    <span class="resident-token ${resident.id === state.selectedResidentId ? "selected" : ""}" data-resident="${resident.id}">
      <span class="sprite ${resident.personality}">${resident.avatar}</span>
      <span>${resident.name.slice(0, 2)}</span>
    </span>
  `;
}

function renderDetailPanel(selectedResident: Resident, selectedEvent: ActiveEvent | null): string {
  if (state.activeView === "events" || selectedEvent) {
    return renderEventPanel(selectedEvent);
  }

  if (state.activeView === "residents") {
    return renderResidentsPanel();
  }

  if (state.activeView === "items") {
    return `
      <section class="panel-card">
        <p class="eyebrow">物品</p>
        <h2>今晚能做的事</h2>
        <div class="item-grid">
          <span>宵夜</span>
          <span>小禮物</span>
          <span>咖啡</span>
          <span>聊天邀請</span>
        </div>
      </section>
    `;
  }

  if (state.activeView === "settings") {
    return `
      <section class="panel-card">
        <p class="eyebrow">設定</p>
        <h2>存檔</h2>
        <p>進度會自動保存到本機瀏覽器。</p>
        <button class="danger-action" data-action="reset">重置存檔</button>
      </section>
    `;
  }

  return renderResidentDetail(selectedResident);
}

function renderResidentsPanel(): string {
  return `
    <section class="panel-card">
      <p class="eyebrow">居民</p>
      <h2>今晚誰有狀況</h2>
      <div class="resident-list">
        ${state.residents
          .map(
            (resident) => `
              <button class="resident-list-item" data-resident="${resident.id}">
                <span class="sprite ${resident.personality}">${resident.avatar}</span>
                <span>
                  <strong>${resident.name}</strong>
                  <small>${labels.lifeBackground[resident.lifeBackground]} / ${labels.financeState[resident.financeState]}</small>
                </span>
              </button>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderResidentDetail(resident: Resident): string {
  return `
    <section class="panel-card resident-detail">
      <p class="eyebrow">${resident.job}</p>
      <div class="resident-heading">
        <span class="large-sprite ${resident.personality}">${resident.avatar}</span>
        <div>
          <h2>${resident.name}</h2>
          <p>${labels.personality[resident.personality]} / ${labels.lifeBackground[resident.lifeBackground]}</p>
        </div>
      </div>
      <div class="tag-row">
        <span>${labels.housingType[resident.housingType]}</span>
        <span>${labels.financeState[resident.financeState]}</span>
        <span>${labels.location[resident.location]}</span>
      </div>
      ${statBar("心情", resident.mood)}
      ${statBar("能量", resident.energy)}
      ${statBar("飢餓", resident.hunger)}
      ${statBar("社交需求", resident.socialNeed)}
      <div class="mini-section">
        <strong>喜好</strong>
        <p>${resident.likes.join("、")}</p>
      </div>
      <div class="mini-section">
        <strong>最近記憶</strong>
        <p>${resident.memoryLog[resident.memoryLog.length - 1] ?? "今晚還沒有留下什麼。"}</p>
      </div>
      <button class="secondary-action" data-action="focus-events">查看事件</button>
    </section>
  `;
}

function renderEventPanel(selectedEvent: ActiveEvent | null): string {
  const unresolvedEvents = state.events.filter((event) => !event.resolvedAt);
  const event = selectedEvent && !selectedEvent.resolvedAt ? selectedEvent : unresolvedEvents[0];

  if (!event) {
    return `
      <section class="panel-card">
        <p class="eyebrow">事件</p>
        <h2>今晚暫時平靜</h2>
        <p>推進下班時間，讓居民狀態繼續發酵。</p>
        <button class="primary-action full" data-action="advance">推進下班時間</button>
      </section>
      ${renderEventHistory()}
    `;
  }

  return `
    <section class="panel-card event-card">
      <p class="eyebrow">${event.type} / ${labels.location[event.location]}</p>
      <h2>${event.title}</h2>
      <p>${event.message}</p>
      <div class="choice-list">
        ${event.choices
          .map(
            (choiceItem, index) => `
              <button class="choice-button" data-event="${event.id}" data-choice="${index}">
                <strong>${choiceItem.label}</strong>
                <span>${choiceItem.summary}</span>
              </button>
            `,
          )
          .join("")}
      </div>
    </section>
    ${renderEventHistory()}
  `;
}

function renderEventHistory(): string {
  const history = state.events.filter((event) => event.resolvedAt).slice(-4).reverse();
  return `
    <section class="panel-card compact">
      <p class="eyebrow">事件紀錄</p>
      ${
        history.length
          ? history
              .map(
                (event) => `
                  <div class="history-item">
                    <strong>${event.title}</strong>
                    <span>${event.result ?? "已處理"}</span>
                  </div>
                `,
              )
              .join("")
          : "<p>還沒有已解決事件。</p>"
      }
    </section>
  `;
}

function statBar(label: string, value: number): string {
  return `
    <div class="stat-bar">
      <span>${label}</span>
      <div><i style="width: ${clamp(value, 0, 100)}%"></i></div>
      <strong>${clamp(Math.round(value), 0, 100)}</strong>
    </div>
  `;
}

function bindEvents(): void {
  app.querySelectorAll<HTMLButtonElement>("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeView = button.dataset.view as ViewId;
      state.selectedEventId = null;
      saveState();
      render();
    });
  });

  app.querySelectorAll<HTMLElement>("[data-resident]").forEach((element) => {
    element.addEventListener("click", (event) => {
      event.stopPropagation();
      const residentId = element.dataset.resident;
      if (!residentId) return;
      state.selectedResidentId = residentId;
      state.activeView = "map";
      state.selectedEventId = null;
      saveState();
      render();
    });
  });

  app.querySelectorAll<HTMLButtonElement>("[data-location]").forEach((button) => {
    button.addEventListener("click", () => {
      const location = button.dataset.location as LocationId;
      const resident = state.residents.find((item) => item.location === location);
      if (resident) state.selectedResidentId = resident.id;
      state.activeView = "map";
      saveState();
      render();
    });
  });

  app.querySelectorAll<HTMLButtonElement>("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const eventId = button.dataset.event;
      const choiceIndex = Number(button.dataset.choice);
      if (!eventId || Number.isNaN(choiceIndex)) return;
      resolveEvent(eventId, choiceIndex);
      saveState();
      render();
    });
  });

  app.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "advance") advanceTime();
      if (action === "reset") resetGame();
      if (action === "focus-events") state.activeView = "events";
      saveState();
      render();
    });
  });
}

function advanceTime(): void {
  state.tick += 1;
  state.residents = state.residents.map((resident) => ({
    ...resident,
    hunger: clamp(resident.hunger + 8, 0, 100),
    energy: clamp(resident.energy - 5, 0, 100),
    mood: clamp(resident.mood + (resident.energy > 35 ? 1 : -4), 0, 100),
    socialNeed: clamp(resident.socialNeed + 5, 0, 100),
    location: nextLocation(resident),
  }));

  state.metrics.gossipHeat = clamp(state.metrics.gossipHeat - 2, 0, 100);
  const event = generateEvent();
  if (event) {
    state.events.unshift(event);
    state.selectedEventId = event.id;
    state.activeView = "events";
  }
}

function nextLocation(resident: Resident): LocationId {
  if (resident.hunger > 65) return "convenience";
  if (resident.socialNeed > 70) return resident.personality === "shy" ? "park" : "bar";
  if (resident.energy < 30) return "residence";
  if (resident.lifeBackground === "in_debt") return "station";
  return (["residence", "convenience", "bar", "park", "station"] as LocationId[])[
    (state.tick + resident.id.length) % 5
  ];
}

function generateEvent(): ActiveEvent | null {
  const unresolvedIds = new Set(state.events.filter((event) => !event.resolvedAt).map((event) => event.templateId));
  const candidates = eventTemplates
    .filter((template) => !unresolvedIds.has(template.id))
    .flatMap((template) => template.candidates(state).map((residents) => ({ template, residents })));

  if (!candidates.length) return null;

  const selected = candidates[state.tick % candidates.length];
  return {
    id: `${selected.template.id}-${Date.now()}`,
    templateId: selected.template.id,
    title: selected.template.title,
    type: selected.template.type,
    location: selected.template.location,
    residentIds: selected.residents.map((resident) => resident.id),
    message: selected.template.description(state, selected.residents),
    choices: selected.template.choices,
    createdAt: state.tick,
  };
}

function resolveEvent(eventId: string, choiceIndex: number): void {
  const event = state.events.find((item) => item.id === eventId);
  if (!event || event.resolvedAt) return;

  const selectedChoice = event.choices[choiceIndex];
  if (!selectedChoice) return;

  selectedChoice.apply(state, event);
  event.resolvedAt = state.tick;
  event.result = selectedChoice.summary;
  if (!state.resolvedEventTypes.includes(event.templateId)) {
    state.resolvedEventTypes.push(event.templateId);
  }
  event.residentIds.forEach((residentId) => {
    const resident = getResident(residentId);
    resident.memoryLog.push(`${event.title}：${selectedChoice.label}`);
    resident.memoryLog = resident.memoryLog.slice(-5);
  });
  state.selectedEventId = null;
}

function resetGame(): void {
  const confirmed = window.confirm("確定要重置《下班要做什麼?》的本機存檔嗎？");
  if (!confirmed) return;
  localStorage.removeItem(saveKey);
  state = createInitialState();
}

function pairCandidates(stateValue: GameState, predicate: (relationship: Relationship) => boolean): Resident[][] {
  return stateValue.relationships
    .filter(predicate)
    .map((rel) => [stateValue.residents.find((resident) => resident.id === rel.fromResidentId), stateValue.residents.find((resident) => resident.id === rel.toResidentId)])
    .filter((pair): pair is Resident[] => pair.every(Boolean));
}

function getResident(residentId: string): Resident {
  const resident = state.residents.find((item) => item.id === residentId);
  if (!resident) throw new Error(`Resident not found: ${residentId}`);
  return resident;
}

function adjustResident(stateValue: GameState, residentId: string, delta: Partial<Record<"mood" | "energy" | "hunger" | "socialNeed", number>>): void {
  const resident = stateValue.residents.find((item) => item.id === residentId);
  if (!resident) return;
  resident.mood = clamp(resident.mood + (delta.mood ?? 0), 0, 100);
  resident.energy = clamp(resident.energy + (delta.energy ?? 0), 0, 100);
  resident.hunger = clamp(resident.hunger + (delta.hunger ?? 0), 0, 100);
  resident.socialNeed = clamp(resident.socialNeed + (delta.socialNeed ?? 0), 0, 100);
}

function setFinance(stateValue: GameState, residentId: string, financeState: FinanceState): void {
  const resident = stateValue.residents.find((item) => item.id === residentId);
  if (resident) resident.financeState = financeState;
}

function nudgeBestRelationship(stateValue: GameState, residentId: string, score: number, trust: number, awkwardness: number): void {
  const rel = stateValue.relationships.find((item) => item.fromResidentId === residentId || item.toResidentId === residentId);
  if (!rel) return;
  nudgeRelationship(stateValue, rel.fromResidentId, rel.toResidentId, score, trust, awkwardness, rel.note);
}

function nudgeRelationship(
  stateValue: GameState,
  fromResidentId: string,
  toResidentId: string,
  scoreDelta: number,
  trustDelta: number,
  awkwardnessDelta: number,
  note: string,
): void {
  const rel = getOrCreateRelationship(stateValue, fromResidentId, toResidentId);
  rel.score = clamp(rel.score + scoreDelta, -100, 100);
  rel.trust = clamp(rel.trust + trustDelta, 0, 100);
  rel.awkwardness = clamp(rel.awkwardness + awkwardnessDelta, 0, 100);
  rel.note = note;
  rel.lastInteractionAt = stateValue.tick;
  rel.tag = deriveRelationshipTag(rel);
}

function setRelationship(
  stateValue: GameState,
  fromResidentId: string,
  toResidentId: string,
  tag: RelationshipTag,
  score: number,
  trust: number,
  awkwardness: number,
  note: string,
): void {
  const rel = getOrCreateRelationship(stateValue, fromResidentId, toResidentId);
  rel.tag = tag;
  rel.score = score;
  rel.trust = trust;
  rel.awkwardness = awkwardness;
  rel.note = note;
  rel.lastInteractionAt = stateValue.tick;
}

function getOrCreateRelationship(stateValue: GameState, fromResidentId: string, toResidentId: string): Relationship {
  let rel = stateValue.relationships.find((item) => item.fromResidentId === fromResidentId && item.toResidentId === toResidentId);
  if (!rel) {
    rel = relationship(fromResidentId, toResidentId, "stranger", 0, "還沒有真正說過話。", 20, 0);
    stateValue.relationships.push(rel);
  }
  return rel;
}

function deriveRelationshipTag(rel: Relationship): RelationshipTag {
  if (rel.awkwardness > 65) return "awkward";
  if (rel.score > 72 && rel.trust > 58) return "dating";
  if (rel.score > 50) return "ambiguous";
  if (rel.score > 28) return "crush";
  if (rel.score > 15) return "friend";
  if (rel.score < -20) return "conflict";
  return "acquaintance";
}

function bumpMetrics(stateValue: GameState, activity: number, gossip: number): void {
  stateValue.metrics.communityActivity = clamp(stateValue.metrics.communityActivity + activity, 0, 100);
  stateValue.metrics.gossipHeat = clamp(stateValue.metrics.gossipHeat + gossip, 0, 100);
}

function eventCollectionRate(): number {
  return (state.resolvedEventTypes.length / eventTemplates.length) * 100;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
