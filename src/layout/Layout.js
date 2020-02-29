import React from 'react';
import { HeaderNav } from '../Header/Container/HeaderNav';
import { LateralBar } from '../LateralBar/Container/LateralBar';

export default function Layout({ children }) {
  return (
    <div>
      <HeaderNav userName="Carlos Raez" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-2 lateralBar">
            <LateralBar />
          </div>
          <div className="col-12 col-md-10 pb-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
