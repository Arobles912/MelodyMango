import "./styles/Header.css";

export default function Header() {
  return (
    <header>
      <div className="logo-div">
        <img
          src="src/assets/logos/melodymango-logo-removebg.png"
          alt="example-logo"
        />
      </div>
      <div className="text-div">
        <h1>Melody Mango</h1>
        <p>Unveil your inside melody.</p>
      </div>
    </header>
  );
}
