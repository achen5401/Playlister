import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import AuthContext from '../auth'

function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    let text = "";
    let isAddButtonDisabled = false;

    if (store.currentScreen) {
        if (store.currentScreen === "home") {
            text = (
                <div>
                    <IconButton
                        color="primary"
                        aria-label="add"
                        id="add-list-button"
                        onClick={handleCreateNewList}
                        disabled={store.currentModal !== "NONE"} // Disable button if currentModal is not "NONE"
                    >
                        <AddIcon />
                    </IconButton>
                    Your Lists
                </div>
            );
        } else if (
            store.currentScreen === "all-playlists" ||
            store.currentScreen === "users-playlists"
        ) {
            if (store.searchValue) {
                text = <div>{store.searchValue} Playlists</div>;
            } else {
                if (store.currentScreen === "all-playlists") {
                    text = <div>All Playlists</div>;
                } else {
                    text = <div>Users Playlists</div>;
                }
            }
        }
    }

    let hidden = "none";
    if (auth && auth.loggedIn) {
        hidden = "";
    }

    function handleCreateNewList() {
        store.createNewList();
    }

    return (
        <div id="playlister-statusbar" style={{ display: hidden }}>
            <Typography variant="h4">{text}</Typography>
        </div>
    );
}

export default Statusbar;