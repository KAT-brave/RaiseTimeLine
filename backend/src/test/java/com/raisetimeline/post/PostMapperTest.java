package com.raisetimeline.post;

import com.raisetimeline.follow.FollowMapper;
import com.raisetimeline.support.MapperTestBase;
import com.raisetimeline.user.User;
import com.raisetimeline.user.UserMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.*;

/**
 * PostMapperTest - 投稿Mapperの統合テスト（Testcontainers + PostgreSQL）
 *
 * 実際のSQLが正しく動作するかを検証する。
 * ILIKE・EXISTS サブクエリ・JOIN など PostgreSQL 固有の構文を含む。
 */
@Transactional
class PostMapperTest extends MapperTestBase {

    @Autowired PostMapper postMapper;
    @Autowired UserMapper userMapper;
    @Autowired FollowMapper followMapper;

    private User userA;
    private User userB;
    private Post postByA;
    private Post postByB;

    @BeforeEach
    void setUp() {
        userA = new User();
        userA.setUsername("userA");
        userA.setEmail("a@example.com");
        userA.setPasswordDigest("hashed");
        userMapper.insert(userA);

        userB = new User();
        userB.setUsername("userB");
        userB.setEmail("b@example.com");
        userB.setPasswordDigest("hashed");
        userMapper.insert(userB);

        postByA = new Post();
        postByA.setUserId(userA.getId());
        postByA.setContent("AさんのPost");
        postMapper.insert(postByA);

        postByB = new Post();
        postByB.setUserId(userB.getId());
        postByB.setContent("BさんのPost");
        postMapper.insert(postByB);
    }

    @Test
    @DisplayName("findAllWithUser: 全ユーザーの投稿が取得される")
    void findAllWithUser_returnsAllPosts() {
        List<PostWithUser> result = postMapper.findAllWithUser(10, 0, userA.getId());

        assertThat(result).hasSize(2);
        assertThat(result).extracting(PostWithUser::getContent)
                .containsExactlyInAnyOrder("AさんのPost", "BさんのPost");
    }

    @Test
    @DisplayName("findAllWithUser: ページネーション - offsetが正しく機能する")
    void findAllWithUser_pagination_works() {
        // 新着順で並ぶので offset=1 なら2件目のみ
        List<PostWithUser> result = postMapper.findAllWithUser(1, 1, userA.getId());
        assertThat(result).hasSize(1);
    }

    @Test
    @DisplayName("findFollowingWithUser: フォロー中のユーザーの投稿のみ返る（フォローなし時は0件）")
    void findFollowingWithUser_noFollows_returnsEmpty() {
        // userA は誰もフォローしていない
        List<PostWithUser> result = postMapper.findFollowingWithUser(10, 0, userA.getId());
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("findFollowingWithUser: フォロー中のユーザーの投稿のみ返る")
    void findFollowingWithUser_withFollows_returnsOnlyFollowedPosts() {
        // userA が userB をフォロー
        followMapper.insert(userA.getId(), userB.getId());

        List<PostWithUser> result = postMapper.findFollowingWithUser(10, 0, userA.getId());

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getContent()).isEqualTo("BさんのPost");
    }

    @Test
    @DisplayName("countAfter: 指定IDより新しい投稿件数を返す")
    void countAfter_returnsCorrectCount() {
        // postByA が先に作られたので postByB.id > postByA.id
        int count = postMapper.countAfter(postByA.getId());
        assertThat(count).isEqualTo(1); // postByB の分
    }
}
