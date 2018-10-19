import React from 'react';
import img from 'images/404.png';
import './index.less';

class NotFound extends React.Component {

  render() {
    return (
      <div className="center common-not-found-page">
        <img src={img} alt="404"/>
      </div>
    );
  }
}

export default NotFound;
