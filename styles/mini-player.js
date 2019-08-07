import css from 'styled-jsx/css'

export default css`
  .player {
    border-radius: 0;
    background: #ddd;
    position: fixed;
    bottom: 0;
    height: 72px;
    width: 100%;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    transition: all 0.2s ease;
    box-shadow: 0px -2px 16px 8px rgba(0, 0, 0, 0.2);
    min-width: 0;
  }

  .song {
    height: 72px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    text-decoration: none;
    color: inherit;
  }

  .offscreen {
    transform: translateY(72px);
  }

  .inner {
    flex: 0 1 100px;
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
  }

  img {
    flex: 0 1 auto;
    height: 100%;
  }

  .cardInfo {
    margin-left: 20px;
    flex: 1 1 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .cardTitle {
    min-width: 0;
    font-weight: bold;
    max-lines: 2;
  }

  p {
    margin: 0;
    padding: 0;
    font-size: 14px;
    overflow: hidden;
    white-space: wrap;
    text-overflow: ellipsis;
  }

  button {
    background: rgba(255, 255, 255, 0.5);
    flex: 0 0 72px;
    border: 0px solid;
  }

  svg g g path {
    stroke: white;
    stroke-width: 2;
  }

  @media screen and (max-width: 480px) {
    button {
      position: absolute;
      width: 48px;
      height: 48px;
      top: 50%;
      transform: translate(70%, -50%);
    }
  }
`
