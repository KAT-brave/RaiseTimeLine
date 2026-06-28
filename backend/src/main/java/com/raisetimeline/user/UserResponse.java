package com.raisetimeline.user;

public class UserResponse {
    private Long id;
    private String username;
    private String bio;
    private String avatarUrl;
    private int followingCount;
    private int followersCount;
    private boolean followedByMe;

    public UserResponse(Long id, String username, String bio, String avatarUrl,
                        int followingCount, int followersCount, boolean followedByMe) {
        this.id = id;
        this.username = username;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
        this.followingCount = followingCount;
        this.followersCount = followersCount;
        this.followedByMe = followedByMe;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getBio() { return bio; }
    public String getAvatarUrl() { return avatarUrl; }
    public int getFollowingCount() { return followingCount; }
    public int getFollowersCount() { return followersCount; }
    public boolean isFollowedByMe() { return followedByMe; }
}
