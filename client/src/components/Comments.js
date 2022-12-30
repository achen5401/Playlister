import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import ListCard from './ListCard.js'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'
import PlaylisterYouTubePlayer from './PlaylisterYouTubePlayer';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { borderRight } from '@mui/system';
//import Comments from './Comments'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
export default function Comments() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    let playingPlaylist = store.playingPlaylist;

    let commentsCard = ""
    let commentsArray = []
    if (playingPlaylist) {
        for (let i = 0; i < playingPlaylist.comments.length; i++) {
            commentsArray.push(playingPlaylist.comments[i]);
        }

        commentsCard =
        <List id= "comments-cards" sx={{ width: '90%', height: "500px", 
        left: '5%', bgcolor: 'background.paper',
        overflow: "scroll" }}>
            {
                commentsArray.map((comment) => (
                    <div>
                    <Box>
                        <div
                    style={{fontSize: 30, 
                    border:"1px solid black"}}>
                        {comment}</div>
                    </Box>
                    <br></br>
                    </div>
                ))
            }
            </List>;
    }

    const [text, setText] = useState("");

    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleEnter(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            if (text !== "") {
                store.playingPlaylist.comments.push(text + " - " + auth.user.username);
                store.setPlayingPlaylist(store.playingPlaylist._id, store.playingPlaylist);
                document.getElementById("comment-text-field").value = "";
            }
            setText("");
        }
    
    }

    let commentTextBox = "No Playlist Loaded"
    if (playingPlaylist) {
        commentTextBox = <TextField id="comment-text-field" 
        onKeyPress={event => handleEnter(event)}
        onChange={event => handleUpdateText(event)}
        />
    }


    return(
        <div id= "comment-section" >
            {commentsCard}
            {commentTextBox}
        </div>
    )
}
