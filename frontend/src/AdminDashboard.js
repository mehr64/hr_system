import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', position: '', department: '', salary: '' });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  let username = '';
  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.username;
    } catch (err) {
      console.error('Invalid token');
    }
  }

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/employees', { headers });
        setEmployees(res.data);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };
    fetchEmployees();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/employees/${editId}`, form, { headers });
        setMessage('Employee updated successfully.');
      } else {
        await axios.post('http://localhost:5000/api/employees', form, { headers });
        setMessage('Employee added successfully.');
      }
      setForm({ name: '', email: '', position: '', department: '', salary: '' });
      setEditId(null);
      // Refresh after update/add
      const res = await axios.get('http://localhost:5000/api/employees', { headers });
      setEmployees(res.data);
    } catch (err) {
      console.error('Error saving employee:', err);
      setMessage('Something went wrong.');
    }
  };

  const handleEdit = (emp) => {
    setForm(emp);
    setEditId(emp._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`, { headers });
      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error('Error deleting employee:', err);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>👤 Welcome, {username} (Admin)</h3>
        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="card p-4 mb-4 shadow-sm">
        <h5 className="mb-3">{editId ? 'Edit Employee' : 'Add New Employee'}</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-6">
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-6">
            <input type="text" name="position" placeholder="Position" value={form.position} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-6">
            <input type="text" name="department" placeholder="Department" value={form.department} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-6">
            <input type="number" name="salary" placeholder="Salary" value={form.salary} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-6 d-grid">
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editId ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </div>
      </div>

      <table className="table table-bordered table-hover shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Name</th><th>Email</th><th>Position</th><th>Department</th><th>Salary</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
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
    </div>
  );
}

export default AdminDashboard;
