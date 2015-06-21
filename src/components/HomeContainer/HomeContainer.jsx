import React from 'react';
import {RouteHandler} from 'react-router';
import HomeHeader from './HomeHeader';

if (process.env.BROWSER){
  require('../../styles/HomeContainer/HomeContainer.styl');
}

class HomeContainer extends React.Component {
  render(){
    return (
      <div className="home-container">
        <div className="home-container__inner">
          <HomeHeader/>
          <RouteHandler/>
        </div>
      </div>
    );
  }
}

export default HomeContainer;
