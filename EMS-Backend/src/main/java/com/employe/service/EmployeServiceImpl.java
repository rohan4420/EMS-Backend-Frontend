package com.employe.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.employe.dto.EmployeDto;
import com.employe.entity.Employe;
import com.employe.exception.ResourceNotFoundException;
import com.employe.mapper.EmployeMapper;
import com.employe.repository.EmployeRepository;

@Service
public class EmployeServiceImpl implements EmployeService{
	
	@Autowired
	private EmployeRepository employeRepository;

	@Override
	public EmployeDto createEmploye(EmployeDto employeDto) {
		Employe employe = EmployeMapper.mapToEmploye(employeDto);
		Employe savedEmploye = employeRepository.save(employe);
		return EmployeMapper.mapToEmployeDto(savedEmploye);
	}

	@Override
	public EmployeDto getEmployeById(long id) {
		Employe employe = employeRepository.findById(id)
			.orElseThrow(()-> 
						new ResourceNotFoundException("Employe is not exist with given id :" + id));
		
		return EmployeMapper.mapToEmployeDto(employe);
	}

	@Override
	public List<EmployeDto> getAllEmploye() {
		List <Employe> employe= employeRepository.findAll();
		return employe.stream().map((emp)-> EmployeMapper.mapToEmployeDto(emp))
				.collect(Collectors.toList());
	}

	@Override
	public EmployeDto updatedEmploye(long id, EmployeDto updatedEemployeDto) {
		Employe employe = employeRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Employe is not exist with given id :" + id));
		
		employe.setFirstName(updatedEemployeDto.getFirstName());
		employe.setLastName(updatedEemployeDto.getLastName());
		employe.setEmail(updatedEemployeDto.getEmail());
		
		Employe updatedEmploye = employeRepository.save(employe);
		return EmployeMapper.mapToEmployeDto(updatedEmploye);
	}

	@Override
	public void deleteEmployeById(long id) {
		Employe employe = employeRepository.findById(id)
					.orElseThrow(() -> new ResourceNotFoundException("Employe is not exist with given id :" + id));
		employeRepository.delete(employe);
	}
	

}
