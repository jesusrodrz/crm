import React from 'react';
import PropTypes from 'prop-types';
import PdfPortal from '../TrabajoRealizado/Components/PdfPortal';

function Printable({ children, print }) {
  return (
    <>
      <PdfPortal>{children} </PdfPortal>
      {children}
    </>
  );
}

Printable.propTypes = {};

export default Printable;
