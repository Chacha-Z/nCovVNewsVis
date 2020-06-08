import React, {Component} from 'react';
import './TopBar.css'

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount(){


  }

  render(){
      return (
          <>
            <div id='top-bar'>
              {this.props.children}
            </div>
          </>
      );
  }

}

export default TopBar;