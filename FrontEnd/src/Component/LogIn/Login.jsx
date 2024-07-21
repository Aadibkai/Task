import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate(); // Initialize navigate function

    const [signInData, setSignInData] = useState({
        email: '',
        hashPassword: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignInData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    useEffect(() => {
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!signInData.email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(signInData.email)) {
            newErrors.email = "Email address is invalid.";
        }
        if (!signInData.password) {
            newErrors.password = "Password is required.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };



    const handleSignin = async (e) => {
        e.preventDefault();
    
        if (!validate()) {
            toast.error("Please correct the errors in the form.");
            return;
        }
    
        try {
            const response = await axios.post("http://localhost:8081/login", signInData);
            console.log("Login successful:", response.data);
            toast.success("Login successful");
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data
            navigate('/admin');
        } catch (error) {
            console.error("There was an error!", error);
            toast.error(error?.response?.data?.message || "Login failed. Please try again.");
        }
    };
    


    return (
        <div style={{
            padding: "0 20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f5f5f5",
        }}>
            <div className="container" style={{
                width: "100%",
                maxWidth: "400px",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                padding: "24px",
                boxSizing: "border-box",
            }}>
                <h2 style={{
                    fontSize: "28px",
                    fontWeight: "600",
                    color: "#1e7898",
                    fontFamily: "Poppins",
                    marginBottom: "24px",
                }}>Sign In</h2>
                <form onSubmit={handleSignin}>
                    <div style={{ marginBottom: "16px" }}>
                        <input
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #c7c7c7",
                                borderRadius: "4px",
                                fontFamily: "Poppins",
                                outline: "none",
                                boxSizing: "border-box",
                            }}
                            type="email"
                            name="email"
                            value={signInData.email}
                            placeholder="Enter Email"
                            onChange={handleChange}
                        />
                        {errors.email && <div style={{ color: "red", fontFamily: "Poppins", fontSize: "12px" }}>{errors.email}</div>}
                    </div>
                    <div style={{ marginBottom: "24px", position: "relative" }}>
                        <input
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #c7c7c7",
                                borderRadius: "4px",
                                fontFamily: "Poppins",
                                outline: "none",
                                boxSizing: "border-box",
                            }}
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            value={signInData.password}
                            placeholder="Password"
                            onChange={handleChange}
                        />
                        <svg
                            style={{
                                position: "absolute",
                                top: "50%",
                                right: "12px",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                            }}
                            onClick={togglePasswordVisibility}
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d={passwordVisible ? "M12 4.5C7.30558 4.5 3.17234 7.39137 1 12C2.32603 14.8841 5.09569 17.034 8.42343 17.7761L12 21.3568L15.5766 17.7761C18.9043 17.034 21.674 14.8841 23 12C20.8277 7.39137 16.6944 4.5 12 4.5Z" : "M12 5.5C7.75305 5.5 4.07004 8.16228 2.05 12C4.07004 15.8377 7.75305 18.5 12 18.5C16.247 18.5 19.93 15.8377 21.95 12C19.93 8.16228 16.247 5.5 12 5.5ZM12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8Z"} fill="#1e7898" />
                        </svg>
                        {errors.password && <div style={{ color: "red", fontFamily: "Poppins", fontSize: "12px" }}>{errors.password}</div>}
                    </div>
                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "#1e7898",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            fontFamily: "Poppins",
                            cursor: "pointer",
                            fontSize: "16px",
                            marginBottom: "16px",
                            transition: "background-color 0.3s",
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#155e73"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1e7898"}
                    >
                        Sign In
                    </button>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <button
                            type="button"
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #1e7898",
                                backgroundColor: "transparent",
                                color: "#1e7898",
                                borderRadius: "4px",
                                fontFamily: "Poppins",
                                cursor: "pointer",
                                fontSize: "16px",
                                transition: "background-color 0.3s",
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f0f8ff"}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                            Don't have an account? Sign Up
                        </button>
                    </Link>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Login;
