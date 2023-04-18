import React, { useContext, useState } from 'react';
import {
   collection,
   query,
   where,
   getDocs,
   setDoc,
   getDoc,
   doc,
   updateDoc,
   serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const Search = () => {
   const { currentUser } = useContext(AuthContext);

   const [userName, setUserName] = useState('');
   const [user, setUser] = useState(null);

   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');

   const handleSearch = async () => {
      const q = query(collection(db, 'users'), where('displayName', '==', userName));

      try {
         setIsLoading(true);
         const querySnapshot = await getDocs(q);
         if (querySnapshot.docs.length) {
            querySnapshot.forEach((doc) => {
               setUser(doc.data());
            });
         } else {
            setUser(null);
         }

         setIsLoading(false);
      } catch (error) {
         setError(error.message);
      }
   };

   const handleKeyDown = (e) => {
      if (e.code === 'Enter') {
         handleSearch();
      }
      return;
   };
   const handleSelect = async () => {
      //check whether the group(chats in firestore) exists, if not create
      const combinedId =
         currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;

      try {
         const res = await getDoc(doc(db, 'chats', combinedId));

         if (!res.exists()) {
            //create a chat in chats collection
            await setDoc(doc(db, 'chats', combinedId), { messages: [] });

            //create user chats
            await updateDoc(doc(db, 'userChat', currentUser.uid), {
               [combinedId + '.userInfo']: {
                  uid: user.uid,
                  displayName: user.displayName,
                  photoURL: user.photoURL,
               },
               [combinedId + '.date']: serverTimestamp(),
            });

            await updateDoc(doc(db, 'userChat', user.uid), {
               [combinedId + '.userInfo']: {
                  uid: currentUser.uid,
                  displayName: currentUser.displayName,
                  photoURL: currentUser.photoURL,
               },
               [combinedId + '.date']: serverTimestamp(),
            });
         }
      } catch (error) {
         setError(error.message);
      }
      setUser(null);
      setUserName('');
   };

   return (
      <div className="search">
         <div className="searchForm">
            <input
               value={userName}
               onChange={(e) => setUserName(e.target.value)}
               onKeyDown={handleKeyDown}
               type="text"
               name="searchUser"
               placeholder="Find a user"
            />
         </div>
         {error && <span className="formError">{error}</span>}

         {isLoading ? (
            <span>Loading...</span>
         ) : user ? (
            <div onClick={handleSelect} className="userChat">
               <img src={user.photoURL} alt="" />
               <div className="userChatInfo">
                  <span>{user.displayName}</span>
               </div>
            </div>
         ) : (
            ''
         )}
      </div>
   );
};

export default Search;
