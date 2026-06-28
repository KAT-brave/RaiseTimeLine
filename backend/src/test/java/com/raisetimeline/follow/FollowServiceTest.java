package com.raisetimeline.follow;

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

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * FollowServiceTest - フォローサービスの単体テスト
 *
 * ブラックボックス視点: フォロー・アンフォローの正常/異常
 * ホワイトボックス視点: 自分自身フォロー禁止・重複・存在チェックの分岐
 */
@ExtendWith(MockitoExtension.class)
class FollowServiceTest {

    @Mock FollowMapper followMapper;
    @Mock UserMapper userMapper;
    @InjectMocks FollowService followService;

    private User targetUser;

    @BeforeEach
    void setUp() {
        targetUser = new User();
        targetUser.setId(2L);
        targetUser.setUsername("targetUser");
    }

    @Test
    @DisplayName("follow: 正常系 - フォローが登録される")
    void follow_success() {
        when(userMapper.findById(2L)).thenReturn(Optional.of(targetUser));
        when(followMapper.existsByFollowerAndFollowing(1L, 2L)).thenReturn(false);

        assertThatCode(() -> followService.follow(2L, 1L)).doesNotThrowAnyException();
        verify(followMapper).insert(1L, 2L);
    }

    @Test
    @DisplayName("follow: 異常系 - 自分自身をフォローしようとすると422")
    void follow_self_throws422() {
        assertThatThrownBy(() -> followService.follow(1L, 1L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);

        verify(followMapper, never()).insert(anyLong(), anyLong());
    }

    @Test
    @DisplayName("follow: 異常系 - 存在しないユーザーをフォローしようとすると404")
    void follow_userNotFound_throws404() {
        when(userMapper.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> followService.follow(99L, 1L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("follow: 異常系 - すでにフォロー済みのユーザーをフォローすると422")
    void follow_alreadyFollowing_throws422() {
        when(userMapper.findById(2L)).thenReturn(Optional.of(targetUser));
        when(followMapper.existsByFollowerAndFollowing(1L, 2L)).thenReturn(true);

        assertThatThrownBy(() -> followService.follow(2L, 1L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);
    }

    @Test
    @DisplayName("unfollow: 正常系 - フォローが解除される")
    void unfollow_success() {
        when(userMapper.findById(2L)).thenReturn(Optional.of(targetUser));
        when(followMapper.existsByFollowerAndFollowing(1L, 2L)).thenReturn(true);

        assertThatCode(() -> followService.unfollow(2L, 1L)).doesNotThrowAnyException();
        verify(followMapper).deleteByFollowerAndFollowing(1L, 2L);
    }

    @Test
    @DisplayName("unfollow: 異常系 - フォローしていないユーザーをアンフォローすると404")
    void unfollow_notFollowing_throws404() {
        when(userMapper.findById(2L)).thenReturn(Optional.of(targetUser));
        when(followMapper.existsByFollowerAndFollowing(1L, 2L)).thenReturn(false);

        assertThatThrownBy(() -> followService.unfollow(2L, 1L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.NOT_FOUND);
    }
}
