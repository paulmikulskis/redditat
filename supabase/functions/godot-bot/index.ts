// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'

// https://github.com/discordeno/template/blob/main/minimal/mod.ts
import {
  createBot,
  Intents,
  startBot,
  sendMessage,
  CreateMessage,
  Message,
  ApplicationCommand,
  send,
} from "https://deno.land/x/discordeno@13.0.0/mod.ts";
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.2.2";

import { passPromptToSelfBot } from "./salai.ts";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
};

const bot = createBot({
  token: Deno.env.get("GODOT_DISCORD_BOT_TOKEN") || "",
  intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
  events: {
    ready() {
      console.log("Successfully connected to gateway");
    },
    messageCreate(bot, message) {
      console.log(`received message: '${message.content}'`);
      const content = "anime 8k style beautiful colors" + message.content.slice(11);
      if (message.content.slice(0, 11) == "i fuck with") {
        const mes = {
          content: `I'll get to work on that for you right away ${message.tag} ;)`,
        } as CreateMessage;
        sendMessage(bot, message.channelId, mes);
        passPromptToSelfBot(content);
      }
    },
  },
});

await startBot(bot);

serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );
    // Now we can get the session or user object
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    // And we can run queries in the context of our authenticated user
    const { data, error } = await supabaseClient.from("users").select("*");
    if (error) throw error;

    return new Response(JSON.stringify({ user, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
