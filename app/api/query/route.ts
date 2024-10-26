import axios from "axios";

export async function POST(request: Request, response: Response) {
    try {
        const body= await request.json();
        const {query} = body;
        const result = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/query`, { query: query });
        console.log({result});
        // Simulated response
        const simulatedResponse = {
          answer: result.data.response.answer, 
          sources: result.data.response.sources
        }
  
        return Response.json({ message: 'Submission successful', simulatedResponse: simulatedResponse });
      } catch (error) {
        console.error("'Error:'", error)
        return new Response("An error occurred while searching", {status: 400})
      } 
}