package com.projet.springbootbackend.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.projet.springbootbackend.model.user;
import com.projet.springbootbackend.repository.UserRepository;

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
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginDetails) {
        String username = loginDetails.get("username");
        String mdp = loginDetails.get("mdp");

        if (username == null || mdp == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username and password are required");
        }

        Optional<user> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            user user = optionalUser.get();
            if (user.getMdp().equals(mdp)) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
    @GetMapping("/users/{id}")
    public ResponseEntity<user> getUserById(@PathVariable Long id) {
        Optional<user> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            return ResponseEntity.ok(optionalUser.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

}
