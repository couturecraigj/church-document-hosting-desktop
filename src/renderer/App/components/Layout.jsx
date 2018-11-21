import React from 'react';
import { NavLink } from 'react-router-dom';

import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import { Provider } from './context';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body, html {
    height: 100%;
    margin: 0;
  }
  body {
    color: ${props => (props.blackColor ? '#bbb' : '#444')};
    background-color: ${props => (props.blackColor ? '#444' : '#bbb')};
    font-family: Arial, Helvetica, sans-serif;
  }
  #app {
    width: 100%;
    height: 100%;
  }
  a {
    color: ${props => (props.blackColor ? '#eee' : '#333')};
    &:visited {
      color: ${props => (props.blackColor ? '#333' : '#bbb')};
    }
  }
`;

const displayProps = {
  blackColor: true
};

const Link = styled(NavLink).attrs({
  activeClassName: 'current',
  ...displayProps
})`
  font-size: 20px;
  color: ${props => (props.blackColor ? '#eee' : '#444')};
  line-height: 2rem;
  padding: 0 0.3rem;
  height: 2rem;
  transition: all 0.2s ease-in-out;

  &.current {
    font-size: scale(1.1);
    color: ${props => (props.blackColor ? '#bbb' : '#222')};
  }
`;

const NavBanner = styled.div`
  width: 100%;
  padding: 0.5rem;
`;
const Body = styled.div`
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  padding: 0.5rem;
`;

const Layout = ({ children }) => (
  <Provider>
    <Body>
      <GlobalStyle {...displayProps} />
      <NavBanner>
        <Link exact to="/">
          Home
        </Link>
        <Link exact to="/profile">
          Profile
        </Link>
        {/* <Link exact to="/login">
          Login
        </Link> */}
        <Link exact to="/inventory">
          Inventory
        </Link>
        <Link exact to="/files">
          Files
        </Link>
        <Link exact to="/users">
          Users
        </Link>
        <Link exact to="/notifications">
          Notifications
        </Link>
      </NavBanner>
      <Content>{children}</Content>
    </Body>
  </Provider>
);

Layout.propTypes = {
  children: PropTypes.element.isRequired
};
export default Layout;
