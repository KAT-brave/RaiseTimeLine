package com.raisetimeline.auth;

import jakarta.validation.constraints.NotBlank;

public class RefreshRequest {

    @NotBlank(message = "リフレッシュトークンが必要です")
    private String refreshToken;

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
}
