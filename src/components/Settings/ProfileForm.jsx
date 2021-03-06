import React from 'react';
import {Form, InputGroup} from '../form';
import {validators} from 'react-form-input';
import * as UserAction from '../../actions/UserAction';
import bindActions from '../../utils/bindActions';
import {FormattedMessage} from '../intl';

class ProfileForm extends React.Component {
  static contextTypes = {
    flux: React.PropTypes.object.isRequired
  }

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
    let {user} = this.props;
    let {error} = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        {error && !error.field && <div className="settings__form-error">{error.message}</div>}
        <InputGroup
          name="name"
          ref="name"
          label={<FormattedMessage message="common.name"/>}
          type="text"
          defaultValue={user.get('name')}
          required
          validators={[
            validators.required('Name is required'),
            validators.maxLength(100, 'The maximum length of the name is 100')
          ]}/>
        <InputGroup
          ref="email"
          label={<FormattedMessage message="common.email"/>}
          type="email"
          defaultValue={user.get('email')}
          required
          validators={[
            validators.required('Email is required'),
            validators.email('Email is invalid')
          ]}/>
        <button type="submit" className="settings__button--primary">
          <FormattedMessage message="common.update"/>
        </button>
      </Form>
    );
  }

  handleSubmit(e){
    e.preventDefault();

    const {name, email} = this.refs;
    const {user} = this.props;
    const {updateUser} = bindActions(UserAction, this.context.flux);

    if (name.getError() || email.getError()){
      return;
    }

    updateUser(user.get('id'), {
      name: name.getValue(),
      email: email.getValue()
    }).then(() => {
      this.setState({error: null});
    }).catch(err => {
      this.setState({error: err.body || err});
    });
  }
}

export default ProfileForm;
