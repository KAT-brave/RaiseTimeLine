package com.raisetimeline.follow;

import com.raisetimeline.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "フォロー", description = "ユーザーのフォロー・アンフォロー")
@SecurityRequirement(name = "Bearer")
@RestController
@RequestMapping("/api/v1/users/{id}/follow")
public class FollowController {

    private final FollowService followService;

    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    @Operation(summary = "フォロー")
    @PostMapping
    public ResponseEntity<Void> follow(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        followService.follow(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "アンフォロー")
    @DeleteMapping
    public ResponseEntity<Void> unfollow(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        followService.unfollow(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}
