
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { account, ID } from "@/lib/appwrite";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const newUser = await account.create({
        userId: ID.unique(),
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
      });

      // Sign in so we can save the user's initial preferences.
      await account.createEmailPasswordSession({
        email: formData.email.trim(),
        password: formData.password,
      });

      await account.updatePrefs({
        prefs: {
          role: "customer",
        },
      });

      setSuccess(`Welcome, ${newUser.name}! Your account is ready.`);

      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.message ||
          "Account creation failed. Check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-white shadow-2xl">
        <CardHeader className="space-y-2">
          <p className="text-sm font-medium text-blue-400">
            Customer Support System
          </p>

          <CardTitle className="text-2xl font-bold">
            Create your account
          </CardTitle>

          <CardDescription className="text-slate-400">
            Register as a customer to get started.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>

              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                maxLength={100}
                required
                className="border-slate-700 bg-slate-950 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>

              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="border-slate-700 bg-slate-950 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>

              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
                className="border-slate-700 bg-slate-950 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium"
              >
                Confirm password
              </label>

              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Enter your password again"
                autoComplete="new-password"
                required
                className="border-slate-700 bg-slate-950 text-white placeholder:text-slate-500"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                role="status"
                className="rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300"
              >
                {success}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create customer account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
