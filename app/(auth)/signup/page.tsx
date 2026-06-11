import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { SignupForm } from "@/components/auth/signup-form";

export default function LoginPage() {
  return (
    <AuthCard>
      <div className="space-y-6">
        <AuthHeader title="Welcome back" description="Sign in to your account" />

        <SignupForm />
      </div>
    </AuthCard>
  );
}
