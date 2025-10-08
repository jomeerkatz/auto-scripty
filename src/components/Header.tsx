import clsx from "clsx";
interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <>
      <p className={clsx("text-4xl", className)}>AutoScript</p>
    </>
  );
};

export default Header;
