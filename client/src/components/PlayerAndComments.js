import React, { useContext } from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';
import PlaylisterYouTubePlayer from './PlaylisterYouTubePlayer';
import Comments from './Comments';
import Button from '@mui/material/Button';

export default function PlayerAndComments() {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);

  let playerCommentsButton = store.playerCommentsButton;

  function handlePlayerButtonClick(event) {
    event.stopPropagation();
    event.preventDefault();
    store.setPlayerCommentsButton('player');
  }

  function handleCommentsButtonClick(event) {
    event.stopPropagation();
    event.preventDefault();
    store.setPlayerCommentsButton('comments');
  }

  let playerCommentsSubBox = playerCommentsButton === 'player' ? <PlaylisterYouTubePlayer /> : <Comments />;

  return auth.loggedIn ? (
    <div id="player-and-comments" className="player-comments-container">
      <div id="player-and-comments-buttons">
        <Button
          disabled={playerCommentsButton === 'player'}
          id="player-button"
          onClick={handlePlayerButtonClick}
          variant="contained"
        >
          Player
        </Button>
        <Button
          disabled={playerCommentsButton === 'comments'}
          id="undo-button"
          onClick={handleCommentsButtonClick}
          variant="contained"
        >
          Comments
        </Button>
      </div>

      <div id="player-or-comments" className="player-comments-content">
        <div className="player-comments-content-wrapper">{playerCommentsSubBox}</div>
      </div>
    </div>
  ) : null;
}