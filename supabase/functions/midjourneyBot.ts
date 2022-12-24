import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createBot, Intents, startBot } from "https://deno.land/x/discordeno@13.0.0/mod.ts";

const bot = createBot({
  token: Deno.env.get("DISCORD_TOKEN"),
  intents: Intents.Guilds | Intents.GuildMessages,
  events: {
    ready() {
      console.log("Successfully connected to gateway");
    },
    messageCreate(b, message) {
      // Process the message here with your command handler.
    },
  },
});

await startBot(bot);

serve(async (req) => {
  // process request and return result
});
