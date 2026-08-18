import * as z from "zod";

export const RegisterValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32),
});

export type RegisterDto = z.infer<typeof RegisterValidator>;

export const LoginValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32),
});

export type LoginDto = z.infer<typeof LoginValidator>;
