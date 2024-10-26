
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import toast from 'react-hot-toast';

const UploadBox = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0]);
    }
  }, []);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleClick = async (event: React.FormEvent) => {
    toast.success("clicked", {position: "bottom-left"});
    event.preventDefault();
    console.log("upload button clicked");
    if (!file) {
        alert("Please select a file to upload.");
        return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
        console.log({formData})
        const response = await axios.post(`/api/upload`, formData);

        console.log(response.data.message);
        toast.success("Upload Succesful", {position: 'bottom-right'});
        setFile(null);
        (document.getElementById('file-upload') as HTMLInputElement).value = ''; // Clear the input field
    }catch (e){
        console.error(e);
        toast.error("Upload unsuccesful",{position: 'bottom-right'});
    }
  }

  return (
    <div className="my-10 mx-auto w-[55%] p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="file-upload">
          Upload a file:
        </label>
        <div 
          className="relative mb-4 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          {file ? (
            <p className="text-sm text-gray-600">Selected file: {file.name}</p>
          ) : (
            <p className="text-sm text-gray-600">Drag and drop a file here, or click to select</p>
          )}
          <input
            id="file-upload"
            type="file"
            onChange={(event) => { setFile(event.target.files ? event.target.files[0] : null) }}
            className="hidden"
          />
        </div>
        <Button 
          type="submit" 
          className="mt-2 w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3 rounded-lg transition-all duration-300 transform shadow-md active:shadow-lg active:scale-105"
          onClick={handleClick}
        >
            Upload
        </Button>
      </div>
  )
}

export default UploadBox
