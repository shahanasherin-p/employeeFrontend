import React from "react";
import axios from "axios";

const EmployeeList = ({ employees, fetchEmployees, setSelectedEmployee }) => {
  const handleDelete = async (id) => {
    await axios.delete(`https://employeeserver-i83t.onrender.com/allEmployees/${id}`);
    fetchEmployees();
  };

  return (
    <table className="table table-bordered">
      <thead className="thead-dark">
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee.id}>
            <td>{employee.id}</td>
            <td>{employee.username}</td>
            <td>{employee.email}</td>
            <td>{employee.status}</td>
            <td>
              <button className="btn btn-info mr-2" onClick={() => setSelectedEmployee(employee)}>Edit</button>
              <button className="btn btn-danger" onClick={() => handleDelete(employee.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmployeeList;
