import React from 'react';
import { UncontrolledCarousel } from 'reactstrap';

const items = [
  {
    //src: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa1d%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa1d%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.921875%22%20y%3D%22218.3%22%3EFirst%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
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