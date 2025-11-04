import clsx from "clsx";

/**
 * Props for the Footer component
 */
interface FooterProps {
  /** Optional additional CSS classes to apply to the footer */
  className?: string;
}

/**
 * Footer Component
 * 
 * Displays the application footer. Currently a placeholder component
 * that can be extended with additional footer content.
 * 
 * @param className - Optional additional CSS classes
 */
const Footer = ({ className }: FooterProps) => {
  return (
    <div
      className={clsx(
        "w-full p-4 bg-blue-500 flex-grow max-h-[150px]",
        className
      )}
    >
      <p>hello footer</p>
    </div>
  );
};

export default Footer;
