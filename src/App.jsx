import React, { useState, useEffect } from "react";
import axios from "axios";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = async () => {
    const response = await axios.get("https://employeeserver-i83t.onrender.com/allEmployees");
    setEmployees(response.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const clearSelection = () => setSelectedEmployee(null);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Employee Management</h1>
      <EmployeeForm fetchEmployees={fetchEmployees} selectedEmployee={selectedEmployee} clearSelection={clearSelection} />
      <EmployeeList employees={employees} fetchEmployees={fetchEmployees} setSelectedEmployee={setSelectedEmployee} />
    </div>
  );
};

export default App;
