import React from 'react';

import Display from './components/display';
import { RouterProvider, Route } from './utils/router';

import { routes as r } from './scenes';

import MainMenu from './scenes/main-menu';
import Gameplay from './scenes/gameplay';
import GameOver from './scenes/game-over';

export default function App() {
  return (
    <Display>
      <RouterProvider>
        {/* <Route name={r.mainMenu}>
          <MainMenu />
        </Route> */}
        <Route name={r.gameplay}>
          <Gameplay />
        </Route>
        {/* <Route name={r.gameOver}>
          <GameOver />
        </Route> */}
      </RouterProvider>
    </Display>
  );
}
