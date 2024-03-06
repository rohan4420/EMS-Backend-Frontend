import React, { useEffect, useState } from "react";
import {
  createEmploye,
  getEmploye,
  updateEmploye,
} from "../services/EmployeService";
import { useNavigate, useParams } from "react-router-dom";

const EmployeComponent = () => {
  const [firstName, setFirstName] = useState(" ");
  const [lastName, setLastName] = useState(" ");
  const [email, setEmail] = useState(" ");

  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const navigator = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getEmploye(id)
        .then((response) => {
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          setEmail(response.data.email);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [id]);

  function saveOrUpdateEmploye(event) {
    event.preventDefault();
    if (validateForm()) {
      const employe = { firstName, lastName, email };
      if (id) {
        updateEmploye(id, employe)
          .then((response) => {
            console.log(response.data);
            navigator("/employees");
          })
          .catch((error) => console.error(error));
      } else {
        createEmploye(employe)
          .then((response) => {
            console.log(response.data);
            navigator("/employees");
          })
          .catch((error) => console.error(error));
      }
    }
  }

  function validateForm() {
    let valid = true;
    const errorsCopy = { ...error };

    if (firstName.trim()) {
      errorsCopy.firstName = " ";
    } else {
      errorsCopy.firstName = "First name is required";
      valid = false;
    }
    if (lastName.trim()) {
      errorsCopy.lastName = " ";
    } else {
      errorsCopy.lastName = "last name is required";
      valid = false;
    }
    if (email.trim()) {
      errorsCopy.email = " ";
    } else {
      errorsCopy.email = "Email is required";
    }
    setError(errorsCopy);
    return valid;
  }

  function pageTitle() {
    if (id) {
      return <h2 className="text-center">Update Employe</h2>;
    } else {
      return <h2 className="text-center">Add Employe</h2>;
    }
  }
  return (
    <div className="container">
      <div className="card col-mid-6 offset-md-3 mt-5">
        {pageTitle()}
        <div className="card-body">
          <form action="">
            <div className="form-group mb-2">
              <label className="foram-label" htmlFor="">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter employe first name"
                name="firstName"
                value={firstName}
                className={`form-control ${
                  error.firstName ? "is-invalid" : " "
                }`}
                onChange={(event) => setFirstName(event.target.value)}
              />
              {error.firstName && (
                <div className="invalid-feedback">{error.firstName}</div>
              )}
            </div>
            <div className="form-group mb-2">
              <label className="foram-label" htmlFor="">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter employe last name"
                name="lastName"
                value={lastName}
                className={`form-control ${
                  error.lastName ? "is-invalid" : " "
                }`}
                onChange={(event) => setLastName(event.target.value)}
              />
              {error.lastName && (
                <div className="invalid-feedback">{error.lastName}</div>
              )}
            </div>
            <div className="form-group mb-2">
              <label className="foram-label" htmlFor="">
                Email
              </label>
              <input
                type="text"
                placeholder="Enter employe email"
                name="email"
                value={email}
                className={`form-control ${error.email ? "is-invalid" : " "}`}
                onChange={(event) => setEmail(event.target.value)}
              />
              {error.email && (
                <div className="invalid-feedback">{error.email}</div>
              )}
            </div>
            <button className="btn btn-success" onClick={saveOrUpdateEmploye}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeComponent;
