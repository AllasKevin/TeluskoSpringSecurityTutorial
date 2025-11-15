package com.example.TeluskoSpringSecurityTutorial.config;

import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {
    @Bean
    public Jackson2ObjectMapperBuilderCustomizer objectIdToString() {
        return builder -> builder
                .serializerByType(org.bson.types.ObjectId.class, new com.fasterxml.jackson.databind.ser.std.ToStringSerializer());
    }
}