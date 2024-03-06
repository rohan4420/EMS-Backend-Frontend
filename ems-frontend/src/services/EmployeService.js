import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/employees";

export const listEmployees = () => axios.get(REST_API_BASE_URL)

export const createEmploye = (employe) => axios.post(REST_API_BASE_URL,employe)

export const getEmploye = (employeId) => axios.get(REST_API_BASE_URL + '/' + employeId)

export const updateEmploye = (employeId,employe) => axios.put(REST_API_BASE_URL + '/' + employeId,employe)

export const deleteEmploye = (employeId) => axios.delete(REST_API_BASE_URL + '/' + employeId)