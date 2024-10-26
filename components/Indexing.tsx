import React from 'react'
import { Button } from "@/components/ui/button"
import axios from 'axios'

const Indexing = () => {
    const handleClick = async(event: React.FormEvent) => {
        event.preventDefault();
        alert("started indexing");
    try{
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/index`,{})
        console.log(response.data)
        alert(response.data);
    }catch (e){
        console.log(e);
    }

  }
  return (
    <div className="pt-10 w-[55%] mx-auto">
        <Button 
          onClick={handleClick}
          type="button" 
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          Index Those Files
        </Button>
      </div>
  )
}

export default Indexing