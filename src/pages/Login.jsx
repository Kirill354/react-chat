import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
   const navigate = useNavigate();
   const [error, setError] = useState('');

   const handleSubmit = async (e) => {
      e.preventDefault();
      const email = e.target[0].value;
      const password = e.target[1].value;
      console.log(email, password);

      try {
         await signInWithEmailAndPassword(auth, email, password);
         navigate('/');
      } catch (error) {
         setError(error.message);
      }
   };

   return (
      <div className="formContainer">
         <div className="formWrapper">
            <span className="logo">React Chat</span>
            <span className="title">Login</span>
            <form onSubmit={handleSubmit}>
               <input type="email" name="email" placeholder="email" />
               <input type="password" name="password" placeholder="password" />
               <button type="submit">Sign in</button>
               {error && <span className="formError">{error}</span>}
            </form>
            <p>
               Don't have an account? <Link to="/register">Register</Link>
            </p>
         </div>
      </div>
   );
};

export default Login;
