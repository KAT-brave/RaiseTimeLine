package com.raisetimeline.like;

import com.raisetimeline.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "いいね", description = "投稿へのいいね追加・取り消し")
@SecurityRequirement(name = "Bearer")
@RestController
@RequestMapping("/api/v1/posts/{postId}/likes")
public class LikeController {

    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @Operation(summary = "いいね追加")
    @PostMapping
    public ResponseEntity<Void> addLike(
            @PathVariable Long postId,
            @AuthenticationPrincipal User currentUser) {
        likeService.addLike(postId, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "いいね取り消し")
    @DeleteMapping
    public ResponseEntity<Void> removeLike(
            @PathVariable Long postId,
            @AuthenticationPrincipal User currentUser) {
        likeService.removeLike(postId, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}
