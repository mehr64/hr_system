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
    <div>
      <h2>Employee List</h2>
      <table border="1" cellPadding="8">
        <thead>
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
                <button onClick={() => handleEdit(emp)}>Edit</button>{' '}
                <button onClick={() => handleDelete(emp._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingEmployee && (
        <div style={{ marginTop: '20px' }}>
          <h3>Edit Employee</h3>
          <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Name" />
          <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Email" />
          <input value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} placeholder="Position" />
          <input value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} placeholder="Department" />
          <input value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} placeholder="Salary" />
          <br />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditingEmployee(null)}>Cancel</button>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h3>Add New Employee</h3>
        <input
          placeholder="Name"
          value={newEmployee.name}
          onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={newEmployee.email}
          onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })}
        />
        <input
          placeholder="Position"
          value={newEmployee.position}
          onChange={e => setNewEmployee({ ...newEmployee, position: e.target.value })}
        />
        <input
          placeholder="Department"
          value={newEmployee.department}
          onChange={e => setNewEmployee({ ...newEmployee, department: e.target.value })}
        />
        <input
          placeholder="Salary"
          value={newEmployee.salary}
          onChange={e => setNewEmployee({ ...newEmployee, salary: e.target.value })}
        />
        <br />
        <button onClick={handleAddEmployee}>Add Employee</button>
      </div>
    </div>
  );
}

export default AdminDashboard;
