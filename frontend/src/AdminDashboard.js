import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    salary: ''
  });

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    salary: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/employees', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEmployees(res.data);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };

    fetchEmployees();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEmployees(prev => prev.filter(emp => emp._id !== id));
    } catch (err) {
      console.error('Failed to delete employee:', err);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee._id);
    setFormData({
      name: employee.name,
      email: employee.email,
      position: employee.position,
      department: employee.department,
      salary: employee.salary
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/employees/${editingEmployee}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setEmployees(prev =>
        prev.map(emp =>
          emp._id === editingEmployee ? { ...emp, ...formData } : emp
        )
      );

      setEditingEmployee(null);
    } catch (err) {
      console.error('Failed to update employee:', err);
    }
  };

  const handleAddEmployee = async () => {
    try {
      await axios.post('http://localhost:5000/api/employees', newEmployee, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setNewEmployee({
        name: '',
        email: '',
        position: '',
        department: '',
        salary: ''
      });

      const res = await axios.get('http://localhost:5000/api/employees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to add employee:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Employee Management</h2>

      {/* Add Employee */}
      <div className="card mb-4">
        <div className="card-header">Add New Employee</div>
        <div className="card-body row g-2">
          {['name', 'email', 'position', 'department', 'salary'].map(field => (
            <div className="col-md-6 mb-3" key={field}>
              <input
                className="form-control"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={newEmployee[field]}
                onChange={e => setNewEmployee({ ...newEmployee, [field]: e.target.value })}
              />
            </div>
          ))}
          <div className="col-12">
            <button className="btn btn-primary" onClick={handleAddEmployee}>
              Add Employee
            </button>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th><th>Email</th><th>Position</th><th>Department</th><th>Salary</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp._id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.position}</td>
              <td>{emp.department}</td>
              <td>{emp.salary}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(emp)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(emp._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Employee */}
      {editingEmployee && (
        <div className="card mt-4">
          <div className="card-header">Edit Employee</div>
          <div className="card-body row g-2">
            {['name', 'email', 'position', 'department', 'salary'].map(field => (
              <div className="col-md-6 mb-3" key={field}>
                <input
                  className="form-control"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData[field]}
                  onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                />
              </div>
            ))}
            <div className="col-12">
              <button className="btn btn-success me-2" onClick={handleUpdate}>Save</button>
              <button className="btn btn-secondary" onClick={() => setEditingEmployee(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
