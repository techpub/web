import React from 'react';
import {Modal} from '../modal';
import {Form, Input} from '../form';
import * as ElementAction from '../../actions/ElementAction';
import bindActions from '../../utils/bindActions';
import {FormattedMessage} from '../intl';

class NewScreenModal extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    project: React.PropTypes.object.isRequired
  }

  constructor(props, context){
    super(props, context);

    this.state = {
      error: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidUpdate(){
    let {error} = this.state;

    if (error && error.field){
      this.refs[error.field].setError(error.message);
    }
  }

  render(){
    const {error} = this.state;
    const {closeModal} = this.props;

    return (
      <Modal title={<FormattedMessage message="project.new_screen"/>} onDismiss={closeModal}>
        <Form onSubmit={this.handleSubmit}>
          {error && !error.field && <div>{error.message}</div>}
          <Input
            id="new-screen-name"
            name="name"
            ref="name"
            label={<FormattedMessage message="common.name"/>}
            type="text"
            required
            maxLength={255}/>
          <div className="modal__btn-group">
            <a className="modal__btn" onClick={closeModal}>
              <FormattedMessage message="common.cancel"/>
            </a>
            <button type="submit" className="modal__btn--primary">
              <FormattedMessage message="common.create"/>
            </button>
          </div>
        </Form>
      </Modal>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {name} = this.refs;
    const {project, closeModal} = this.props;
    const {createElement} = bindActions(ElementAction, this.context.flux);

    if (name.getError()){
      return;
    }

    createElement(project.get('id'), {
      name: name.getValue(),
      type: 'screen'
    }).then(element => {
      closeModal();
      this.context.router.transitionTo(`/projects/${project.get('id')}/screens/${element.id}`);
    }, err => {
      this.setState({error: err.body || err});
    });
  }
}

export default NewScreenModal;
