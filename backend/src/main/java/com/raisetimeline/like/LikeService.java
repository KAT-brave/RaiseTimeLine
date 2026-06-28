package com.raisetimeline.like;

import com.raisetimeline.post.PostMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class LikeService {

    private final LikeMapper likeMapper;
    private final PostMapper postMapper;

    public LikeService(LikeMapper likeMapper, PostMapper postMapper) {
        this.likeMapper = likeMapper;
        this.postMapper = postMapper;
    }

    public void addLike(Long postId, Long userId) {
        postMapper.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "投稿が見つかりません"));
        if (likeMapper.existsByPostAndUser(postId, userId)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "すでにいいねしています");
        }
        likeMapper.insert(postId, userId);
    }

    public void removeLike(Long postId, Long userId) {
        postMapper.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "投稿が見つかりません"));
        if (!likeMapper.existsByPostAndUser(postId, userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "いいねが見つかりません");
        }
        likeMapper.deleteByPostAndUser(postId, userId);
    }
}
