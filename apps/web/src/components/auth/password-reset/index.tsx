import DefaultLayout from "@/src/layouts/default-layout";
import ParticleLayout from "@/src/layouts/particle-layout";
import { Button } from "@components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { CardFooter } from "@components/ui/card";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { cn } from "@/src/lib/utils";
import { useState } from "react";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [diagnostics, setDiagnostics] = useState<string[]>([]);

  async function resetPassword() {}

  return (
    <DefaultLayout>
      <ParticleLayout
        props={{
          contentPanelClassName: "opacity-80",
        }}
      >
        <Card
          className={cn(
            "w-full max-w-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          )}
        >
          <CardHeader>
            <CardTitle>Reset your password</CardTitle>

            <CardDescription>
              Enter your email below to reset your password
            </CardDescription>
          </CardHeader>

          <form>
            <CardContent>
              <div className="flex flex-col gap-6">
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
                      onChange={(e) => setPassword(e.target.value)}
                      value={password ?? ""}
                      autoFocus
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 cursor-pointer"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
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

                <div className="grid gap-2">
                  <Label htmlFor="password-repeat">Repeat Password</Label>

                  <div className="relative">
                    <Input
                      id="password-repeat"
                      name="password-repeat"
                      type={showPasswordRepeat ? "text" : "password"}
                      autoComplete="current-password"
                      className="pr-10"
                      required
                      onChange={(e) => setPasswordRepeat(e.target.value)}
                      value={passwordRepeat ?? ""}
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
                      onClick={() =>
                        setShowPasswordRepeat((current) => !current)
                      }
                      autoFocus
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

            <CardFooter className="mt-6 flex-col gap-2">
              <Button
                className="w-full cursor-pointer"
                onMouseUp={() => resetPassword()}
              >
                Reset Password
              </Button>
            </CardFooter>
          </form>
        </Card>
      </ParticleLayout>
    </DefaultLayout>
  );
}
