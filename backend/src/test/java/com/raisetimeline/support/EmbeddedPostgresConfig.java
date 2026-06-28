package com.raisetimeline.support;

import io.zonky.test.db.postgres.embedded.EmbeddedPostgres;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

/**
 * Mapperテスト用のデータソース設定。
 * EmbeddedPostgres でバイナリ内包の PostgreSQL を起動する（Docker不要）。
 */
@TestConfiguration
public class EmbeddedPostgresConfig {

    @Bean
    @Primary
    public DataSource dataSource() throws Exception {
        return EmbeddedPostgres.start().getPostgresDatabase();
    }
}
