import React, { useState, useEffect } from 'react';
import { AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiOutlineSchedule, AiOutlineUpload } from 'react-icons/ai';
import { FaGenderless } from 'react-icons/fa';
import axios from 'axios';
import Header from '../Header/Header';

function Employe() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNo: '',
        designation: '',
        gender: '',
        courses: {
            MCA: false,
            BCA: false,
            BSC: false
        },
        imgUpload: null
    });
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8081/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleChange = (event) => {
        const { id, value, type, checked, files } = event.target;
        if (type === 'checkbox') {
            setFormData(prevData => ({
                ...prevData,
                courses: {
                    ...prevData.courses,
                    [id]: checked
                }
            }));
        } else if (type === 'radio') {
            setFormData(prevData => ({
                ...prevData,
                gender: value
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [id]: type === 'file' ? files[0] : value
            }));
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateMobileNumber = (mobileNo) => {
        return /^[0-9]+$/.test(mobileNo);
    };

    const validateFileUpload = (file) => {
        const allowedExtensions = ['jpg', 'png'];
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file) {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                return false;
            }
            if (file.size > maxSize) {
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let validationErrors = [];

        setErrors([]);
        setSuccessMessage('');

        if (!formData.name) {
            validationErrors.push('Name is required.');
        }

        if (!validateEmail(formData.email)) {
            validationErrors.push('Invalid email format.');
        }

        if (!validateMobileNumber(formData.mobileNo)) {
            validationErrors.push('Mobile number should contain only numeric values.');
        }

        if (!formData.designation || formData.designation === 'Select Designation') {
            validationErrors.push('Designation is required.');
        }

        if (users.some(user => user.email === formData.email)) {
            validationErrors.push('Email is already used.');
        }

        if (!validateFileUpload(formData.imgUpload)) {
            validationErrors.push('Only jpg and png files under 2MB are allowed.');
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        const formSubmissionData = new FormData();
        formSubmissionData.append('name', formData.name);
        formSubmissionData.append('email', formData.email);
        formSubmissionData.append('mobileNo', formData.mobileNo);
        formSubmissionData.append('designation', formData.designation);
        formSubmissionData.append('gender', formData.gender);
        formSubmissionData.append('courses', JSON.stringify(formData.courses));
        formSubmissionData.append('imgUpload', formData.imgUpload);

        try {
            const response = await axios.post('http://localhost:8081/saveUser', formSubmissionData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUsers([...users, response.data]);
            setSuccessMessage('Form submitted successfully!');
            setTimeout(() => window.location.reload(), 2000); 
        } catch (error) {
            console.error('Error saving user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ fontFamily: 'Poppins, sans-serif', minHeight: '100vh' }}>
            <Header />
            <main style={{ maxWidth: '600px', margin: '30px auto', padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 0 15px rgba(0,0,0,0.2)', fontFamily: 'Poppins, sans-serif' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                            { id: 'name', label: 'Name:', value: formData.name, type: 'text', icon: <AiOutlineUser />, placeholder: 'Enter your name' },
                            { id: 'email', label: 'Email:', value: formData.email, type: 'email', icon: <AiOutlineMail />, placeholder: 'Enter your email' },
                            { id: 'mobileNo', label: 'Mobile No:', value: formData.mobileNo, type: 'tel', icon: <AiOutlinePhone />, placeholder: 'Enter your mobile number' },
                            { id: 'designation', label: 'Designation:', value: formData.designation, type: 'select', icon: <AiOutlineSchedule />, options: ['Select Designation', 'HR', 'Manager', 'Sales'] },
                        ].map(({ id, label, value, type, icon, options, placeholder }) => (
                            <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
                                {icon && <div style={{ color: '#1e7898', fontSize: '20px' }}>{icon}</div>}
                                <label htmlFor={id} style={{ flex: '1', fontWeight: 'bold', color: '#333', fontSize: '14px' }}>{label}</label>
                                {type === 'select' ? (
                                    <select
                                        id={id}
                                        value={value}
                                        onChange={handleChange}
                                        style={{
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            padding: '8px',
                                            flex: '2',
                                            fontSize: '14px',
                                            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                                            outline: 'none',
                                        }}
                                    >
                                        {options.map((option, index) => <option key={index} value={option}>{option}</option>)}
                                    </select>
                                ) : (
                                    <input
                                        type={type}
                                        id={id}
                                        value={value}
                                        onChange={handleChange}
                                        placeholder={placeholder}
                                        style={{
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            padding: '8px',
                                            flex: '2',
                                            fontSize: '14px',
                                            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                                            outline: 'none',
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
                            <FaGenderless style={{ color: '#1e7898', fontSize: '20px' }} />
                            <label style={{ flex: '1', fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Gender:</label>
                            <div style={{ flex: '2', display: 'flex', justifyContent: 'space-between' }}>
                                {['Male', 'Female', 'Other'].map(gender => (
                                    <label key={gender} style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="radio"
                                            id={gender}
                                            name="gender"
                                            value={gender}
                                            checked={formData.gender === gender}
                                            onChange={handleChange}
                                            style={{ marginRight: '5px' }}
                                        />
                                        {gender}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
                            <AiOutlineUpload style={{ color: '#1e7898', fontSize: '20px' }} />
                            <label htmlFor="imgUpload" style={{ flex: '1', fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Upload Image:</label>
                            <input
                                type="file"
                                id="imgUpload"
                                onChange={handleChange}
                                style={{
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    padding: '8px',
                                    flex: '2',
                                    fontSize: '14px',
                                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                                    outline: 'none',
                                }}
                            />
                        </div>
                    </div>
                    {errors.length > 0 && (
                        <div style={{ color: 'red', marginTop: '10px' }}>
                            {errors.map((error, index) => <div key={index}>{error}</div>)}
                        </div>
                    )}
                    {successMessage && (
                        <div style={{ color: 'green', marginTop: '10px' }}>
                            {successMessage}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            marginTop: '20px',
                            backgroundColor: isSubmitting ? '#ccc' : '#1e7898',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            alignSelf: 'flex-start'
                        }}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </main>
        </div>
    );
}

export default Employe;
