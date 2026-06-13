package com.raisetimeline.post;

import java.util.List;

public class PostsResponse {
    private List<PostResponse> posts;
    private boolean hasNext;
    private long totalCount;

    public PostsResponse(List<PostResponse> posts, boolean hasNext, long totalCount) {
        this.posts = posts;
        this.hasNext = hasNext;
        this.totalCount = totalCount;
    }

    public List<PostResponse> getPosts() { return posts; }
    public boolean isHasNext() { return hasNext; }
    public long getTotalCount() { return totalCount; }
}
