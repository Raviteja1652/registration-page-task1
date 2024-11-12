import React, { useEffect, useState } from 'react';
import './Registration.css';
import axios from 'axios';
import { useHistory, useParams, useLocation } from 'react-router-dom'
import { auth, db } from '../../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, get, set, update } from 'firebase/database';

const Registration = () => {
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobile: '',
    country: '',
    zip: ''
  }
  const [userData, setUserData] = useState(initialState)
  const [countries, setCountries] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({password: '', email: ''})
  const history = useHistory()
  const { id } = useParams()
  const location = useLocation()

  useEffect(() => {
    if (location.state && location.state.user) {
      setUserData(location.state.user);
    }

    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data.map(country => country.name.common))
      })
      .catch(error => console.log(error))
  }, [id])

  const validateEmail = (mail_id) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(mail_id);
  }

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{7,}$/;
    return passwordRegex.test(password);
  };

  const changeHandler = (e) => {
    setUserData({...userData, [e.target.id]: e.target.value})
  };


  const submitHandler = async (e) => {
    e.preventDefault()

    if (!validatePassword(userData.password)) {
      setErrors(prevState => ({
        ...prevState, 
        password: 'Password must be 7 characters long and should include a special character and a capital letter.'
      }))
      return
    } else {
      setErrors(prev => ({...prev, password: ''}))
    }

    if (!validateEmail(userData.email)) {
      setErrors(prevState => ({
        ...prevState,
        email: 'Please enter a valid email address.'
      }))
      return
    } else {
      setErrors(prevState => ({
        ...prevState,
        email: ''
      }))
    }

    try {
      if (location.state && location.state.user) {
        await update(ref(db, 'users/' + location.state.user.id), {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          mobile: userData.mobile,
          country: userData.country,
          zip: userData.zip
      });
      } else {
        const enteredCredentials = await createUserWithEmailAndPassword(auth, userData.email, userData.password)

        await set(ref(db, 'users/' + enteredCredentials.user.uid), {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          mobile: userData.mobile,
          country: userData.country,
          zip: userData.zip
        })
      }

      history.push({
        pathname: '/welcome',
        state: { firstName: userData.firstName, lastName: userData.lastName }
      })
      
    } catch (error) {
      console.log('Error', error.message)
    }

    console.log(userData)
    
  };

  const handleNumberInput = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setUserData({ ...userData, [e.target.id]: value });
    }
  }; 

  return (
    <div>
        <form className='registration-form' onSubmit={submitHandler}>
            <h2>Registration</h2>
            <div>
              <input type='text' id='firstName' placeholder='First Name' onChange={changeHandler} required />
              <input type='text' id='lastName' placeholder='Last Name' onChange={changeHandler} required />
              <input type='email' id='email' placeholder='Email id' onChange={changeHandler} required />
              {errors.email && <small style={{color: 'red'}}>{errors.email}</small>}
              <input type='password' id='password' placeholder='Password' onChange={changeHandler} required />
              {errors.password && <small style={{color: 'red'}}>{errors.password}</small>}
              <input type='text' id='mobile' value={userData.mobile} placeholder='Mobile number' onChange={handleNumberInput} required />

              <select id='country' onChange={changeHandler}>
                <option>Select Country</option>
                {countries.map(country => <option key={country}>{country}</option>)}
              </select>

              <input type='text' id='zip' value={userData.zip} placeholder='Zip Code' onChange={handleNumberInput} />
              <button type='submit' className='submit-button'>Register</button>
            </div>
        </form>
    </div>
  );
};

export default Registration;