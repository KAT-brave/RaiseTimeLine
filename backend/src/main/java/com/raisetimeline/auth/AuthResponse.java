package com.raisetimeline.auth;

public class AuthResponse {

    private String token;
    private UserDto user;

    public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() { return token; }
    public UserDto getUser() { return user; }

    public static class UserDto {
        private Long id;
        private String username;
        private String email;
        private String bio;
        private String avatarUrl;

        public UserDto(Long id, String username, String email, String bio, String avatarUrl) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.bio = bio;
            this.avatarUrl = avatarUrl;
        }

        public Long getId() { return id; }
        public String getUsername() { return username; }
        public String getEmail() { return email; }
        public String getBio() { return bio; }
        public String getAvatarUrl() { return avatarUrl; }
    }
}
