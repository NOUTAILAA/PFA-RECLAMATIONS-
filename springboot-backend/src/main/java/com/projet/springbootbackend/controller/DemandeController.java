package com.projet.springbootbackend.controller;

import com.projet.springbootbackend.model.demand;
import com.projet.springbootbackend.model.user;
import com.projet.springbootbackend.repository.DemandRepository;
import com.projet.springbootbackend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Optional;

@RestController
public class DemandeController {
    @Autowired
    private DemandRepository demandRepository;
    private UserRepository userRepository;

    
    @Autowired
    public DemandeController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    
    @PostMapping("/demands")
    public ResponseEntity<?> createDemand(@RequestBody demand demand, @RequestParam Long userId) {
        // Vérifiez si l'utilisateur existe
        user user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Associez l'utilisateur à la demande et sauvegardez
        demand.setUser(user);
        demand savedDemand = demandRepository.save(demand);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDemand);
    }



    // Lire toutes les demandes
 // Fetch demands by user ID
    @GetMapping("/demands")
    public List<demand> getDemandsByUserId(@RequestParam Optional<Long> userId) {
        if (userId.isPresent()) {
            return demandRepository.findAllByUserId(userId.get());
        }
        return demandRepository.findAll();
    }

    // Lire une demande spécifique par son ID
    @GetMapping("/demands/{id}")
    public ResponseEntity<demand> getDemandById(@PathVariable Long id) {
        Optional<demand> demand = demandRepository.findById(id);
        return demand.map(value -> ResponseEntity.ok().body(value))
                     .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Mettre à jour une demande spécifique
    @PutMapping("/demands/{id}")
    public ResponseEntity<demand> updateDemand(@PathVariable Long id, @RequestBody demand demandDetails) {
        return demandRepository.findById(id)
            .map(existingDemand -> {
                existingDemand.setSujet(demandDetails.getSujet());
                existingDemand.setDescription(demandDetails.getDescription());
                existingDemand.setDate(demandDetails.getDate());
                existingDemand.setEtat(demandDetails.getEtat());
                existingDemand.setUser(demandDetails.getUser()); // Assurez-vous que getUser/setUser sont correctement implémentés
                demand updatedDemand = demandRepository.save(existingDemand);
                return ResponseEntity.ok().body(updatedDemand);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Supprimer une demande
    @DeleteMapping("/demands/{id}")
    public ResponseEntity<?> deleteDemand(@PathVariable Long id) {
        return demandRepository.findById(id)
            .map(demand -> {
                demandRepository.delete(demand);
                return ResponseEntity.ok().build();
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
