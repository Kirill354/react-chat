import React, { useState, useEffect, useContext } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';

const UserChats = () => {
   const { dispatch } = useContext(ChatContext);
   const { currentUser } = useContext(AuthContext);
   const [chats, setChats] = useState([]);

   useEffect(() => {
      const getChats = () => {
         const unsub = onSnapshot(doc(db, 'userChat', currentUser.uid), (doc) => {
            setChats(doc.data());
         });

         return () => {
            unsub();
         };
      };

      currentUser.uid && getChats();
   }, [currentUser.uid]);

   const handleSelect = (user) => {
      dispatch({ type: 'CHANGE_USER', payload: user });
   };

   return (
      <div className="chats">
         {Object.entries(chats)
            ?.sort((chat1, chat2) => chat2[1].date - chat1[1].date)
            .map((chat) => (
               <div
                  key={chat[0]}
                  className="userChat"
                  onClick={() => handleSelect(chat[1].userInfo)}>
                  <img src={chat[1].userInfo.photoURL} alt="userChatImg" />
                  <div className="userChatInfo">
                     <span>{chat[1].userInfo.displayName}</span>
                     <p>{chat[1].lastMessage?.text}</p>
                  </div>
               </div>
            ))}
      </div>
   );
};

export default UserChats;
