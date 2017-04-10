var React = require('react');
var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var alertClicked = require('react-bootstrap').alertClicked;
var Col = require('react-bootstrap').Col;
var Row = require('react-bootstrap').Row;

var LeaveButton = require('./LeaveButton');

const GetLeagues = React.createClass({
  getInitialState() {
    return {
      value: '',
      leagues: '',
      teams: ''
    };
  },

  onChildUpdate() {
    this.props.callback();
  },

  buildLeagues() {
    var leagues = this.state.leagues;
    var teams = this.state.teams;
    if (leagues.length > 0){
      var res = [];
      var i = 0;
      for (i=0;i<leagues.length;i++){
        res[i] = <ListGroupItem key={ i }>{ leagues[i] }<LeaveButton league={ leagues[i] } team={ teams[i] } callback={ this.onChildUpdate } /></ListGroupItem>
      }
      return <ListGroup>{ res }</ListGroup>;
    }
    else{
      return <ListGroup></ListGroup>;
    }
  },

  getLeague() {
    if (localStorage.email != undefined){
      var url = "http://localhost:3000/user/getData/"+localStorage.email;
      fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        responseText = JSON.parse(responseText);
        responseText = responseText["data"][0];
        if (responseText["leagues"].length >= 0){
          var newState = { leagues : responseText["leagues"], teams : responseText["teams"] };
          this.setState(newState);
        }
      })
      .catch((error) => {
        console.warn(error);
      });
    }
  },

  componentDidMount() {
    this.getLeague();
  },

 componentDidUpdate(prevProps, prevState) {
    if (this.props.update === prevProps.update) {
      console.log("Nothing to get" + this.state.leagues + this.props.update);
    } else {
      console.log("Got league");
      this.getLeague();
    }
  },

  render() {
    return (
      <div>
      <h2>Active Leagues </h2>
        {this.buildLeagues()}
      </div>
    );
  }
});

module.exports = GetLeagues;
