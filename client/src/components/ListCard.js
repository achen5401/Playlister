import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import AuthContext from '../auth'

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const { idNamePair, selected, userPlaylist} = props;
    const history = useHistory();


    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        event.stopPropagation();
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);
            console.log("test");

            // CHANGE THE CURRENT LIST
            store.clearAllTransactions();
            store.setCurrentListNoAuth(id);
        }
    }

    function handleLike(event) {
        event.stopPropagation();
        if (auth.user != null && auth.loggedIn == true) {
            if (userPlaylist.likes.includes(auth.user.username)) {
                userPlaylist.likes = userPlaylist.likes.filter(username => username !== auth.user.username);
            }
            else if (userPlaylist.dislikes.includes(auth.user.username)){
                userPlaylist.dislikes = userPlaylist.dislikes.filter(username => username !== auth.user.username);
                userPlaylist.likes.push(auth.user.username);
            }
            else {
                userPlaylist.likes.push(auth.user.username);
            }
        }
        store.updateListNoAuth(idNamePair._id, userPlaylist);
    }

    function handleDislike(event) {
        event.stopPropagation();
        if (auth.user != null && auth.loggedIn == true) {
            if (userPlaylist.dislikes.includes(auth.user.username)) {
                userPlaylist.dislikes = userPlaylist.dislikes.filter(username => username !== auth.user.username);
            }
            else if (userPlaylist.likes.includes(auth.user.username)){
                userPlaylist.likes = userPlaylist.likes.filter(username => username !== auth.user.username);
                userPlaylist.dislikes.push(auth.user.username);
            }
            else {
                userPlaylist.dislikes.push(auth.user.username);
            }
        }
        store.updateListNoAuth(idNamePair._id, userPlaylist);
    }

    function handlePlaylistClick() {
        if(userPlaylist.published.isPublished){
            userPlaylist.views.push(1);
            store.setPlayingPlaylist(idNamePair._id, userPlaylist);
        }
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    let publishedDateInfo = "";
    if(userPlaylist.published.isPublished) {
        const publishedDate = new Date(userPlaylist.published.publishedDate);
        const publishedDateString = publishedDate.toDateString().substring(4);
        publishedDateInfo = <div style = {{fontSize: 20}}>
            Published:
            &nbsp;
            <strong style = {{color: "green"}}>
            {publishedDateString}
            </strong>
        </div>
    }

    let arrowDownIcon = <IconButton 
        onClick={(event)=>handleLoadList(event, idNamePair._id)}
        style={{position:"absolute",top:"70%", right:"0.15%",float:"right"}}>
            <KeyboardArrowDownOutlinedIcon style={{fontSize:"40px", color:'black'}}/>
        </IconButton>

    let likesIcon = ""

    if (userPlaylist.published.isPublished) {
        likesIcon =
        <IconButton 
        onClick={(event)=>handleLike(event)}
        style={{position:"absolute",top:"20%", right:"15%"}}>
            <ThumbUpAltOutlinedIcon style={{fontSize:"40px", color:'black'}}/>
            <strong style={{color:'black'}}>
                {userPlaylist.likes.length}
            </strong>
        </IconButton>
    }
    let dislikesIcon = ""
    if (userPlaylist.published.isPublished) {
        dislikesIcon =
        <IconButton 
        onClick={(event)=>handleDislike(event)}
        style={{position:"absolute",top:"20%", right:"7%"}}>
            <ThumbDownAltOutlinedIcon style={{fontSize:"40px", color:'black'}}/>
            <strong style={{color:'black'}}>
                {userPlaylist.dislikes.length}
            </strong>
        </IconButton>
    }

    let listensIcon = ""
    if (userPlaylist.published.isPublished) {
        listensIcon =
        <div id = "listens"
        style={{position:"absolute",top:"50%", right:"7%", fontSize: 30}}>
            Listens: {userPlaylist.views.length} 
            </div>
    }

    let listCardColor = ""
    if (userPlaylist.published.isPublished) {
        listCardColor = "CornflowerBlue";
    }
    if (store.playingPlaylist) {
        if (userPlaylist == store.playingPlaylist) {
            listCardColor = "Gold";
        }
    }

    return (
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={{ width: '100%', fontSize: '25pt', backgroundColor: listCardColor }}
            onClick = {handlePlaylistClick}
        >
            <Box sx={{ p: 1, flexGrow: 1 }}><strong>{idNamePair.name} </strong>
            <br/> 
            <div
            style={{fontSize: 20}}>
                by {userPlaylist.ownerUsername}</div>
            <br/> {publishedDateInfo}
            </Box>
            <Box sx={{ p:1}}>
                {arrowDownIcon}
            </Box>
            <Box sx={{ p:1}}>
                {likesIcon}
            </Box>
            <Box sx={{ p:1}}>
                {dislikesIcon}
            </Box>
            {listensIcon}

        </ListItem>
    );
}

export default ListCard;