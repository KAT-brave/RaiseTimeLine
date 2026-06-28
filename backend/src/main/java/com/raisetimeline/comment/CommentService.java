package com.raisetimeline.comment;

import com.raisetimeline.post.PostMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentMapper commentMapper;
    private final PostMapper postMapper;

    public CommentService(CommentMapper commentMapper, PostMapper postMapper) {
        this.commentMapper = commentMapper;
        this.postMapper = postMapper;
    }

    public List<CommentResponse> getComments(Long postId) {
        ensurePostExists(postId);
        return commentMapper.findByPostId(postId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CommentResponse createComment(Long postId, CommentRequest request, Long userId) {
        ensurePostExists(postId);
        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setUserId(userId);
        comment.setContent(request.getContent().trim());
        commentMapper.insert(comment);
        Comment saved = commentMapper.findById(comment.getId());
        List<CommentWithUser> rows = commentMapper.findByPostId(postId);
        CommentWithUser row = rows.stream()
                .filter(r -> r.getId().equals(saved.getId()))
                .findFirst()
                .orElseThrow();
        return toResponse(row);
    }

    public void deleteComment(Long postId, Long commentId, Long userId) {
        ensurePostExists(postId);
        Comment comment = commentMapper.findById(commentId);
        if (comment == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "コメントが見つかりません");
        }
        if (!comment.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "この操作は許可されていません");
        }
        commentMapper.deleteById(commentId);
    }

    private void ensurePostExists(Long postId) {
        postMapper.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "投稿が見つかりません"));
    }

    private CommentResponse toResponse(CommentWithUser row) {
        CommentResponse.UserDto user = new CommentResponse.UserDto(row.getUserId(), row.getUsername(), row.getAvatarUrl());
        return new CommentResponse(row.getId(), row.getContent(), row.getCreatedAt(), user);
    }
}
