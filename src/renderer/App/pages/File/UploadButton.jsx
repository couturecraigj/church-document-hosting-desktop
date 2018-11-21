import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';

const Button = styled.button``;

class UploadButton extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired
  };
  state = {
    redirect: false
  };
  onClick = e => {
    const { name } = this.props;

    e.preventDefault();
    ipcRenderer.send('uploadfolder', name);
    this.setState({ redirect: true });
  };
  render() {
    const { name } = this.props;
    const { redirect } = this.state;

    if (redirect) return <Redirect to="/" />;

    return (
      <Button data-filepath={name} onClick={this.onClick} type="button">
        Upload
      </Button>
    );
  }
}

export default UploadButton;
