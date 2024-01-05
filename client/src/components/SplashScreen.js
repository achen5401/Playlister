import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'
export default function SplashScreen() {
    const {auth} = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const WelcomeButton = styled(Button)({
        boxShadow: 'none',
        textTransform: 'none',
        fontSize: 26,
        fontWeight: "bold",
        padding: '6px 12px',
        border: '1px solid',
        lineHeight: 1.5,
        backgroundColor: '#88A4BA',
        borderColor: 'black',
        color: 'black',
        position: 'relative',
        bottom: "-20px",
        '&:hover': {
          backgroundColor: '#0069d9',
          borderColor: 'black',
          color: 'white',
          boxShadow: 'none',
        },
        '&:active': {
          boxShadow: 'none',
          backgroundColor: '#0062cc',
          borderColor: '#005cbf',
        },
        '&:focus': {
          boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
        },
      });

    function guestUser() {
        auth.guestUser();
        store.guestUser();
    }
    return (
        <div id="splash-screen" className="fade-in" style={{ height: '100vh', background: 'linear-gradient(to bottom, #F0F0F0, #C0C0C0)' }}>
            <div id="welcome-text">Welcome to<br/>Playlister!</div>
            <div className="description-box">
                    This website provides a place for people to create and share music playlists with others.
                    You can publish your own playlists, and listen to ones others have created. We hope you are able
                    to find playlists that interest you.
            </div>
            <div id="welcome-button-box">
                <div className="welcome-button" style={{position: 'relative', left:"-90px"}}>
                    <Link to='/login'>
                        <WelcomeButton>
                                Login
                        </WelcomeButton>
                    </Link>
                </div>
                <div className="welcome-button">
                    <Link to="/register">
                        <WelcomeButton>
                                Create Account
                        </WelcomeButton>
                    </Link>
                </div>
                <div className="welcome-button" style={{position: 'relative', right:"-90px"}}>
                        <WelcomeButton onClick={()=>guestUser()}>
                            Continue as Guest
                        </WelcomeButton>
                </div>
            </div>
            <div style={{position: "relative", top:"40%", left: "38%", fontSize:"30px"}}>
                <strong> Developed by Adam Chen </strong>
            </div>
        </div>
    )
}