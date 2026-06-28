package com.raisetimeline.support;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

/**
 * Mapperテスト用基底クラス。
 * EmbeddedPostgres（バイナリ内包）で実際の PostgreSQL を起動し、
 * Flyway マイグレーションを実行した上で SQL の動作を検証する。
 * Docker 不要で動作する。
 */
@SpringBootTest
@Import(EmbeddedPostgresConfig.class)
@ActiveProfiles("test")
public abstract class MapperTestBase {
}
