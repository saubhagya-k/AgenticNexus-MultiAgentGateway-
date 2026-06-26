import React from 'react'
import {useState} from 'react'
import axios from "axios"


const Main = () => {

    const[messages,setMessages] = useState([]);
    const[input,setInput] = useState('');
    const [userId] = userState('user-'+ Math.random().toString(36).substring(7));

    const sendMessage = async()=>{
        if(!input.trim()) return;
        const userMsg = input;

        setMessage([...messages,{text:userMsg,sender:'user'}]);
        setInput('');



        try{
            const res = await axios.post('/api/chat', {
            message: userMsg,
            user_id: userId
        });

        setMessages(prev => [...prev, { text: res.data.response, sender: 'ai' }]);
        } catch (err) {
        setMessages(prev => [...prev, { text: 'Error: ' + err.message, sender: 'ai' }]);
        }
        }
    

  return (
     <div className="App">
      <h1>AI Chat Bot</h1>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender === 'user' ? 'user-msg' : 'ai-msg'}>
            <strong>{msg.sender === 'user' ? 'You' : 'AI'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default Main

