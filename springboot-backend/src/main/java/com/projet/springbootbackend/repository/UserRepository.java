package com.projet.springbootbackend.repository;

import com.projet.springbootbackend.model.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<user, Long> {
    Optional<user> findByUsername(String username);
    Optional<user> findById(Long id); 
}
