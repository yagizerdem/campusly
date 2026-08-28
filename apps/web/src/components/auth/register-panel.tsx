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
import { useEffect, useState, type Dispatch } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axiosWrapper from "@/src/lib/axios-wrapper";
import {
  type RegisterDto,
  // RegisterValidator,
} from "@campusly/shared/src/dto/auth-dto";
import type IApiResponse from "@campusly/shared/src/util/api-response";

import axios from "axios";
import { toast } from "@components/ui/toast";
import { useDispatch } from "react-redux";
import { setIsLoading } from "@store/slice/loader-slice";

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
  const [diagnostics, setDiagnostics] = useState<Dispatch<string[]> | string[]>(
    [],
  );
  const dispatch = useDispatch();
  const { data, error, isError, isSuccess, isPending, mutate } = useMutation({
    mutationFn: register,
  });

  async function register() {
    setDiagnostics([]); // clear error messsasges

    //@ts-ignore
    const apiResponse: IApiResponse<unknown> = (
      await axiosWrapper.post("/api/auth/register", {
        email: props.registerEmail,
        password: props.registerPassword,
      } as RegisterDto)
    ).data;
  }

  useEffect(() => {
    if (!isError) return;

    if (axios.isAxiosError(error)) {
      const apiResponse: IApiResponse<unknown> = error.response?.data;

      if (apiResponse.diagnostics && apiResponse.diagnostics?.length > 0) {
        setDiagnostics(apiResponse.diagnostics);
      }

      if (apiResponse.message) {
        setDiagnostics((prev: string[]) => [apiResponse.message, ...prev]);
      }

      toast.add({
        type: "error",
        title: "Error occurred while registering",
        description: apiResponse?.message ?? "An unexpected error occurred.",
      });
    } else {
      toast.add({
        type: "error",
        title: "Error occurred while registering",
        description: "An unexpected error occurred.",
      });
    }
  }, [isError, error]);

  useEffect(() => {
    if (!isSuccess) return;

    toast.add({
      type: "success",
      title: "Account created successfully",
      description: "You can now log in with your new account.",
    });

    async function redirectToLogin() {
      dispatch(setIsLoading(true));
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.add({
        type: "info",
        title: "Redirecting to login",
        description: "You will be redirected to the login panel shortly.",
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      props.onSwitchLogin();
      dispatch(setIsLoading(false));
    }

    redirectToLogin();
  }, [isSuccess, data]);

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
            disabled={isPending}
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

          {diagnostics.length > 0 &&
            typeof diagnostics !== "function" &&
            diagnostics.map((diagnostic: string, index: number) => (
              <Label key={index} className="text-sm text-red-500 mt-2">
                {diagnostic}
              </Label>
            ))}
        </CardContent>

        <CardFooter className="mt-6">
          <Button
            className="w-full cursor-pointer"
            onMouseUp={() => mutate()}
            disabled={isPending}
          >
            Create Account
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
