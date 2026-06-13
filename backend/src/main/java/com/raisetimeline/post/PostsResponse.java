package com.raisetimeline.post;

import java.util.List;

public class PostsResponse {
    private List<PostResponse> posts;
    private boolean hasNext;

    public PostsResponse(List<PostResponse> posts, boolean hasNext) {
        this.posts = posts;
        this.hasNext = hasNext;
    }

    public List<PostResponse> getPosts() { return posts; }
    public boolean isHasNext() { return hasNext; }
}
