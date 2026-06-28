package com.raisetimeline.post;

import com.raisetimeline.user.User;
import com.raisetimeline.user.UserMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * PostServiceTest - 投稿サービスの単体テスト
 *
 * ブラックボックス視点: タイムライン取得・CRUD の正常系・異常系
 * ホワイトボックス視点: type=global/following の分岐, 権限チェック (自分/他人) の分岐
 */
@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock PostMapper postMapper;
    @Mock UserMapper userMapper;
    @InjectMocks PostService postService;

    private Post post;
    private User author;
    private PostWithUser postWithUser;

    @BeforeEach
    void setUp() {
        author = new User();
        author.setId(1L);
        author.setUsername("author");

        post = new Post();
        post.setId(10L);
        post.setUserId(1L);
        post.setContent("テスト投稿");
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());

        postWithUser = new PostWithUser();
        postWithUser.setId(10L);
        postWithUser.setUserId(1L);
        postWithUser.setContent("テスト投稿");
        postWithUser.setUsername("author");
        postWithUser.setCreatedAt(LocalDateTime.now());
        postWithUser.setUpdatedAt(LocalDateTime.now());
    }

    // ========== getTimeline ==========

    @Test
    @DisplayName("getTimeline: global - findAllWithUser が呼ばれる")
    void getTimeline_global_callsFindAll() {
        when(postMapper.findAllWithUser(anyInt(), anyInt(), anyLong()))
                .thenReturn(List.of(postWithUser));

        PostsResponse result = postService.getTimeline(0, 20, 1L, "global");

        assertThat(result.getPosts()).hasSize(1);
        verify(postMapper).findAllWithUser(21, 0, 1L);
        verify(postMapper, never()).findFollowingWithUser(anyInt(), anyInt(), anyLong());
    }

    @Test
    @DisplayName("getTimeline: following - findFollowingWithUser が呼ばれる")
    void getTimeline_following_callsFindFollowing() {
        when(postMapper.findFollowingWithUser(anyInt(), anyInt(), anyLong()))
                .thenReturn(List.of());

        PostsResponse result = postService.getTimeline(0, 20, 1L, "following");

        assertThat(result.getPosts()).isEmpty();
        verify(postMapper).findFollowingWithUser(21, 0, 1L);
        verify(postMapper, never()).findAllWithUser(anyInt(), anyInt(), anyLong());
    }

    @Test
    @DisplayName("getTimeline: hasNext=true - size+1件取得時に次ページありと判定される")
    void getTimeline_hasNext_whenMoreThanPageSize() {
        // size=2 のとき3件返ってきたら hasNext=true
        PostWithUser p2 = new PostWithUser(); p2.setId(2L); p2.setCreatedAt(LocalDateTime.now()); p2.setUpdatedAt(LocalDateTime.now());
        PostWithUser p3 = new PostWithUser(); p3.setId(3L); p3.setCreatedAt(LocalDateTime.now()); p3.setUpdatedAt(LocalDateTime.now());
        when(postMapper.findAllWithUser(3, 0, 1L)).thenReturn(List.of(postWithUser, p2, p3));

        PostsResponse result = postService.getTimeline(0, 2, 1L, "global");

        assertThat(result.isHasNext()).isTrue();
        assertThat(result.getPosts()).hasSize(2);
    }

    // ========== createPost ==========

    @Test
    @DisplayName("createPost: 正常系 - 投稿が作成されてレスポンスが返る")
    void createPost_success() {
        PostRequest req = new PostRequest();
        req.setContent("新しい投稿");
        when(postMapper.findById(any())).thenReturn(Optional.of(post));
        when(userMapper.findById(1L)).thenReturn(Optional.of(author));

        PostResponse result = postService.createPost(req, 1L);

        verify(postMapper).insert(any(Post.class));
        assertThat(result).isNotNull();
    }

    // ========== updatePost / deletePost 権限チェック ==========

    @Test
    @DisplayName("updatePost: 異常系 - 他人の投稿を編集しようとすると403")
    void updatePost_otherUserPost_throws403() {
        PostRequest req = new PostRequest();
        req.setContent("改ざん");
        when(postMapper.findById(10L)).thenReturn(Optional.of(post)); // post.userId=1L

        assertThatThrownBy(() -> postService.updatePost(10L, req, 2L)) // 別ユーザー2L
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    @DisplayName("deletePost: 異常系 - 存在しない投稿を削除しようとすると404")
    void deletePost_notFound_throws404() {
        when(postMapper.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> postService.deletePost(99L, 1L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("deletePost: 正常系 - 自分の投稿を削除できる")
    void deletePost_ownPost_success() {
        when(postMapper.findById(10L)).thenReturn(Optional.of(post));

        assertThatCode(() -> postService.deletePost(10L, 1L)).doesNotThrowAnyException();
        verify(postMapper).deleteById(10L);
    }
}
