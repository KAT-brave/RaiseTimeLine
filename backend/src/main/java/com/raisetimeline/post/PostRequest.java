package com.raisetimeline.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PostRequest {
    @NotBlank(message = "投稿内容を入力してください")
    @Size(max = 280, message = "投稿は280文字以内で入力してください")
    private String content;

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
