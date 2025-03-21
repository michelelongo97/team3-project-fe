import { Link } from "react-router";
import { useEffect } from "react";

export default function Team() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const teamMembers = [
    "Alessandra Sinigaglia",
    "Erika Cutugno",
    "Raffaele Molinaro",
    "Alessandro Frisone",
    "Michele Longo",
  ];

  return (
    <div>
      <div className="team-container">
        <h1 className="team-title">🤝 Il Nostro Team</h1>
        <p className="team-intro">
          Siamo un gruppo di appassionati di libri, uniti dalla voglia di creare
          qualcosa di speciale.
        </p>
        <ul className="team-list">
          {teamMembers.map((member, index) => (
            <li key={index} className="team-member">
              {member}
            </li>
          ))}
        </ul>
      </div>
      <div className="btn-footer">
        <Link to="/">
          <button className="return-home-btn-footer">←</button>{" "}
        </Link>
      </div>
    </div>
  );
}
