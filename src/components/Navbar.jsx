import React, { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../context/AuthContext';

import { auth } from '../firebase';

const Navbar = () => {
   const { currentUser } = useContext(AuthContext);

   const onLogOutClick = () => {
      signOut(auth);
   };

   return (
      <div className="navbar">
         <span className="logo">React chat</span>
         <div className="user">
            <img src={currentUser.photoURL} alt="userAvatar" />
            <span>{currentUser.displayName}</span>
            <button onClick={onLogOutClick}>Log out</button>
         </div>
      </div>
   );
};

export default Navbar;
