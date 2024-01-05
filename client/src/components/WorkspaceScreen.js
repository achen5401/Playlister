import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import SongCard from './SongCard.js';
import MUIEditSongModal from './MUIEditSongModal';
import MUIRemoveSongModal from './MUIRemoveSongModal';
import MUIDeleteModal from './MUIDeleteModal';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'; // Import Typography
import { GlobalStoreContext } from '../store/index.js';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';

import EditToolbar from './EditToolbar';

function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState('');

    let modalJSX = '';

    if (!store || !store.currentList) {
        store.history.push('/');
        return null;
    }

    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    } else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    } else if (store.isDeleteListModalOpen()) {
        modalJSX = <MUIDeleteModal />;
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    function handleKeyPress(event) {
        if (event.code === 'Enter') {
            let id = event.target.id.substring('list-'.length);
            if (text !== '') {
                store.changeListName(id, text);
            }
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let titleElement = (
        <Typography variant="h4" component="div" id="playlist-title">
            {store.currentList.name}
            <IconButton onClick={handleToggleEdit}>
                <EditIcon style={{ fontSize: '24pt' }} />
            </IconButton>
        </Typography>
    );

    let centeredTitleElement = (
        <div style={{ display: 'flex', alignItems: 'center', height: '100px' }}>
            {titleElement}
        </div>
    );

    let workspaceElement = (
        <div id="playlist-workspace">
            <div>{centeredTitleElement}</div>

            <List id="playlist-cards" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {store.currentList.songs.map((song, index) => (
                    <SongCard
                        id={'playlist-song-' + index}
                        key={'playlist-song-' + index}
                        index={index}
                        song={song}
                    />
                ))}
            </List>
            {modalJSX}
            <br />
            <Box sx={{ flexGrow: 1 }}>
                <EditToolbar />
            </Box>
        </div>
    );

    if (editActive) {
        workspaceElement = (
            <div id="playlist-workspace">
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    height="50px"
                    id={'list-' + store.currentList._id}
                    label="Playlist Name"
                    name="name"
                    autoComplete="Playlist Name"
                    className="list-card"
                    onKeyPress={handleKeyPress}
                    onChange={handleUpdateText}
                    defaultValue={store.currentList.name}
                    inputProps={{ style: { fontSize: 24 } }}
                    InputLabelProps={{ style: { fontSize: 24 } }}
                    autoFocus
                />
                <List id="playlist-cards">
                    {store.currentList.songs.map((song, index) => (
                        <SongCard
                            id={'playlist-song-' + index}
                            key={'playlist-song-' + index}
                            index={index}
                            song={song}
                        />
                    ))}
                </List>
                {modalJSX}
                <EditToolbar />
            </div>
        );
    }

    return workspaceElement;
}

export default WorkspaceScreen;