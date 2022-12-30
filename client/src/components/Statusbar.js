import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import AuthContext from '../auth'

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    let text ="";
    if (store.currentScreen) {
        if (store.currentScreen == "home") {
            text = 
            <div>
            <IconButton 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </IconButton>
            Your Lists
            </div>
        }
        else if (store.currentScreen == "all-playlists"
        || store.currentScreen == "users-playlists") {
            if (store.searchValue) {
                text = <div>{store.searchValue} Playlists</div>
            }
            else {
                if (store.currentScreen == "all-playlists") {
                    text = <div>All Playlists</div>
                }
                else {
                    text = <div>Users Playlists</div>
                }
            }
        }
    }

    let hidden = "none"
    if (auth && auth.loggedIn) {
        hidden = ""
    }

    function handleCreateNewList() {
        store.createNewList();
    }

    return (
        <div id="playlister-statusbar"
        style = {{display:hidden}}>
            <Typography variant="h4">{text}</Typography>
        </div>
    );
}

export default Statusbar;