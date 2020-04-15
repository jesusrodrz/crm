import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

const PdfPortal = ({ children }) => {
  const controlsRoot = document.getElementById('pdf-root');
  return createPortal(children, controlsRoot);
};

PdfPortal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};
export default PdfPortal;
