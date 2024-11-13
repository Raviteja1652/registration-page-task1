import React, { useEffect, useState } from 'react';
import './Registration.css';
import axios from 'axios';
import { useHistory, useParams, useLocation } from 'react-router-dom'
import { auth, db } from '../../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, get, set, update } from 'firebase/database';
import { validateEmail, validatePassword } from '../../helperfunction'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const Registration = () => {
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobile: '',
    country: '',
    state: '',
    city: '',
    zip: ''
  }
  const [userData, setUserData] = useState(initialState)
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({password: '', email: ''})
  const [errorMessage, setErrorMessage] = useState('')
  const history = useHistory()
  const { id } = useParams()
  const location = useLocation()

  useEffect(() => {
    if (location.state && location.state.user) {
      setUserData(location.state.user);
    }

    axios.get('https://api.countrystatecity.in/v1/countries', {
      headers: {"X-CSCAPI-KEY": "QTM0RVlRQ0pReUZ2UVhuamt4SGpORzVXaHppVk5wRUpMM1A2bG5qZA=="}
    })
      .then(response => {
        setCountries(response.data.map(country => ({ name: country.name, iso2: country.iso2})))
      })
      .catch(error => console.log(error))
  }, [id, location.state])

  const closeErrorModal = () => setErrorMessage('')

  const changeHandler = async (e) => {
    const { id, value } = e.target
    setUserData({...userData, [id]: value})

    if (id === 'country') {
      setUserData(prev => ({ ...prev, country: value }))
      try {
        const res = await axios.get(`https://api.countrystatecity.in/v1/countries/${value}/states`, {
          headers: {"X-CSCAPI-KEY": "QTM0RVlRQ0pReUZ2UVhuamt4SGpORzVXaHppVk5wRUpMM1A2bG5qZA=="}
        })
        setStates(res.data)
        setCities([])
      } catch (error) {
        console.log(error)
      }
    } else if (id === 'state') {
      try {
        const res = await axios.get(`https://api.countrystatecity.in/v1/countries/${userData.country}/states/${value}/cities`, {
          headers: {"X-CSCAPI-KEY": "QTM0RVlRQ0pReUZ2UVhuamt4SGpORzVXaHppVk5wRUpMM1A2bG5qZA=="}
        })
        setCities(res.data)
      } catch (error) {
        console.log(error)
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault()

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

      localStorage.setItem('firstName', userData.firstName)
      localStorage.setItem('lastName', userData.lastName)
      history.push('/welcome')
      
    } catch (error) {
      console.log('Error', error.message)
      setErrorMessage(error.message)
    }

    console.log(userData)
  };

  const handleNumberInput = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setUserData({ ...userData, [e.target.id]: value });
    }
  };

  const validation = (id, value) => {
    if (id === 'email') {
      if (!validateEmail(value)) {
        setErrors(prev => ({...prev, email: 'Please enter a valid email address.'}))
      } else setErrors(prev => ({...prev, email:''}))
    } else if (id === 'password') {
      if (!validatePassword(value)) {
        setErrors(prev => ({...prev, password: 'Password must be 8 characters long and should contain a special character and a capital letter.'}))
      } else setErrors(prev => ({...prev, password: ''}))
    }
  } 

  const blurHandler = (e) => {
    validation(e.target.id, e.target.value)
  }

  return (
    <div>
        <form className='registration-form' onSubmit={submitHandler}>
            <h2>Registration</h2>
            <div>
              <input type='text' id='firstName' placeholder='First Name' onChange={changeHandler} required />
              <input type='text' id='lastName' placeholder='Last Name' onChange={changeHandler} required />

              <input type='text' id='email' placeholder='Email id' onChange={changeHandler} onBlur={blurHandler} required />
              {errors.email && <small style={{color: 'red'}}>{errors.email}</small>}

              <div className='password-wrapper'>
                <input type={showPassword ? 'text' : 'password'} id='password' placeholder='Password' onChange={changeHandler} onBlur={blurHandler} required />
                <span className='eye-icon' onClick={() => setShowPassword(prev => !prev)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
              </div>
              {errors.password && <small style={{color: 'red'}}>{errors.password}</small>}

              <input type='text' id='mobile' value={userData.mobile} placeholder='Mobile number' onChange={handleNumberInput} required />

              <select id='country' onChange={changeHandler}>
                <option>Select Country</option>
                {countries.map(country => <option key={country.iso2} value={country.iso2}>{country.name}</option>)}
              </select>

              <select id='state' onChange={changeHandler}>
                <option>Select State</option>
                {states.map(state => <option key={state.iso2} value={state.iso2}>{state.name}</option>)}
              </select>

              <select id='city' onChange={changeHandler}>
                <option>Select City</option>
                {cities.map(city => <option key={city.name} value={city.name}>{city.name}</option>)}
              </select>

              <input type='text' id='zip' value={userData.zip} placeholder='Zip Code' onChange={handleNumberInput} />
              <button type='submit' className='submit-button'>Register</button>
            </div>
        </form>

        {errorMessage && (
        <div className="error-modal">
          <div className="modal-content">
            <p>{errorMessage}</p>
            <button onClick={closeErrorModal} className="close-button">Close</button>
          </div>
        </div>
        )}


    </div>
  );
};

export default Registration;