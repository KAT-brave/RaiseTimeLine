package com.raisetimeline.like;

import com.raisetimeline.post.Post;
import com.raisetimeline.post.PostMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * LikeServiceTest - いいねサービスの単体テスト
 *
 * ブラックボックス視点: いいね追加・取り消しの正常/異常
 * ホワイトボックス視点: 存在チェック・重複チェックの分岐
 */
@ExtendWith(MockitoExtension.class)
class LikeServiceTest {

    @Mock LikeMapper likeMapper;
    @Mock PostMapper postMapper;
    @InjectMocks LikeService likeService;

    private Post post;

    @BeforeEach
    void setUp() {
        post = new Post();
        post.setId(1L);
        post.setUserId(2L);
    }

    @Test
    @DisplayName("addLike: 正常系 - いいねが追加される")
    void addLike_success() {
        when(postMapper.findById(1L)).thenReturn(Optional.of(post));
        when(likeMapper.existsByPostAndUser(1L, 10L)).thenReturn(false);

        assertThatCode(() -> likeService.addLike(1L, 10L)).doesNotThrowAnyException();
        verify(likeMapper).insert(1L, 10L);
    }

    @Test
    @DisplayName("addLike: 異常系 - 同じ投稿に2回いいねすると422")
    void addLike_duplicate_throws422() {
        when(postMapper.findById(1L)).thenReturn(Optional.of(post));
        when(likeMapper.existsByPostAndUser(1L, 10L)).thenReturn(true);

        assertThatThrownBy(() -> likeService.addLike(1L, 10L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);

        verify(likeMapper, never()).insert(anyLong(), anyLong());
    }

    @Test
    @DisplayName("addLike: 異常系 - 存在しない投稿へのいいねで404")
    void addLike_postNotFound_throws404() {
        when(postMapper.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> likeService.addLike(99L, 10L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("removeLike: 正常系 - いいねが取り消される")
    void removeLike_success() {
        when(postMapper.findById(1L)).thenReturn(Optional.of(post));
        when(likeMapper.existsByPostAndUser(1L, 10L)).thenReturn(true);

        assertThatCode(() -> likeService.removeLike(1L, 10L)).doesNotThrowAnyException();
        verify(likeMapper).deleteByPostAndUser(1L, 10L);
    }

    @Test
    @DisplayName("removeLike: 異常系 - いいねしていない投稿の取り消しで404")
    void removeLike_notLiked_throws404() {
        when(postMapper.findById(1L)).thenReturn(Optional.of(post));
        when(likeMapper.existsByPostAndUser(1L, 10L)).thenReturn(false);

        assertThatThrownBy(() -> likeService.removeLike(1L, 10L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.NOT_FOUND);
    }
}
