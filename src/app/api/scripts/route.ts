import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
const ScriptTableSchema = z.object({
  title_script: z.string().min(1, "error in zod: title is required"),
  text_script: z.string(),
});
// todo: check, if this can get deleted
// create script
export async function POST(request: Request) {
  try {
    console.log("API called"); // Debug log

    const rawData = await request.json();
    console.log("Raw data:", rawData); // Debug log

    const validatedData = ScriptTableSchema.parse(rawData);
    console.log("Validated data:", validatedData); // Debug log

    const supabase = await createClient();
    console.log("Supabase client created"); // Debug log

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
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: "validation failed",
          details: error.issues,
        },
        { status: 400 }
      );
    }
    return Response.json({ error: "server error" }, { status: 500 });
  }
}
