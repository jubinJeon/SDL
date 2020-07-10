import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';

function WrapPage({ children, color, background, location: {state,},}) {
  const cx = classNames({page: true,'page--prev': state && state.prev,});
  return (
    <section className={cx} style={{color,background,}}>
      {children}
    </section>
  );
}

WrapPage.propTypes = {children: PropTypes.node.isRequired, color: PropTypes.string, background: PropTypes.string,};
WrapPage.defaultProps = {color: '#000',background: '#fff'};

export default withRouter(WrapPage);