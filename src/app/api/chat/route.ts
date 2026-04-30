import { NextRequest } from "next/server";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import {
  getAnthropic,
  buildSystemPrompt,
  CHATBOT_MODEL,
  CHATBOT_MAX_TOKENS,
} from "@/lib/chatbot/client";
import { checkAndIncrement, getClientIp } from "@/lib/chatbot/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
});

function sseEvent(data: object): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(
      sseEvent({ type: "error", message: "Requête invalide." }),
      { status: 400, headers: { "Content-Type": "text/event-stream" } },
    );
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      sseEvent({ type: "error", message: "Format de requête invalide." }),
      { status: 400, headers: { "Content-Type": "text/event-stream" } },
    );
  }

  const ip = getClientIp(req);
  const limit = await checkAndIncrement(ip);

  if (!limit.allowed) {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode(
            sseEvent({
              type: "error",
              message:
                "Vous avez atteint la limite de messages du jour. Pour continuer la discussion, contactez-nous sur WhatsApp au 06 50 84 97 38.",
            }),
          ),
        );
        controller.close();
      },
    });
    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        const apiStream = getAnthropic().messages.stream({
          model: CHATBOT_MODEL,
          max_tokens: CHATBOT_MAX_TOKENS,
          system: buildSystemPrompt(),
          messages: parsed.data.messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        });

        for await (const event of apiStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(
                sseEvent({ type: "delta", text: event.delta.text }),
              ),
            );
          }
        }

        controller.enqueue(encoder.encode(sseEvent({ type: "done" })));
      } catch (err) {
        let message = "Une erreur est survenue. Réessayez dans un instant.";
        if (err instanceof Anthropic.RateLimitError) {
          message =
            "Le service est temporairement surchargé. Réessayez dans quelques minutes.";
        } else if (err instanceof Anthropic.AuthenticationError) {
          console.error("Anthropic auth error", err);
          message = "Configuration manquante côté serveur.";
        } else {
          console.error("Chat stream error", err);
        }
        controller.enqueue(
          encoder.encode(sseEvent({ type: "error", message })),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
