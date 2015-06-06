import React from 'react';
import {Modal} from '../modal';
import {Input} from '../form';
import {createProject} from '../../actions/ProjectAction';

class NewProjectModal extends React.Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired
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
    let {error} = this.state;

    return (
      <Modal title="New project" onDismiss={this.props.closePortal}>
        <form onSubmit={this.handleSubmit}>
          {error && !error.field && <div className="form-error">{error.message}</div>}
          <Input
            id="new-project-title"
            name="title"
            ref="title"
            label="Title"
            type="text"
            required
            maxLength={255}/>
          <button type="submit">Create</button>
        </form>
      </Modal>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    let {title} = this.refs;
    let {context} = this.props;

    if (title.getError()){
      return;
    }

    context.executeAction(createProject, this.props.user.get('id'), {
      title: title.getValue()
    }).then(project => {
      this.setState({error: null});
      context.router.transitionTo('project', project);
    }, err => {
      this.setState({error: err.body || err});
    });
  }
}

export default NewProjectModal;
