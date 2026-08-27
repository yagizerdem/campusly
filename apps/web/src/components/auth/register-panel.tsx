import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { cn } from "@lib/utils";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axiosWrapper from "@/src/lib/axios-wrapper";
import {
  type RegisterDto,
  RegisterValidator,
} from "@campusly/shared/dto/auth-dto";
import axios from "axios";

interface RegisterPanelProps {
  className?: string;
  onSwitchLogin: () => void;
  readonly registerEmail?: string;
  readonly registerPassword?: string;
  readonly registerPasswordRepeat?: string;
  setRegisterEmail?: (email: string) => void;
  setRegisterPassword?: (password: string) => void;
  setRegisterPasswordRepeat?: (password: string) => void;
}

export default function RegisterPanel(props: RegisterPanelProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);

  const { data, error, isError, isSuccess, isPending, mutate } = useMutation({
    mutationFn: register,
  });

  async function register() {
    const response = await axiosWrapper.post("/api/auth/register", {
      email: props.registerEmail,
      password: props.registerPassword,
    } as RegisterDto);
  }

  useEffect(() => {
    if (!isError) return;

    if (axios.isAxiosError(error)) {
      const apiResponse = error.response?.data;

      console.log(apiResponse);
    }
  }, [isError, error]);

  return (
    <Card className={cn("w-full max-w-sm", props.className)}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>

        <CardDescription>
          Enter your details below to create your account
        </CardDescription>

        <CardAction>
          <Button
            type="button"
            variant="link"
            className="cursor-pointer"
            onClick={props.onSwitchLogin}
          >
            Login
          </Button>
        </CardAction>
      </CardHeader>

      <form>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="register-email">Email</Label>

              <Input
                id="register-email"
                name="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
                required
                onChange={(e) => props.setRegisterEmail?.(e.target.value)}
                value={props.registerEmail ?? ""}
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="register-password">Password</Label>

              <div className="relative">
                <Input
                  id="register-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="pr-10"
                  required
                  onChange={(e) => props.setRegisterPassword?.(e.target.value)}
                  value={props.registerPassword ?? ""}
                  autoFocus
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="register-password-repeat">Repeat Password</Label>

              <div className="relative">
                <Input
                  id="register-password-repeat"
                  name="passwordRepeat"
                  type={showPasswordRepeat ? "text" : "password"}
                  autoComplete="new-password"
                  className="pr-10"
                  required
                  onChange={(e) =>
                    props.setRegisterPasswordRepeat?.(e.target.value)
                  }
                  value={props.registerPasswordRepeat ?? ""}
                  autoFocus
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 cursor-pointer"
                  aria-label={
                    showPasswordRepeat ? "Hide password" : "Show password"
                  }
                  aria-pressed={showPasswordRepeat}
                  onClick={() => setShowPasswordRepeat((current) => !current)}
                >
                  {showPasswordRepeat ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="mt-6">
          <Button className="w-full cursor-pointer" onMouseUp={() => mutate()}>
            Create Account
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
