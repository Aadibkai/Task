import React, { useState, useEffect } from 'react';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Checkbox, FormGroup, Paper, Typography, Grid } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "../Header/Header";

const Input = styled('input')({
    display: 'none',
});

const Edit = () => {
    const { id } = useParams(); // Get user ID from URL parameters
    const navigate = useNavigate(); // Navigation hook

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [designation, setDesignation] = useState('');
    const [gender, setGender] = useState('');
    const [course, setCourse] = useState({
        MCA: false,
        BCA: false,
        BSC: false
    });
    const [imgFile, setImgFile] = useState(null);
    const [emailError, setEmailError] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [imgError, setImgError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!id) return;

            try {
                const response = await axios.get(`http://localhost:8081/getUser/${id}`);
                const userData = response.data;
                setName(userData.name);
                setEmail(userData.email);
                setMobileNo(userData.mobileNo);
                setDesignation(userData.designation);
                setGender(userData.gender);
                setCourse({
                    MCA: userData.course.includes('MCA'),
                    BCA: userData.course.includes('BCA'),
                    BSC: userData.course.includes('BSC')
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [id]);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
    const handleEmailChange = (event) => {
        const emailInput = event.target.value;
        setEmail(emailInput);
        setEmailError(emailInput && !validateEmail(emailInput) ? 'Please enter a valid email address' : '');
    };
    const validateMobile = (mobileNo) => /^\d{10}$/.test(mobileNo);
    const handleMobileChange = (event) => {
        const mobileNoInput = event.target.value;
        setMobileNo(mobileNoInput);
        setMobileError(mobileNoInput && !validateMobile(mobileNoInput) ? 'Please enter a valid 10-digit mobile number' : '');
    };
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setImgFile(file);
        setImgError(file && !['image/jpeg', 'image/png'].includes(file.type) ? 'Please upload a JPG or PNG image' : '');
    };
    const handleCourseChange = (event) => {
        setCourse({
            ...course,
            [event.target.name]: event.target.checked
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name || !email || !mobileNo || !designation || !gender || !Object.values(course).some(v => v) || !imgFile) {
            alert('Please fill all the required fields');
            return;
        }
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }
        if (!validateMobile(mobileNo)) {
            setMobileError('Please enter a valid 10-digit mobile number');
            return;
        }
        if (imgFile && !['image/jpeg', 'image/png'].includes(imgFile.type)) {
            setImgError('Please upload a JPG or PNG image');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('mobileNo', mobileNo);
        formData.append('designation', designation);
        formData.append('gender', gender);
        formData.append('course', JSON.stringify(Object.keys(course).filter(key => course[key])));
        formData.append('imgFile', imgFile);

        try {
            setIsSubmitting(true);
            await axios.put(`http://localhost:8081/usersdb/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccessMessage('Form submitted successfully!');
            setTimeout(() => navigate('/employlist'), 2000); 
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Header />
            <Paper elevation={3} style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', backgroundColor: '#f5f5f5' }}>
                <Typography variant="h5" gutterBottom style={{ textAlign: 'center', marginBottom: '20px' }}>
                    Edit Employee Details
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Email"
                                value={email}
                                onChange={handleEmailChange}
                                error={!!emailError}
                                helperText={emailError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Mobile No"
                                value={mobileNo}
                                onChange={handleMobileChange}
                                error={!!mobileError}
                                helperText={mobileError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Designation"
                                value={designation}
                                onChange={(event) => setDesignation(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl component="fieldset" margin="dense">
                                <FormLabel component="legend">Gender</FormLabel>
                                <RadioGroup
                                    row
                                    value={gender}
                                    onChange={(event) => setGender(event.target.value)}
                                >
                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="Other" control={<Radio />} label="Other" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl component="fieldset" margin="dense">
                                <FormLabel component="legend">Course</FormLabel>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox checked={course.MCA} onChange={handleCourseChange} name="MCA" />}
                                        label="MCA"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={course.BCA} onChange={handleCourseChange} name="BCA" />}
                                        label="BCA"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={course.BSC} onChange={handleCourseChange} name="BSC" />}
                                        label="BSC"
                                    />
                                </FormGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                            <label htmlFor="imgFile">
                                <Input accept="image/*" id="imgFile" type="file" onChange={handleFileUpload} />
                                <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
                                    Upload Image
                                </Button>
                            </label>
                            {imgError && <Typography color="error" style={{ marginLeft: '16px' }}>{imgError}</Typography>}
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                {successMessage && <Typography color="primary" align="center" style={{ marginTop: '16px' }}>{successMessage}</Typography>}
            </Paper>
        </div>
    );
};

export default Edit;
