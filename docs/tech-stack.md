# 技術スタック

## バックエンド

| 役割 | 技術 | バージョン（目安） | 選定理由 |
|------|------|-----------------|---------|
| 言語 | Java | 21 | 型安全・学習目的に適している |
| フレームワーク | Spring Boot | 3.x | Java標準のWebフレームワーク・本番実績豊富 |
| 認証 | JWT（jjwt） | 0.12.x | ステートレスな認証・フロントとの分離に適している |
| パスワード暗号化 | bcrypt（Spring Security） | Spring Boot同梱 | Spring Securityと統合・安全なハッシュ化 |
| ORM | Spring Data JPA / Hibernate | Spring Boot同梱 | SQLを意識せずエンティティでDB操作が可能 |
| DBマイグレーション | Flyway | 9.x | バージョン管理されたDBスキーマ管理 |
| ビルドツール | Gradle | 8.x | 依存関係管理・ビルド自動化 |

---

## フロントエンド

| 役割 | 技術 | バージョン（目安） | 選定理由 |
|------|------|-----------------|---------|
| フレームワーク | React | 18.x | コンポーネントベースのUI構築・学習リソースが豊富 |
| 言語 | TypeScript | 5.x | 型安全・補完が効くことでバグを事前に防げる |
| 状態管理 | React Context API / useState | React同梱 | 外部ライブラリなしでログイン状態をアプリ全体で共有 |
| HTTPクライアント | Fetch API / Axios | - | APIリクエストの送受信 |

---

## データベース

| 役割 | 技術 | バージョン（目安） | 選定理由 |
|------|------|-----------------|---------|
| RDBMS | PostgreSQL | 16.x | 高機能・ILIKE検索対応・RDS対応 |

---

## インフラ・クラウド

| 役割 | 技術 | 備考 |
|------|------|------|
| クラウド | AWS | |
| 画像ストレージ | Amazon S3 | 投稿画像・アイコン画像の保存（確定） |
| ロードバランサー | ALB（Application Load Balancer） | HTTPS終端（検討中） |
| サーバー | EC2（t3.micro） | Spring Boot + React静的ファイルをホスト（検討中） |
| DB | RDS（PostgreSQL 16.x） | EC2からのみアクセス（検討中） |
| Webサーバー | nginx | リバースプロキシ（/api → Spring Boot / それ以外 → React）（検討中） |

> AWS S3の利用は確定。EC2・RDS・ALBはAWSでのサーバー構築として検討中。

---

## 開発環境

| 役割 | 技術 |
|------|------|
| コンテナ | Docker / Docker Compose |
| IDE | IntelliJ IDEA / VSCode |
| バージョン管理 | Git / GitHub |
