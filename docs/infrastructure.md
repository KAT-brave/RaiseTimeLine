# インフラ構成

## 構成図

```
ユーザー
  │
  │ HTTPS (ポート443) / HTTP (ポート80)
  ▼
[ALB（Application Load Balancer）]
  │ ap-northeast-1 (東京)
  │
  │ HTTP (ポート8080)
  ▼
[EC2 (t3.micro)] ─── ap-northeast-1 (東京)
  │
  ├── nginx (リバースプロキシ)
  │     ├── /api  → Spring Boot (ポート8080)
  │     └── /     → React ビルド済み静的ファイル
  │
  └── Spring Boot API サーバー (ポート8080)
        └── profile=production

  │
  │ PostgreSQL (ポート5432)
  ▼
[RDS (PostgreSQL 16.x)] ─── ap-northeast-1 (東京)
  └── raisetimeline_production

  │
  │ HTTPS (AWS SDK / presigned URL)
  ▼
[S3]
  ├── 投稿画像バケット（post-images）
  └── アイコン画像バケット（user-avatars）
```

---

## サービス構成詳細

| サービス | 内容 | 備考 |
|---------|------|------|
| ALB | Application Load Balancer | HTTPS終端・EC2へのルーティング |
| EC2 | t3.micro / Ubuntu 22.04 / ap-northeast-1 | Springアプリ + Reactビルド成果物をホスト |
| RDS | PostgreSQL 16.x / t3.micro / ap-northeast-1 | EC2からのみアクセス許可 |
| S3 | 投稿画像・アイコン画像の保存 | presigned URLで直接アップロード |
| nginx | リバースプロキシ | `/api` → Spring Boot / それ以外 → React静的ファイル |

---

## ネットワーク構成

| 項目 | 設定 |
|-----|------|
| VPC | 専用VPC |
| ALB セキュリティグループ | HTTP(80) / HTTPS(443) を全開放 |
| EC2 セキュリティグループ | ALBからのHTTP(8080) / SSH(22) のみ許可 |
| RDS セキュリティグループ | EC2からのPostgreSQL(5432)接続のみ許可 |
| S3 バケットポリシー | 認証済みユーザーのみアップロード・取得可能 |

---

## 画像アップロードフロー（S3 presigned URL方式）

```
クライアント(React)
  │ 1. アップロード用presigned URLをリクエスト
  ▼
Spring Boot API
  │ 2. AWS SDK でS3 presigned URLを発行
  ▼
クライアント(React)
  │ 3. presigned URLに直接PUT（S3へ直接アップロード）
  ▼
S3
  │ 4. アップロード完了後、S3のURLをAPIに送信
  ▼
Spring Boot API → RDS（URLをDBに保存）
```

---

## 技術スタック

### バックエンド

| 役割 | 技術 | 選定理由 |
|------|------|---------|
| 言語 | Java | 型安全・学習目的に適している |
| フレームワーク | Spring Boot | Java標準のWebフレームワーク・本番実績豊富 |
| 認証 | JWT（jjwt） | ステートレスな認証・フロントとの分離に適している |
| ORM | Spring Data JPA / Hibernate | SQLを意識せずエンティティでDB操作が可能 |
| DBマイグレーション | Flyway | バージョン管理されたDBスキーマ管理 |

### フロントエンド

| 役割 | 技術 | 選定理由 |
|------|------|---------|
| フレームワーク | React | コンポーネントベースのUI構築・学習リソースが豊富 |
| 言語 | TypeScript | 型安全・補完が効くことでバグを事前に防げる |
| 状態管理 | React Context API / useState | 外部ライブラリなしでログイン状態をアプリ全体で共有 |

### インフラ

| 役割 | 技術 |
|------|------|
| クラウド | AWS |
| ストレージ | Amazon S3 |
| ロードバランサー | ALB（Application Load Balancer） |
| サーバー | EC2（t3.micro） |
| DB | RDS（PostgreSQL 16.x） |

---

## 注意事項

- 現時点ではAWSでのサーバー構築は検討中のため、本構成は将来的な参考として作成
- ローカル開発環境ではDockerを使用してSpring Boot + PostgreSQLを起動する想定
- S3の利用は確定。画像の保存先として使用する
