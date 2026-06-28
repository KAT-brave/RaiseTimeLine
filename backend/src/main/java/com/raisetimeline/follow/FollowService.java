package com.raisetimeline.follow;

import com.raisetimeline.user.UserMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FollowService {

    private final FollowMapper followMapper;
    private final UserMapper userMapper;

    public FollowService(FollowMapper followMapper, UserMapper userMapper) {
        this.followMapper = followMapper;
        this.userMapper = userMapper;
    }

    public void follow(Long targetUserId, Long currentUserId) {
        if (targetUserId.equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "自分自身をフォローすることはできません");
        }
        userMapper.findById(targetUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ユーザーが見つかりません"));
        if (followMapper.existsByFollowerAndFollowing(currentUserId, targetUserId)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "すでにフォローしています");
        }
        followMapper.insert(currentUserId, targetUserId);
    }

    public void unfollow(Long targetUserId, Long currentUserId) {
        userMapper.findById(targetUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ユーザーが見つかりません"));
        if (!followMapper.existsByFollowerAndFollowing(currentUserId, targetUserId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "フォロー情報が見つかりません");
        }
        followMapper.deleteByFollowerAndFollowing(currentUserId, targetUserId);
    }
}
