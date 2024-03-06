package com.employe.service;

import java.util.List;

import com.employe.dto.EmployeDto;

public interface EmployeService {
	
//	Add employe
	EmployeDto createEmploye(EmployeDto employeDto);
	
	EmployeDto getEmployeById(long id);
	
	List<EmployeDto> getAllEmploye();
	
	EmployeDto updatedEmploye(long id, EmployeDto updatedEemployeDto);
	
	void deleteEmployeById(long id);
}
