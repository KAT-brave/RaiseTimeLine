package com.raisetimeline.post;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface PostMapper {
    List<PostWithUser> findAllWithUser(@Param("limit") int limit, @Param("offset") int offset);
    int countAfter(@Param("afterId") Long afterId);
    Optional<Post> findById(@Param("id") Long id);
    void insert(Post post);
    void update(Post post);
    void deleteById(@Param("id") Long id);
}
