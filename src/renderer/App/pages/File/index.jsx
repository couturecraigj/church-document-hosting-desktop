import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import { remote } from 'electron';
import ResizeObserver from '@rb/resize-observer';

import DeleteButton from './DeleteButton';
import DownloadButton from './DownloadButton';
import UploadButton from './UploadButton';

const Page = styled.div`
  width: ${({ width }) => (width ? width : '100%')};
  height: ${({ height }) => (height ? height : '100%')};
  overflow: hidden;
`;
const Container = styled.div`
  width: 100%;
  max-height: 100%;
  min-height: 80vh;
`;

class FilePage extends React.Component {
  state = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  onResize = ({ width, height }) => {
    this.setState({
      width,
      height
    });
  };
  render() {
    const { width, height } = this.state;

    const { match } = this.props;
    const port = remote.getGlobal('__EXPRESS_PORT__');

    return (
      <Page>
        <DeleteButton name={match.params.name} />
        <UploadButton name={match.params.name} />
        <DownloadButton name={match.params.name} />
        <Container>
          <ResizeObserver onResize={this.onResize} />
          <iframe
            height={height}
            width={width}
            autosize
            src={`http://localhost:${port}/file/${
              match.params.name
            }/index.html`}
            title={match.params.name}
          />
        </Container>
      </Page>
    );
  }
}

FilePage.propTypes = {
  match: PropTypes.shape({}).isRequired
};

export default FilePage;
