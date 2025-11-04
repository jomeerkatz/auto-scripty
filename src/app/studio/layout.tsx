import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Props for the StudioLayout component
 */
interface StudioLayoutProps {
  /** Child components to render within the studio layout */
  children: React.ReactNode;
}

/**
 * Studio Layout Component
 * 
 * Provides a dedicated layout wrapper for the studio section.
 * Ensures full-height layout structure for studio pages.
 * 
 * Note: Header and Footer are imported but not used here as they're
 * already provided by the root layout. This layout focuses on studio-specific styling.
 * 
 * @param children - Child page components to render
 */
export default function StudioLayout({ children }: StudioLayoutProps) {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <div className="">{children}</div>
      </div>
    </>
  );
}
