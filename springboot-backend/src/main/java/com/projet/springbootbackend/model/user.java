package com.projet.springbootbackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity

public class user {
@Id
    @GeneratedValue
    
    private Long id;
    private String username;
    private String name;
    private String email;
    private String mdp;
    private String role;
    private int tel;


 public user() {}
    public user(Long id, String username, String name, String email, String mdp, String role, int tel) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.mdp = mdp;
        this.role = role;
        this.tel = tel;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    public String getMdp() {
        return mdp;
    }

    public void setMdp(String mdp) {
        this.mdp = mdp;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public int getTel() {
        return tel;
    }

    public void setTel(int tel) {
        this.tel = tel;
    }


}