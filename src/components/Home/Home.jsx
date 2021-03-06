import React from 'react';
import * as AppAction from '../../actions/AppAction';
import bindActions from '../../utils/bindActions';

if (process.env.BROWSER){
  require('../../styles/Home/Home.styl');
}

class Home extends React.Component {
  static onEnter(state, transition){
    const {setPageTitle} = bindActions(AppAction, this);
    setPageTitle('Diff');
  }

  render(){
    return <div>Home</div>;
  }
}

export default Home;
