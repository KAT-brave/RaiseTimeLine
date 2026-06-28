package com.raisetimeline.post;

import com.raisetimeline.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "投稿", description = "投稿の作成・取得・編集・削除")
@SecurityRequirement(name = "Bearer")
@RestController
@RequestMapping("/api/v1/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @Operation(summary = "タイムライン取得", description = "type=global で全体、type=following でフォロー中ユーザーの投稿一覧を返します。after パラメータを指定すると新着件数のみ返します")
    @GetMapping
    public ResponseEntity<?> getPosts(
            @Parameter(description = "ページ番号（0始まり）") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "1ページの件数（最大100）") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "指定IDより新しい投稿件数を返す") @RequestParam(required = false) Long after,
            @Parameter(description = "global=全体 / following=フォロー中") @RequestParam(defaultValue = "global") String type,
            @AuthenticationPrincipal User currentUser) {
        if (after != null) {
            return ResponseEntity.ok(java.util.Map.of("count", postService.countNewPosts(after)));
        }
        int clampedSize = Math.min(Math.max(size, 1), 100);
        return ResponseEntity.ok(postService.getTimeline(page, clampedSize, currentUser.getId(), type));
    }

    @Operation(summary = "投稿作成")
    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @Valid @RequestBody PostRequest request,
            @AuthenticationPrincipal User currentUser) {
        PostResponse response = postService.createPost(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "投稿編集", description = "自分の投稿のみ編集できます")
    @PatchMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(postService.updatePost(id, request, currentUser.getId()));
    }

    @Operation(summary = "投稿削除", description = "自分の投稿のみ削除できます")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        postService.deletePost(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}
