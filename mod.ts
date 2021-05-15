import {
  camelize,
  decode,
  DiscordInteractionResponseTypes,
  Interaction,
  InteractionResponseTypes,
  InteractionTypes,
  json,
  rest,
  serve,
  setApplicationId,
  validateRequest,
  verifySignature,
} from "./deps.ts";
import { aliases, commands } from "./src/commands/mod.ts";
import translate, { loadAllLanguages } from "./src/languages/translate.ts";
import { isInteractionResponse } from "./src/utils/isInteractionResponse.ts";
import { logWebhook } from "./src/utils/logWebhook.ts";
import hasPermissionLevel from "./src/utils/permissionLevels.ts";
import redeploy from "./src/utils/redeploy.ts";

// Loads the rest information for all future requests
// TODO: move to rest serverless instead
const token = Deno.env.get("DISCORD_TOKEN");
rest.token = `Bot ${token}`;
setApplicationId(new TextDecoder().decode(decode(token?.split(".")[0] || "")) || "");

serve({
  "/": main,
  "/redeploy": redeploy,
  "/translations": loadAllLanguages
});

async function main(request: Request) {
  // Validate the incmoing request; whether or not, it includes
  // the specified headers that are sent by Discord.
  const { error } = await validateRequest(request, {
    POST: {
      headers: ["X-Signature-Ed25519", "X-Signature-Timestamp"],
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  const publicKey = Deno.env.get("DISCORD_PUBLIC_KEY");
  if (!publicKey) {
    return json({
      error: "Missing Discord public key from environment variables.",
    });
  }

  const signature = request.headers.get("X-Signature-Ed25519")!;
  const timestamp = request.headers.get("X-Signature-Timestamp")!;

  const { body, isValid } = verifySignature({
    publicKey,
    signature,
    timestamp,
    body: await request.text(),
  });
  if (!isValid) {
    return json(
      { error: "Invalid request; could not verify the request" },
      {
        status: 401,
      }
    );
  }

  const payload = camelize<Interaction>(JSON.parse(body));
  if (payload.type === InteractionTypes.Ping) {
    return json({
      type: InteractionResponseTypes.Pong,
    });
  } else if (payload.type === InteractionTypes.ApplicationCommand) {
    if (!payload.data?.name) {
      return json({
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: "Something went wrong. I was not able to find the command name in the payload sent by Discord.",
        },
      });
    }

    const command = commands[payload.data.name] || aliases[payload.data.name];
    if (!command) {
      // Try to see if the command is an alias that was translated
      return json({
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: "Something went wrong. I was not able to find this command.",
        },
      });
    }

    // Make sure the user has the permission to run this command.
    if (!(await hasPermissionLevel(command, payload))) {
      return json({
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: translate(payload.guildId!, "MISSING_PERM_LEVEL"),
        },
      });
    }

    const result = await command.execute(payload);
    if (!isInteractionResponse(result)) {
      await logWebhook(payload).catch(console.error);
      return json({
        data: result,
        type: DiscordInteractionResponseTypes.ChannelMessageWithSource,
      });
    }

    // DENO/TS BUG DOESNT LET US SEND A OBJECT WITHOUT THIS OVERRIDE
    return json(result as unknown as { [key: string]: unknown });
  }

  return json({ error: "Bad request" }, { status: 400 });
}
