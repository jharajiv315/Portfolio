import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clearAllUserErrors, login } from "@/store/slices/userSlice";
import { toast } from "react-toastify";
import SpecialLoadingButton from "./sub-components/SpecialLoadingButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleLogin = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and password.");
      return;
    }
    dispatch(login(email.trim(), password.trim()));
  };

  useEffect(() => {
    // Only display genuine login error messages (ignore session verification noise)
    if (
      error &&
      !error.toLowerCase().includes("authenticated") &&
      !error.toLowerCase().includes("session")
    ) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [dispatch, isAuthenticated, error, loading, navigateTo]);

  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="min-h-[100vh] flex items-center justify-center py-12 px-4">
        <div className="mx-auto grid w-full max-w-[360px] gap-6">
          <div className="grid gap-2 text-center">
            <span className="text-[11px] uppercase tracking-wider text-primary font-semibold block mb-1">
              Admin Portal
            </span>
            <h1 className="text-3xl font-serif font-bold text-foreground">Admin Login</h1>
            <p className="text-balance text-muted-foreground text-xs sm:text-sm">
              Enter your credentials to access your administrative portfolio dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} autoComplete="off" className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                name="email"
                autoComplete="off"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="admin-password">Password</Label>
                <Link
                  to="/password/forgot"
                  className="ml-auto inline-block text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="admin-password"
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>
            {loading ? (
              <SpecialLoadingButton content={"Logging In"} />
            ) : (
              <Button
                type="submit"
                className="w-full rounded-full shadow-sm mt-2"
              >
                Sign In
              </Button>
            )}
          </form>
        </div>
      </div>
      <div className="hidden lg:flex justify-center items-center bg-muted/40 p-8 border-l border-border">
        <img src="/login.png" alt="login" className="max-w-[400px] w-full object-contain" />
      </div>
    </div>
  );
};

export default Login;
