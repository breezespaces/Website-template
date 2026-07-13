import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PasswordResetForm from "@/components/auth/password-reset";

export default function PasswordResetPage() {
  return (
    <Card className="w-full border-none shadow-none bg-white p-6 ring-0">
      <CardHeader className="space-y-1 text-center pb-8">
        <CardTitle className="text-3xl font-bold font-azeret!">
          Password Reset
        </CardTitle>
        <CardDescription className="text-xs font-normal text-primary">
          We Will Help You Reset Your Password
        </CardDescription>
      </CardHeader>
      <PasswordResetForm />
    </Card>
  );
}
