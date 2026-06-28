package com.raisetimeline.follow;

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
 * FollowMapperTest - フォローMapperの統合テスト（Testcontainers + PostgreSQL）
 */
@Transactional
class FollowMapperTest extends MapperTestBase {

    @Autowired FollowMapper followMapper;
    @Autowired UserMapper userMapper;

    private User follower;
    private User following;

    @BeforeEach
    void setUp() {
        follower = new User();
        follower.setUsername("follower");
        follower.setEmail("follower@example.com");
        follower.setPasswordDigest("hashed");
        userMapper.insert(follower);

        following = new User();
        following.setUsername("following");
        following.setEmail("following@example.com");
        following.setPasswordDigest("hashed");
        userMapper.insert(following);
    }

    @Test
    @DisplayName("insert: フォロー後に existsByFollowerAndFollowing が true を返す")
    void insert_thenExists() {
        followMapper.insert(follower.getId(), following.getId());
        assertThat(followMapper.existsByFollowerAndFollowing(follower.getId(), following.getId())).isTrue();
    }

    @Test
    @DisplayName("existsByFollowerAndFollowing: フォロー前は false を返す")
    void exists_beforeInsert_returnsFalse() {
        assertThat(followMapper.existsByFollowerAndFollowing(follower.getId(), following.getId())).isFalse();
    }

    @Test
    @DisplayName("deleteByFollowerAndFollowing: アンフォロー後に exists が false を返す")
    void delete_thenNotExists() {
        followMapper.insert(follower.getId(), following.getId());
        followMapper.deleteByFollowerAndFollowing(follower.getId(), following.getId());
        assertThat(followMapper.existsByFollowerAndFollowing(follower.getId(), following.getId())).isFalse();
    }

    @Test
    @DisplayName("countFollowing: フォロー数が正しくカウントされる")
    void countFollowing_returnsCorrectCount() {
        followMapper.insert(follower.getId(), following.getId());
        assertThat(followMapper.countFollowing(follower.getId())).isEqualTo(1);
        assertThat(followMapper.countFollowing(following.getId())).isEqualTo(0);
    }

    @Test
    @DisplayName("countFollowers: フォロワー数が正しくカウントされる")
    void countFollowers_returnsCorrectCount() {
        followMapper.insert(follower.getId(), following.getId());
        assertThat(followMapper.countFollowers(following.getId())).isEqualTo(1);
        assertThat(followMapper.countFollowers(follower.getId())).isEqualTo(0);
    }
}
