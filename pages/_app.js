import React from 'react'
import App, { Container } from 'next/app'
import Nav from '../components/nav'
import AudioContext from '../lib/audio-context'
import Player from '../components/player'
import { PageTransition } from 'next-page-transitions'

import 'rc-slider/assets/index.css'
class YTApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    // this will do I guess
    if (ctx.res && ctx.res.req.url.includes('/player')) {
      ctx.res.redirect('/')
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  state = {
    nowPlaying: {},
    playing: false,
    volume: 1
  }

  audio = React.createRef()

  setNowPlaying = nowPlaying => this.setState({ nowPlaying })
  setPlaying = playing => this.setState({ playing })
  setVolume = () => this.setState({ volume: this.audio.current.volume })

  render() {
    const { Component, pageProps, router } = this.props
    const audioContext = {
      nowPlaying: this.state.nowPlaying,
      isPlaying: this.state.playing,
      volume: this.state.volume,
      setNowPlaying: this.setNowPlaying,
      setVolume: vol => {
        this.audio.current.volume = vol
      },
      togglePlaying: () => {
        if (this.state.playing) {
          this.audio.current.pause()
        } else {
          this.audio.current.play()
        }
      }
    }

    const hidden = router.pathname.includes('player')

    return (
      <AudioContext.Provider value={audioContext}>
        <Container>
          <Nav hidden={hidden} />
          <PageTransition
            timeout={200}
            classNames="full-height page-transition"
          >
            <Component {...pageProps} key={router.route} />
          </PageTransition>
          <Player hidden={hidden} />

          <audio
            autoPlay
            src={audioContext.nowPlaying.url}
            ref={this.audio}
            onPlaying={() => this.setPlaying(true)}
            onPause={() => this.setPlaying(false)}
            onVolumeChange={() => this.setVolume()}
          >
            Your browser does not support the audio tag.
          </audio>

          <style jsx global>{`
            .full-height {
              height: 100%;
            }
            .page-transition-enter {
              opacity: 0;
            }
            .page-transition-enter-active {
              opacity: 1;
              transition: opacity 200ms;
            }
            .page-transition-exit {
              opacity: 1;
            }
            .page-transition-exit-active {
              opacity: 0;
              transition: opacity 200ms;
            }
          `}</style>
        </Container>
      </AudioContext.Provider>
    )
  }
}

export default YTApp
