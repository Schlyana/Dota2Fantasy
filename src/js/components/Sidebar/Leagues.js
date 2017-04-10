var React = require('react');
var Col = require('react-bootstrap').Col;
var form = require('react-bootstrap').Form;
var FormGroup = require('react-bootstrap').FormGroup;
var ControlLabel = require('react-bootstrap').ControlLabel;
var FormControl = require('react-bootstrap').FormControl;
var Button = require('react-bootstrap').Button;

var CreateLeague = require('./Leagues/CreateLeague');
var GetLeagues = require('./Leagues/GetLeagues');
var JoinLeague = require('./Leagues/JoinLeague');

const XS = 5;
const SM = 6;
const MD = 6;
const LG = 6;

const Leagues = React.createClass({

  getInitialState() {
    return { create : false, join : false, get : false };
  },

  onChildUpdate () {
    this.setState({ get: !this.state.get });
  },

  setCreateState () {
    this.setState({ create: !this.state.create });
  },

  setJoinState () {
    this.setState({ join: !this.state.join });
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.props.leagueState === prevProps.leagueState) {
    } else {
      this.onChildUpdate();
    }
  },

  render() {
    return (
      <div>
        <Col xs={ XS } sm={ SM } md={ MD } lg={ LG }>
          <CreateLeague update={ this.state.create } callback={ this.onChildUpdate }/>
          <Button bsStyle="primary" onClick={ this.setCreateState }>
            Submit
          </Button>
          <GetLeagues update={ this.state.get } callback={ this.onChildUpdate } />
        </Col>
        <Col xs={ XS } sm={ SM } md={ MD } lg={ LG }>
          <JoinLeague update={ this.state.join } callback={ this.onChildUpdate } />
          <Button bsStyle="primary" onClick={ this.setJoinState }>
            Submit
          </Button>
        </Col>
      </div>
    );
  }
});

module.exports = Leagues;
