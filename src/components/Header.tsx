import useHydrated from "@/hooks/useHydrated";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
  const { hasHydrated } = useHydrated();

  if (!hasHydrated) return null;

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <a className="btn btn-ghost normal-case text-xl">CrossDAO</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Proposals list</a>
          </li>

          <li>
            <a>Create Proposal</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <ConnectButton />
      </div>
    </div>
  );
};

export default Header;
