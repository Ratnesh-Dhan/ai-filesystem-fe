'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Trash2, FileText, Loader2 } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

// type File = {
//   id: string;
//   name: string;
// }

export default function DeleteFilesPage() {
  const [files, setFiles] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    fetchFiles()
  }, []);

  // useEffect(() => {
  //   console.log(files);
  // }, [files]);

  const fetchFiles = async () => {
    setIsFetching(true)
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/list-files`)
      setFiles(response.data.files)
      // console.log(response.data.files);
    } catch (error) {
      console.error("Error fetching files:", error)
    } finally {
      setIsFetching(false)
    }
  }

  const handleCheckboxChange = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleDeleteClick = () => {
    if (selectedFiles.length > 0) {
      setIsDeleteDialogOpen(true)
    }
  }

  const handleConfirmDelete = async () => {
    console.log({selectedFiles});
    setIsLoading(true)
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_API}/delete-files`, { data: { files: selectedFiles } })
      if(response.status===200)
          toast.success("Deleted Successfully")
      fetchFiles();
      // setFiles(prev => prev.filter(file => !selectedFiles.includes(file)))
      setSelectedFiles([])
    } catch (error) {
      // toast.error(error.error);
      console.error("Error deleting files:", error)
    } finally {
      setIsLoading(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const LoadingScreen = () => (
    <div className="flex flex-col items-center justify-center h-64">
      <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
      <p className="mt-4 text-lg text-gray-600">Loading files...</p>
    </div>
  )

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-3xl mx-auto bg-gradient-to-br from-purple-100 to-indigo-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
          <CardTitle className="text-xl sm:text-2xl font-bold flex items-center justify-between">
            <span className="flex items-center">
              <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Delete Files
            </span>
            <Button
              onClick={handleDeleteClick}
              disabled={selectedFiles.length === 0 || isFetching}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              Delete Selected
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {isFetching ? (
            <LoadingScreen />
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div key={file} className="flex items-center space-x-2 p-2 bg-white rounded-lg shadow-sm">
                  <Checkbox
                    id={file}
                    checked={selectedFiles.includes(file)}
                    onCheckedChange={() => handleCheckboxChange(file)}
                  />
                  <label
                    htmlFor={file}
                    className="text-sm sm:text-base text-gray-700 flex items-center cursor-pointer"
                  >
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-500" />
                    {file}
                  </label>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-white bg-opacity-60 backdrop-filter backdrop-blur-lg p-4">
          <p className="text-sm text-gray-600">
            {isFetching ? 'Loading...' : `${selectedFiles.length} file(s) selected`}
          </p>
        </CardFooter>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedFiles.length} file(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Yes, delete'
              )}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}