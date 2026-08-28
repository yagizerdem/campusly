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
import { useState, type Dispatch } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "@/src/lib/firebase-app";
import {
  LoginValidator,
  type LoginDto,
} from "@campusly/shared/src/dto/auth-dto";
import { toast } from "@components/ui/toast";
import { FirebaseError } from "firebase/app";
import authCodeToMessage from "@campusly/shared/src/auth/firebase/client-auth-error-message";
import { useDispatch } from "react-redux";
import { setIsLoading } from "@/src/store/slice/loader-slice";

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
  const [diagnostics, setDiagnostics] = useState<Dispatch<string[]> | string[]>(
    [],
  );
  const dispatch = useDispatch();

  async function login() {
    try {
      dispatch(setIsLoading(true));
      setDiagnostics([]); // clear error messages
      if (!props.loginEmail || !props.loginPassword) {
        toast.add({
          type: "destructive",
          title: "Login failed",
          description: "Please check your email and password.",
        });
        setDiagnostics(["Email and password must be provided."]);
        return;
      }

      const parseResult = await LoginValidator.safeParseAsync({
        email: props.loginEmail,
        password: props.loginPassword,
      } as LoginDto);

      if (!parseResult.success) {
        setDiagnostics(
          parseResult.error.issues.flatMap((issue) => issue.message),
        );
        toast.add({
          type: "destructive",
          title: "Login failed",
          description: "Please check your email and password.",
        });
        return;
      }

      const auth = getAuth(firebaseApp);
      await signInWithEmailAndPassword(
        auth,
        props.loginEmail ?? "",
        props.loginPassword ?? "",
      );

      toast.add({
        type: "success",
        title: "Login successful",
        description: `Login successfull`,
      });
    } catch (err: any) {
      console.error(err);

      if (err instanceof FirebaseError) {
        const message = authCodeToMessage(err.code);
        toast.add({
          type: "destructive",
          title: "Login failed",
          description: message,
        });
      } else {
        toast.add({
          type: "destructive",
          title: "Login failed",
          description: "Unexpected error occurred. Please try again later.",
        });
      }
    } finally {
      dispatch(setIsLoading(false));
    }
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
          {diagnostics.length > 0 &&
            typeof diagnostics !== "function" &&
            diagnostics.map((diagnostic: string, index: number) => (
              <Label key={index} className="text-sm text-red-500 mt-2">
                {diagnostic}
              </Label>
            ))}
        </CardContent>

        <CardFooter className="mt-6 flex-col gap-2">
          <Button className="w-full cursor-pointer" onMouseUp={() => login()}>
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
