# Phase 4 — Website interface and YouTube highlights

実装・検証日: 2026-11-02（Asia/Tokyo）。ローカル実装のみ。

## 実装結果

- タイトル: **MJO Workshop 2026 — Knowledge & Action Portal**
- サブタイトル: **Scientific Questions, Emerging Insights, and Future Research Actions**
- 英語の11ページと動画・質問・研究アクションの詳細3ページを実装。
- Astroのサーバー描画、既存EmDashのhead/body統合、管理画面、科学情報の公開制御を保持。
- 共通ヘッダー、全ページを辿れるフッター、キーボードで操作できるトピックメニュー、本文へのスキップリンク、現在位置表示を追加。
- 学術用途の落ち着いた配色、見出し、カード、日付索引、モバイル時の1列表示を実装。ホームの波形は装飾的な概念図であり、科学データではないと明示。

| ページ | 経路 |
| --- | --- |
| Home | `/` |
| Program & Sessions | `/program` |
| Video Highlights | `/videos` |
| Scientific Questions | `/questions` |
| Diverging Perspectives | `/diverging-perspectives` |
| Emerging Alignment | `/emerging-alignment` |
| Open Challenges | `/open-challenges` |
| Research Action Roadmap | `/actions` |
| AI for MJO Research | `/ai-for-mjo-research` |
| MJO Indices and Diagnostics | `/mjo-indices-and-diagnostics` |
| About & Methodology | `/about` |
| サンプル動画詳細 | `/videos/breakout-themes-3-4` |
| 質問のドラフト画面 | `/questions/theory-and-modelling` |
| アクションのドラフト画面 | `/actions/theory-and-modelling` |

## プログラムと動画の照合

