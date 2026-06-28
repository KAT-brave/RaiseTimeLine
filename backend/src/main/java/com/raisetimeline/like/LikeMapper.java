package com.raisetimeline.like;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface LikeMapper {
    void insert(@Param("postId") Long postId, @Param("userId") Long userId);
    void deleteByPostAndUser(@Param("postId") Long postId, @Param("userId") Long userId);
    boolean existsByPostAndUser(@Param("postId") Long postId, @Param("userId") Long userId);
    int countByPostId(@Param("postId") Long postId);
}
