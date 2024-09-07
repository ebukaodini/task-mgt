import Logo from "../assets/logo.png";

interface LogoHeaderProps {}

const LogoHeader: React.FC<LogoHeaderProps> = () => {
  return (
    <div className="w-full flex justify-center">
      <a
        href="https://etapinsure.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={Logo} alt="Logo" width={120} />
      </a>
    </div>
  );
};

export default LogoHeader;
