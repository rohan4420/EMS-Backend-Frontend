package com.employe.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.employe.dto.EmployeDto;
import com.employe.service.EmployeService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/employees")
public class EmployeController {
	
	@Autowired
	private EmployeService employeService;
	
//	Build Add Employe REST API
	@PostMapping
	public ResponseEntity<EmployeDto> createEmploye(@RequestBody EmployeDto employeDto){
		EmployeDto savedEmploye = employeService.createEmploye(employeDto);
		return new ResponseEntity<>(savedEmploye,HttpStatus.CREATED);
	}
	
//	Get employee by ID
	@GetMapping("{id}")
	public ResponseEntity<EmployeDto> getEmployeByid(@PathVariable("id") long id){
		EmployeDto employeDto = employeService.getEmployeById(id);
		return  ResponseEntity.ok(employeDto);
	}
	
//	Build get all employee 
	@GetMapping
	public ResponseEntity<List<EmployeDto>> getAllEmploye(){
		List <EmployeDto> employe = employeService.getAllEmploye();
		return ResponseEntity.ok(employe);
	}
//	Build update employee Rest API
	@PutMapping("/{id}")
	public ResponseEntity<EmployeDto> updateEmployeByid(@PathVariable("id")long id,@RequestBody EmployeDto updateEmployeDto){
		EmployeDto employeDto = employeService.updatedEmploye(id, updateEmployeDto);
		return ResponseEntity.ok(employeDto);
	}
//	Build delete employee Rest API
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteEmployeByid(@PathVariable("id") long id){
		employeService.deleteEmployeById(id);
		return ResponseEntity.ok("Deleted");
	}
	
	
	
	
}
