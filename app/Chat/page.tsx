'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, User, Bot, MessageSquareOff } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionID, setSessionID] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  useEffect(()=>{
    const sessionId = generateUUID();
    setSessionID(sessionId);
    console.log(sessionId);
  },[]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value);
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage: Message = { id: Date.now(), text: inputMessage, sender: 'user' }
    setMessages(prevMessages => [...prevMessages, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Replace this with your actual API call
      // const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/chat`, { chat: inputMessage }, {
      //   headers: {
      //     'Temp-Session-ID': sessionID,
      //     // 'Content-Type': 'application/json'
      //   }
      // })
      // Stream response
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/chat`, {
        method: 'POST',
        headers: {
            'content-type':'application/json',
            'Temp-Session-ID': sessionID, 
        },
        body: JSON.stringify({
          chat: inputMessage 
        })
      });
      // end - Stream response
      const botMessage: Message = { id: Date.now() + 1, text: '', sender: 'bot' }
      setMessages(prevMessages => [...prevMessages, botMessage])
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const reader = response.body?.pipeThrough(new TextDecoderStream("utf-8"))
      .getReader()
      if (!reader) {
        console.log("no reader")
        throw new Error('Failed to create reader');
      }
      let fullText = '';
      while(true) {
        const { value , done } = await reader.read();

        if (done) {
          console.log("it is done");
          break;
        }
        console.log(value);

        fullText += value
          setMessages(prevMessages => {
            const lastMessage = prevMessages[prevMessages.length - 1]
            // Only update if this is still the same message (checking ID)
            if (lastMessage.id === botMessage.id) {
              return [
                ...prevMessages.slice(0, -1),
                { ...lastMessage, text: fullText }
              ]
            }
            return prevMessages
          })

          // setMessages(prevMessages => {
          //   const updatedMessages = [...prevMessages]
          //   // console.log(updatedMessages[updatedMessages.length - 1].text);
          //   const text = updatedMessages[updatedMessages.length - 1].text + value // newChunk is the incoming stream data
          //   updatedMessages[updatedMessages.length - 1].text = text;
          //   return updatedMessages
          // })

      }
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = { id: Date.now() + 1, text: "Sorry, I couldn't process your request.", sender: 'bot' }
      setMessages(prevMessages => [...prevMessages, errorMessage])
    } finally {
      setIsLoading(false)
      console.log(messages[messages.length -1]);
    }
  }

  const handleEndChat = async () => {
    if ( messages.length === 0) {
      toast.success("No chat to clear");
      return;
    }
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/end-chat`, {}, {
        headers: {
          'Temp-Session-ID': sessionID
        }
      }).then((response)=>{
        console.log(response.data.message);
        if( response.status === 200)
          toast.success("Chat ended successfully");
      });
      setMessages([]);
      const newSessionId = generateUUID();
      setSessionID(newSessionId);
    } catch (error) {
      console.error("Error ending chat:", error);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
    <Card className="w-full max-w-3xl mx-auto h-[calc(100vh-2rem)] sm:h-[600px] flex flex-col bg-gradient-to-br from-purple-100 to-indigo-100 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl sm:text-2xl font-bold flex items-center">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            AI Chat Assistant
          </CardTitle>
          <Button
            onClick={handleEndChat}
            variant="ghost"
            className="text-white hover:bg-white/20 transition-all duration-300"
          >
            <MessageSquareOff className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            End Chat
          </Button>
        </div>
      </CardHeader>
        <CardContent className="flex-grow overflow-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] p-2 sm:p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {message.sender === 'user' ? (
                      <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    ) : (
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    )}
                    <span className="font-semibold text-sm sm:text-base">
                      {message.sender === 'user' ? 'You' : 'AI'}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter className="p-2 sm:p-4 bg-white bg-opacity-60 backdrop-filter backdrop-blur-lg">
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={handleInputChange}
              className="flex-grow pl-3 pr-3 sm:pl-4 sm:pr-4 py-2 text-sm sm:text-base rounded-full border-2 border-purple-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-300"
            />
            <Button 
              type="submit" 
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-2 px-3 sm:px-4 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="w-5 h-5 sm:w-6 sm:h-6 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}