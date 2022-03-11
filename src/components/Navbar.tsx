import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  const { data: session } = useSession();

  async function handleSignOut() {
    const data = await signOut({ redirect: false, callbackUrl: "/" });

    router.push(data.url);
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img
            src={session.user.image}
            alt={session.user.name}
            width="48"
            height="48"
            style={{ borderRadius: "5px", border: "1px solid black" }}
          />
        </a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <span className="nav-link">{session.user.name}</span>
            </li>
          </ul>
        </div>
        <div>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link href="/app">
                <a className="nav-link">Home</a>
              </Link>
            </li>
            <li className="nav-item">
              <span
                className="nav-link cursor-pointer"
                style={{ cursor: "pointer" }}
                onClick={handleSignOut}>
                Logout
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
