import React from 'react';

import Display from './components/display';
import { RouterProvider, Route } from './utils/router';

import { routes as r } from './scenes';

import MainMenu from './scenes/main-menu';
import Gameplay from './scenes/gameplay';
import GameOver from './scenes/game-over';

import Level0 from './levels/level0';

export default function App() {
  return (
    <Display>
      <RouterProvider>
        <Route name={r.mainMenu}>
          <MainMenu />
        </Route>
        <Route name={r.level1}>
          <Gameplay
            nextLevel={r.level2}
            level={(onGameOver, onExitedLevel) => (
              <Level0 onGameOver={onGameOver} onExitedLevel={onExitedLevel} />
            )}
          />
        </Route>
        <Route name={r.level2}>
          <Gameplay
            nextLevel={r.level3}
            level={(onGameOver, onExitedLevel) => (
              <Level0 onGameOver={onGameOver} onExitedLevel={onExitedLevel} />
            )}
          />
        </Route>
        <Route name={r.level3}>
          <Gameplay
            nextLevel={r.mainMenu}
            level={(onGameOver, onExitedLevel) => (
              <Level0 onGameOver={onGameOver} onExitedLevel={onExitedLevel} />
            )}
          />
        </Route>
        {/* <Route name={r.gameOver}>
          <GameOver />
        </Route> */}
      </RouterProvider>
    </Display>
  );
}
