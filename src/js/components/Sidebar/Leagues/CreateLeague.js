var React = require('react');
var Col = require('react-bootstrap').Col;
var form = require('react-bootstrap').Form;
var FormGroup = require('react-bootstrap').FormGroup;
var ControlLabel = require('react-bootstrap').ControlLabel;
var FormControl = require('react-bootstrap').FormControl;
var Button = require('react-bootstrap').Button;

var GetLeagues = require('./GetLeagues');

const CreateLeague = React.createClass({

  getInitialState() {
    return {
      league: '',
      team: ''
    };
  },

  handleChangeTeam(e) {
    this.setState({ team: e.target.value});
  },

  handleChangeLeague(e) {
    this.setState({ league: e.target.value});
  },

  leagueCreate() {
    var league = {
      "data" : {
        "league" : {
          "name" : this.state.league,
          "owner" : localStorage.email,
          "participants" : []
        },
        "team" : {
            "name" : this.state.team,
            "owner" : localStorage.email,
            "points" : 0,
            "money" : 10000,
            "league" : this.state.league,
            "players" : []
        }
      }
    }
    league = JSON.stringify(league);
    var url = "http://localhost:3000/league/create/";
    var request = new Request(url, {
      method: 'POST',
      body: league,
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
    fetch(request).then(function(response){
      return response.json();
    }).then(function(j){
      console.log(j);
    }).catch((error) => {
      console.warn(error);
    });
    this.registerTeam();
  },

  registerTeam() {
    var team = {
      "team" : {
        "name" : this.state.team,
        "owner" : localStorage.email,
        "points" : 0,
        "money" : 10000,
        "league" : this.state.value,
        "players" : []
      }
    }
    team = JSON.stringify(team);
    var url = "http://localhost:3000/team/register/";
    var request = new Request(url, {
      method: 'POST',
      body: team,
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
    fetch(request).then(function(response){
      return response.json();
    }).then(function(j){
      console.log(j);
    }).catch((error) => {
      console.log(error);
    });
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.props.update === prevProps.update) {
    } else {
      this.leagueCreate();
      this.props.callback();
    }
  },

  render() {
    return (
      <div>
        <h2>Register League</h2>
        <form>
          <FormGroup
            controlId="formBasicText"
          >
            <ControlLabel>Create League</ControlLabel>
            <FormControl
              type="text"
              value={ this.state.league }
              placeholder="Enter league name"
              onChange={ this.handleChangeLeague }
            />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup
            controlId="formAdvancedText"
          >
            <FormControl
              type="text"
              value={ this.state.team }
              placeholder="Enter team name"
              onChange={ this.handleChangeTeam }
            />
            <FormControl.Feedback />
          </FormGroup>
        </form>
      </div>
    );
  }
});

module.exports = CreateLeague;
