package com.example.TeluskoSpringSecurityTutorial.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.cert.X509Certificate;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
public class RestTemplateConfig {

    private final ObjectMapper objectMapper;

    public RestTemplateConfig(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Bean
    @Profile("local")
    public RestTemplate insecureRestTemplate() throws Exception {
        // Disable SSL certificate validation
        TrustManager[] trustAllCerts = new TrustManager[]{
                new X509TrustManager() {
                    public X509Certificate[] getAcceptedIssuers() { return new X509Certificate[0]; }
                    public void checkClientTrusted(X509Certificate[] certs, String authType) {}
                    public void checkServerTrusted(X509Certificate[] certs, String authType) {}
                }
        };
        SSLContext sslContext = SSLContext.getInstance("TLS");
        sslContext.init(null, trustAllCerts, new java.security.SecureRandom());
        HttpsURLConnection.setDefaultSSLSocketFactory(sslContext.getSocketFactory());
        HttpsURLConnection.setDefaultHostnameVerifier((hostname, session) -> true);

        // 👇 Force the same objectMapper that has the ToStringSerializer
        MappingJackson2HttpMessageConverter jsonConverter =
                new MappingJackson2HttpMessageConverter(objectMapper);

        RestTemplate restTemplate = new RestTemplate(new SimpleClientHttpRequestFactory());
        restTemplate.setMessageConverters(List.of(jsonConverter));
        return restTemplate;
    }

    @Bean
    @Profile("prod")
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate(new SimpleClientHttpRequestFactory());

        // ✅ Completely replace converters with one using the injected ObjectMapper
        MappingJackson2HttpMessageConverter jsonConverter =
                new MappingJackson2HttpMessageConverter(objectMapper);
        restTemplate.setMessageConverters(List.of(jsonConverter));

        return restTemplate;
    }
}