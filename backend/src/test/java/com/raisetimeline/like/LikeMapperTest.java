package com.raisetimeline.like;

import com.raisetimeline.post.Post;
import com.raisetimeline.post.PostMapper;
import com.raisetimeline.support.MapperTestBase;
import com.raisetimeline.user.User;
import com.raisetimeline.user.UserMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.*;

/**
 * LikeMapperTest - いいねMapperの統合テスト（Testcontainers + PostgreSQL）
 */
@Transactional
class LikeMapperTest extends MapperTestBase {

    @Autowired LikeMapper likeMapper;
    @Autowired UserMapper userMapper;
    @Autowired PostMapper postMapper;

    private User user;
    private Post post;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setUsername("liker");
        user.setEmail("liker@example.com");
        user.setPasswordDigest("hashed");
        userMapper.insert(user);

        post = new Post();
        post.setUserId(user.getId());
        post.setContent("いいね対象の投稿");
        postMapper.insert(post);
    }

    @Test
    @DisplayName("insert: いいねが追加されて existsByPostAndUser が true を返す")
    void insert_thenExists() {
        likeMapper.insert(post.getId(), user.getId());
        assertThat(likeMapper.existsByPostAndUser(post.getId(), user.getId())).isTrue();
    }

    @Test
    @DisplayName("existsByPostAndUser: いいね前は false を返す")
    void exists_beforeInsert_returnsFalse() {
        assertThat(likeMapper.existsByPostAndUser(post.getId(), user.getId())).isFalse();
    }

    @Test
    @DisplayName("deleteByPostAndUser: いいねを削除すると existsByPostAndUser が false を返す")
    void delete_thenNotExists() {
        likeMapper.insert(post.getId(), user.getId());
        likeMapper.deleteByPostAndUser(post.getId(), user.getId());
        assertThat(likeMapper.existsByPostAndUser(post.getId(), user.getId())).isFalse();
    }
}
