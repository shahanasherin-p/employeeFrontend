import React, { useState, useEffect } from "react";
import axios from "axios";

const EmployeeForm = ({ fetchEmployees, selectedEmployee, clearSelection }) => {
  const [employee, setEmployee] = useState({
    id: "",
    username: "",
    email: "",
    status: "active"
  });

  const [errors, setErrors] = useState({
    id: "",
    username: "",
    email: ""
  });

  useEffect(() => {
    if (selectedEmployee) {
      setEmployee(selectedEmployee);
    } else {
      setEmployee({ id: "", username: "", email: "", status: "active" });
    }
  }, [selectedEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });

    let error = "";
    if (name === "id") error = validateId(value);
    if (name === "email") error = validateEmail(value);
    if (name === "username") error = validateUsername(value);

    setErrors({ ...errors, [name]: error });
  };

  const validateId = (id) => {
    if (!id.match(/^\d+$/)) {
      return "ID must be a number";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
      return "Invalid email address";
    }
    return "";
  };

  const validateUsername = (username) => {
    if (username.length < 3) {
      return "Username must be at least 3 characters long";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const idError = validateId(employee.id);
    const emailError = validateEmail(employee.email);
    const usernameError = validateUsername(employee.username);
  
    if (idError || emailError || usernameError) {
      setErrors({
        id: idError,
        email: emailError,
        username: usernameError
      });
      return;
    }
  
    try {
      const response = await axios.get("https://employeeserver-i83t.onrender.com/allEmployees");
      const existingEmployees = response.data;
  
      const idExists = existingEmployees.some((emp) => emp.id === employee.id);
      const emailExists = existingEmployees.some((emp) => emp.email === employee.email);
  
      if ((idExists && !selectedEmployee) || (emailExists && !selectedEmployee)) {
        setErrors({
          id: idExists ? "ID already exists" : "",
          email: emailExists ? "Email already exists" : "",
          username: errors.username
        });
        return;
      }
  
      if (selectedEmployee) {
        await axios.put(`https://employeeserver-i83t.onrender.com/allEmployees/${employee.id}`, employee);
      } else {
        await axios.post("https://employeeserver-i83t.onrender.com/allEmployees", employee);
      }
      fetchEmployees();
      clearSelection();
    } catch (err) {
      console.error("Error during submission", err);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="form-group">
        <label htmlFor="id" style={{fontWeight:"700"}}>ID</label>
        <input type="text" name="id" className="form-control" value={employee.id} onChange={handleChange} placeholder="Id" required />
        {selectedEmployee && <small className="text-danger">ID cannot be updated</small>}
        {errors.id && <small className="text-danger">{errors.id}</small>}
      </div>
      <div className="form-group">
        <label htmlFor="username" style={{fontWeight:"700"}}>Username</label>
        <input type="text" name="username" className="form-control" value={employee.username} onChange={handleChange} placeholder="Username" required />
        {errors.username && <small className="text-danger">{errors.username}</small>}
      </div>
      <div className="form-group">
        <label htmlFor="email" style={{fontWeight:"700"}}>Email</label>
        <input type="email" name="email" className="form-control" value={employee.email} onChange={handleChange} placeholder="Email" required />
        {errors.email && <small className="text-danger">{errors.email}</small>}
      </div>
      <div className="form-group">
        <label htmlFor="status" style={{fontWeight:"700"}}>Status</label>
        <select name="status" className="form-control" value={employee.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary">{selectedEmployee ? 'Update' : 'Add'} Employee</button>
    </form>
  );
};

export default EmployeeForm;
