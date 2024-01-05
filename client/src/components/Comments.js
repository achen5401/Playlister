import React, { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store';
import AuthContext from '../auth';
import { Box, List, ListItem, TextField } from '@mui/material';
import Button from '@mui/material/Button';

export default function Comments() {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);

  const [text, setText] = useState('');

  const handleUpdateText = (event) => {
    setText(event.target.value);
  };

  const handleEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (text !== '') {
        const newComment = `${text} - ${auth.user.username}`;
        store.playingPlaylist.comments.push(newComment);
        store.setPlayingPlaylist(store.playingPlaylist._id, store.playingPlaylist);
        setText('');
      }
    }
  };

  let commentsList = null;
  if (store.playingPlaylist) {
    commentsList = (
      <List
        id="comments-cards"
        sx={{
          width: '90%',
          height: '25vh', // Reduced height to show comment text field without scrolling
          left: '5%',
          bgcolor: 'background.paper',
          overflow: 'auto',
          marginTop: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        {store.playingPlaylist.comments.map((comment, index) => (
          <ListItem
            key={index}
            sx={{
              border: '1px solid #ccc',
              marginBottom: '10px',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <Box sx={{ fontSize: 16 }}>{comment}</Box>
          </ListItem>
        ))}
      </List>
    );
  }

  let commentTextField = null;
  if (store.playingPlaylist) {
    commentTextField = (
      <TextField
        id="comment-text-field"
        variant="outlined"
        margin="normal"
        fullWidth
        placeholder="Add a comment"
        value={text}
        onKeyPress={(event) => handleEnter(event)}
        onChange={(event) => handleUpdateText(event)}
        sx={{
          marginTop: '20px',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
        }}
      />
    );
  }

  return (
    <div id="comment-section">
      {commentsList}
      {commentTextField}
    </div>
  );
}