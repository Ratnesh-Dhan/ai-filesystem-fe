"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Search } from "lucide-react"
import axios from "axios"
import UploadBox from "./UploadBox"
import Indexing from "./Indexing"

export function DynamicSearchInterface() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<{ answer: string; sources: string[] } | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!query) return
    setIsSearching(true)

    try {
      const result = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/query`, { query: query });
      console.log({result});
      // Simulated response
      const simulatedResponse = {
        answer: result.data.response.answer, 
        sources: result.data.response.sources
      }

      setResult(simulatedResponse)
    } catch (error) {
      console.error("'Error:'", error)
      setResult({ answer: "'An error occurred while searching'", sources: [] })
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <>
    <Card className="w-full max-w-3xl mx-auto bg-gradient-to-br from-purple-100 to-indigo-100 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center">
          <Search className="w-6 h-6 mr-2" />
          AI Document Search
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="What would you like to know?"
              value={query}
              onChange={handleQueryChange}
              className="pl-10 pr-4 py-3 rounded-full border-2 border-purple-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
          </div>
          <Button 
            type="submit" 
            disabled={!query || isSearching} 
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            {isSearching ? "'Searching...'" : "'Search Documents'"}
          </Button>
        </form>
      </CardContent>
      {result && (
        <CardFooter className="flex flex-col items-start p-6 bg-white bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-b-lg">
          <div className="w-full">
            <h3 className="font-bold text-lg mb-2 text-purple-700">Answer:</h3>
            <p className="text-gray-800 bg-white bg-opacity-50 p-4 rounded-lg shadow-inner">{result.answer}</p>
            <h4 className="font-bold text-lg mt-4 mb-2 text-indigo-700">Sources:</h4>
            <ul className="list-none p-0 space-y-2">
              {result.sources.map((source, index) => (
                <li key={index} className="flex items-center text-indigo-600 bg-white bg-opacity-50 p-2 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                  <FileText className="w-5 h-5 mr-2 text-purple-500" />
                  {source}
                </li>
              ))}
            </ul>
          </div>
        </CardFooter>
      )}
    </Card>
    <UploadBox />
    {/* <Indexing /> */}
    </>
  )
}