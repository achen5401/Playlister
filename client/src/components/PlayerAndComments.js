import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import ListCard from './ListCard.js'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'
import PlaylisterYouTubePlayer from './PlaylisterYouTubePlayer';
import Comments from './Comments'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
export default function PlayerAndComments() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    let playerCommentsButton = store.playerCommentsButton;

    function handlePlayerButtonClick(event) {
        event.stopPropagation();
        event.preventDefault();
        store.setPlayerCommentsButton("player");
    }

    function handleCommentsButtonClick(event) {
        event.stopPropagation();
        event.preventDefault();
        store.setPlayerCommentsButton("comments");
    }

    let playerCommentsSubBox = ""
    if (playerCommentsButton == "player") {
        playerCommentsSubBox = <PlaylisterYouTubePlayer/>;
    }
    else if (playerCommentsButton == "comments") {
        playerCommentsSubBox = <Comments/>
    }

    let playCommentsBox = <div id= "player-and-comments"
        style = {{display: "none"}}></div> 
    let playingPlaylist = ""
    if (store.playingPlaylist) {
        playingPlaylist = store.playingPlaylist.name;
    }

    if (auth.loggedIn) {
        playCommentsBox = 
        <div id= "player-and-comments">
        <div id= "player-and-comments-buttons">
        <Button
            disabled={playerCommentsButton == "player"}
            id='player-button'
            onClick={handlePlayerButtonClick}
            variant="contained">
            Player
        </Button>
        <Button 
            disabled={playerCommentsButton == "comments"}
            id='undo-button'
            onClick={handleCommentsButtonClick}
            variant="contained">
            Comments
        </Button>
        </div>

        <div id = "player-or-comments">
            {playerCommentsSubBox}
        </div>


    
    </div>
    }

    return(
        playCommentsBox
    )
}
