package com.raisetimeline.user;

import com.raisetimeline.follow.FollowMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * UserServiceTest - ユーザーサービスの単体テスト
 *
 * ブラックボックス視点: 検索・取得・更新の正常/異常
 * ホワイトボックス視点: 自分/他人の更新権限チェック・空キーワード検索の分岐
 */
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock UserMapper userMapper;
    @Mock FollowMapper followMapper;
    @InjectMocks UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setBio("自己紹介");
    }

    @Test
    @DisplayName("getUser: 正常系 - ユーザー情報とフォロー数が返る")
    void getUser_success() {
        when(userMapper.findById(1L)).thenReturn(Optional.of(user));
        when(followMapper.countFollowing(1L)).thenReturn(5);
        when(followMapper.countFollowers(1L)).thenReturn(3);
        when(followMapper.existsByFollowerAndFollowing(anyLong(), anyLong())).thenReturn(false);

        UserResponse result = userService.getUser(1L, 2L);

        assertThat(result.getUsername()).isEqualTo("testuser");
        assertThat(result.getFollowingCount()).isEqualTo(5);
        assertThat(result.getFollowersCount()).isEqualTo(3);
    }

    @Test
    @DisplayName("getUser: 異常系 - 存在しないユーザーで404")
    void getUser_notFound_throws404() {
        when(userMapper.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUser(99L, 1L))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("updateUser: 異常系 - 他人のプロフィールを更新しようとすると403")
    void updateUser_otherUser_throws403() {
        UserUpdateRequest req = new UserUpdateRequest();
        req.setUsername("newname");

        assertThatThrownBy(() -> userService.updateUser(1L, req, 2L)) // 自分(2L)が他人(1L)を更新しようとする
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.FORBIDDEN);

        verify(userMapper, never()).update(any());
    }

    @Test
    @DisplayName("search: 境界値 - キーワードが空のとき空リストが返る")
    void search_emptyKeyword_returnsEmpty() {
        List<UserResponse> result = userService.search("", 1L);
        assertThat(result).isEmpty();
        verify(userMapper, never()).search(anyString(), anyLong(), anyInt());
    }

    @Test
    @DisplayName("search: 正常系 - キーワードに一致するユーザーが返る（自分とは別のユーザー）")
    void search_withKeyword_returnsUsers() {
        // 検索結果として自分とは別のユーザー(id=2L)を返す
        User otherUser = new User();
        otherUser.setId(2L);
        otherUser.setUsername("testuser2");

        when(userMapper.search("test", 1L, 20)).thenReturn(List.of(otherUser));
        when(followMapper.countFollowing(2L)).thenReturn(0);
        when(followMapper.countFollowers(2L)).thenReturn(0);
        when(followMapper.existsByFollowerAndFollowing(1L, 2L)).thenReturn(false);

        List<UserResponse> result = userService.search("test", 1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getUsername()).isEqualTo("testuser2");
    }
}
