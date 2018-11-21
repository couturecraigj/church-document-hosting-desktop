import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';

const Button = styled.button``;

class DeleteButton extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired
  };
  onClick = e => {
    const { name } = this.props;

    e.preventDefault();
    ipcRenderer.send('downloadfolder', name);
  };
  render() {
    const { name } = this.props;

    return (
      <Button data-filepath={name} onClick={this.onClick} type="button">
        Download
      </Button>
    );
  }
}

export default DeleteButton;
