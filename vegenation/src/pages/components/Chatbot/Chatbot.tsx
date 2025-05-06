// components/ChatBot/ChatBot.tsx
import React, { useEffect, useRef, useState } from 'react';
import styles from '@/pages/dashboard/dashboard.module.css';
import { sendChatMessage } from '@/pages/lib/api'; // ✅ import dari api.ts

const ChatBot: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<{ type: 'user' | 'bot'; message: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage = inputMessage.trim();
    setChatHistory(prev => [...prev, { type: 'user', message: userMessage }]);
    setInputMessage('');
    setLoading(true);

    try {
      const data = await sendChatMessage(userMessage); // ✅ gunakan fungsi dari api
      setChatHistory(prev => [
        ...prev,
        { type: 'bot', message: data.response || 'Tidak ada jawaban.' }
      ]);
    } catch (error) {
      setChatHistory(prev => [
        ...prev,
        { type: 'bot', message: 'Maaf, terjadi kesalahan.' }
      ]);
      console.error('Chatbot error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatMessages}>
        {chatHistory.map((chat, i) => (
          <div key={i} className={chat.type === 'user' ? styles.userMessage : styles.botMessage}>
            {chat.message}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className={styles.chatInputArea}>
        <input
          className={styles.chatInput}
          type="text"
          placeholder="Tulis pertanyaan..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={loading}
        />
        <button
          onClick={handleSendMessage}
          className={styles.sendButton}
          disabled={loading}
        >
          {loading ? '...' : 'Kirim'}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
