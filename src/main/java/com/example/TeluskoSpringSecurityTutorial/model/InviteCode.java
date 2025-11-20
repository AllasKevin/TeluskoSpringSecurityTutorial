package com.example.TeluskoSpringSecurityTutorial.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

//Todo: make InviteCodeRecord class and check the mapping in frontend
public class InviteCode {
    @Id
    private ObjectId id;
    private String inviteCode;
    private boolean available;
    private String usedBy;
    private String belongsTo;

    public String getBelongsTo() {
        return belongsTo;
    }

    public void setBelongsTo(String belongsTo) {
        this.belongsTo = belongsTo;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getInviteCode() {
        return inviteCode;
    }

    public void setInviteCode(String inviteCode) {
        this.inviteCode = inviteCode;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getUsedBy() {
        return usedBy;
    }

    public void setUsedBy(String usedBy) {
        this.usedBy = usedBy;
    }

    public InviteCode() {
    }

    public InviteCode(ObjectId id, String inviteCode, boolean available, String usedBy, String belongsTo) {
        this.id = id;
        this.inviteCode = inviteCode;
        this.available = available;
        this.usedBy = usedBy;
        this.belongsTo = belongsTo;
    }
}
