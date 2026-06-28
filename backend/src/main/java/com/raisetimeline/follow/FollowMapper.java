package com.raisetimeline.follow;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface FollowMapper {
    void insert(@Param("followerId") Long followerId, @Param("followingId") Long followingId);
    void deleteByFollowerAndFollowing(@Param("followerId") Long followerId, @Param("followingId") Long followingId);
    boolean existsByFollowerAndFollowing(@Param("followerId") Long followerId, @Param("followingId") Long followingId);
    int countFollowing(@Param("followerId") Long followerId);
    int countFollowers(@Param("followingId") Long followingId);
}
