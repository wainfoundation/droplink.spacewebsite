
import { Link } from "react-router-dom";
import Logo from "@/components/ui/Logo";
import { Badge } from "@/components/ui/badge";

const NavLogo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <Logo size="md" />
      {/* Mainnet badge or nothing, as Droplink is now mainnet */}
    </Link>
  );
};

export default NavLogo;
