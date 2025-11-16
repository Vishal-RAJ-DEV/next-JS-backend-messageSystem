import { z } from "zod";

export const AcceptMessageSchema = z.object({
    isAcceptingMessages: z.boolean().optional() //optional because user may choose not to update this field
})