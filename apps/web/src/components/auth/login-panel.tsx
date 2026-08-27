import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { cn } from "@lib/utils";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface LoginPanelProps {
  className?: string;
  onSwitchRegister: () => void;
  setLoginEmail?: (email: string) => void;
  setLoginPassword?: (password: string) => void;
  loginEmail?: string;
  loginPassword?: string;
}

export default function LoginPanel(props: LoginPanelProps) {
  const [showPassword, setShowPassword] = useState(false);

  async function login() {
    console.log(props.loginEmail, props.loginPassword);
  }

  return (
    <Card className={cn("w-full max-w-sm", props.className)}>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>

        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>

        <CardAction>
          <Button
            type="button"
            variant="link"
            className="cursor-pointer"
            onClick={props.onSwitchRegister}
          >
            Register
          </Button>
        </CardAction>
      </CardHeader>

      <form>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                autoComplete="email"
                required
                onChange={(e) => props.setLoginEmail?.(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="pr-10"
                  required
                  onChange={(e) => props.setLoginPassword?.(e.target.value)}
                  value={props.loginPassword ?? ""}
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
                  autoFocus
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="mt-6 flex-col gap-2">
          <Button
            type="submit"
            className="w-full cursor-pointer"
            onMouseUp={() => login()}
          >
            Login
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full cursor-pointer"
          >
            Forgot Password
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
