package com.employe.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.employe.entity.Employe;

public interface EmployeRepository extends JpaRepository<Employe, Long>{

}
