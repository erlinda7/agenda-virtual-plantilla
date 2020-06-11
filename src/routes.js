import React from 'react';

import Profile from './pages/Dashboard/Profile/Profile';
import Contacts from './pages/Dashboard/Contacts/Contacts';
import Contact from './pages/Dashboard/Contacts/Contact';
import ListUser from './pages/Dashboard/ListUser/ListUser';
import BlockedUser from './pages/Dashboard/BlockedUser/BlockedUser';

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },

  { path: '/profile', exact: true, name: 'Profile', component: Profile },
  { path: '/contacts', exact: true, name: 'Contacts', component: Contacts },
  { path: '/contacts/:id', exact: true, name: 'Contacts Details', component: Contact },
  { path: '/listUser', exact: true, name: 'List User', component: ListUser },
  { path: '/blockedUser', exact: true, name: 'Blocked User', component: BlockedUser },
];

export default routes;
