# 技術與驗收標準

## 建議技術棧

此遊戲重點在居民狀態、事件系統與 UI，不需要一開始就使用大型遊戲引擎。

建議採用：

- Vite：開發伺服器與 build 工具。
- TypeScript：資料模型、事件規則與狀態管理。
- HTML/CSS：主要 UI、像素風版面與響應式布局。
- DOM + CSS：MVP 社區地圖、像素角色與事件卡片。
- Canvas 或 SVG：後續若居民移動、場景動畫或地圖互動變複雜再導入。
- localStorage：MVP 本機存檔。
- IndexedDB：後續若存檔資料變大再導入。
- Vitest：居民狀態、關係與事件產生器測試。
- Playwright：瀏覽器流程與手機版面檢查。

## 核心資料模型

建議模組：

- `Resident`：居民基本資料、個性、人生背景、住處、財務狀態、需求、心情、喜好。
- `Relationship`：居民之間的關係值與狀態。
- `CommunityState`：社區等級、時間、居民、事件、物品。
- `EventTemplate`：事件條件、文字、選項、結果。
- `EventEngine`：挑選與產生事件。
- `ActionSystem`：處理玩家介入。
- `SaveSystem`：序列化與本機存檔。
- `UIState`：目前選取居民、面板與通知。
- `InputMode`：觸控、滑鼠與鍵盤導覽狀態。

## MVP 狀態欄位

正式 enum 與 MVP 內容表請見 [MVP 內容規格](MVP_CONTENT.md)。

居民：

- `id`
- `name`
- `avatar`
- `personality`
- `lifeBackground`
- `housingType`
- `financeState`
- `mood`
- `energy`
- `hunger`
- `socialNeed`
- `likes`
- `dislikes`

關係：

- `fromResidentId`
- `toResidentId`
- `score`
- `tag`
- `lastInteractionAt`

事件：

- `id`
- `type`
- `residentIds`
- `message`
- `choices`
- `effects`
- `createdAt`
- `resolvedAt`

## 最低支援

MVP 應支援：

- 最新版 Chrome、Edge、Firefox、Safari。
- 桌面 1366x768 以上解析度。
- 手機 844x390 左右的橫向螢幕，手機橫向為主要設計基準。
- 滑鼠點選。
- 觸控點選。
- 鍵盤基本導覽。

## 操作與版面要求

手機橫向操作是 MVP 必要條件，不是後續加分項。

- 主要流程必須能用單指完成。
- 主要點擊目標建議至少 44px x 44px。
- 主要導覽採左側或右側固定列，避免佔用橫向手機的垂直空間。
- 詳情與事件使用側邊面板、浮層或全螢幕面板。
- hover 只能作為桌面增強，不能承載必要資訊。
- 拖曳只能作為後續增強，MVP 主要互動需有點選替代方案。
- 手機橫向版不應出現水平捲動。
- 手機直向可顯示旋轉提示或基本相容版面。
- 文字與按鈕不得被瀏覽器底部工具列遮擋。
- 重要操作需要可撤回或二次確認，例如重置存檔。

## 驗收標準

功能驗收：

- 玩家可以新增或查看居民。
- 居民有心情、需求、人生背景、住處、財務狀態與關係資料。
- 系統能產生至少 8 種事件。
- 玩家可選擇行動並看到狀態變化。
- 遊戲可保存與載入。
- 沒有主流程 JavaScript 錯誤。

體驗驗收：

- 玩家打開遊戲後能立刻看見社區、居民與事件。
- 事件文字清楚，選項不溢出。
- UI 不遮擋主要互動區。
- 手機版按鈕容易點選。
- 手機橫向單指可完成新增居民、查看事件、執行行動、保存進度。
- 居民差異能被觀察到。

工程驗收：

- `npm run dev` 可啟動本機開發伺服器。
- `npm run build` 可產生可部署版本。
- 事件規則有單元測試。
- 存檔格式有版本欄位，方便日後升級。
- README 記錄啟動、測試、建置方式。

## 效能目標

- 主要互動維持流暢。
- 避免每秒大量重算所有事件。
- 事件產生採用 tick 或玩家操作觸發即可。
- 存檔資料保持輕量。
- 圖片與音效需壓縮。
