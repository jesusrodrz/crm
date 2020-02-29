import React from 'react';
import './Activities.css';
import { Link } from 'react-router-dom';

const Activity = props => {
  const {
    image,
    titleActivity,
    descriptionActivity,
    buttonActivity,
    direction
  } = props;
  return (
    <div className="card activity">
      <img
        src={image}
        className="card-img-top imagesActivity"
        alt="presupuestos"
      />
      <div className="card-body">
        <h5 className="card-title">{titleActivity}</h5>
        <p className="card-text">{descriptionActivity}</p>
        <Link to={direction} className="btn btn-primary">
          {buttonActivity}
        </Link>
      </div>
    </div>
  );
};

export default Activity;