出典: [公式ICTPプログラム](https://indico.ictp.it/event/11169/other-view?view=ictptimetable)。2026-11-02に照合。

5日間のセッションを時系列表示し、個別講演にはプログラム記載の講演者のみを表示する。議論セッションに個人名を付与していない。休憩は関連ブロック内に注記する。月曜午後と木曜の公式セッション枠には重複があり、元の時刻を保持し注記した。講演タイトルは予定情報であり、審査済み科学的知見として提示しない。

[YouTube RPXnSvabsGY](https://www.youtube.com/watch?v=RPXnSvabsGY)をブラウザで直接確認した。

- 表示タイトル: `MJO Workshop 2026: Discussion — Breakout Discussion — Themes 3 + 4`
- 通常視聴画面の長さ: **1:00**、限定公開。
- 説明欄もThemes 3 + 4のbreakoutを示す。
- 対応する公式枠: **2026-10-27 16:30–18:00、Europe/Rome（CET、UTC+01:00）**。
- 10月28日11:00のThemes 3 + 4のplenaryとは区別した。
- 対応根拠は動画題名・説明と公式プログラムの照合。完全な録画、完全な議事記録、科学的内容の審査を意味しない。

動画詳細は、埋め込みプレーヤー、タイトルと長さ、セッション情報、科学要約、論点、関連質問、研究アクション、出典と確認状況の各欄を持つ。

## 科学的内容とCMSの境界

- 科学要約と論点は未審査のため確認待ち表示。動画説明の科学的提案を審査済み議事録の代用として転載していない。
- 質問の詳細は導線確認用のプレースホルダー。実際の質問や対立・合意を創作していない。
- 研究アクションは一般的なAIエージェント作業例。ワークショップの提案・合意・担当・期限・進捗・実施済み研究を意味しない。
- 既存Phase 3の科学契約・公開禁止ポリシー・seedは変更していない。科学レコードのCMS投入や公開は実施していない。
- 今回の事実情報と画面用コピーは`src/data/`とAstroページにある。科学情報をCMSから取り込む公開フローの完成を意味しない。
- サンプルの公開サイト掲載許諾・代表版の最終承認は確認待ち。限定公開動画であること自体を掲載許諾の根拠にしない。

## YouTubeとローカル再生

クリック後に`youtube-nocookie.com/embed/RPXnSvabsGY`を読み込む。画面幅に追従する16:9のiframeで、英語のプレーヤーUI、インライン再生、全画面操作を有効にした。YouTubeが要求する埋め込み元情報を送れるよう`strict-origin-when-cross-origin`を指定する。自動再生はしない。

**実再生を確認済み。** ローカル詳細画面で「Load YouTube player」→「Play video」を操作し、映像・英語字幕の表示、Pause操作、経過時間14秒から16秒への進行を確認した。HTTP成功だけで再生成功とは判定していない。全60秒の通し視聴や全ブラウザ・全地域での再生保証は検証範囲外。

## 検証結果

| 検査 | 結果 |
| --- | --- |
| `npm run typecheck` | 38ファイル、エラー・警告・ヒント0件 |
| `npm run build` | サーバービルド成功。上流管理画面bundleの500 kB超警告は継続 |
| `npm run test:science` | 既存59件すべて成功 |
| `npm run science:check` | 生成契約と一致 |
| `npm run verify:local` | ホーム・Posts・管理画面200、秘密ファイル3経路403 |
| `node scripts/verify-phase4-http.mjs` | 14画面200、英語、単一h1、ナビゲーション、原本DLなし、詳細の未知経路404 |
| 主導線 | Program → Video Highlight → Scientific Question → Research Actionを実クリックで完走 |
| 埋め込み動画 | ローカルサイト内で映像・字幕・経過時間を確認 |
| 390 px表示 | ホームを目視、残る13画面の横はみ出しなし |
| 320 px表示 | ホーム・プログラム・動画詳細・質問詳細・アクション詳細で横はみ出しなし。動画iframeも目視確認 |
| キーボード | Enterでトピックメニュー開閉、7リンク表示、スキップリンクでmainにフォーカス |
| 待受範囲 | `lsof`で`127.0.0.1:4321`のみ確認 |

再現例（プロジェクト内Node 24.22.2）:

```sh
PATH="$PWD/node_modules/.bin:$PATH" npm run dev
PATH="$PWD/node_modules/.bin:$PATH" npm run typecheck
PATH="$PWD/node_modules/.bin:$PATH" NODE_OPTIONS='--import ./scripts/loopback-only.mjs' npm run build
PATH="$PWD/node_modules/.bin:$PATH" npm run test:science
PATH="$PWD/node_modules/.bin:$PATH" npm run science:check
PATH="$PWD/node_modules/.bin:$PATH" npm run verify:local
node_modules/.bin/node scripts/verify-phase4-http.mjs
```

この実行環境ではsandboxが127.0.0.1の補助待受とHTTP接続をEPERMで拒否したため、ビルドとローカルHTTP検査は承認された制限外実行で成功を確認した。外部公開や待受の拡張はしていない。既存開発サーバーを再利用した。

`scripts/verify-science-http.mjs`はPhase 3当時の「プログラム未投入」という文言を検査する履歴的スクリプトで、今回のプログラム実装には適用しない。Phase 4の画面検査は新設`verify-phase4-http.mjs`を用いる。以前の記録とスクリプトは上書きしていない。

## バックアップと証跡

既存6ファイルはユーザー承認後、`backups/phase4-before-interface/`へ複製してから編集した。未追跡ファイルのバックアップは保持している。

Git除外されたローカル証跡:

- `.verification/phase4/home-desktop.png`
- `.verification/phase4/home-mobile.png`
- `.verification/phase4/video-playing.png`
- `.verification/phase4/action-mobile.png`
- `.verification/phase4/responsive-390.json`
- `.verification/phase4/responsive-320.json`

新規パッケージ追加、動画ファイル・原本資料のアップロード、外部デプロイ、トンネル、GitHub作成、commit、pushは実施していない。認証後の管理操作、公開用の科学データ投入、動画許諾確認は引き続き後続作業。
