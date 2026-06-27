-- E2Eテスト用データをクリーンアップ

DELETE FROM comments  WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'e2euser_%');
DELETE FROM likes     WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'e2euser_%');
DELETE FROM follows   WHERE follower_id  IN (SELECT id FROM users WHERE username LIKE 'e2euser_%')
                         OR following_id IN (SELECT id FROM users WHERE username LIKE 'e2euser_%');
DELETE FROM posts     WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'e2euser_%');
DELETE FROM users     WHERE username LIKE 'e2euser_%';

SELECT '✅ E2Eクリーンアップ完了' AS result;
