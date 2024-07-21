import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Header from '../Header/Header';

const EmployList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8081/usersdb');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Error fetching user data.');
            }
        };

        fetchData();
    }, []);

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/usersdb/${id}`);
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Error deleting user.');
        }
    };

    const columns = [
        { name: 'Unique Id', selector: row => row.id, sortable: true },
        {
            name: 'Image',
            selector: row => row.imgUpload,
            sortable: true,
            cell: row => (
                <img src={`http://localhost:8081/uploads/${row.imgUpload}`} alt={row.name} width="50" />
            ),
        },
        { name: 'Name', selector: row => row.name, sortable: true },
        { name: 'Email', selector: row => row.email, sortable: true },
        { name: 'Mobile No', selector: row => row.mobileNo, sortable: true },
        { name: 'Designation', selector: row => row.designation, sortable: true },
        { name: 'Gender', selector: row => row.gender, sortable: true },
        {
            name: 'Courses',
            selector: row => JSON.parse(row.courses),
            cell: row => {
                const courses = JSON.parse(row.courses);
                return (
                    <div>
                        {courses.includes('MCA') && <span>MCA </span>}
                        {courses.includes('BCA') && <span>BCA </span>}
                        {courses.includes('BSC') && <span>BSC </span>}
                    </div>
                );
            },
            sortable: true,
        },
        { name: 'Create Date', selector: row => new Date(row.createdAt).toLocaleDateString(), sortable: true },
        {
            name: 'Action',
            cell: row => (
                <div>
                    <button
                        onClick={() => handleEdit(row.id)}
                        style={{ backgroundColor: '#fff', border: 'none', color: '#1e7898', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', margin: '0 5px' }}>
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        style={{ backgroundColor: '#fff', border: 'none', color: '#1e7898', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', margin: '0 5px' }}>
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    const handleSubmit = async (event) => {
        event.preventDefault();
      
        const userData = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          mobileNo: '1234567890',
          designation: 'Developer',
          gender: 'Male',
          courses: ['MCA', 'BCA'],
          imgUpload: 'filename.jpg' // This should be the filename received after uploading the image
        };
      
        try {
          const response = await axios.put('http://localhost:8081/usersdb/5', userData);
          console.log(response.data);
        } catch (error) {
          console.error('There was an error!', error);
        }
      };

    return (
        <div>
            <Header />
            <div style={{ padding: '20px' }}>
                <h1>Employee List</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div style={{ margin: '20px' }}>
                    <DataTable
                        title="Employee Data"
                        columns={columns}
                        data={users}
                        pagination
                        fixedHeader
                        fixedHeaderScrollHeight="300px"
                        subHeader
                        subHeaderComponent={
                            <input
                                type="text"
                                placeholder="Enter Search Keyword"
                                style={{ width: '200px', padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}
                            />
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default EmployList;
