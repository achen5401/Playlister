import React, { useContext } from 'react'
import YouTube from 'react-youtube';
import { GlobalStoreContext } from '../store'

import Button from '@mui/material/Button';
import FastRewind from '@mui/icons-material/FastRewind';
import FastForward from '@mui/icons-material/FastForward';
import Stop from '@mui/icons-material/Stop';
import PlayArrow from '@mui/icons-material/PlayArrow';

export default function PlaylisterYouTubePlayer() {
    // THIS EXAMPLE DEMONSTRATES HOW TO DYNAMICALLY MAKE A
    // YOUTUBE PLAYER AND EMBED IT IN YOUR SITE. IT ALSO
    // DEMONSTRATES HOW TO IMPLEMENT A PLAYLIST THAT MOVES
    // FROM ONE SONG TO THE NEXT

    const { store } = useContext(GlobalStoreContext);

    // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST
    let playlist = [];
    if (store.playingPlaylist !== null) {
        playlist = [];
        for (let i = 0; i < store.playingPlaylist.songs.length; i++){
            playlist.push(store.playingPlaylist.songs[i].youTubeId);
        }
    }

    // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST
    let currentSong = 0;
    if (store.playlistInfo) {
        currentSong = store.playlistInfo.songNumber;
    }

    const playerOptions = {
        height: '300',
        width: '500',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    let player = ""
    if (store.player) {
        player = store.player;
    }

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        console.log("loadandplaycurrent");
        let song = playlist[currentSong];
        player.loadVideoById(song);
        if (store.playingPlaylist) {
            console.log(store.playingPlaylist.songs[currentSong]);
            console.log(currentSong);
            store.setPlaylistInfo(
                currentSong,
                store.playingPlaylist.songs[currentSong].title,
                store.playingPlaylist.songs[currentSong].artist
            );
        }
        player.playVideo();
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        currentSong++;
        currentSong = currentSong % playlist.length;
    }

    function decSong() {
        if (currentSong >= 0) {
            currentSong--;
            currentSong = currentSong % playlist.length;
            if (currentSong < 0) {
                currentSong = playlist.length + currentSong;
            }
        }
    }

    function onPlayerReady(event) {
        loadAndPlayCurrentSong(event.target);
        event.target.playVideo();
        store.setPlayer(event.target);
    }


    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        let player = event.target;
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            incSong();
            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
    }

    function handleRewind(event) {
        event.stopPropagation();
        decSong();
        loadAndPlayCurrentSong(player);
    }

    function handleForward(event) {
        event.stopPropagation();
        incSong();
        loadAndPlayCurrentSong(player);
    }

    function handlePause(event) {
        event.stopPropagation();
        player.pauseVideo();

    }

    function handlePlay(event) {
        event.stopPropagation();
        player.playVideo();
    }

    let playlistInfo = "";

    if (store.playingPlaylist) {
    playlistInfo = 
        <div id = "playlist-info">
            <div><center>Now Playing</center></div>
            <div id = "playlist-name">Playlist: {store.playingPlaylist.name}</div>
            <div id = "playlist-song-number">Song #: {store.playlistInfo.songNumber} </div>
            <div id = "song-title">Title: {store.playlistInfo.title}</div>
            <div id = "song-artist">Artist: {store.playlistInfo.artist}</div>
        </div>
    }

    let playlistButtons = ""
    playlistButtons = <div id = "playlist-buttons">
            <Button
                id='fast-rewind-button'
                onClick={handleRewind}
                variant="contained">
                <FastRewind />
            </Button>
            <Button
                id='pause-button'
                onClick={handlePause}
                variant="contained">
                <Stop />
            </Button>
            <Button
                id='play-button'
                onClick={handlePlay}
                variant="contained">
                <PlayArrow />
            </Button>
            <Button
                id='fast-forward-button'
                onClick={handleForward}
                variant="contained">
                <FastForward />
            </Button>
            
    </div>


    return (
        <div id = "youtube-player">

        <div id="youtube"
        style = {{display: 'flex'}}>
        <YouTube
        videoId={playlist[currentSong]}
        opts={playerOptions}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange} />
        </div>

        {playlistInfo}

        {playlistButtons}

        </div>
        )
}