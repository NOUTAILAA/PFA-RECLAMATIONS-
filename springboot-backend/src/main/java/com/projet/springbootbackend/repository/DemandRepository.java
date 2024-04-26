package com.projet.springbootbackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.projet.springbootbackend.model.demand;

public interface DemandRepository extends JpaRepository<demand,Long> {
	List<demand> findAllByUserId(Long userId);

}
