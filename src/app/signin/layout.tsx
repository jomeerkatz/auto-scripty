interface SigninLayoutProps {
  children: React.ReactNode;
}

export default function SigninLayout({ children }: SigninLayoutProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div>{children}</div>
    </div>
  );
}
