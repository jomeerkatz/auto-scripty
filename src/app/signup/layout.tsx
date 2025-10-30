interface SignupLayoutProps {
  children: React.ReactNode;
}

export default function SignupLayout({ children }: SignupLayoutProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div>{children}</div>
    </div>
  );
}
