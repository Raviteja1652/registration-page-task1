import React from 'react'
import { db } from '../../firebase';
import './UsersData.css';
import { ref, remove } from 'firebase/database';
import { useHistory } from 'react-router-dom';
import { getAuth, deleteUser } from 'firebase/auth';

const UsersData = (props) => {
  const history = useHistory()

  const editHandler = (userId) => {
    console.log('Editing', userId)
    const usersToEdit = props.users.find(user => user.id === userId)
    history.push({
      pathname: `/register/${userId}`,
      state: {user: usersToEdit}
    })
  }

  const deleteHandler = async (userId) => {
    const auth = getAuth();
    const userRef = ref(db, 'users/' + userId);

    try {
      await remove(userRef);
      console.log('User deleted from database');

      const user = auth.currentUser;
      if (user && user.uid === userId) {
        await deleteUser(user);
        console.log('User deleted from Authentication');
      }
      
      props.setUsers(props.users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }


  return (
    <div className='users-data'>
      <ul className='data-list'>
        {props.users.map(user => (
          <li key={user.id} className='user-item'>
          <div className='user-info'>
            <span className='user-name'>{user.firstName} {user.lastName}</span>
            <span className='user-email'>{user.email}</span>
          </div>
          <div className='user-actions'>
            <button onClick={() => editHandler(user.id)} className='edit-button'>Edit</button>
            <button onClick={() => deleteHandler(user.id)} className='delete-button'>Delete</button>
          </div>
        </li>
        ))}
      </ul>
    </div>
  )
}

export default UsersData;