import React, { useContext, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext';
import Messages from './Messages';
import SendMesInput from './SendMesInput';

import Cam from '../assets/img/cam.png';
import Add from '../assets/img/add.png';
import More from '../assets/img/more.png';

const Chat = () => {
   const { data } = useContext(ChatContext);

   return (
      <div className="chat">
         <div className="chatInfo">
            <span>{data.user?.displayName}</span>
            <div className="chatIcons">
               <img src={Cam} alt="Camera image" />
               <img src={Add} alt="Add image" />
               <img src={More} alt="More image" />
            </div>
         </div>
         <Messages />
         <SendMesInput />
      </div>
   );
};

export default Chat;
