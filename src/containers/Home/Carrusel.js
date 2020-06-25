import React from 'react';
import { UncontrolledCarousel } from 'reactstrap';

const items = [
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/agendavirtual-f818c.appspot.com/o/carousel%2Fwoman-using-silver-laptop-2265488.jpg?alt=media&token=6d9f01fb-5193-407b-ae9a-0d3c49643e97',
    altText: 'Slide 1',
    caption: 'Virtual Agenda',
    header: 'WELCOME',
    key: '1',
    height: '100vh',
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/agendavirtual-f818c.appspot.com/o/carousel%2Fspace-grey-apple-iphone-on-notebook-page-2388936.jpg?alt=media&token=bb7a194f-2f14-45a4-81de-6e79c7321bf2',
    altText: 'Slide 2',
    caption: 'Virtual Agenda',
    header: 'WELCOME',
    key: '2'
  },
  {
    src: 'https://firebasestorage.googleapis.com/v0/b/agendavirtual-f818c.appspot.com/o/carousel%2Fhappy-young-woman-speaking-on-smartphone-near-window-4149069.jpg?alt=media&token=e4eeeb65-870b-4447-88df-da551aafccf2',
    altText: 'Slide 3',
    caption: 'Virtual Agenda',
    header: 'WELCOME',
    key: '3'
  }
];

const Carrusel = () => <UncontrolledCarousel items={items} />;

export default Carrusel;