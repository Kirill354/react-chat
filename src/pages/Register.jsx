import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

import { auth, db, storage } from '../firebase';

import addAvarar from '../assets/img/addAvatar.png';

const Register = () => {
   const navigate = useNavigate();
   const [error, setError] = useState('');

   const handleSubmit = async (e) => {
      e.preventDefault();
      const displayName = e.target[0].value;
      const email = e.target[1].value;
      const password = e.target[2].value;
      const file = e.target[3].files[0];

      try {
         const res = await createUserWithEmailAndPassword(auth, email, password);

         const storageRef = ref(storage, displayName);

         await uploadBytesResumable(storageRef, file).then(() => {
            getDownloadURL(storageRef).then(async (downloadURL) => {
               try {
                  //Update profile
                  await updateProfile(res.user, {
                     displayName,
                     photoURL: downloadURL,
                  });
                  //create user and user chat on firestore
                  await setDoc(doc(db, 'users', res.user.uid), {
                     uid: res.user.uid,
                     displayName,
                     email,
                     photoURL: downloadURL,
                  });
                  await setDoc(doc(db, 'userChat', res.user.uid), {});

                  navigate('/');
               } catch (err) {
                  setError(err.message);
               }
            });
         });
      } catch (error) {
         setError(error.message);
      }
   };

   return (
      <div className="formContainer">
         <div className="formWrapper">
            <span className="logo">React Chat</span>
            <span className="title">Register</span>
            <form onSubmit={handleSubmit}>
               <input type="text" name="name" placeholder="display name" />
               <input type="email" name="email" placeholder="email" />
               <input type="password" name="password" placeholder="password" />
               <input
                  style={{ display: 'none' }}
                  accept="image/*"
                  id="inputFile"
                  type="file"
                  name="file"
               />
               <label htmlFor="inputFile">
                  <img src={addAvarar} alt="addAvatar.png" />
                  <span>Add an avatar</span>
               </label>

               <button type="submit">Sign up</button>
               {error && <span className="formError">{error}</span>}
            </form>
            <p>
               Do you have an account? <Link to="/login">Login</Link>
            </p>
         </div>
      </div>
   );
};

export default Register;
