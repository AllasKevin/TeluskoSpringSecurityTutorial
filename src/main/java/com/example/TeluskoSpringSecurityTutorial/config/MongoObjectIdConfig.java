package com.example.TeluskoSpringSecurityTutorial.config;

import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import org.bson.types.ObjectId;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

@Configuration
public class MongoObjectIdConfig {
    public MongoObjectIdConfig(Jackson2ObjectMapperBuilder builder) {
        builder.modulesToInstall(new SimpleModule() {{
            addSerializer(ObjectId.class, new ToStringSerializer());
        }});
    }
}
