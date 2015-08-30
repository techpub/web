import React from 'react';
import connectToStores from '../../decorators/connectToStores';
import pureRender from '../../decorators/pureRender';
import * as ElementAction from '../../actions/ElementAction';
import bindActions from '../../utils/bindActions';
import ElementSidebar from './ElementSidebar';
import ViewMask from './ViewMask';
import ScreenToolbar from './ScreenToolbar';
import cx from 'classnames';

let Mousetrap;

if (process.env.BROWSER){
  Mousetrap = require('mousetrap');
  require('../../styles/Screen/Screen.styl');
}

@connectToStores([
  'ElementStore',
  'ComponentStore',
  'ProjectStore',
  'ActionStore',
  'EventStore',
  'AssetStore',
  'AppStore'
], (stores, props) => ({
  project: stores.ProjectStore.getProject(props.params.projectID),
  elements: stores.ElementStore.getElementsOfProject(props.params.projectID),
  components: stores.ComponentStore.getList(),
  editable: stores.ProjectStore.isEditable(props.params.projectID),
  activeElement: stores.ElementStore.getSelectedElement(),
  hoverElements: stores.ElementStore.getHoverElements(),
  hasUnsavedChanges: stores.ElementStore.hasUnsavedChanges(),
  isSavingChanges: stores.ElementStore.isSavingChanges(),
  actions: stores.ActionStore.getActionsOfProject(props.params.projectID),
  events: stores.EventStore.getList(),
  actionDefinitions: stores.ActionStore.getDefinitions(),
  assets: stores.AssetStore.getAssetsOfProject(props.params.projectID),
  apiEndpoint: stores.AppStore.getAPIEndpoint(),
  selectedAsset: stores.AssetStore.getSelectedAsset()
}))
@pureRender
class Screen extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      screenSize: '360x640',
      screenDimension: 'landscape',
      screenScale: 1
    };

    this.routerWillLeave = this.routerWillLeave.bind(this);
    this.selectElement = this.selectElement.bind(this);
    this.updateScreenSize = this.updateScreenSize.bind(this);
    this.updateScreenDimension = this.updateScreenDimension.bind(this);
    this.updateScreenScale = this.updateScreenScale.bind(this);
    this.saveNow = this.saveNow.bind(this);
  }

  componentDidMount(){
    this.context.router.addTransitionHook(this.routerWillLeave);
    Mousetrap.bind(['command+s', 'ctrl+s'], this.saveNow);
  }

  componentWillUnmount(){
    this.context.router.removeTransitionHook(this.routerWillLeave);
    Mousetrap.unbind(['command+s', 'ctrl+s'], this.saveNow);
  }

  componentWillUpdate(nextProps, nextState){
    if (this.state.project.get('theme') !== nextState.project.get('theme')){
      this.selectElement(null);
    }
  }

  routerWillLeave(state, transition){
    this.selectElement(null);
  }

  render(){
    const {editable, elements} = this.state;
    const selectedScreen = this.props.params.screenID;

    let containerClassName = cx('screen__container', {
      'screen__container--full': editable
    });

    return (
      <div className="screen">
        <div className={containerClassName}>
          <div className="screen__content" ref="content">
            <ViewMask {...this.state}
              element={elements.get(selectedScreen)}
              selectElement={this.selectElement}/>
            <ScreenToolbar {...this.state}
              updateScreenSize={this.updateScreenSize}
              updateScreenDimension={this.updateScreenDimension}
              updateScreenScale={this.updateScreenScale}/>
          </div>
          {editable && (
            <ElementSidebar
              {...this.state}
              selectElement={this.selectElement}
              selectedScreen={selectedScreen}/>
          )}
        </div>
      </div>
    );
  }

  selectElement(id){
    const {selectElement} = bindActions(ElementAction, this.context.flux);
    selectElement(id);
  }

  updateScreenSize(size){
    this.setState({
      screenSize: size
    });
  }

  updateScreenDimension(dimension){
    this.setState({
      screenDimension: dimension
    });
  }

  updateScreenScale(scale){
    this.setState({
      screenScale: scale
    });
  }

  saveNow(e){
    e.preventDefault();

    const {updateElementNow} = bindActions(ElementAction, this.context.flux);
    updateElementNow();
  }
}

export default Screen;
