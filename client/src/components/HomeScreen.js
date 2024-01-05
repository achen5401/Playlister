import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import ListCard from './ListCard.js'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
export default function HomeScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    let screen = store.currentScreen;
    
    useEffect(() => {
        store.loadPublishedIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }



    let pairPlaylists = [];
    if (store.currentScreen == "home" && auth.user){
        for (let i = 0; i < store.idNamePairs.length; i++) {
            if (store.userPlaylists[i].ownerEmail == auth.user.email) {
                pairPlaylists.push(
                    {pair: store.idNamePairs[i], playlist: store.userPlaylists[i]});
                }
            }
    }
    else if (store.currentScreen === "all-playlists" || store.currentScreen === "users-playlists") {
        // Logic to display all published playlists in the 'all-playlists' or 'users-playlists' screen
        for (let i = 0; i < store.idNamePairs.length; i++) {
            if (store.userPlaylists[i].published.isPublished) {
                pairPlaylists.push({ pair: store.idNamePairs[i], playlist: store.userPlaylists[i] });
            }
        }
    }


    if (store.searchValue !== "" && store.userPlaylists) {
        if (screen == "home" || screen == "all-playlists") {
            pairPlaylists = pairPlaylists.filter(pairPlaylist => {
                if ((pairPlaylist.playlist.name.toLowerCase()).includes(store.searchValue.toLowerCase())) {
                    return pairPlaylist;
                }
            })
        }
        else if (screen == "users-playlists") {
            pairPlaylists = pairPlaylists.filter(pairPlaylist => {
                if ((pairPlaylist.playlist.ownerUsername.toLowerCase()) == store.searchValue.toLowerCase()) {
                    return pairPlaylist;
                }
            })
        }
    }

    if (store.sortValue !== "") {
        if (store.sortValue == "name") {
            pairPlaylists = pairPlaylists.sort((a, b) => {
                return a.playlist.name.toLowerCase().localeCompare(b.playlist.name.toLowerCase());
            })
        }
        else if (store.sortValue == "date") {
            pairPlaylists = pairPlaylists.sort((a, b) => {
                let dateA = new Date(a.playlist.published.publishedDate);
                let dateB = new Date(b.playlist.published.publishedDate);
                return dateB-dateA;
            })
        }
        else if (store.sortValue == "listens") {
            pairPlaylists = pairPlaylists.sort((a, b) => {
                return b.playlist.views.length - a.playlist.views.length;
            })
        }
        else if (store.sortValue == "likes") {
            pairPlaylists = pairPlaylists.sort((a, b) => {
                return b.playlist.likes.length - a.playlist.likes.length;
            })
        }
        else if (store.sortValue == "dislikes") {
            pairPlaylists = pairPlaylists.sort((a, b) => {
                return b.playlist.dislikes.length - a.playlist.dislikes.length;
            })
        }
    }

    let listCard = "";
    if (store) {
        listCard = (
            <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
                {pairPlaylists.map((pairPlaylist) => (
                    <ListCard
                        key={pairPlaylist.pair._id}
                        idNamePair={pairPlaylist.pair}
                        userPlaylist={pairPlaylist.playlist}
                        selected={false}
                    />
                ))}
            </List>
        );
    }

    return (
        <div id="playlist-selector">
            <div id="list-selector-list">
                {listCard}
            </div>
        </div>
    );
}
