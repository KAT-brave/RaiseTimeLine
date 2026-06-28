package com.raisetimeline.user;

import com.raisetimeline.follow.FollowMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {

    private final UserMapper userMapper;
    private final FollowMapper followMapper;

    public UserService(UserMapper userMapper, FollowMapper followMapper) {
        this.userMapper = userMapper;
        this.followMapper = followMapper;
    }

    public UserResponse getUser(Long id, Long currentUserId) {
        User user = userMapper.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ユーザーが見つかりません"));
        return toResponse(user, currentUserId);
    }

    public UserResponse updateUser(Long id, UserUpdateRequest request, Long currentUserId) {
        if (!id.equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "この操作は許可されていません");
        }
        userMapper.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ユーザーが見つかりません"));
        if (userMapper.existsByUsernameExcluding(request.getUsername(), id)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "ユーザー名はすでに使用されています");
        }
        User user = new User();
        user.setId(id);
        user.setUsername(request.getUsername());
        user.setBio(request.getBio());
        userMapper.update(user);
        return toResponse(userMapper.findById(id).orElseThrow(), currentUserId);
    }

    public List<UserResponse> search(String keyword, Long currentUserId) {
        if (keyword == null || keyword.trim().isEmpty()) return List.of();
        return userMapper.search(keyword.trim(), currentUserId, 20).stream()
                .map(u -> toResponse(u, currentUserId))
                .collect(java.util.stream.Collectors.toList());
    }

    private UserResponse toResponse(User user, Long currentUserId) {
        int followingCount = followMapper.countFollowing(user.getId());
        int followersCount = followMapper.countFollowers(user.getId());
        boolean followedByMe = currentUserId != null
                && !user.getId().equals(currentUserId)
                && followMapper.existsByFollowerAndFollowing(currentUserId, user.getId());
        return new UserResponse(
                user.getId(), user.getUsername(), user.getBio(), user.getAvatarUrl(),
                followingCount, followersCount, followedByMe);
    }
}
