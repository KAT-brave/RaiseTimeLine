package com.raisetimeline.post;

import java.time.LocalDateTime;
import java.util.List;

public class PostResponse {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserDto user;
    private List<ImageDto> images;
    private int likesCount;
    private int commentsCount;
    private boolean likedByMe;

    public PostResponse(Long id, String content, LocalDateTime createdAt, LocalDateTime updatedAt,
                        UserDto user, List<ImageDto> images, int likesCount, int commentsCount, boolean likedByMe) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.user = user;
        this.images = images;
        this.likesCount = likesCount;
        this.commentsCount = commentsCount;
        this.likedByMe = likedByMe;
    }

    public Long getId() { return id; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public UserDto getUser() { return user; }
    public List<ImageDto> getImages() { return images; }
    public int getLikesCount() { return likesCount; }
    public int getCommentsCount() { return commentsCount; }
    public boolean isLikedByMe() { return likedByMe; }

    public static class UserDto {
        private Long id;
        private String username;
        private String avatarUrl;

        public UserDto(Long id, String username, String avatarUrl) {
            this.id = id;
            this.username = username;
            this.avatarUrl = avatarUrl;
        }

        public Long getId() { return id; }
        public String getUsername() { return username; }
        public String getAvatarUrl() { return avatarUrl; }
    }

    public static class ImageDto {
        private String imageUrl;
        private int position;

        public ImageDto(String imageUrl, int position) {
            this.imageUrl = imageUrl;
            this.position = position;
        }

        public String getImageUrl() { return imageUrl; }
        public int getPosition() { return position; }
    }
}
