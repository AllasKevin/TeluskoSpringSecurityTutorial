package com.example.TeluskoSpringSecurityTutorial.service;

import com.example.TeluskoSpringSecurityTutorial.model.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class RestTemplateService {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${signalingserver.url}")
    String signalingServerUrl;

    public void sendRequest(Booking booking) {
        String path = "/serverUpdatesConnectedSockets";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Booking> request = new HttpEntity<>(booking, headers);

        System.out.println("Before sending request to signaling server: " + signalingServerUrl + path);
        ResponseEntity<String> response = restTemplate.postForEntity(signalingServerUrl + path, request, String.class);
        System.out.println("Response from signaling server: " + response.getBody());
    }
}
