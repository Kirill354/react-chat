import React, { useContext, useState, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import Message from './Message';

const Messages = () => {
   const { data } = useContext(ChatContext);
   const [messages, setMessages] = useState([]);

   useEffect(() => {
      const getMessages = () => {
         const unsub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
         });

         return () => {
            unsub();
         };
      };

      getMessages();
   }, [data.chatId]);

   return (
      <div className="messages">
         {messages.length ? (
            messages.map((message) => <Message key={message.id} message={message} />)
         ) : (
            <span className="EmptyChat">Start chatting here</span>
         )}
      </div>
   );
};

export default Messages;
