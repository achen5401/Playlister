/* This is the component representing the menu bar with 4 tabs,
a search textfield, and a sort by drop down in the app */
import * as React from 'react';
import { useContext, useState } from 'react';
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'
import SortIcon from '@mui/icons-material/Sort';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { useHistory } from 'react-router-dom'
import Button from '@mui/material/Button';
export default function NavBar(){
    const {store} = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    let disabled = false;
    //anchorEL will handle allowing the menu to open or not (initially closed so set to null)
    const [anchorEl, setAnchorEl] = useState(null);
    let isMenuOpen = Boolean(anchorEl);

    const history = useHistory();

    function handlePath(screen){
        //Only allow navigation to other screens if the workspace screen isn't opened
        store.changeScreens(screen);
        disabled = false;
    }

    function handleMenuItemClick(sortValue){
        store.setSortField(sortValue);
        setAnchorEl(null);
    }

    const [text, setText] = useState("");

    function handleUpdateText(event) {
        const searchText = event.target.value;
        setText(searchText);

        // Perform search as the user types in the search bar
        store.setSearchField(searchText);
    }


    function handleEnter(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default behavior (submitting form)
        }
    }

    const handleProfileMenuOpen = (event) => {
        //Only open the sort menu if the current screen isn't workspace
        setAnchorEl(event.currentTarget);
    }
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const menuId = 'primary-search-account-menu';
    //sortMenu will only open if there is an associated anchor element
    const sortMenu = (
    <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
    >
        <MenuItem onClick={() => handleMenuItemClick("name")}> Name (A-Z) </MenuItem>
        <MenuItem onClick={()=>handleMenuItemClick("date")}>Publish Date (Newest)</MenuItem>
        <MenuItem onClick={()=>handleMenuItemClick("listens")}>Listens (High - Low)</MenuItem>
        <MenuItem onClick={()=>handleMenuItemClick("likes")}>Likes (High - Low)</MenuItem>
        <MenuItem onClick={()=>handleMenuItemClick("dislikes")}>Dislikes (High - Low)</MenuItem>
    </Menu>);

    let navMenu = "";

    let homeButton = "";
    if (!auth.guest) {
        homeButton = <Button
                        sx={{
                            mr: 2,
                            backgroundColor: store.currentScreen === "home" ? "#ccc" : "",
                            "&:hover": {
                                backgroundColor: store.currentScreen === "home" ? "#ccc" : "",
                            },
                        }}
                        disabled={disabled}
                        onClick = {()=>handlePath("home")}
                        >
                            <HomeOutlinedIcon style={{fontSize:"50px", float: "right", color:"black"}}/>
                    </Button>
    }
    //Only allow the nav menu to appear if a guest or a user is viewing the main app
    //ie, remove the menu when a guest tries to go back to the splash screen
    if (auth.loggedIn == true){
        navMenu =
        (<Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar style={{backgroundColor: '#A19F9F'}}>
                    {homeButton}
                    <Button
                    sx={{
                        mr: 2,
                        backgroundColor: store.currentScreen === "all-playlists" ? "#ccc" : "",
                        "&:hover": {
                            backgroundColor: store.currentScreen === "all-playlists" ? "#ccc" : "",
                        },
                    }}
                    disabled={disabled}
                    onClick = {()=>handlePath("all-playlists")}
                    >
                        <GroupsOutlinedIcon style={{fontSize:"50px", float: "right", color:"black"}} />
                    </Button>

                    <Button
                    sx={{
                        mr: 2,
                        backgroundColor: store.currentScreen === "users-playlists" ? "#ccc" : "",
                        "&:hover": {
                            backgroundColor: store.currentScreen === "users-playlists" ? "#ccc" : "",
                        },
                    }}
                    disabled={disabled}
                    onClick = {()=>handlePath("users-playlists")}
                    >
                        <PersonOutlinedIcon style={{fontSize:"50px", float: "right", color:"black"}} />
                    </Button>

                    <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '75ch', backgroundColor: 'white' },
            }}
            disabled={disabled}
            noValidate
            autoComplete="off"
        >
            <TextField
                id="searchbar-text-field"
                onKeyPress={event => handleEnter(event)}
                onChange={event => handleUpdateText(event)}
                placeholder="Search playlists..."
                            InputLabelProps={{
                                shrink: true,
                                style: { color: '#808080' }, // Adjust placeholder text color
                            }}
            />
        </Box>
                    <div style = {{position: "absolute", left: "90%", display: "grid", gridTemplateColumns: "1fr 1fr"}}>
                    <strong style={{color: "black", size:"45px"}}>
                            SORT BY
                        </strong>
                    <Box sx={{display: {xs: 'none', md: 'flex', marginLeft: 'auto'}}}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="sort-button"
                            aria-haspopup="true"
                            aria-controls={menuId}
                            onClick={handleProfileMenuOpen}
                        >
                            <SortIcon 
                            style={{fontSize:"45px", color:"black"}}
                            />
                        </IconButton>
                    </Box>
                    </div>
                </Toolbar>
            </AppBar>
            {sortMenu}
        </Box>);
    }
    return (
        navMenu
    );
}