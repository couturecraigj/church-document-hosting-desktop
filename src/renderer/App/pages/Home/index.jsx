import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
// eslint-disable-next-line import/no-unresolved

const Label = styled.label`
  background-color: #555;
  border-radius: 0.5em;
  padding: 1em;
`;
const Page = styled.div`
  height: 100%;
  width: 100%;
`;
const Overlay = styled.div`
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  font-size: 200px;
  /* content: ${({ valid }) => (valid ? '"👍"' : '"🛑"')}; */
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  &:after {
    content: ${({ valid }) => (valid ? '"👍"' : '"🛑"')};
  }
`;

const getImageSize = file =>
  new Promise(resolve => {
    if (!file.type.includes('image')) return resolve({});

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        // eslint-disable-next-line no-console
        console.log('LOADED Image');
        resolve({ width: img.width, height: img.height });
      };

      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

class Home extends React.Component {
  state = {
    overLay: false,
    valid: false,
    redirect: ''
  };
  onDragOver = event => {
    event.preventDefault();
    this.setState({
      valid: [...event.dataTransfer.items].every(
        item =>
          item.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ),
      overLay: true
    });
  };
  onDragEnd = async event => {
    event.preventDefault();
    this.setState({
      overLay: false
    });
    // Turn off overlay when triggered
  };
  onDrop = async event => {
    const { valid } = this.state;

    event.stopPropagation();
    event.preventDefault();
    this.setState({
      overLay: false
    });

    if (!valid) return;

    ipcRenderer.once('ondropfinished', (event, fileName) => {
      // eslint-disable-next-line no-console
      console.log(fileName);
      this.setState({
        redirect: `/file/${fileName}`
      });
    });
    ipcRenderer.send(
      'ondrop',
      await Promise.all(
        [...event.dataTransfer.files].map(async file => {
          const { width, height } = await getImageSize(file);

          return {
            path: file.path,
            name: file.name,
            size: file.size,
            mimeType: file.type,
            height,
            width
          };
        })
      )
    );

    // ipcRenderer.send('ondragstart', event.dataTransfer.files);

    return false;
    // eslint-disable-next-line no-console
    // console.log(event);
    // ipcRenderer.send("ondragstart", "details");
  };
  onDragStart = async event => {
    this.setState({
      overLay: true
    });
    // // eslint-disable-next-line no-console
    // console.log('dragStart', event.dataTransfer.files);
    event.preventDefault();

    // Place an overlay on the screen when this is triggered
  };
  onChange = async event => {
    event.preventDefault();
    // // eslint-disable-next-line no-console
    // console.log(event.target.files);
    this.setState({
      overLay: false
    });

    for (const file of event.target.files) {
      const { width, height } = await getImageSize(file);

      ipcRenderer.send('onfilechange', {
        path: file.path,
        name: file.name,
        size: file.size,
        mimeType: file.type,
        height,
        width
      });
    }
  };
  render() {
    const { overLay, valid, redirect } = this.state;

    if (redirect) return <Redirect to={redirect} />;

    return (
      <Page
        onDrop={this.onDrop}
        onDragStart={this.onDragStart}
        onDragLeave={this.onDragEnd}
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <h1>Home</h1>

        <div>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <Label>
            <input hidden name="Photo" type="file" onChange={this.onChange} />
            Drag Word File
          </Label>
        </div>
        <Overlay visible={overLay} valid={valid} />
      </Page>
    );
  }
}

export default Home;
