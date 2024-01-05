import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const history = useHistory();

    function handleAddNewSong() {
        store.addNewSong();
    }
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        store.closeCurrentList();
    }
    function handleDeleteList() {
        store.markListForDeletion(store.currentList._id);
    }

    function handlePublishList() {
        store.currentList.published.isPublished = true;
        
        const now = Date.now();
        const date = new Date(now);
        store.currentList.published.publishedDate = date;
        store.updateCurrentList();
        history.push('/home');
    }

    function handleDuplicateList() {
        let aOwnerUsername = auth.user ? auth.user.username : "";
        let aOwnerEmail = auth.user? auth.user.email : "";
        let payload = {
            name: store.currentList.name + " - Copy",
            ownerUsername: aOwnerUsername,
            ownerEmail: aOwnerEmail,
            songs: store.currentList.songs,
            comments: [],
            likes: [],
            dislikes: [],
            views: [],
            published: {isPublished: false, publishedDate: new Date()}
        }
        store.createList(payload);

    }

    function canDeleteList() {
        if (!auth.user) {
            return true;
        }
        return !(store.currentList.ownerUsername == auth.user.username
            && store.currentList.ownerEmail == auth.user.email);
    }

    return (
        <div id="edit-toolbar">
            <Button
                disabled={!store.canAddNewSong()}
                id='add-song-button'
                onClick={handleAddNewSong}
                variant="contained">
                <AddIcon />
            </Button>
            <Button 
                disabled={!store.canUndo()}
                id='undo-button'
                onClick={handleUndo}
                variant="contained">
                    <UndoIcon />
            </Button>
            <Button 
                disabled={!store.canRedo()}
                id='redo-button'
                onClick={handleRedo}
                variant="contained">
                    <RedoIcon />
            </Button>
            <Button 
                disabled = {store.currentList.published.isPublished}
                id='publish-button'
                onClick={handlePublishList}
                variant="contained">
                    Publish
            </Button>
            <Button 
                disabled = {canDeleteList()}
                id='delete-button'
                onClick={handleDeleteList}
                variant="contained">
                    Delete
            </Button>
            <Button 
                disabled = {auth.guest}
                id='duplicate-button'
                onClick={handleDuplicateList}
                variant="contained">
                    Duplicate
            </Button>

            <IconButton 
                disabled={!store.canClose()}
                id='close-button'
                onClick={handleClose}
                variant="contained">
                    <KeyboardArrowLeftOutlinedIcon 
                    style={{fontSize:"40px", color:'black',
                     position: "relative"}}/>
            </IconButton>
        </div>
    )
}

export default EditToolbar;