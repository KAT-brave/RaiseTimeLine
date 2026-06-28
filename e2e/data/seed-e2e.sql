-- E2Eテスト用シードデータ

-- 既存データをクリーンアップ
DELETE FROM comments  WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'e2euser_%');
DELETE FROM likes     WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'e2euser_%');
DELETE FROM follows   WHERE follower_id  IN (SELECT id FROM users WHERE username LIKE 'e2euser_%')
                         OR following_id IN (SELECT id FROM users WHERE username LIKE 'e2euser_%');
DELETE FROM posts     WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'e2euser_%');
DELETE FROM users     WHERE username LIKE 'e2euser_%';

-- 3ユーザーを挿入（パスワード: E2eTestPass1）
INSERT INTO users (username, email, password_digest, bio, created_at, updated_at) VALUES
  ('e2euser_alice',   'e2euser_alice@e2e.test',   '$2b$10$TPNLQ4wGdyGYWIpXvh6hhO0HMIe3zoMEhfFBuQMqOUJXCiNCJXE/u', 'E2Eテストユーザー Alice', NOW(), NOW()),
  ('e2euser_bob',     'e2euser_bob@e2e.test',     '$2b$10$TPNLQ4wGdyGYWIpXvh6hhO0HMIe3zoMEhfFBuQMqOUJXCiNCJXE/u', 'E2Eテストユーザー Bob',   NOW(), NOW()),
  ('e2euser_charlie', 'e2euser_charlie@e2e.test', '$2b$10$TPNLQ4wGdyGYWIpXvh6hhO0HMIe3zoMEhfFBuQMqOUJXCiNCJXE/u', 'E2Eテストユーザー Charlie', NOW(), NOW());

SELECT '✅ E2Eシード完了' AS result;
