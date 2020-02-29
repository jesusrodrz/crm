import React from 'react';

export default function ButtonClose({ onClick }) {
  return (
    <button
      type="button"
      style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem'
      }}
      className="btn btn-outline-danger btn-sm"
      onClick={onClick}
    >
      <span>×</span>
    </button>
  );
}
