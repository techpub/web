import React from 'react';
import Portal from 'react-portal';
import Palette from './Palette';
import NewScreenModal from './NewScreenModal';
import ScreenItem from './ScreenItem';
import FontAwesome from '../common/FontAwesome';
import Translation from '../i18n/Translation';

if (process.env.BROWSER){
  require('../../styles/Project/ScreenPalette.styl');
}

class ScreenPalette extends React.Component {
  static contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    __: React.PropTypes.func.isRequired
  }

  static propTypes = {
    project: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired,
    selectedScreen: React.PropTypes.string
  }

  render(){
    const {elements, selectedScreen, project} = this.props;
    let btn = (
      <div className="screen-palette__new-screen">
        <FontAwesome icon="plus"/>
      </div>
    );

    const screens = elements
      .filter(item => !item.get('element_id'))
      .map((item, id) => (
        <ScreenItem key={id} element={item} selectedScreen={selectedScreen}/>
      )).toArray();

    return (
      <Palette title={<Translation id="project.screens"/>}>
        {screens}
        <div className="screen-palette__new-screen-wrap">
          <Portal openByClickOn={btn} closeOnEsc={true}>
            <NewScreenModal context={this.context} project={project}/>
          </Portal>
        </div>
      </Palette>
    );
  }
}

export default ScreenPalette;
