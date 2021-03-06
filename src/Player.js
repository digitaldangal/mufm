// import {updateFile} from './actions/playlistActions'
// import PlayListItem from "./components/playlist/PlayListItem"
// // import {connect} from "react-redux"
// // import PropTypes from "prop-types"
import findIndex from "lodash/findIndex"

class Player {
    playlist = []

    addToPlayList(item) {
        this.playlist.push(item)
    }

    getPlayList() {
        return this.playlist
    }

    removeSong(id) {
        const index = findIndex(this.playlist, {id: id})
        if (index >= 0) {
            return [this.playlist.slice(0, index), this.playlist.slice(index + 1)]
        }
        return this.playlist
    }

    startPlaying(playFrom) {
        const existingPlaylist = this.getPlayList()
        // for (let i = playFrom; i < existingPlaylist.length; i++) {
        if (playFrom >= existingPlaylist.length) {
            playFrom = 0
        }
        // updateFile({
        //     id:playFrom,
        //     path: existingPlaylist[playFrom].path,
        //     filename:existingPlaylist[playFrom].filename,
        //     duration:existingPlaylist[playFrom].duration,
        //     played:true
        // })
        // new PlayListItem().hasPlayed({
        //      id:playFrom,
        //      path: existingPlaylist[playFrom].path,
        //      filename:existingPlaylist[playFrom].filename,
        //      duration:existingPlaylist[playFrom].duration,
        //      played:true
        //  })
        document.getElementById('playing_song').innerText = existingPlaylist[playFrom].filename
        const audioPlayer = document.getElementById('audio_player')
        audioPlayer.src = existingPlaylist[playFrom].path
        audioPlayer.play()
        // this.setState({playingFile: this.props.id})
        audioPlayer.addEventListener('ended', () => {
            this.startPlaying(playFrom + 1)
        })
        // }
    }

    renderAudioPlayer() {
        const audio = new Audio()
        audio.controls = true
        audio.id = "audio_player"
        // audio.onended=()=>{
        //     // const nextFile=this.props.getFile(this.props.id)
        //     // document.getElementById('playing_song').innerText = nextFile.filename
        //     // const audioPlayer = document.getElementById('audio_player')
        //     // audioPlayer.src = nextFile.path
        //     // audioPlayer.play()
        //     PlayListItem.playNext()
        // }
// Establish all variables that your Analyser will use
        let canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height
// Initialize the MP3 player after the page loads all of its HTML into the window
        window.addEventListener("load", initMp3Player, false)

        function initMp3Player() {
            document.getElementById('audio_box').appendChild(audio)
            context = new AudioContext() // AudioContext object instance
            analyser = context.createAnalyser() // AnalyserNode method
            canvas = document.getElementById('analyser_render')
            ctx = canvas.getContext('2d')
            // Re-route audio playback into the processing graph of the AudioContext
            source = context.createMediaElementSource(audio)
            source.connect(analyser)
            analyser.connect(context.destination)
            frameLooper()
        }

// frameLooper() animates any style of graphics you wish to the audio frequency
// Looping at the default frame rate that the browser provides(approx. 60 FPS)
        function frameLooper() {
            window.requestAnimationFrame(frameLooper)
            fbc_array = new Uint8Array(analyser.frequencyBinCount)
            analyser.getByteFrequencyData(fbc_array)
            ctx.clearRect(0, 0, canvas.width, canvas.height) // Clear the canvas
            ctx.fillStyle = '#17c900' // Color of the bars
            bars = 100
            for (let i = 0; i < bars; i++) {
                bar_x = i * 3
                bar_width = 2
                bar_height = -(fbc_array[i] / 2)
                //  fillRect( x, y, width, height ) // Explanation of the parameters below
                ctx.fillRect(bar_x, canvas.height, bar_width, bar_height)
            }
        }
    }
}

// Player.propTypes = {
//     updateFile: PropTypes.func.isRequired,
// }

const instance = new Player()
Object.freeze(instance)

// connect(null, {updateFile})(instance)
export default instance
