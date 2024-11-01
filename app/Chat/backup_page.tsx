// components/Chat.tsx
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const socket = io('http://localhost:5000'); // Replace with your server URL

const Chat = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        // Listen for chat responses from the server
        socket.on('chat_response', (data) => {
            setMessages((prevMessages) => [...prevMessages, data.response]);
        });

        // Cleanup on component unmount
        return () => {
            socket.off('chat_response');
        };
    }, []);

    const sendMessage = () => {
        // Emit the message to the server
        socket.emit('chat_message', { chat: input });
        setInput('');
    };

    return (
        <Card className="my-4 bg-white dark:bg-zinc-950 w-[55%] mx-auto mt-10 shadow-lg">
            <CardHeader>
                <CardTitle className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Chat</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-2">
                    <div className="overflow-y-auto max-h-60 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 bg-white dark:bg-zinc-950">
                        {messages.map((msg, index) => (
                            <div key={index} className="p-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-zinc-950 dark:text-zinc-50">
                                {msg}
                            </div>
                        ))}
                    </div>
                    <div className="flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message"
                            className="flex-1 border border-zinc-300 dark:border-zinc-600 rounded-md p-2 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50"
                        />
                        <Button onClick={sendMessage} className="ml-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                            Send
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default Chat;