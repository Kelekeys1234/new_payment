package com.example.payment.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS setup so the frontend can call this API.
 * <p>
 * Configurable via the {@code APP_CORS_ALLOWED_ORIGINS} environment variable - a comma-separated
 * list of allowed origin patterns (e.g. "https://your-frontend.vercel.app,http://localhost:*").
 * Defaults to "*" (any origin) so the app works out of the box right after deployment; tighten
 * this to your actual frontend domain(s) once you know them.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.cors.allowed-origins:*}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns(allowedOrigins.split("\\s*,\\s*"))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false);
    }
}
