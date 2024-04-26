package com.projet.springbootbackend.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity

public class demand {
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Id
    @GeneratedValue
    private Long id;

    public String getSujet() {
        return sujet;
    }

    public void setSujet(String sujet) {
        this.sujet = sujet;
    }

    private String sujet;
    private String description;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    private Date date;

    public String getEtat() {
        return etat;
    }

    public void setEtat(String etat) {
        this.etat = etat;
    }
    

    public user getUser() {
		return user;
	}

	public void setUser(user user) {
		this.user = user;
	}

	private String etat;
    @ManyToOne
    private user user;
}