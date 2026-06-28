package com.raisetimeline.post;

import com.raisetimeline.user.User;
import com.raisetimeline.user.UserMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    private final PostMapper postMapper;
    private final UserMapper userMapper;

    public PostService(PostMapper postMapper, UserMapper userMapper) {
        this.postMapper = postMapper;
        this.userMapper = userMapper;
    }

    public PostsResponse getTimeline(int page, int size, Long currentUserId, String type) {
        int offset = page * size;
        List<PostWithUser> rows = "following".equals(type)
                ? postMapper.findFollowingWithUser(size + 1, offset, currentUserId)
                : postMapper.findAllWithUser(size + 1, offset, currentUserId);
        boolean hasNext = rows.size() > size;
        if (hasNext) rows = rows.subList(0, size);
        List<PostResponse> responses = rows.stream().map(this::toResponseFromJoin).collect(Collectors.toList());
        return new PostsResponse(responses, hasNext);
    }

    public int countNewPosts(Long afterId) {
        return postMapper.countAfter(afterId);
    }

    public PostResponse createPost(PostRequest request, Long userId) {
        Post post = new Post();
        post.setUserId(userId);
        post.setContent(request.getContent());
        postMapper.insert(post);
        Post saved = postMapper.findById(post.getId()).orElse(post);
        return toResponse(saved);
    }

    public PostResponse updatePost(Long id, PostRequest request, Long userId) {
        Post post = findAndAuthorize(id, userId);
        post.setContent(request.getContent());
        postMapper.update(post);
        Post updated = postMapper.findById(id).orElse(post);
        return toResponse(updated);
    }

    public void deletePost(Long id, Long userId) {
        findAndAuthorize(id, userId);
        postMapper.deleteById(id);
    }

    private Post findAndAuthorize(Long id, Long userId) {
        Post post = postMapper.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "投稿が見つかりません"));
        if (!post.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "この操作は許可されていません");
        }
        return post;
    }

    private PostResponse toResponseFromJoin(PostWithUser row) {
        PostResponse.UserDto userDto = new PostResponse.UserDto(row.getUserId(), row.getUsername(), row.getAvatarUrl());
        return new PostResponse(
                row.getId(), row.getContent(), row.getCreatedAt(), row.getUpdatedAt(),
                userDto, Collections.emptyList(), row.getLikesCount(), row.getCommentsCount(), row.isLikedByMe());
    }

    private PostResponse toResponse(Post post) {
        User user = userMapper.findById(post.getUserId()).orElse(null);
        PostResponse.UserDto userDto = user != null
                ? new PostResponse.UserDto(user.getId(), user.getUsername(), user.getAvatarUrl())
                : new PostResponse.UserDto(post.getUserId(), "unknown", null);
        return new PostResponse(
                post.getId(), post.getContent(), post.getCreatedAt(), post.getUpdatedAt(),
                userDto, Collections.emptyList(), 0, 0, false);
    }
}
