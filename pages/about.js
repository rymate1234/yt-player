import React from 'react'
import Head from '../components/head'
import home from '../styles/home'

const Home = () => (
  <div className="page">
    <Head title="About" />

    <div className="hero">
      <h1 className="title">About YT Player</h1>
    </div>

    <div className="row">
      <p>
        YT Player is a web app which allows you to play your favourite youtube
        based songs as audio, saving you bandwidth
      </p>
    </div>

    <style jsx>{home}</style>
  </div>
)

export default Home
