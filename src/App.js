import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

import './styles.scss';

function App() {
   const { currentUser } = useContext(AuthContext);

   const ProtectedRoute = ({ children }) => {
      if (!currentUser) {
         return <Navigate to="/login" />;
      }

      return children;
   };

   return (
      <>
         <Routes>
            <Route path="/">
               <Route
                  index
                  element={
                     <ProtectedRoute>
                        <Home />
                     </ProtectedRoute>
                  }
               />
               <Route path="login" element={<Login />} />
               <Route path="register" element={<Register />} />
            </Route>
            {/* <Route index path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} /> */}
         </Routes>
      </>
   );
}

export default App;
