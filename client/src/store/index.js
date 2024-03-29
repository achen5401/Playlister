import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
import { Global } from '@emotion/react'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    LOAD_PLAYLISTS: "LOAD_PLAYLISTS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    SET_SEARCH: "SET_SEARCH",
    SET_SORT: "SET_SORT",
    CHANGE_SCREENS: "CHANGE_SCREENS",
    PLAYER_COMMENTS: "PLAYER_COMMENTS",
    PLAY_PLAYLIST: "PLAY_PLAYLIST",
    RESET_STORE : "RESET_STORE",
    SET_PLAYER: "SET_PLAYER",
    SET_PLAYLIST_INFO: "SET_PLAYLIST_INFO",
    GUEST_LOGIN: "GUEST_LOGIN"

}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        ctrlPressed: false,
        userPlaylists: null,
        searchValue: "",
        currentScreen: "home",
        playerCommentsButton: "player",
        playingPlaylist: null,
        player: null,
        playlistInfo: null

    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    userPlaylists: payload.userPlaylists,
                    searchValue: "",
                    sortValue: "",
                    currentScreen: store.currentScreen,
                    playerCommentsButton: store.playerCommentsButton,
                    playingPlaylist: store.playingPlaylist,
                    player: store.player,
                    playlistInfo: store.playlistInfo
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    userPlaylists: store.userPlaylists,
                    searchValue: "",
                    sortValue: "",
                    currentScreen: store.currentScreen,
                    playerCommentsButton: store.playerCommentsButton,
                    playingPlaylist: store.playingPlaylist,
                    player: store.player,
                    playlistInfo: store.playlistInfo
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    userPlaylists: store.userPlaylists,
                    searchValue: "",
                    sortValue: "",
                    currentScreen: store.currentScreen,
                    playerCommentsButton: store.playerCommentsButton,
                    playingPlaylist: store.playingPlaylist,
                    player: store.player,
                    playlistInfo: store.playlistInfo
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    userPlaylists: payload.userPlaylists,
                    searchValue: "",
                    sortValue: "",
                    currentScreen: payload.currentScreen,
                    playerCommentsButton: store.playerCommentsButton,
                    playingPlaylist: store.playingPlaylist,
                    player: store.player,
                    playlistInfo: store.playlistInfo
                });
            }
            case GlobalStoreActionType.LOAD_PLAYLISTS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: null,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    userPlaylists: payload,
                    searchValue: "",
                    sortValue: "",
                    currentScreen: store.currentScreen,
                    playerCommentsButton: store.playerCommentsButton,
                    playingPlaylist: store.playingPlaylist,
                    player: store.player,
                    playlistInfo: store.playlistInfo
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    userPlaylists: store.userPlaylists,
                    searchValue: "",
                    sortValue: "",
                    currentScreen: store.currentScreen,
                    playerCommentsButton: store.playerCommentsButton,
                    playingPlaylist: store.playingPlaylist,
                    player: store.player,
                    playlistInfo: store.playlistInfo
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    userPlaylists: store.userPlaylists,
                    searchValue: "",
                    sortValue: "",
                    currentScreen: store.currentScreen,
                    playerCommentsButton: store.playerCommentsButton,
                    playingPlaylist: store.playingPlaylist,
                    player: store.player,
                    playlistInfo: store.playlistInfo
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    userPlaylists: store.userPlaylists,
                    searchValue: "",
                    sortValue: "",
                    currentScreen: store.currentScreen,
                    playerCommentsButton: store.playerCommentsButton,
                    playingPlaylist: store.playingPlaylist,
                    player: store.player,
                    playlistInfo: store.playlistInfo
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    userPlaylists: store.userPlaylists,
                    searchValue: "",
                    sortValue: "",
                    currentScreen: store.currentScreen,
                    playerCommentsButton: store.playerCommentsButton,
                    playingPlaylist: store.playingPlaylist,
                    player: store.player,
                    playlistInfo: store.playlistInfo
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    userPlaylists: store.userPlaylists,
                    searchValue: "",
                    sortValue: "",
                    currentScreen: store.currentScreen,
                    playerCommentsButton: store.playerCommentsButton,
                    playingPlaylist: store.playingPlaylist,
                    player: store.player,
                    playlistInfo: store.playlistInfo
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    userPlaylists: store.userPlaylists,
                    searchValue: "",
                    sortValue: "",
                    currentScreen: store.currentScreen,
                    playerCommentsButton: store.playerCommentsButton,
                    playingPlaylist: store.playingPlaylist,
                    player: store.player,
                    playlistInfo: store.playlistInfo


                });
            }
            case GlobalStoreActionType.SET_SEARCH: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    userPlaylists: store.userPlaylists,
                    searchValue: payload,
                    sortValue: store.sortValue,
                    currentScreen: store.currentScreen,
                    playerCommentsButton: store.playerCommentsButton,
                    playingPlaylist: store.playingPlaylist,
                    player: store.player,
                    playlistInfo: store.playlistInfo

                });
            }
            case GlobalStoreActionType.SET_SORT: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    userPlaylists: store.userPlaylists,
                    searchValue: store.searchValue,
                    sortValue: payload,
                    currentScreen: store.currentScreen,
                    playerCommentsButton: store.playerCommentsButton,
                    playingPlaylist: store.playingPlaylist,
                    player: store.player,
                    playlistInfo: store.playlistInfo

                });
            }
            case GlobalStoreActionType.CHANGE_SCREENS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    userPlaylists: store.userPlaylists,
                    searchValue: "",
                    sortValue: "",
                    currentScreen: payload.currentScreen,
                    playerCommentsButton: store.playerCommentsButton,
                    playingPlaylist: store.playingPlaylist,
                    player: store.player,
                    playlistInfo: store.playlistInfo
                });
            }

            case GlobalStoreActionType.PLAYER_COMMENTS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    userPlaylists: store.userPlaylists,
                    searchValue: "",
                    sortValue: "",
                    currentScreen: store.currentScreen,
                    playerCommentsButton: payload,
                    playingPlaylist: store.playingPlaylist,
                    player: store.player,
                    playlistInfo: store.playlistInfo
                });
            }

            case GlobalStoreActionType.PLAY_PLAYLIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    userPlaylists: store.userPlaylists,
                    searchValue: store.searchValue,
                    sortValue: store.sortValue,
                    currentScreen: store.currentScreen,
                    playerCommentsButton: store.playerCommentsButton,
                    playingPlaylist: payload.playlist,
                    player: store.player,
                    playlistInfo: payload.playlistInfo
                })
            }

            case GlobalStoreActionType.RESET_STORE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: [],
                    currentList: null,
                    currentSongIndex : -1,
                    currentSong : null,
                    newListCounter: 0,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    ctrlPressed: false,
                    userPlaylists: null,
                    searchValue: "",
                    currentScreen: "home",
                    playerCommentsButton: "player",
                    playingPlaylist: null,
                    player: store.player,
                    playlistInfo: store.playlistInfo
            
                });
            }

            case GlobalStoreActionType.SET_PLAYER: {
                return setStore({
                    currentModal : store.currentModal,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex : store.currentSongIndex,
                    currentSong : store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    ctrlPressed: store.ctrlPressed,
                    userPlaylists: store.userPlaylists,
                    searchValue: store.searchValue,
                    currentScreen: store.currentScreen,
                    playerCommentsButton: store.playerCommentsButton,
                    playingPlaylist: store.playingPlaylist,
                    player: payload,
                    playlistInfo: store.playlistInfo
                })
            }

            case GlobalStoreActionType.SET_PLAYLIST_INFO: {
                return setStore({
                    currentModal : store.currentModal,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex : store.currentSongIndex,
                    currentSong : store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    ctrlPressed: store.ctrlPressed,
                    userPlaylists: store.userPlaylists,
                    searchValue: store.searchValue,
                    currentScreen: store.currentScreen,
                    playerCommentsButton: store.playerCommentsButton,
                    playingPlaylist: store.playingPlaylist,
                    player: store.player,
                    playlistInfo: payload
                })
            }

            case GlobalStoreActionType.GUEST_LOGIN: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: [],
                    currentList: null,
                    currentSongIndex : -1,
                    currentSong : null,
                    newListCounter: 0,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    ctrlPressed: false,
                    userPlaylists: null,
                    searchValue: "",
                    currentScreen: "all-playlists",
                    playerCommentsButton: "player",
                    playingPlaylist: null,
                    player: store.player,
                    playlistInfo: store.playlistInfo
            
                });
            }

            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                let userPlaylists = response.data.userPlaylists;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist,
                                        userPlaylists: userPlaylists,
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        history.push("/home");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let payload = {
            name: "Untitled",
            ownerUsername: auth.user.username,
            ownerEmail: auth.user.email,
            songs: [],
            comments: [],
            likes: [],
            dislikes: [],
            views: [],
            published: {isPublished: false, publishedDate: new Date()}
        }
        const response = await api.createPlaylist(payload);
        console.log("createNewList response: " + response);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            history.push("/playlist/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    store.createList = async function (playlist) {
        const response = await api.createPlaylist(playlist);
        console.log("createList response: " + response);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );
            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            history.push("/playlist/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    store.emptyIdNamePairs = function() {
        storeReducer({
            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
            payload: {
                idNamePairs: null,
                userPlaylists: null,
            }
        })
    }

    store.loadPublishedIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPublishedPlaylistPairs();
            if (response.data.success) {
                console.log(response.data.userPlaylists);
                let pairsArray = response.data.idNamePairs;
                let userPlaylists = response.data.userPlaylists;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        idNamePairs: pairsArray,
                        userPlaylists: userPlaylists,
                        currentScreen: store.currentScreen,
                    }
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                console.log(response.data.userPlaylists);
                let pairsArray = response.data.idNamePairs;
                let userPlaylists = response.data.userPlaylists;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {
                        idNamePairs: pairsArray,
                        userPlaylists: userPlaylists,
                        currentScreen: "home",
                    }
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            store.loadPublishedIdNamePairs();
            history.push("/home");
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }

    store.changeScreens = function(path) {
        storeReducer({
            type: GlobalStoreActionType.CHANGE_SCREENS,
            payload: {
                currentScreen: path
            }
        })
        history.push("/home");
    }

    store.setSearchField = function(text) {
        storeReducer({
            type: GlobalStoreActionType.SET_SEARCH,
            payload: text

        })
    }
    store.setSortField = function(text) {
        storeReducer({
            type: GlobalStoreActionType.SET_SORT,
            payload: text
        })
    }

    store.setPlayerCommentsButton = function(button) {
        storeReducer({
            type: GlobalStoreActionType.PLAYER_COMMENTS,
            payload: button
        })
    }

    store.setPlayer = function(player) {
        storeReducer({
            type:GlobalStoreActionType.SET_PLAYER,
            payload: player
        })
    } 

    store.setPlaylistInfo = function(songNumber, title, artist) {
        storeReducer({
            type:GlobalStoreActionType.SET_PLAYLIST_INFO,
            payload: {songNumber: songNumber,
                    title: title,
                    artist: artist}
        })
    }

    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }

    store.setCurrentListNoAuth = function (id) {
        async function asyncSetCurrentListNoAuth(id) {
            let response = await api.getPlaylistByIdNoAuth(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                response = await api.updatePlaylistByIdNoAuth(playlist._id, playlist);
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentListNoAuth(id);
    }

    store.resetStore = function() {
        storeReducer({
            type: GlobalStoreActionType.RESET_STORE,
        });
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
                store.loadIdNamePairs();
            }
        }
        asyncUpdateCurrentList();
    }

    store.updateList = function(id, playlist) {
        async function asyncUpdateList() {
            const response = await api.updatePlaylistById(id, playlist);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateList();
    }

    store.updateListNoAuth = function(id, playlist) {
        async function asyncUpdateList() {
            const response = await api.updatePlaylistByIdNoAuth(id, playlist);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
            }
        }
        asyncUpdateList();
    }

    store.setPlayingPlaylist = function(id, playlist) {
        async function asyncUpdateList() {
            const response = await api.updatePlaylistByIdNoAuth(id, playlist);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.PLAY_PLAYLIST,
                    payload: {playlist : playlist,
                        playlistInfo : {
                        songNumber: 0,
                        title: playlist.songs[0].title,
                        artist: playlist.songs[0].artist}
                    }
                });
            }
        }
        asyncUpdateList();
    }


    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        if (!auth.user) {
            return false;
        }
        return (store.currentList !== null && 
            store.currentList.ownerEmail == auth.user.email &&
            !store.currentList.published.isPublished);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }


    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.clearAllTransactions = function () {
        tps.clearAllTransactions();
    }

    store.guestUser = function () {
        storeReducer({
            type: GlobalStoreActionType.GUEST_LOGIN,
            payload: "all-playlists"
        })
    }

    // SETUP CTRL-Z AND CTRL-Y
    store.ctrlPressed = false;
    document.onkeydown = store.handleAppKeyDown;
    document.onkeyup = store.handleAppKeyUp;

    store.handleAppKeyDown = (keyEvent) => {
        let CTRL_KEY_CODE = "17";
        if (keyEvent.which == CTRL_KEY_CODE) {
            store.ctrlPressed = true;
        }
        else if (keyEvent.key == "z" || keyEvent.key == "Z") {
            if (store.ctrlPressed) {
                store.undo();
            }
        }
        else if (keyEvent.key == "y" || keyEvent.key == "Y") {
            if (store.ctrlPressed) {
                store.redo();
            }
        }
    }
    store.handleAppKeyUp = (keyEvent) => {
        if (keyEvent.which == "17")
            store.ctrlPressed = false;
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };