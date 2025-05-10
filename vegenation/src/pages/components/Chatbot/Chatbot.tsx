/* eslint-disable prefer-const */
import React, { useEffect, useRef, useState } from 'react';
import styles from '@/pages/dashboard/dashboard.module.css';
import { sendChatMessage } from '@/lib/api';
import Image from 'next/image';

const ChatBot: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<{ type: 'user' | 'bot'; message: string }[]>([
    {
      type: 'bot',
      message: 'Hai! Saya Vegebot, siap memberikan prediksi harga sayur untuk Anda. Sayur apa yang ingin Anda ketahui harganya?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingDots, setTypingDots] = useState(''); // Efek typing dots
  const [emptyError, setEmptyError] = useState(false); // untuk alert kalau kosong

  const [userHasAsked, setUserHasAsked] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') {
      setEmptyError(true); // Tampilkan alert kecil
      setTimeout(() => setEmptyError(false), 2000); // Hilangkan setelah 2 detik
      return;
    }
  
    setEmptyError(false); // Hilangkan alert
    setUserHasAsked(true); // User sudah mulai bertanya

    const userMessage = inputMessage.trim();
    setChatHistory(prev => [...prev, { type: 'user', message: userMessage }]);
    setInputMessage('');
    setLoading(true);
    setTypingDots('.');
  
    // Tambahkan placeholder bot typing
    setChatHistory(prev => [...prev, { type: 'bot', message: '' }]);
  
    let dotsInterval = setInterval(() => {
      setTypingDots(prev => (prev.length >= 3 ? '.' : prev + '.'));
    }, 500);
  
    try {
      const data = await sendChatMessage(userMessage);
  
      // Delay efek typing
      setTimeout(() => {
        clearInterval(dotsInterval);
        setTypingDots('');
        setChatHistory(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { type: 'bot', message: data.response || 'Tidak ada jawaban.' };
          return updated;
        });
        setLoading(false);
      }, 2000);
    } catch (error) {
      clearInterval(dotsInterval);
      setTypingDots('');
      setChatHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { type: 'bot', message: 'Maaf, terjadi kesalahan.' };
        return updated;
      });
      setLoading(false);
      console.error('Chatbot error:', error);
    }
  };
  

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, typingDots]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatMessages}>
      {!userHasAsked && (
    <div className={styles.helpText}>Chatbot</div>
  )}
        {chatHistory.map((chat, i) => (
          <div
            key={i}
            className={chat.type === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper}
          >
            {chat.type === 'bot' && (
              <Image
                src="/chatbot.png" // ✅ Avatar bot (taruh gambar di /public)
                alt="Vegebot"
                width={24}
                height={24}
                className={styles.botAvatar}
              />
            )}
            <div
              className={
                chat.type === 'user' ? styles.userMessage : styles.botMessage
              }
            >
              {chat.message || (loading && i === chatHistory.length - 1 ? typingDots : '')}
            </div>
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
      {/* Alert kecil */}
{emptyError && (
  <div className={styles.errorMessage}>Silakan tulis pertanyaan terlebih dahulu!</div>
)}
    </div>
  );
};

export default ChatBot;
