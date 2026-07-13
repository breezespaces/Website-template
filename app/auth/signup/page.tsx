import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignupForm from "@/components/auth/signup";

export default function SignupPage() {
  return (
    <Card className="w-full border-none shadow-none bg-white p-6 ring-0">
      <CardHeader className="space-y-1 text-center pb-8">
        <CardTitle className="text-3xl font-bold font-azeret!">
          Create an Account
        </CardTitle>
        <CardDescription className="text-sm font-medium">
          Have an Account?{" "}
          <Link
            href="/auth/login"
            className="text-primary font-semibold hover:underline underline-offset-4 decoration-current"
          >
            Sign In
          </Link>
        </CardDescription>
      </CardHeader>
      <SignupForm />
    </Card>
  );
}
