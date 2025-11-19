import React, { useState } from 'react'
import './CSS/LoginSignup.css'

const LoginSignup = () => {

  const [state, setstate] = useState("Login");
  const [formdata, setFormdata] = useState({
    username: "",
    password: "",
    email: "",
  });

  const changeHandler = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  // 🔥 Your Render Backend URL
  const API_BASE = "https://ecommerce-website-uw5x.onrender.com";

  const login = async () => {
    console.log("Login executed", formdata);

    let responseData;

    await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formdata),
    })
      .then((res) => res.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.error);
    }
  };

  const signup = async () => {
    console.log("Signup executed", formdata);

    let responseData;

    await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formdata),
    })
      .then((res) => res.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.error);
    }
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>

        <div className="loginsignup-fields">
          {state === "Sign up" && (
            <input
              name='username'
              value={formdata.username}
              onChange={changeHandler}
              type='text'
              placeholder='Your Name'
            />
          )}

          <input
            name='email'
            value={formdata.email}
            onChange={changeHandler}
            type="email"
            placeholder='Your email'
          />

          <input
            name='password'
            value={formdata.password}
            onChange={changeHandler}
            type="password"
            placeholder='Password'
          />
        </div>

        <button onClick={() => { state === "Login" ? login() : signup() }}>
          Continue
        </button>

        {state === "Sign up" ? (
          <p className="loginsignup-login">
            Already have an account?
            <span onClick={() => setstate("Login")}> Login here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account?
            <span onClick={() => setstate("Sign up")}> Click here</span>
          </p>
        )}

        <div className="loginsignup-agree">
          <input type="checkbox" />
          <p>By continuing, I agree to the terms and privacy policy</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
