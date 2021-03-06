import React from 'react'
import { Video } from './youtube-retriever'

export interface YTAudioContext {
  nowPlaying?: Video
  isPlaying: boolean
  volume: number
  currentTime: number
  currentBuffered: number
  setPosition: (pos: number) => void
  setNowPlaying: (nowPlaying: any) => void
  setVolume: (vol: number) => void
  togglePlaying: () => void
}

export const AudioContext = React.createContext<YTAudioContext>({
  nowPlaying: null,
  isPlaying: false,
  volume: 1,
  currentTime: 0,
  currentBuffered: 0,
  setPosition(pos) {},
  setNowPlaying(nowPlaying) {},
  setVolume(vol) {},
  togglePlaying() {},
})

export default class YTAudioContextWrapper extends React.Component {
  state = {
    nowPlaying: null,
    playing: false,
    volume: 1,
    currentTime: 0,
    currentBuffered: 0,
  }

  audio = React.createRef<HTMLAudioElement>()

  setNowPlaying = (nowPlaying: any) => this.setState({ nowPlaying })
  setPlaying = (playing) => this.setState({ playing })
  setVolume = () => this.setState({ volume: this.audio.current.volume })
  setCurrentTime = () => {
    this.setState({
      currentTime: this.audio.current.currentTime,
      currentBuffered: this.audio.current.buffered.length
        ? this.audio.current.buffered.end(0)
        : 0,
    })
  }

  render() {
    const audioContext: YTAudioContext = {
      nowPlaying: this.state.nowPlaying,
      isPlaying: this.state.playing,
      volume: this.state.volume,
      setNowPlaying: this.setNowPlaying,
      currentTime: this.state.currentTime,
      currentBuffered: this.state.currentBuffered,
      setVolume: (vol: number) => {
        this.audio.current.volume = vol
      },
      setPosition: (pos: number) => {
        if (!this.audio.current) return
        this.audio.current.currentTime = pos
      },
      togglePlaying: () => {
        if (this.state.playing) {
          this.audio.current.pause()
        } else {
          this.audio.current.play()
        }
      },
    }

    return (
      <AudioContext.Provider value={audioContext}>
        <>
          {this.props.children}
          <audio
            id="audioElem"
            autoPlay
            src={audioContext.nowPlaying?.url}
            ref={this.audio}
            onPlaying={() => this.setPlaying(true)}
            onPause={() => this.setPlaying(false)}
            onVolumeChange={() => this.setVolume()}
            onTimeUpdate={() => this.setCurrentTime()}
            preload="all"
          >
            Your browser does not support the audio tag.
          </audio>
        </>
      </AudioContext.Provider>
    )
  }
}
