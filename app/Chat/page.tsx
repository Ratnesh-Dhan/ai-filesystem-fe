'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, User, Bot } from "lucide-react"
import axios from "axios"

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value)
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
      const response = await axios.post('/api/chat', { message: inputMessage })
      const botMessage: Message = { id: Date.now() + 1, text: response.data.message, sender: 'bot' }
      setMessages(prevMessages => [...prevMessages, botMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = { id: Date.now() + 1, text: "Sorry, I couldn't process your request.", sender: 'bot' }
      setMessages(prevMessages => [...prevMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-3xl mx-auto h-[calc(100vh-2rem)] sm:h-[600px] flex flex-col bg-gradient-to-br from-purple-100 to-indigo-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
          <CardTitle className="text-xl sm:text-2xl font-bold flex items-center">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            AI Chat Assistant
          </CardTitle>
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