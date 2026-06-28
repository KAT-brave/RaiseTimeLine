package com.raisetimeline.comment;

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
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * CommentServiceTest - コメントサービスの単体テスト
 *
 * ブラックボックス視点: コメントCRUDの正常/異常
 * ホワイトボックス視点: 投稿存在チェック・コメント所有者チェックの分岐
 */
@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock CommentMapper commentMapper;
    @Mock PostMapper postMapper;
    @InjectMocks CommentService commentService;

    private Post post;
    private Comment comment;

    @BeforeEach
    void setUp() {
        post = new Post();
        post.setId(1L);
        post.setUserId(1L);

        comment = new Comment();
        comment.setId(10L);
        comment.setPostId(1L);
        comment.setUserId(1L);
        comment.setContent("テストコメント");
    }

    @Test
    @DisplayName("getComments: 異常系 - 存在しない投稿のコメント取得で404")
    void getComments_postNotFound_throws404() {
        when(postMapper.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> commentService.getComments(99L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("deleteComment: 正常系 - 自分のコメントを削除できる")
    void deleteComment_ownComment_success() {
        when(postMapper.findById(1L)).thenReturn(Optional.of(post));
        when(commentMapper.findById(10L)).thenReturn(comment);

        assertThatCode(() -> commentService.deleteComment(1L, 10L, 1L)).doesNotThrowAnyException();
        verify(commentMapper).deleteById(10L);
    }

    @Test
    @DisplayName("deleteComment: 異常系 - 他人のコメントを削除しようとすると403")
    void deleteComment_otherUserComment_throws403() {
        when(postMapper.findById(1L)).thenReturn(Optional.of(post));
        when(commentMapper.findById(10L)).thenReturn(comment); // comment.userId=1L

        assertThatThrownBy(() -> commentService.deleteComment(1L, 10L, 2L)) // 別ユーザー2L
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    @DisplayName("deleteComment: 異常系 - 存在しないコメントを削除しようとすると404")
    void deleteComment_commentNotFound_throws404() {
        when(postMapper.findById(1L)).thenReturn(Optional.of(post));
        when(commentMapper.findById(99L)).thenReturn(null);

        assertThatThrownBy(() -> commentService.deleteComment(1L, 99L, 1L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.NOT_FOUND);
    }
}
