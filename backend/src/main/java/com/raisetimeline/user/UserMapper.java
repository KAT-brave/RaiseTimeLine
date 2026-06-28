package com.raisetimeline.user;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserMapper {

    Optional<User> findById(@Param("id") Long id);

    Optional<User> findByEmail(@Param("email") String email);

    boolean existsByEmail(@Param("email") String email);

    boolean existsByUsername(@Param("username") String username);

    void insert(User user);

    void update(User user);

    boolean existsByUsernameExcluding(@Param("username") String username, @Param("excludeId") Long excludeId);

    List<User> search(@Param("keyword") String keyword, @Param("excludeId") Long excludeId, @Param("limit") int limit);
}
