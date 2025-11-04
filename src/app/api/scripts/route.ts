import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

/**
 * Zod schema for validating script data before database insertion.
 * Ensures title is provided (non-empty string) and text_script is a string.
 */
const ScriptTableSchema = z.object({
  title_script: z.string().min(1, "error in zod: title is required"),
  text_script: z.string(),
});

/**
 * POST /api/scripts
 * 
 * Creates a new script in the database.
 * 
 * Request body should contain:
 * - title_script: string (required, min length 1)
 * - text_script: string
 * 
 * Returns:
 * - 200: Success with script data
 * - 400: Validation error (invalid input)
 * - 500: Server error (database or unexpected error)
 * 
 * @param request - Next.js request object containing script data
 * @returns JSON response with success status and data, or error details
 */
export async function POST(request: Request) {
  try {
    console.log("API called"); // Debug log

    const rawData = await request.json();
    console.log("Raw data:", rawData); // Debug log

    // Validate input data against schema
    const validatedData = ScriptTableSchema.parse(rawData);
    console.log("Validated data:", validatedData); // Debug log

    // Create Supabase client with server-side authentication
    const supabase = await createClient();
    console.log("Supabase client created"); // Debug log

    // Insert validated data into the text-script table
    const { data, error } = await supabase
      .from("text-script")
      .insert(validatedData);

    console.log("Supabase result:", { data, error }); // Debug log

    if (error) {
      console.error("Supabase error:", error); // Debug log
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, data: data });
  } catch (error) {
    console.error("Catch block error:", error); // Debug log
    
    // Handle validation errors separately with detailed error information
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: "validation failed",
          details: error.issues,
        },
        { status: 400 }
      );
    }
    
    // Handle unexpected errors
    return Response.json({ error: "server error" }, { status: 500 });
  }
}
