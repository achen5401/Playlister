/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/playlist', auth.verify, PlaylistController.createPlaylist)
router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist)
router.get('/playlist/:id', auth.verify, PlaylistController.getPlaylistById)
router.get('/playlistnoauth/:id', auth.verify, PlaylistController.getPlaylistByIdNoAuth)
router.get('/playlistpairs', auth.verify, PlaylistController.getPlaylistPairs)
router.get('/publishedplaylistpairs', auth.verify, PlaylistController.getPublishedPlaylistPairs)
router.get('/playlists', auth.verify, PlaylistController.getPlaylists)
router.put('/playlist/:id', auth.verify, PlaylistController.updatePlaylist)
router.put('/playlistnoauth/:id', auth.verify, PlaylistController.updatePlaylistNoAuth)

module.exports = router