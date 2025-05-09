import {useCallback, useEffect, useState} from "react";
import { Socket } from 'socket.io-client';
import io from "socket.io-client";
import type {ChatMessage, MessageType, SystemMessageType} from "../../types/crypto.ts";
import * as React from "react";
import styles from "./CryptoChat.module.css";



export default function CryptoChat() {
  const [socket, setSocket] = useState<typeof Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const newSocket = io("ws://89.169.168.253:4500", {
      transports: ["websocket"],
      secure: false,
      timestampRequests: false,
    });

    newSocket.on('connect', () => {
      console.log('Соединение с сервером установлено');
      setSocket(newSocket);
    });

    newSocket.on('message', (message: MessageType) => {
      setMessages(prev => [...prev, { type: 'message', data: message }]);
    });

    newSocket.on('system', (systemMessage: SystemMessageType) => {
      setMessages(prev => [...prev, { type: 'system', data: systemMessage }]);
    });

    newSocket.on('disconnect', () => {
      console.log('Соединение с сервером разорвано');
      setSocket(null);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = useCallback(async () => {
    if (!socket || !inputText.trim()) return;

    if (inputText.startsWith('/name ')) {
      const newUsername = inputText.split(' ')[1];
      socket.emit('set_username', { username: newUsername });
      setUsername(newUsername);
    } else {
      if (!username) {
        alert('Сначала установите имя с помощью /name ВашеИмя');
        return;
      }
      socket.emit('message', { text: inputText });
    }

    setInputText('');
  }, [socket, inputText, username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage();
  };
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
      <>
        <button
            className={`${styles.toggleButton} ${isOpen ? styles.open : styles.closed}`}
            onClick={toggleChat}
        >
          {isOpen ? '⇛' : '⇚'}
        </button>

        <div className={`${styles.chatContainer} ${isOpen ? styles.open : ''}`}>
          <div className={styles.header}>
            <h3 className={styles.title}>Чат {username && `(${username})`}</h3>
          </div>

          <div className={styles.messages}>
            {messages.map((msg, index) => (
                <div key={index} className={`${styles.message} ${
                    msg.type === 'system' ? styles.systemMessage : styles.userMessage
                }`}>
                  {msg.type === 'system' ? (
                      <div>
                        <em>{msg.data.text}</em>
                        <small>
                          {new Date(msg.data.timestamp).toLocaleTimeString()}
                        </small>
                      </div>
                  ) : (
                      <div>
                        <strong>{(msg.data as MessageType).username}: </strong>
                        <span>{(msg.data as MessageType).text}</span>
                        <small>
                          {new Date(msg.data.timestamp).toLocaleTimeString()}
                        </small>
                      </div>
                  )}
                </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  username
                      ? "Введите сообщение..."
                      : "Установите имя: /name ВашеИмя"
                }
                disabled={!socket?.connected}
                className={styles.input}
            />
            <button
                type="submit"
                disabled={!socket?.connected || !inputText.trim()}
                className={styles.button}
            >
              Send
            </button>
          </form>

          <div className={`${styles.connectionStatus} ${
              socket?.connected ? styles.connected : styles.disconnected
          }`}>
            Статус: {socket?.connected ? 'Подключено' : 'Не подключено'}
          </div>
        </div>
      </>
  );
}