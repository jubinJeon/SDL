import React from 'react';
import {Link} from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="navTop">
      <Link 
        to={{
          pathname: '/',
          state: { prev: false },
        }} 
        className="nav__link"
      >
        Home
      </Link>
      <Link 
        to={{
          pathname: '/about',
          state: { prev: true },
        }}
        className="nav__link"
      >
        About
      </Link>
    </nav>
  );
}