import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "@/components/auth/login";

export default function LoginPage() {
  return (
    <Card className="w-full border-none shadow-none bg-white p-6 ring-0">
      <CardHeader className="space-y-1 text-center pb-8 border-none">
        <CardTitle className="text-3xl font-bold font-azeret!">
          Sign In
        </CardTitle>
        <CardDescription className="text-sm font-medium">
          New to our Product?{" "}
          <Link
            href="/auth/signup"
            className="text-primary font-semibold hover:underline underline-offset-4 decoration-current"
          >
            Create an Account
          </Link>
        </CardDescription>
      </CardHeader>
      <LoginForm />
    </Card>
  );
}
