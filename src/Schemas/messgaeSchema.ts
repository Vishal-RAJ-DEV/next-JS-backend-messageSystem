import { z } from "zod";

export const MessageSchema = z.object({
    message: z
        .string()
        .min(10, { message: "Message cannot be empty" })
        .max(500, { message: "Message cannot exceed 500 characters" })
})