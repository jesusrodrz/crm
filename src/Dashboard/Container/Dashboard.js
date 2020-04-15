import React from 'react';
import Activity from '../Components/Activities';
import { HeaderNav } from '../../Header/Container/HeaderNav';
import '../../App.css';
import { useAuthValue } from '../../context/context';
import { NAV_LINKS } from '../../Constants/Constants';

export function Dashboard({ userType }) {
  const {
    user: {
      data: { name }
    }
  } = useAuthValue();
  const cards = NAV_LINKS.filter(card => {
    return card.user.includes(userType);
  });
  return (
    <div>
      <HeaderNav userName={name} noMenu />
      <div className="container pb-5">
        <div className="row">
          <>
            {cards.map((card, i) => (
              <div className="col-12 col-md-4" key={`${i}-${card.link}`}>
                <Activity
                  image={card.image}
                  titleActivity={card.titleActivity}
                  descriptionActivity={card.descriptionActivity}
                  buttonActivity={card.buttonActivity}
                  direction={card.link}
                />
              </div>
            ))}
          </>
        </div>
      </div>
    </div>
  );
}
