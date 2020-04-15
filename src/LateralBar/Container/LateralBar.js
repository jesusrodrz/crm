import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthValue } from '../../context/context';
import { NAV_LINKS } from '../../Constants/Constants';

export function LateralBar() {
  const { user } = useAuthValue();
  const type = user?.data?.type;
  const links = NAV_LINKS.filter(card => {
    return card.user.includes(type);
  });
  return (
    <nav className="navbar navbar-collapse">
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="./app" className="btn btn-link">
            Inicio
          </Link>
        </li>
        {links.map((link, i) => (
          <li className="nav-item" key={`${i}-${link.link}`}>
            <Link to={link.link} className="btn btn-link">
              {link.navText}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
