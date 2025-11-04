import Link from "next/link";
import clsx from "clsx";

/**
 * Props for the Header component
 */
interface HeaderProps {
  /** Optional additional CSS classes to apply to the header */
  className?: string;
}

/**
 * Header Component
 * 
 * Displays the application header with branding and navigation.
 * Includes a link back to the home page.
 * 
 * @param className - Optional additional CSS classes
 */
const Header = ({ className }: HeaderProps) => {
  return (
    <div className={clsx("w-full p-4 bg-blue-500 min-h-[80px]", className)}>
      <Link href="/">
        <p className="text-4xl">Auto Scripty</p>
      </Link>
    </div>
  );
};

export default Header;
