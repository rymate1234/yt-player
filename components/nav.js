import React from 'react'
import Link from 'next/link'

const links = [
  { href: '/about', label: 'About' },
  { href: 'https://github.com/rymate1234/yt-player', label: 'GitHub' }
].map(link => {
  link.key = `nav-link-${link.href}-${link.label}`
  return link
})

const Nav = () => (
  <nav>
    <ul>
      <li>
        <Link prefetch href="/">
          <a>Home</a>
        </Link>
      </li>
      <ul>
        {links.map(({ key, href, label }) => (
          <li key={key}>
            <Link href={href}>
              <a>{label}</a>
            </Link>
          </li>
        ))}
      </ul>
    </ul>

    <style jsx>{`
      :global(*) { box-sizing: border-box; }
      :global(body) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
          Helvetica, sans-serif;
      }
      nav {
        text-align: center;
        background-color: #2887A2;
        padding: 4px 16px;
      }
      ul {
        display: flex;
        justify-content: space-between;
        padding: 0;
      }
      li {
        display: flex;
        padding: 6px 8px;
      }
      a {
        color: rgb(241,241,241);
        text-decoration: none;
        font-size: 13px;
      }
    `}</style>
  </nav>
)

export default Nav
