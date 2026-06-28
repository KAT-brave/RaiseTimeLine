-- パフォーマンステスト用データを削除（perfuser_ プレフィックスで識別）

DELETE FROM comments
  WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'perfuser_%');

DELETE FROM likes
  WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'perfuser_%');

DELETE FROM follows
  WHERE follower_id  IN (SELECT id FROM users WHERE username LIKE 'perfuser_%')
     OR following_id IN (SELECT id FROM users WHERE username LIKE 'perfuser_%');

DELETE FROM posts
  WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'perfuser_%');

DELETE FROM users
  WHERE username LIKE 'perfuser_%';

SELECT '✅ クリーンアップ完了' AS result;
