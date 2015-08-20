import React from 'react';
import {actions as ElementActionTypes} from '../../constants/ElementTypes';
import {Link} from 'react-router';
import {Dropdown, DropdownMenu, DropdownItem} from '../dropdown';
import FontAwesome from '../common/FontAwesome';
import {ModalPortal} from '../modal';
import EventModal from './EventModal';
import bindActions from '../../utils/bindActions';
import * as EventAction from '../../actions/EventAction';

if (process.env.BROWSER){
  require('../../styles/Screen/EventItem.styl');
}

class EventItem extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

  static propTypes = {
    event: React.PropTypes.object.isRequired,
    action: React.PropTypes.object.isRequired,
    elements: React.PropTypes.object.isRequired
  }

  render(){
    const {event} = this.props;

    let editBtn = (
      <a>Edit</a>
    );

    return (
      <li className="event-item">
        <div className="event-item__content">
          <strong className="event-item__event">{event.get('event')}</strong>
          <span className="event-item__action">{this.renderAction()}</span>
        </div>
        <Dropdown className="event-item__dropdown">
          <button className="event-item__more-btn">
            <FontAwesome icon="ellipsis-v"/>
          </button>
          <DropdownMenu position="fixed">
            <DropdownItem>
              <ModalPortal trigger={editBtn}>
                <EventModal {...this.props}/>
              </ModalPortal>
            </DropdownItem>
            <DropdownItem>
              <a onClick={this.deleteEvent}>Delete</a>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </li>
    );
  }

  renderAction(){
    const {action, elements} = this.props;

    switch (action.get('action')){
    case ElementActionTypes.transition:
      const screen = elements.get(action.getIn(['data', 'screen']));

      if (screen){
        return (
          <span>
            Transition to <Link to={`/projects/${screen.get('project_id')}/screens/${screen.get('id')}`}>{screen.get('name')}</Link>
          </span>
        );
      }
    }

    return action.get('action');
  }

  deleteEvent = (e) => {
    e.preventDefault();

    const {event} = this.props;
    const {deleteEvent} = bindActions(EventAction, this.context.flux);

    deleteEvent(event.get('id'));
  }
}

export default EventItem;
