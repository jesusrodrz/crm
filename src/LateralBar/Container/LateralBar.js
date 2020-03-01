import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthValue } from '../../context/context';

export function LateralBar() {
  const { user } = useAuthValue();
  const type = user?.data?.type;
  return (
    <nav className="navbar navbar-collapse">
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="./app" className="btn btn-link">
            Inicio
          </Link>
        </li>
        {type === 'vendedor' && (
          <>
            <li className="nav-item">
              <Link to="./visitas" className="btn btn-link">
                Visitas
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/gestion" className="btn btn-link">
                Gestionar Visitas
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/fichar" className="btn btn-link">
                Fichar
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/trabajorealizado" className="btn btn-link">
                Trabajo Realizado
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/estadisticas" className="btn btn-link">
                Estadísticas
              </Link>
            </li>
          </>
        )}
        {type === 'admin' && (
          <>
            <li className="nav-item">
              <Link to="./configuracion" className="btn btn-link">
                Configuración
              </Link>
            </li>

            <li className="nav-item">
              <Link to="./vendedores" className="btn btn-link">
                Vendedores
              </Link>
            </li>

            <li className="nav-item">
              <Link to="./visitas" className="btn btn-link">
                Visitas
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/gestion" className="btn btn-link">
                Gestionar Visitas
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/fichar" className="btn btn-link">
                Fichar
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/trabajorealizado" className="btn btn-link">
                Trabajo Realizado
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/estadisticas" className="btn btn-link">
                Estadísticas
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
