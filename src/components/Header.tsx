import clsx from "clsx";
interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <div className={clsx("w-full p-4 bg-blue-500 min-h-[80px]", className)}>
      <p className="text-4xl">AutoScript</p>
    </div>
  );
};

export default Header;
