package com.raisetimeline.auth;

import com.raisetimeline.security.JwtUtil;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * AuthServiceTest - 認証サービスの単体テスト
 *
 * ブラックボックス視点: 入力に対して正しいレスポンス（トークン、エラー）が返るか
 * ホワイトボックス視点: 重複チェック・パスワード照合の分岐が正しく通るか
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UserMapper userMapper;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtUtil jwtUtil;
    @InjectMocks AuthService authService;

    private SignupRequest signupReq;
    private LoginRequest loginReq;
    private User existingUser;

    @BeforeEach
    void setUp() {
        signupReq = new SignupRequest();
        signupReq.setUsername("testuser");
        signupReq.setEmail("test@example.com");
        signupReq.setPassword("password123");

        loginReq = new LoginRequest();
        loginReq.setEmail("test@example.com");
        loginReq.setPassword("password123");

        existingUser = new User();
        existingUser.setId(1L);
        existingUser.setUsername("testuser");
        existingUser.setEmail("test@example.com");
        existingUser.setPasswordDigest("hashed");
    }

    // ========== signup ==========

    @Test
    @DisplayName("signup: 正常系 - 新規ユーザーが登録されてトークンが返る")
    void signup_success() {
        when(userMapper.existsByEmail(anyString())).thenReturn(false);
        when(userMapper.existsByUsername(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed");
        when(jwtUtil.generateToken(any())).thenReturn("jwt-token");

        AuthResponse result = authService.signup(signupReq);

        assertThat(result.getToken()).isEqualTo("jwt-token");
        assertThat(result.getUser().getUsername()).isEqualTo("testuser");
        verify(userMapper).insert(any(User.class));
    }

    @Test
    @DisplayName("signup: 異常系 - メールアドレス重複で422エラー")
    void signup_duplicateEmail_throws422() {
        when(userMapper.existsByEmail("test@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.signup(signupReq))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);

        verify(userMapper, never()).insert(any());
    }

    @Test
    @DisplayName("signup: 異常系 - ユーザー名重複で422エラー")
    void signup_duplicateUsername_throws422() {
        when(userMapper.existsByEmail(anyString())).thenReturn(false);
        when(userMapper.existsByUsername("testuser")).thenReturn(true);

        assertThatThrownBy(() -> authService.signup(signupReq))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);
    }

    // ========== login ==========

    @Test
    @DisplayName("login: 正常系 - 正しい認証情報でトークンが返る")
    void login_success() {
        when(userMapper.findByEmail("test@example.com")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("password123", "hashed")).thenReturn(true);
        when(jwtUtil.generateToken(1L)).thenReturn("jwt-token");

        AuthResponse result = authService.login(loginReq);

        assertThat(result.getToken()).isEqualTo("jwt-token");
    }

    @Test
    @DisplayName("login: 異常系 - パスワード不一致で401エラー")
    void login_wrongPassword_throws401() {
        when(userMapper.findByEmail("test@example.com")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        assertThatThrownBy(() -> authService.login(loginReq))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    @DisplayName("login: 異常系 - 存在しないメールで401エラー")
    void login_userNotFound_throws401() {
        when(userMapper.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(loginReq))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(e -> ((ResponseStatusException) e).getStatusCode())
                .isEqualTo(HttpStatus.UNAUTHORIZED);
    }
}
