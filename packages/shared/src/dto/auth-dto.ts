import * as z from "zod";

const strongPasswordRegxp =
  /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8}$/;

/**
^                         Start anchor
(?=.*[A-Z].*[A-Z])        Ensure string has one uppercase letters.
(?=.*[!@#$&*])            Ensure string has one special case letter.
(?=.*[0-9].*[0-9])        Ensure string has one digits.
(?=.*[a-z].*[a-z].*[a-z]) Ensure string has one lowercase letters.
.{8}                      Ensure string is of length 8.
$   
   */

const emailValidator = z.string().email("Invalid email address");
const passwordValidator = z.string().min(8).max(32).regex(strongPasswordRegxp, {
  message:
    "Password must contain at least 1 uppercase letters (A-Z), 1 lowercase letters (a-z),  1 digit (0-9), and 1 special character (!@#$&*).",
});

export const RegisterValidator = z.object({
  email: emailValidator,
  password: passwordValidator,
});

export type RegisterDto = z.infer<typeof RegisterValidator>;

export const LoginValidator = z.object({
  email: emailValidator,
  password: z.string().min(8).max(32), // do not validate password strength on login, only on registration
});

export type LoginDto = z.infer<typeof LoginValidator>;
