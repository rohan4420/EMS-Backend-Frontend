package com.employe.mapper;

import com.employe.dto.EmployeDto;
import com.employe.entity.Employe;

public class EmployeMapper {
	public static EmployeDto mapToEmployeDto(Employe employe) {
		return new EmployeDto(
		employe.getId(),
		employe.getFirstName(),
		employe.getLastName(),
		employe.getEmail()
		);
	}
	public static Employe mapToEmploye(EmployeDto employeDto) {
		return new Employe(
		employeDto.getId(),
		employeDto.getFirstName(),
		employeDto.getLastName(),
		employeDto.getEmail()
		);
	}
}
