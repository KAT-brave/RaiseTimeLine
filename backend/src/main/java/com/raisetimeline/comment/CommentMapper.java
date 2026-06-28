package com.raisetimeline.comment;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommentMapper {
    List<CommentWithUser> findByPostId(@Param("postId") Long postId);
    void insert(Comment comment);
    Comment findById(@Param("id") Long id);
    void deleteById(@Param("id") Long id);
    int countByPostId(@Param("postId") Long postId);
}
