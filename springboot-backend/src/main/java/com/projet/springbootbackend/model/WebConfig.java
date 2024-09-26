package com.projet.springbootbackend.model;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.http.converter.HttpMessageConverter;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Permet CORS pour toutes les routes
            .allowedOrigins("http://localhost:5174" , "exp://192.168.1.218:8081") // Autorise l'origine frontend
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Méthodes autorisées
            .allowedHeaders("*") // Autorise tous les headers
            .allowCredentials(true); // Autorise les cookies et l'authentification par en-tête
    }
    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.add(new MappingJackson2HttpMessageConverter());
    }
}
