package com.example.TeluskoSpringSecurityTutorial.service;

import com.example.TeluskoSpringSecurityTutorial.model.InviteCode;
import com.example.TeluskoSpringSecurityTutorial.repo.InviteCodeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class InviteCodeService {

    @Autowired
    private InviteCodeRepo repo;

    public InviteCode saveInviteCode(InviteCode inviteCode) {
        return repo.save(inviteCode);
    }

    public InviteCode getInviteCode(String inviteCode) {
        return repo.findByInviteCode(inviteCode);
    }

    public boolean isInviteCodeAvailable(InviteCode inviteCode) {
        return repo.findByInviteCode(inviteCode.getInviteCode()).isAvailable();
    }

    public InviteCode getFirstAvailable() {
        return repo.findFirstByAvailableTrueOrderByIdAsc();
    }

    public InviteCode getFirstAvailableServerGenerated(){
        return repo.findFirstByAvailableTrueAndBelongsTo("growhub");
    }

    public List<InviteCode> getAllThatBelongsTo(String username) {
        return repo.findAllByBelongsTo(username);
    }

    public void createNInviteCodesFor(int n, String username){
        for(int i = 0; i < n; i++){
            InviteCode newInviteCode = new InviteCode();
            newInviteCode.setBelongsTo(username);
            newInviteCode.setAvailable(true);
            newInviteCode.setInviteCode(UUID.randomUUID().toString());
            repo.save(newInviteCode);
        }
    }


}
