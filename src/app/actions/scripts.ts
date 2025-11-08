"use server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const createScriptSchema = z.object({
  titleOfScript: z.string().min(3).max(100).trim(),
  textOfScript: z.string().min(10).trim(),
});

type CreateScriptParams = z.infer<typeof createScriptSchema>;

export default async function createScriptAction(params: CreateScriptParams) {
  try {
    // validate the params using zod
    const validatedParams = createScriptSchema.safeParse(params);

    // check if the params are valid
    if (!validatedParams.success) {
      // if not valid, return the errors
      return {
        success: false,
        error: validatedParams.error.issues
          .map((currentIssue) => currentIssue.message)
          .join(", "),
      };
    }

    // create the supabase client
    const supabaseClient = await createClient();

    // get the session from the supabase client
    const { data: sessionData, error: sessionError } =
      await supabaseClient.auth.getSession();

    // check if the session is valid
    if (!sessionData.session) {
      return {
        success: false,
        error: "Unauthorized: " + (sessionError?.message || "No session found"),
      };
    }

    // session found and valid, continue with inserting the script into the database
    // get title and script text from the validated params

    const { titleOfScript, textOfScript } = validatedParams.data;

    // insert the script into the database
    const { data: scriptData, error: scriptError } = await supabaseClient
      .from("text-script")
      .insert({
        title_script: titleOfScript,
        text_script: textOfScript,
      })
      .select()
      .single();

    // check if the script was inserted successfully
    if (scriptError) {
      return {
        success: false,
        error:
          "Failed to create script: " +
          (scriptError.message ||
            "Unknown error occurred while creating script"),
      };
    }

    return {
      success: true,
      data: scriptData,
    };
  } catch (error) {
    return {
      success: false,
      error:
        "Unexpected error: " +
        (error instanceof Error ? error.message : String(error)),
    };
  }
}
