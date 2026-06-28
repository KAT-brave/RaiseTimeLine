package com.raisetimeline.user;

import com.raisetimeline.support.MapperTestBase;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

/**
 * UserMapperTest - ユーザーMapperの統合テスト（Testcontainers + PostgreSQL）
 *
 * ILIKE（大文字小文字を区別しない検索）など PostgreSQL 固有の構文を検証する。
 */
@Transactional
class UserMapperTest extends MapperTestBase {

    @Autowired UserMapper userMapper;

    private User userA;
    private User userB;

    @BeforeEach
    void setUp() {
        userA = new User();
        userA.setUsername("Alice");
        userA.setEmail("alice@example.com");
        userA.setPasswordDigest("hashed");
        userMapper.insert(userA);

        userB = new User();
        userB.setUsername("Bob");
        userB.setEmail("bob@example.com");
        userB.setPasswordDigest("hashed");
        userMapper.insert(userB);
    }

    @Test
    @DisplayName("search: 大文字小文字を区別せず部分一致で検索できる（ILIKE）")
    void search_caseInsensitive_returnsMatch() {
        // "alice" で "Alice" がヒットすること
        List<User> result = userMapper.search("alice", userB.getId(), 20);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getUsername()).isEqualTo("Alice");
    }

    @Test
    @DisplayName("search: 自分自身は除外される")
    void search_excludesSelf() {
        // userA 自身で検索しても自分は除外される
        List<User> result = userMapper.search("Alice", userA.getId(), 20);
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("search: 一致しないキーワードは空リスト")
    void search_noMatch_returnsEmpty() {
        List<User> result = userMapper.search("zzz", userA.getId(), 20);
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("existsByEmail: 登録済みメールアドレスで true を返す")
    void existsByEmail_existingEmail_returnsTrue() {
        assertThat(userMapper.existsByEmail("alice@example.com")).isTrue();
    }

    @Test
    @DisplayName("existsByEmail: 未登録メールアドレスで false を返す")
    void existsByEmail_unknownEmail_returnsFalse() {
        assertThat(userMapper.existsByEmail("nobody@example.com")).isFalse();
    }

    @Test
    @DisplayName("findByEmail: 大文字小文字を区別せず検索できる")
    void findByEmail_caseInsensitive() {
        // メールはlowercaseで保存されているため小文字で検索
        Optional<User> result = userMapper.findByEmail("alice@example.com");
        assertThat(result).isPresent();
        assertThat(result.get().getUsername()).isEqualTo("Alice");
    }
}
