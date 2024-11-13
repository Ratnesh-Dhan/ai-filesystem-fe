"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Search } from "lucide-react"


function Home() {
  const [query, setQuery] = useState('')
  const [document, setDocument] = useState<File | null>(null)
  const [ans, setAns] = useState("");
  // const [result, setResult] = useState<{ 
  //   answer: string; 
  //   source_details: Array<{
  //     file_name: string;
  //     page_number: string;
  //     text_content: string;
  //   }>;
  // } | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("running function");
  
    if (!query) return;
    setIsSearching(true);
    setAns(''); // Clear previous answer if any
    try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/query`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          query: query
      })
  });
  

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const reader = response.body?.pipeThrough(new TextDecoderStream("utf-8"))
      .getReader()
      if (!reader) {
        console.log("no reader")
        throw new Error('Failed to create reader');
        }
        
      while(true) {
        const { value, done } = await reader?.read();
        console.log(value);
        if(done)
          break; 
        setAns((prev)=> prev + value);
      }
    }
    catch (error) {
      console.log("some thing went wrong");
    }finally {
        setIsSearching(false); // Reset searching state
      }


  
    // try {
    //   const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/query`, {
    //     method: "POST",
    //     headers: {
    //       Accept: "application/json, text/plain, */*",
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ query: query }),
    //   });
    //   console.log(response);
  
    //   if (!response.ok || !response.body) {
    //     throw new Error(`Error: ${response.statusText}`);
    //   }
  
    //   const reader = response.body.getReader();
    //   const decoder = new TextDecoder();
  
    //   let buffer = ''; // Temporary storage for accumulating text
  
    //   while (true) {
    //     const { value, done } = await reader.read();
    //     if (done) break;
  
    //     // Decode the received chunk
    //     buffer += decoder.decode(value, { stream: true });
  
    //     // Process each line (each message chunk is newline-separated)
    //     let lines = buffer.split('\n\n'); // Split by SSE message separator
    //     lines.slice(0, -1).forEach((line) => {
    //       // Check if the line starts with "data: "
    //       if (line.startsWith("data: ")) {
    //         const dataText = line.substring(6); // Remove "data: " prefix
  
    //         // Handle special source signals
    //         if (dataText.startsWith("SOURCES_START")) {
    //           const sourcesData = JSON.parse(dataText.replace("SOURCES_START", "").replace("SOURCES_END", ""));
    //           console.log("Sources:", sourcesData); // Process sources as needed
    //         } else {
    //           setAns((prevAns) => prevAns + dataText); // Append regular text to answer
    //         }
    //       }
    //     });
  
    //     // Retain the last incomplete message line in the buffer
    //     buffer = lines[lines.length - 1];
    //   }
    // } catch (error) {
    //   console.error("An error occurred while fetching the streaming response:", error);
    // } finally {
    //   setIsSearching(false); // Reset searching state
    // }
  };
  

  return (
    <>
    <Card className="mt-10 w-full max-w-3xl mx-auto bg-gradient-to-br from-purple-100 to-indigo-100 shadow-lg">
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
            {isSearching ? "Searching..." : "Search Documents"}
          </Button>
        </form>
      </CardContent>
      {true && (
        <CardFooter className="flex flex-col items-start p-6 bg-white bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-b-lg">
          <div className="w-full">
            <h3 className="font-bold text-lg mb-2 text-purple-700">Answer:</h3>
            <p className="text-gray-800 bg-white bg-opacity-50 p-4 rounded-lg shadow-inner">{ans}</p>
            <h4 className="font-bold text-lg mt-4 mb-2 text-indigo-700">Sources:</h4>
            <ul className="list-none p-0 space-y-2">
              {/* {result.source_details.map((source, index) => (
                <li key={index} className="flex items-center text-indigo-600 bg-white bg-opacity-50 p-2 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                  <FileText className="w-5 h-5 mr-2 text-purple-500" />
                  {source.file_name}
                </li>
              ))} */}
            </ul>
          </div>
        </CardFooter>
      )}
    </Card>

    </>
  )
}

export default Home