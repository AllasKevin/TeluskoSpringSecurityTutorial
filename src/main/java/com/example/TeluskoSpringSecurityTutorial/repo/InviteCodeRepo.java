package com.example.TeluskoSpringSecurityTutorial.repo;

import com.example.TeluskoSpringSecurityTutorial.model.Booking;
import com.example.TeluskoSpringSecurityTutorial.model.BookingStatus;
import com.example.TeluskoSpringSecurityTutorial.model.InviteCode;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface InviteCodeRepo extends MongoRepository<InviteCode, ObjectId> {
    InviteCode findByInviteCode(String inviteCode);
    InviteCode findFirstByAvailableTrueOrderByIdAsc();
    InviteCode findFirstByAvailableTrueAndBelongsTo(String belongsTo);
    List<InviteCode> findAllByBelongsTo(String belongTo);
}