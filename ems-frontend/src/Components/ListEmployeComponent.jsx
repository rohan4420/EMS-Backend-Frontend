import React, { useEffect, useState } from "react";
import { listEmployees, deleteEmploye } from "../services/EmployeService";
import { useNavigate } from "react-router-dom";

const ListEmployeComponent = () => {
  const [employess, setEmployees] = useState([]);
  const navigator = useNavigate();

  useEffect(() => {
    getAllEmploye();
  }, []);

  function getAllEmploye() {
    listEmployees()
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  function addNewEmploye() {
    navigator("/addEmploye");
  }

  function updateEmploye(id) {
    navigator(`/editEmploye/${id}`);
  }
  function removeEmploye(id) {
    console.log(id);
    deleteEmploye(id)
      .then((response) => {
        getAllEmploye();
      })
      .catch((error) => {
        console.error(error);
      });
  }
  return (
    <div className="container">
      <h2 className="text-center">List of Employe</h2>
      <button className="btn btn-primary mb-2" onClick={addNewEmploye}>
        Add Employee
      </button>
      <table className="table table-striped table-bordered">
        <tr>
          <th>Employe Id</th>
          <th>Employe FirstName</th>
          <th>Employe LastName</th>
          <th>Employe Email</th>
          <th>Actions</th>
        </tr>
        <tbody>
          {employess.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.firstName}</td>
              <td>{item.lastName}</td>
              <td>{item.email}</td>
              <td>
                <button
                  className="btn btn-info"
                  onClick={() => updateEmploye(item.id)}
                >
                  Update
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => removeEmploye(item.id)}
                  style={{ marginLeft: "10px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListEmployeComponent;
