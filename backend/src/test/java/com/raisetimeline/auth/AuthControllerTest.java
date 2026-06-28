package com.raisetimeline.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.raisetimeline.config.SecurityConfig;
import com.raisetimeline.security.JwtUtil;
import com.raisetimeline.user.UserMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * AuthControllerTest - 認証コントローラーのHTTPレイヤーテスト
 *
 * ブラックボックス視点: HTTPステータスコード・レスポンスボディの検証
 * バリデーション: 必須項目・メール形式・パスワード最小文字数
 */
@WebMvcTest(AuthController.class)
@Import(SecurityConfig.class)
class AuthControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @MockitoBean AuthService authService;
    @MockitoBean JwtUtil jwtUtil;
    @MockitoBean UserMapper userMapper;

    private static final AuthResponse MOCK_RESPONSE =
            new AuthResponse("mock-token", new AuthResponse.UserDto(1L, "testuser", "test@example.com", null, null));

    @Test
    @DisplayName("POST /auth/signup: 正常系 - 201 Created とトークンが返る")
    void signup_success_returns201() throws Exception {
        when(authService.signup(any())).thenReturn(MOCK_RESPONSE);

        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                Map.of("username", "testuser", "email", "test@example.com", "password", "password123"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("mock-token"))
                .andExpect(jsonPath("$.user.username").value("testuser"));
    }

    @Test
    @DisplayName("POST /auth/signup: 異常系 - メールアドレス重複で422")
    void signup_duplicateEmail_returns422() throws Exception {
        when(authService.signup(any()))
                .thenThrow(new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "このメールアドレスはすでに使用されています"));

        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                Map.of("username", "testuser", "email", "dup@example.com", "password", "password123"))))
                .andExpect(status().isUnprocessableEntity());
    }

    @Test
    @DisplayName("POST /auth/signup: バリデーション - パスワード7文字以下で4xx（Spring Boot 3.4はバリデーションエラーを422で返す）")
    void signup_shortPassword_returns4xx() throws Exception {
        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                Map.of("username", "testuser", "email", "test@example.com", "password", "short"))))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @DisplayName("POST /auth/signup: バリデーション - メール形式不正で4xx")
    void signup_invalidEmail_returns4xx() throws Exception {
        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                Map.of("username", "testuser", "email", "not-an-email", "password", "password123"))))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @DisplayName("POST /auth/login: 正常系 - 200 OK とトークンが返る")
    void login_success_returns200() throws Exception {
        when(authService.login(any())).thenReturn(MOCK_RESPONSE);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                Map.of("email", "test@example.com", "password", "password123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-token"));
    }

    @Test
    @DisplayName("POST /auth/login: 異常系 - 認証情報不正で401")
    void login_wrongCredentials_returns401() throws Exception {
        when(authService.login(any()))
                .thenThrow(new ResponseStatusException(HttpStatus.UNAUTHORIZED, "メールアドレスまたはパスワードが正しくありません"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                Map.of("email", "test@example.com", "password", "wrong"))))
                .andExpect(status().isUnauthorized());
    }
}
