import React from 'react';



const SunEditor = React.lazy(() => import('./views/Wysiwyg/SunEditor/SunEditor'));
const TinyMCE = React.lazy(() => import('./views/Wysiwyg/TinyMCE/TinyMCE'));
const Draft = React.lazy(() => import('./views/Wysiwyg/Draf/Draft'));
const DraftWeb = React.lazy(() => import('./views/Wysiwyg/DraftWeb/DarftWeb'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },

  { path: '/wysiwyg/suneditor', name: 'SunEditor', component: SunEditor},
  { path: '/wysiwyg/tinymce', name: 'TyneMCE', component: TinyMCE},
  { path: '/wysiwyg/draft', name: 'Draft', component: Draft},
  { path: '/wysiwyg/draftweb', name: 'DraftWEB', component: DraftWeb},
];

export default routes;
