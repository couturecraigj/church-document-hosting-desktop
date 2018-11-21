import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const Fallback = ({ history }) => (
  <div>
    {/* eslint-disable-next-line no-console */}
    <button type="button" onClick={() => history.goBack()}>
      BACK
    </button>
    <h1>OOPS! MISSED</h1>
  </div>
);

Fallback.propTypes = {
  history: PropTypes.shape({}).isRequired
};

export default withRouter(Fallback);
