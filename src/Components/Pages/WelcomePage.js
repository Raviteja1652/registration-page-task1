import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import UsersData from './UsersData'
import './WelcomePage.css'
import { db } from '../../firebase'
import { ref, get, update, remove } from 'firebase/database'

const WelcomePage = () => {
  const [showUsers, setShowUsers] = useState(false)
  const [users, setUsers] = useState([])
  const location = useLocation()
  const { firstName, lastName } = location.state || {}

  useEffect(() => {
    if (showUsers) {
      const fetchUsers = async () => {
        const usersRef = ref(db, 'users/');
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const userList = [];
          for (const userId in usersData) {
            userList.push({ id: userId, ...usersData[userId] });
          }
          setUsers(userList);
        } else {
          console.log("No users data is available");
        }
      };
      fetchUsers();
    }
  }, [showUsers]);

  const usersToggleHandler = () => setShowUsers(prev => !prev)

  return (
    <div className='welcome-container'>
        <h2>Welcome to the page, {firstName} {lastName}</h2>
        <Link to='#' className='users-toggle-button' onClick={usersToggleHandler}>
          {showUsers ? 'Hide Users Data' : 'Show Users Data'}
        </Link>

        {showUsers && <UsersData users={users} setUsers={setUsers} />}
    </div>
  )
}

export default WelcomePage;