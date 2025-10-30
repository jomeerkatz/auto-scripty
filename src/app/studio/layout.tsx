import Header from "@/components/Header";
import Footer from "@/components/Footer";
interface StudioLayoutProps {
  children: React.ReactNode;
}

export default function StudioLayout({ children }: StudioLayoutProps) {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <div className="">{children}</div>
      </div>
    </>
  );
}
