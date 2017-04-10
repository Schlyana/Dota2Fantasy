import React from 'react';
import {form, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

const JoinLeague = React.createClass({

  getInitialState() {
    return {
      league: '',
      team: ''
    }
  },

  handleChangeLeague(e) {
    this.setState({ league: e.target.value });
  },

  handleChangeTeam(e) {
    this.setState({ team: e.target.value});
  },

  leagueAddUser() {
    var data = {
      "data": {
        "name" : this.state.league,
        "user" : localStorage.email,
        "team" : {
          "name" : this.state.team,
          "owner" : localStorage.email,
          "points" : 0,
          "money" : 10000,
          "league" : this.state.league,
          "players" : []
        }
      }
    };
    data = JSON.stringify(data);
    var url = "http://localhost:3000/league/addUser/";
    var request = new Request (url, {
      method: 'POST',
      body: data,
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

  render() {
    return (
      <div>
        <h2>Join League</h2>
        <form>
          <FormGroup
            controlId="formJoinLeague"
          >
            <ControlLabel>Join League</ControlLabel>
            <FormControl
              type="text"
              value={ this.state.league }
              placeholder="Enter league name"
              onChange={ this.handleChangeLeague }
            />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup
            controlId="formTeamName"
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

module.exports = JoinLeague;
