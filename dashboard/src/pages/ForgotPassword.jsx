import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clearAllUserErrors } from "@/store/slices/userSlice";
import { forgotPassword, clearAllForgotResetPassErrors } from "@/store/slices/forgotResetPasswordSlice";
import { toast } from "react-toastify";
import SpecialLoadingButton from "./sub-components/SpecialLoadingButton";
import { ArrowRight, CheckCircle2, KeyRound } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { loading, error, message, resetPasswordUrl } = useSelector(
    (state) => state.forgotPassword
  );
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleForgotPassword = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your registered email address.");
      return;
    }
    dispatch(forgotPassword(email.trim()));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllForgotResetPassErrors());
    }
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [dispatch, isAuthenticated, error, navigateTo]);

  // Derive local route link from reset URL if same host or full path
  const localResetLink = resetPasswordUrl
    ? resetPasswordUrl.includes("/password/reset/")
      ? `/password/reset/${resetPasswordUrl.split("/password/reset/")[1]}`
      : resetPasswordUrl
    : null;

  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="min-h-[100vh] flex items-center justify-center py-12 px-4">
        <div className="mx-auto grid w-full max-w-[360px] gap-6">
          <div className="grid gap-2 text-center">
            <span className="text-[11px] uppercase tracking-wider text-primary font-semibold block mb-1">
              Account Security
            </span>
            <h1 className="text-3xl font-serif font-bold text-foreground">Forgot Password</h1>
            <p className="text-balance text-muted-foreground text-xs sm:text-sm">
              Enter your email address to request a secure password reset link
            </p>
          </div>

          {localResetLink ? (
            /* Direct Password Reset Access Card */
            <div className="p-6 rounded-2xl bg-card border border-border shadow-md text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <KeyRound className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-base">Reset Access Granted</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Your secure reset token has been verified. Click below to choose your new password:
                </p>
              </div>

              <Button asChild className="w-full rounded-full flex items-center justify-center gap-2 shadow-sm">
                <Link to={localResetLink}>
                  <span>Reset Password Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <div className="pt-2 border-t border-border">
                <Link to="/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  ← Return to Login
                </Link>
              </div>
            </div>
          ) : (
            /* Request Form */
            <form onSubmit={handleForgotPassword} autoComplete="off" className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="reset-email">Registered Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  autoComplete="off"
                  placeholder="jharajiv315@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end">
                <Link
                  to="/login"
                  className="text-xs text-primary hover:underline"
                >
                  Remember your password?
                </Link>
              </div>

              {loading ? (
                <SpecialLoadingButton content={"Verifying Account"} />
              ) : (
                <Button
                  type="submit"
                  className="w-full rounded-full shadow-sm mt-1"
                >
                  Request Password Reset
                </Button>
              )}
            </form>
          )}

          {message && !localResetLink && (
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
      <div className="hidden lg:flex justify-center items-center bg-muted/40 p-8 border-l border-border">
        <img src="/forgot.png" alt="forgot password" className="max-w-[400px] w-full object-contain" />
      </div>
    </div>
  );
};

export default ForgotPassword;
