package com.raisetimeline.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "ユーザー", description = "ユーザーの検索・プロフィール取得・編集")
@SecurityRequirement(name = "Bearer")
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "ユーザー検索", description = "ユーザー名でユーザーを検索します（部分一致）")
    @GetMapping
    public ResponseEntity<List<UserResponse>> searchUsers(
            @Parameter(description = "検索キーワード") @RequestParam(required = false) String q,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userService.search(q, currentUser.getId()));
    }

    @Operation(summary = "ユーザー取得", description = "指定IDのユーザープロフィールを取得します")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userService.getUser(id, currentUser.getId()));
    }

    @Operation(summary = "プロフィール編集", description = "自分のプロフィール（ユーザー名・自己紹介）を更新します")
    @PatchMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userService.updateUser(id, request, currentUser.getId()));
    }
}
