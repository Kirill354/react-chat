import React, { useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Message = ({ message }) => {
   const { currentUser } = useContext(AuthContext);
   const { data } = useContext(ChatContext);

   const ref = useRef();

   useEffect(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
   }, [message]);

   const normalDate = () => {
      const date = new Date(message.date.seconds * 1000);
      let min = date.getMinutes();
      let hour = date.getHours();

      if (min < 10) {
         min = '0' + String(min);
      }
      if (hour < 10) {
         hour = '0' + String(hour);
      }

      return `${hour}:${min}`;
   };

   return (
      <div ref={ref} className={`message ${message.senderId === currentUser.uid ? 'owner' : ''} `}>
         <div className="messageInfo">
            <img src={data.user.photoURL} alt="Message Avatar" />
            <span>{normalDate()}</span>
         </div>
         <div className="messageContent">
            <p>{message.text}</p>
            {message.image && <img src={message.image} alt="img" />}
         </div>
      </div>
   );
};

export default Message;
