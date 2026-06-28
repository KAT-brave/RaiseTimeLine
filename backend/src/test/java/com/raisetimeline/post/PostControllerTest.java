package com.raisetimeline.post;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.raisetimeline.config.SecurityConfig;
import com.raisetimeline.security.JwtUtil;
import com.raisetimeline.user.User;
import com.raisetimeline.user.UserMapper;
import org.junit.jupiter.api.BeforeEach;
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

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * PostControllerTest - 投稿コントローラーのHTTPレイヤーテスト
 *
 * ブラックボックス視点: 認証必須・HTTPステータスコード・レスポンス形式
 * ホワイトボックス視点: after パラメータによる分岐（新着件数モード vs 一覧モード）
 */
@WebMvcTest(PostController.class)
@Import(SecurityConfig.class)
class PostControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @MockitoBean PostService postService;
    @MockitoBean JwtUtil jwtUtil;
    @MockitoBean UserMapper userMapper;

    private static final String VALID_TOKEN = "valid-token";
    private User currentUser;
    private PostResponse mockPost;

    @BeforeEach
    void setUp() {
        currentUser = new User();
        currentUser.setId(1L);
        currentUser.setUsername("testuser");

        // JWTフィルターがモックユーザーを返すよう設定
        when(jwtUtil.validateToken(VALID_TOKEN)).thenReturn(true);
        when(jwtUtil.extractUserId(VALID_TOKEN)).thenReturn(1L);
        when(userMapper.findById(1L)).thenReturn(Optional.of(currentUser));

        mockPost = new PostResponse(
                1L, "テスト投稿", LocalDateTime.now(), LocalDateTime.now(),
                new PostResponse.UserDto(1L, "testuser", null),
                Collections.emptyList(), 0, 0, false);
    }

    @Test
    @DisplayName("GET /posts: 認証なしで401が返る")
    void getPosts_withoutAuth_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/posts"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /posts: 認証ありで200とタイムラインが返る")
    void getPosts_withAuth_returns200() throws Exception {
        when(postService.getTimeline(0, 20, 1L, "global"))
                .thenReturn(new PostsResponse(List.of(mockPost), false));

        mockMvc.perform(get("/api/v1/posts")
                        .header("Authorization", "Bearer " + VALID_TOKEN))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.posts").isArray())
                .andExpect(jsonPath("$.posts[0].content").value("テスト投稿"))
                .andExpect(jsonPath("$.hasNext").value(false));
    }

    @Test
    @DisplayName("GET /posts?after=1: after パラメータで新着件数モードになる")
    void getPosts_withAfter_returnsCount() throws Exception {
        when(postService.countNewPosts(1L)).thenReturn(3);

        mockMvc.perform(get("/api/v1/posts?after=1")
                        .header("Authorization", "Bearer " + VALID_TOKEN))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").value(3));
    }

    @Test
    @DisplayName("POST /posts: 認証ありで201と作成された投稿が返る")
    void createPost_withAuth_returns201() throws Exception {
        when(postService.createPost(any(), eq(1L))).thenReturn(mockPost);

        mockMvc.perform(post("/api/v1/posts")
                        .header("Authorization", "Bearer " + VALID_TOKEN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("content", "テスト投稿"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.content").value("テスト投稿"));
    }

    @Test
    @DisplayName("POST /posts: バリデーション - 内容が空で4xx（Spring Boot 3.4はバリデーションエラーを422で返す）")
    void createPost_emptyContent_returns4xx() throws Exception {
        mockMvc.perform(post("/api/v1/posts")
                        .header("Authorization", "Bearer " + VALID_TOKEN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("content", ""))))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @DisplayName("DELETE /posts/{id}: 他人の投稿削除で403が返る")
    void deletePost_otherUserPost_returns403() throws Exception {
        doThrow(new ResponseStatusException(HttpStatus.FORBIDDEN, "この操作は許可されていません"))
                .when(postService).deletePost(eq(99L), eq(1L));

        mockMvc.perform(delete("/api/v1/posts/99")
                        .header("Authorization", "Bearer " + VALID_TOKEN))
                .andExpect(status().isForbidden());
    }
}
