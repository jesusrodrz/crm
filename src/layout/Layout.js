import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { HeaderNav } from '../Header/Container/HeaderNav';
import { LateralBar } from '../LateralBar/Container/LateralBar';
import { useAuthValue } from '../context/context';

export default function Layout({ children, ...props }) {
  const [menu, setMenu] = useState(false);
  const {
    user: {
      data: { name }
    }
  } = useAuthValue();

  const { listen } = useHistory();

  useEffect(() => {
    return listen(() => setMenu(false));
  }, [listen]);

  return (
    <div>
      <HeaderNav userName={name} togleMenu={() => setMenu(!menu)} show={menu} />
      <div className="container-fluid">
        <div className="row lateralBarWrapper">
          <div className={`col-12 col-md-2 lateralBar ${menu && 'active'}`}>
            <LateralBar />
          </div>
          <div className="col-12 col-md-10 pb-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
