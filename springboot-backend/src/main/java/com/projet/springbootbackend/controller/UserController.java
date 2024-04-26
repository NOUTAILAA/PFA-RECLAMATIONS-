package com.projet.springbootbackend.controller;

import com.projet.springbootbackend.model.user;
import com.projet.springbootbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class UserController {
    @Autowired
    private UserRepository userRepository;

    // Ajouter un utilisateur
    @PostMapping("/user")
    public user newUser(@RequestBody user newUser) {
        return userRepository.save(newUser);
    }

    // Obtenir tous les utilisateurs
    @GetMapping("/users")
    public List<user> getAllUsers() {
        return userRepository.findAll();
    }

    // Supprimer un utilisateur
    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(user -> {
                userRepository.delete(user);
                return ResponseEntity.ok().build();
            }).orElse(ResponseEntity.notFound().build());
    }

    // Modifier un utilisateur
    @PutMapping("/user/{id}")
    public ResponseEntity<user> updateUser(@PathVariable Long id, @RequestBody user userDetails) {
        return userRepository.findById(id)
            .map(user -> {
                user.setUsername(userDetails.getUsername());
                user.setName(userDetails.getName());
                user.setEmail(userDetails.getEmail());
                user.setMdp(userDetails.getMdp());
                user.setRole(userDetails.getRole());
                user.setTel(userDetails.getTel());
                return userRepository.save(user); // Le retour est clairement un User
            })
            .map(ResponseEntity::ok) // Cette ligne pourrait causer un problème si le contexte n'est pas clair
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/user/login")
    public ResponseEntity<?> loginUser(@RequestBody user loginDetails) {
        return userRepository.findByUsername(loginDetails.getUsername())
            .map(user -> {
                if (user.getMdp().equals(loginDetails.getMdp())) {
                    return ResponseEntity.ok(user);
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
                }
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));
    }


}
