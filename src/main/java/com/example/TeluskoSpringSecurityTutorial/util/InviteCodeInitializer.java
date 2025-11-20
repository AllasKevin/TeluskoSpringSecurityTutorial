package com.example.TeluskoSpringSecurityTutorial.util;

import com.example.TeluskoSpringSecurityTutorial.model.InviteCode;
import com.example.TeluskoSpringSecurityTutorial.repo.InviteCodeRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class InviteCodeInitializer implements CommandLineRunner {

    private final int NUMBER_OF_INVITE_CODES = 13;
    private final InviteCodeRepo inviteRepo;

    public InviteCodeInitializer(InviteCodeRepo inviteRepo) {
        this.inviteRepo = inviteRepo;
    }

    @Override // TODO: Ökar man NUMBER_OF_INVITE_CODES så kommer så många nya koder skapas men det värdet måste vara mer än totalt alla koder i repot vilket jag kanske inte vill.
    public void run(String... args) {
        long existing = inviteRepo.count();

        // Only create if not already initialized
        if (existing >= NUMBER_OF_INVITE_CODES) {
            System.out.println("Invite codes already initialized.");
            return;
        }

        System.out.println("Generating " + NUMBER_OF_INVITE_CODES + " invite codes...");

        for (int i = 0; i < NUMBER_OF_INVITE_CODES; i++) {
            InviteCode invite = new InviteCode();
            invite.setInviteCode(UUID.randomUUID().toString());
            invite.setAvailable(true);
            invite.setBelongsTo("growhub");

            inviteRepo.save(invite);
        }

        System.out.println(NUMBER_OF_INVITE_CODES + " invite codes created!");
    }
}