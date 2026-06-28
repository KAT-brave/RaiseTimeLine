# RaiseTimeLine パフォーマンステスト

K6 を使ったバックエンド API のパフォーマンステスト。任意のタイミングで手動実行する形式。

## 言語について

テストスクリプトは **JavaScript** で記述しています。
K6 公式は JavaScript を標準言語として採用しており、TypeScript はネイティブサポートされていません。TypeScript を使う場合は webpack/esbuild によるトランスパイルが必要になるため、シンプルさを優先して JavaScript を使用しています。

## 前提条件

- k6 がインストール済みであること
- Docker Compose でバックエンドが起動済みであること
- psql コマンドが利用可能であること（テストデータのシード・クリーンアップ用）

## セットアップ

### 1. k6 のインストール（初回のみ）

```bash
brew install k6
```

### 2. npm パッケージのインストール（初回のみ）

```bash
cd perf
npm install
```

### 3. バックエンド起動

```bash
# プロジェクトルートで実行
docker compose up -d
cd backend && ./gradlew bootRun
```

## テストデータの準備

### シード投入（初回 or DB リセット後）

```bash
cd perf
PGPASSWORD=password npm run seed
```

- テストユーザー 100 名（perfuser_001〜perfuser_100）
- 投稿 10,000 件
- フォロー関係（各ユーザー約 20 名をフォロー）
- いいね 20,000 件 / コメント 5,000 件

### クリーンアップ（テスト完了後）

```bash
cd perf
PGPASSWORD=password npm run cleanup
```

## テスト実行

```bash
cd perf

# 通常負荷テスト（推奨: 最初に実行）
# 50VU、合計 14 分
npm run test:load

# ストレステスト（限界探索）
# 10 → 200VU まで段階的増加、合計約 23 分
npm run test:stress

# スパイクテスト（急激な負荷変動）
# 10VU ↔ 100〜150VU を繰り返す、合計 8 分
npm run test:spike

# 直接実行も可能
k6 run scripts/load-test.js
```

### 環境変数でベース URL を変更する場合

```bash
BASE_URL=http://staging.example.com npm run test:load
# または
k6 run -e BASE_URL=http://staging.example.com scripts/load-test.js
```

## レポートの確認

テスト完了後、`results/` ディレクトリに HTML レポートが生成されます。

```
results/
  load-test-report.html    # 通常負荷テストレポート
  stress-test-report.html  # ストレステストレポート
  spike-test-report.html   # スパイクテストレポート
```

ブラウザで開いて確認してください。

## パフォーマンス合格基準

| エンドポイント | p95 目標 |
|---|---|
| GET /api/v1/posts（タイムライン） | < 500ms |
| POST /api/v1/auth/login | < 800ms |
| POST /api/v1/posts | < 1000ms |
| POST /api/v1/posts/{id}/like | < 300ms |
| GET /api/v1/posts/{id}/comments | < 500ms |
| GET /api/v1/users/{username} | < 400ms |
| 全体エラー率 | < 1% |
| 全体平均レスポンスタイム | < 500ms |

## ディレクトリ構成

```
perf/
  package.json          # npm scripts 定義
  scripts/
    load-test.js        # 通常負荷テスト
    stress-test.js      # ストレステスト
    spike-test.js       # スパイクテスト
  scenarios/
    auth.js             # ログイン共通モジュール
    timeline.js         # タイムライン閲覧
    post.js             # 投稿作成
    interaction.js      # いいね・コメント
    profile.js          # プロフィール閲覧
  config/
    config.js           # ベース URL 設定
    thresholds.js       # 合格基準定義
  data/
    users.json          # テストユーザー認証情報
    seed-perf-data.sql  # シード SQL
    cleanup-perf-data.sql  # クリーンアップ SQL
  results/              # レポート出力先（.gitignore 対象）
```
