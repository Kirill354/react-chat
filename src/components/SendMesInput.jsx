import React, { useContext, useState } from 'react';
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../firebase';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { v4 as uuid } from 'uuid';

import Attach from '../assets/img/attach.png';
import Img from '../assets/img/img.png';

const SendMesInput = () => {
   const { data } = useContext(ChatContext);
   const { currentUser } = useContext(AuthContext);

   const [text, setText] = useState('');
   const [image, setImage] = useState(null);

   const onMessageSubmit = async () => {
      if (!text && !image) return;

      if (image) {
         const storageRef = ref(storage, uuid());

         await uploadBytesResumable(storageRef, image).then(() => {
            getDownloadURL(storageRef).then(async (downloadURL) => {
               try {
                  await updateDoc(doc(db, 'chats', data.chatId), {
                     messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser.uid,
                        date: Timestamp.now(),
                        image: downloadURL,
                     }),
                  });
               } catch (err) {
                  console.error(err.message);
               }
            });
         });
      } else {
         try {
            await updateDoc(doc(db, 'chats', data.chatId), {
               messages: arrayUnion({
                  id: uuid(),
                  text,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
               }),
            });
         } catch (error) {
            console.log('Ошибка при отправке сообщения - ', error);
         }
      }
      await updateDoc(doc(db, 'userChat', currentUser.uid), {
         [data.chatId + '.lastMessage']: {
            text,
         },
         [data.chatId + '.date']: serverTimestamp(),
      });

      await updateDoc(doc(db, 'userChat', data.user.uid), {
         [data.chatId + '.lastMessage']: {
            text,
         },
         [data.chatId + '.date']: serverTimestamp(),
      });

      setText('');
      setImage(null);
   };

   const onKeyEnter = (e) => {
      if (e.code !== 'Enter') return;
      onMessageSubmit();
   };

   return (
      <div className="input">
         <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyEnter}
            name="sendMesInput"
            placeholder="Type something"
         />
         <div className="send">
            <img className="sendFileBtn" src={Attach} alt="Attach File Button" />
            <input
               style={{ display: 'none' }}
               onChange={(e) => setImage(e.target.files[0])}
               accept="image/*"
               id="attachImage"
               type="file"
               name="attachImage"
            />
            <label htmlFor="attachImage">
               <img src={Img} alt="Image Button" />
            </label>

            <button onClick={onMessageSubmit} disabled={data.chatId === 'null'}>
               Send
            </button>
         </div>
      </div>
   );
};

export default SendMesInput;
