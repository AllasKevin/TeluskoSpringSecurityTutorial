package com.example.TeluskoSpringSecurityTutorial.controller;

import com.example.TeluskoSpringSecurityTutorial.model.InviteCode;
import com.example.TeluskoSpringSecurityTutorial.service.InviteCodeService;
import com.example.TeluskoSpringSecurityTutorial.service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class InviteCodeController {

    @Autowired
    private InviteCodeService inviteCodeService;

    @GetMapping("/availableinvitecode")
    public ResponseEntity<String> availableInviteCode() {
        InviteCode inviteCode = inviteCodeService.getFirstAvailableServerGenerated();
        if(inviteCode == null) {
            return ResponseEntity.badRequest().body("No available invitation codes.");
        }
        return ResponseEntity.ok(inviteCode.getInviteCode());
    }

    @GetMapping("/myinvitecodes")
    public ResponseEntity<List<InviteCode>> getMyInviteCodes(@CookieValue("jwt") String jwt) {
        System.out.println(("/myinvitecodes called"));
        String userFromToken = JWTService.extractUsername(jwt);
        return ResponseEntity.ok(inviteCodeService.getAllThatBelongsTo(userFromToken));
    }

}
