import SignInForm from "@/components/SignInForm";

export default function Signin({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <p>this is the signin page</p>
      <SignInForm />
    </div>
  );
}
