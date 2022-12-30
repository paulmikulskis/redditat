import { Globals } from "./globals.ts";

export async function passPromptToSelfBot(prompt: string) {
  const payload = {
    type: 2,
    application_id: "936929561302675456",
    guild_id: Globals.SERVER_ID,
    channel_id: Globals.CHANNEL_ID,
    session_id: "0a010c9eaf31b12c8b2345c0d38bbb7c",
    data: {
      version: "994261739745050686",
      id: "938956540159881230",
      name: "imagine",
      type: 1,
      options: [{ type: 3, name: "prompt", value: prompt }],
      application_command: {
        id: "938956540159881230",
        application_id: "936929561302675456",
        version: "994261739745050686",
        default_permission: true,
        default_member_permissions: null,
        type: 1,
        name: "imagine",
        description: "There are endless possibilities...",
        dm_permission: true,
        options: [
          {
            type: 3,
            name: "prompt",
            description: "The prompt to imagine",
            required: true,
          },
        ],
      },
      attachments: [],
    },
  };

  const headers = new Headers({
    authorization: Globals.SALAI_TOKEN,
    "Content-Type": "application/json",
  });

  const response = await fetch("https://discord.com/api/v9/interactions", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  return response;
}
