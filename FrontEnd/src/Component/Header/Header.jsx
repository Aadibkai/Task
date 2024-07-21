import React, { useEffect, useState } from 'react';
import { FaHome, FaListAlt } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Header = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchHeaderUser = async () => {
            try {
                const response = await axios.get('http://localhost:8081/users');
                if (response.data.length > 0) {
                    setUser(response.data[0]); 
                }
            } catch (error) {
                console.error('Error fetching header user:', error);
            }
        };

        fetchHeaderUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        localStorage.removeItem('user'); 

        window.location.href = '/login'; 
    };


    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e7898', padding: '15px 20px', color: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <nav style={{ display: 'flex' }}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex' }}>
                    <li style={{ marginRight: '20px' }}>
                        <Link to="/admin" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
                            <FaHome style={{ marginRight: '8px' }} /> Home
                        </Link>
                    </li>
                    <li style={{ marginRight: '20px' }}>
                        <Link to="/employlist" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
                            <FaListAlt style={{ marginRight: '8px' }} /> Employee List
                        </Link>
                    </li>
                </ul>
            </nav>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                        <div style={{ marginRight: '10px' }}>{user.name}</div>
                        <button 
                            onClick={handleLogout} 
                            style={{ backgroundColor: 'white', color: '#1e7898', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
