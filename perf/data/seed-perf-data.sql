-- パフォーマンステスト用シードデータ
-- perfuser_001 〜 perfuser_100 の100名を作成

-- 既存のperfuserデータを削除してからシード
DELETE FROM comments WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'perfuser_%');
DELETE FROM likes WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'perfuser_%');
DELETE FROM follows WHERE follower_id IN (SELECT id FROM users WHERE username LIKE 'perfuser_%') OR following_id IN (SELECT id FROM users WHERE username LIKE 'perfuser_%');
DELETE FROM posts WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'perfuser_%');
DELETE FROM users WHERE username LIKE 'perfuser_%';

-- ユーザー100名を挿入
INSERT INTO users (username, email, password_digest, bio, created_at, updated_at) VALUES
  ('perfuser_001', 'perfuser001@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_002', 'perfuser002@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_003', 'perfuser003@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_004', 'perfuser004@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_005', 'perfuser005@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_006', 'perfuser006@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_007', 'perfuser007@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_008', 'perfuser008@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_009', 'perfuser009@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_010', 'perfuser010@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_011', 'perfuser011@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_012', 'perfuser012@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_013', 'perfuser013@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_014', 'perfuser014@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_015', 'perfuser015@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_016', 'perfuser016@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_017', 'perfuser017@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_018', 'perfuser018@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_019', 'perfuser019@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_020', 'perfuser020@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_021', 'perfuser021@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_022', 'perfuser022@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_023', 'perfuser023@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_024', 'perfuser024@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_025', 'perfuser025@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_026', 'perfuser026@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_027', 'perfuser027@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_028', 'perfuser028@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_029', 'perfuser029@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_030', 'perfuser030@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_031', 'perfuser031@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_032', 'perfuser032@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_033', 'perfuser033@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_034', 'perfuser034@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_035', 'perfuser035@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_036', 'perfuser036@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_037', 'perfuser037@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_038', 'perfuser038@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_039', 'perfuser039@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_040', 'perfuser040@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_041', 'perfuser041@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_042', 'perfuser042@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_043', 'perfuser043@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_044', 'perfuser044@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_045', 'perfuser045@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_046', 'perfuser046@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_047', 'perfuser047@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_048', 'perfuser048@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_049', 'perfuser049@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_050', 'perfuser050@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_051', 'perfuser051@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_052', 'perfuser052@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_053', 'perfuser053@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_054', 'perfuser054@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_055', 'perfuser055@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_056', 'perfuser056@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_057', 'perfuser057@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_058', 'perfuser058@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_059', 'perfuser059@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_060', 'perfuser060@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_061', 'perfuser061@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_062', 'perfuser062@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_063', 'perfuser063@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_064', 'perfuser064@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_065', 'perfuser065@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_066', 'perfuser066@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_067', 'perfuser067@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_068', 'perfuser068@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_069', 'perfuser069@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_070', 'perfuser070@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_071', 'perfuser071@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_072', 'perfuser072@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_073', 'perfuser073@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_074', 'perfuser074@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_075', 'perfuser075@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_076', 'perfuser076@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_077', 'perfuser077@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_078', 'perfuser078@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_079', 'perfuser079@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_080', 'perfuser080@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_081', 'perfuser081@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_082', 'perfuser082@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_083', 'perfuser083@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_084', 'perfuser084@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_085', 'perfuser085@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_086', 'perfuser086@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_087', 'perfuser087@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_088', 'perfuser088@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_089', 'perfuser089@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_090', 'perfuser090@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_091', 'perfuser091@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_092', 'perfuser092@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_093', 'perfuser093@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_094', 'perfuser094@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_095', 'perfuser095@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_096', 'perfuser096@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_097', 'perfuser097@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_098', 'perfuser098@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_099', 'perfuser099@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW()),
  ('perfuser_100', 'perfuser100@perf.test', '$2b$10$A7A2/AuFd3V34j546LM93O2NDnVM74xdMI8Q3gwCnguQ3Y1Mx9riS', 'パフォーマンステスト用ユーザー', NOW(), NOW());

-- 投稿10,000件（perfuser_001〜perfuser_050に分散）
INSERT INTO posts (user_id, content, created_at, updated_at)
SELECT
  u.id,
  'パフォーマンステスト投稿 #' || g.n,
  NOW() - (random() * INTERVAL '30 days'),
-- 投稿10,000件（perfuser_001〜perfuser_050に分散）
INSERT INTO posts (user_id, content, created_at, updated_at)
SELECT
  (SELECT id FROM users WHERE username = 'perfuser_' || LPAD(((g.n % 50) + 1)::text, 3, '0')),
  'パフォーマンステスト投稿 ' || g.n || ' テキストテキストテキスト',
  NOW() - ((random() * 30) || ' days')::interval,
  NOW() - ((random() * 30) || ' days')::interval
FROM generate_series(1, 10000) AS g(n);

-- フォロー関係（各ユーザーが20名をフォロー）
INSERT INTO follows (follower_id, following_id, created_at)
SELECT DISTINCT
  u1.id AS follower_id,
  u2.id AS following_id,
  NOW() - ((random() * 30) || ' days')::interval
FROM
  (SELECT id FROM users WHERE username LIKE 'perfuser_%') u1,
  (SELECT id FROM users WHERE username LIKE 'perfuser_%') u2,
  generate_series(1, 1) g
WHERE u1.id != u2.id
  AND random() < 0.2
ON CONFLICT DO NOTHING;

-- いいね20,000件
INSERT INTO likes (post_id, user_id, created_at)
SELECT DISTINCT
  p.id AS post_id,
  u.id AS user_id,
  NOW() - ((random() * 30) || ' days')::interval
FROM
  (SELECT id FROM posts WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'perfuser_%') ORDER BY random() LIMIT 2000) p,
  (SELECT id FROM users WHERE username LIKE 'perfuser_%' ORDER BY random() LIMIT 50) u
WHERE random() < 0.2
ON CONFLICT DO NOTHING;

-- コメント5,000件
INSERT INTO comments (post_id, user_id, content, created_at, updated_at)
SELECT
  p.id,
  u.id,
  'テストコメント ' || generate_series,
  NOW() - ((random() * 30) || ' days')::interval,
  NOW() - ((random() * 30) || ' days')::interval
FROM generate_series(1, 5000)
JOIN (SELECT id FROM posts WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'perfuser_%') ORDER BY random() LIMIT 5000) p ON true,
     (SELECT id FROM users WHERE username LIKE 'perfuser_%' ORDER BY random() LIMIT 1) u;

SELECT '✅ シード完了: ' || count(*) || ' ユーザー' FROM users WHERE username LIKE 'perfuser_%';
