CREATE TABLE posts (
  id         BIGSERIAL    PRIMARY KEY,
  user_id    BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content    VARCHAR(280) NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_posts_user_id    ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

CREATE TABLE post_images (
  id         BIGSERIAL    PRIMARY KEY,
  post_id    BIGINT       NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  image_url  VARCHAR(500) NOT NULL,
  position   INTEGER      NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, position)
);
