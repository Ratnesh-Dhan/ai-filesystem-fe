import axios from "axios";

export async function POST(request: Request, response: Response) {
    try {
        const formData = await request.formData()
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/upload`, formData);
        return Response.json({message: "Upload Succesful"});
         }catch (e: any){
        return new Response(e.message,  {status: 500});

    }
}