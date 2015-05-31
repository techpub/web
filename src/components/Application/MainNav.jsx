import React from 'react';
import {Link} from 'react-router';

if (process.env.BROWSER){
  require('../../styles/Application/MainNav.styl');
}

const links = [
  {to: 'home', text: 'Home'}
];

class MainNav extends React.Component {
  render(){
    return (
      <nav id="main-nav">
        {links.map((link, i) => <Link to={link.to} className="main-nav__link" key={i}>{link.text}</Link>)}
      </nav>
    );
  }
}

export default MainNav;