import clsx from "clsx";

interface FooterProps {
  className?: string;
}

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
