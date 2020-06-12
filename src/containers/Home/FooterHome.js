import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <>
        <center>
          <div style={{
            fontSize: 12,
            textAlign: 'center'
          }}>
            <br />
            <br />
            <span>
              {' '}
           2020 virtual Agenda
        </span>
            <br />
            <span className="ml-auto">
              chambimanzanoerlinda@gmail.com
        </span>
          </div>
        </center>
      </>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
