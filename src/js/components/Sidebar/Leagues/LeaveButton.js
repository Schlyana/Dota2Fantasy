var React = require('react');
var Button = require('react-bootstrap').Button;
var Position = require('react-bootstrap').Position;

const leaveButton = React.createClass({

  getInitialState() {
      return {
        league: this.props.league,
        team: this.props.team
      };
  },

  leaveLeague() {
    var url = "http://localhost:3000/league/removeUser";
    var data = {
      "data" : {
        "user" : localStorage.email,
        "league" : this.props.league,
        "team" : this.props.team
      }
    }
    data = JSON.stringify(data);
    var request = new Request(url, {
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
      this.props.callback();
    }.bind(this)).catch((error) => {
      console.warn(error);
    });
  },

  render() {
    return (
      <div style={{float:"right"}}>
        <Button bsSize="xsmall" bsStyle="danger" onClick={this.leaveLeague}>
        Leave
        </Button>
      </div>
    );
  }
});

module.exports = leaveButton;
