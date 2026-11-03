# Phase 3 検証記録

確認日: 2026-11-01〜2026-11-02（Asia/Tokyo）。ローカル検証のみ。

## 完了した検証

| 項目 | 結果 |
| --- | --- |
| 契約・意味・参照・再取り込みのテスト | **59件成功、失敗0件** |
| 生成JSON／スキーマの一致 | `npm run science:check` 成功 |
| 型検査 | `npm run typecheck`: 20ファイル、エラー・警告・ヒント0件 |
| Nodeサーバービルド | 成功。下記のループバック限定環境で `npm run build` を実行 |
| EmDash公式seed検証 | 追加スキーマ・統合seedとも成功 |
| 隔離SQLiteへの実適用 | 8コレクション・124フィールド・2トピック作成成功 |
| 既存ローカルDBへの追加 | 同じ8コレクションを作成。ネイティブ参照関係24件。既存Posts/Pagesは保持 |
| 実EmDashの公開防止 | メモリ内DBの8コレクションで `PUBLISH_REJECTED` と `SCHEDULE_REJECTED` を確認（16判定） |
| HTTP作成／更新で公開状態を直接指定 | インストール済みEmDashの実HTTP入力スキーマが `status=published` を拒否することを確認 |
| 既存HTTPチェック | `/`、`/posts`、`/_emdash/admin/` が200・英語HTML。秘密ファイル3経路が403 |
| 追加HTTPチェック | `/program`、`/questions`、両トピックが200・英語・noindex。テスト文言／iframeなし。不明トピック404 |
| ブラウザ表示 | ホーム、科学的質問、時系列、AI研究、指標・診断、管理初期設定を目視確認 |
| 管理初期設定 | テンプレートが10コレクションと表示（既存2＋追加8）。サイトタイトルとtaglineを保持 |
| ローカル待受 | `lsof` で `127.0.0.1:4321` のみを確認 |
| 科学的データ投入 | **0件**。実DBの追加8テーブル、既存Posts/Pagesの全レコード数はいずれも0 |
| 外部操作 | デプロイ・トンネル・GitHub作成・push・commit・外部資料の送信なし |

## 再現コマンド

プロジェクト内のNode 24.22.2を使用する。新規パッケージのインストールやlockfile変更は行っていない。

```sh
npm run test:science
npm run science:check
npm run typecheck
node_modules/.bin/node --import ./tests/science-runtime-register.mjs tests/science-runtime.mjs
NODE_OPTIONS='--import ./scripts/loopback-only.mjs' npm run build
npm run verify:local
node_modules/.bin/node scripts/verify-science-http.mjs
```

HTTPチェックには127.0.0.1:4321で起動した開発サーバーが必要。公式seed検証は以下で再現できる。

```sh
node_modules/.bin/node node_modules/emdash/dist/cli/index.mjs seed seed/science-schema-v1.json --validate
```

`tests/science-runtime-register.mjs` はNode直接実行で存在しないAstroの仮想設定・`import.meta.env`だけを補う。データベース操作、スキーマ検証、公開・予約公開処理、フック実行はインストール済みEmDashを実際に使用する。テストレコードはメモリ内DBだけに存在し、実CMSへの作成・公開はしない。

## 実装中に解消した問題

- EmDash 1.4.0のAstro統合は、`definePlugin()`の結果をそのまま設定に渡す形式をビルドで拒否した。ファイルのentrypointを指定したnative descriptorと`createPlugin()`に修正し、ビルド成功と実ランタイムでの拒否を確認した。
- Astroのフォント補助HTTPサーバーがホスト未指定でlistenするため、制限環境では最初のビルドがEPERMになった。`scripts/loopback-only.mjs` をそのプロセスだけに読み込み、補助サーバーも127.0.0.1へ制限してビルドした。標準のbuildコマンドや依存パッケージは変更していない。
- 動画IDの異常系テストに当初使った文字列は11文字の許容文字であり、書式上は有効だった。実際に不正な形式へ修正した。IDの書式検査は動画の実在確認ではないため、実データには別途対応・目視・権利確認を要求する。

## 保持した記録

- 承認前差分: `.verification/phase3/integration.diff`
- 元ファイル・整合的SQLiteバックアップ: `backups/phase3-before-integration/`
- 隔離スキーマ確認DB: `.verification/phase3/schema-test.db`
- 画面記録: `.verification/phase3/questions.png`、`program.png`、`questions-wide.png`、`admin-setup.png`

いずれもローカルのGit除外対象。バックアップに暗号鍵は含めない。既存ファイルは未追跡であるため、バックアップを勝手に削除しない。

## 検証の限界と次段階

- 実ワークショップの科学的文章、文書の実ハッシュ、氏名、YouTube対応・権利は取り込んでいない。本テストは構造・制御・実EmDash適用を確認するものであり、科学的内容の正しさを検証したものではない。
- 承認メタデータは電子署名や本人確認ではない。Phase 3では全科学コレクションの公開を閉じたままにしている。
- 取り込みはJSON契約・検証・dry-run計画を実装済み。実CMSへの科学的レコード書き込み、CMS現状態との競合照合、変更された出典に依存する主張の再承認を含む公開手順は後続段階。
- ページは入口と未取り込み表示。索引生成ロジックはテスト済みだが、実資料を読む詳細ページ・検索・動画再生の完成を意味しない。
- 管理画面は初期設定フォームまで確認。利用者のメール・パスキーは作成しておらず、認証後の操作は未確認。
- 上流の管理画面バンドルについて500kB超のビルド警告が残る。ビルド失敗ではない。
- Phase 2に記録した依存監査所見は今回の範囲で再監査・修正していない。現行の安全性を再確認したという意味ではない。

[設計と判断の詳細](PHASE3_SCIENTIFIC_ARCHITECTURE.md)を参照する。
