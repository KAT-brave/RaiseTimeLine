package com.raisetimeline.config;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Tag(name = "ヘルスチェック", description = "サーバー稼働確認")
@RestController
@RequestMapping("/api/v1")
public class HealthController {

    @Operation(summary = "ヘルスチェック", description = "サーバーが正常稼働中か確認します（認証不要）")
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }
}
