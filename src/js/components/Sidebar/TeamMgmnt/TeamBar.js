var React = require('react');

var Col = require('react-bootstrap').Col;
var Row = require('react-bootstrap').Row;
var Grid = require('react-bootstrap').Grid;
var Thumbnail = require('react-bootstrap').Thumbnail;
var Button = require('react-bootstrap').Button;
var ListGroup = require('react-bootstrap').ListGroup;

var PlayerStats = require('./TeamBar/PlayerStats');

const PLAYERIMG = "/dota2.jpg";
const XS = 6;
const SM = 3;
const MD = 2;
const LG = 2;
var style = {height:20 +'%', width:100 + "%"};


const TeamBar = React.createClass({

    // Set the initial state to empty.
    getInitialState() {
        return {};
    },

    // Asks the database for the players in the team currently selected and
    // adds them, if there are any, to the state.
    getTeamMembers() {
        if (this.props.activeTeam.length == 0) {
            return;
        }

        var url = 'http://localhost:3000/team/getData/' + this.props.activeTeam;
        fetch(url)
        .then((response) => response.text())
        .then((responseText) => {
            responseText = JSON.parse(responseText);
            console.log(responseText);
            var teamMembers = responseText['data'][0]['players']

            if (teamMembers === undefined) {
                //Do nothing
            } else {
                if (teamMembers.length > 0){
                    var newState = {players : teamMembers};
                    this.setState(newState);
                }
            }
        })
        .catch((error) => {
            console.warn(error);
        });
    },

    removePlayer(player) {
        var data = {"data": {
            "player" : player,
            "user" : localStorage.email,
            "team" : this.props.activeTeam }};

        data = JSON.stringify(data);

        var url = "http://localhost:3000/team/unregisterPlayer";
        var request = new Request (url, {
            method : 'POST',
            body : data,
            headers : new Headers ({'Content-Type' : 'application/json'})
        });

        fetch(request).then(function(response){
            return response.json();
        }).then(function(j){
            console.log(j);
        }).catch((error) => {
            console.warn(error);
        });
        this.getTeamMembers();
    },

    // Generates an array with the React components representing the players
    // in the active team. If there are no players or less than 5, they are set
    // to empty.
    buildPlayerList() {
      var players = this.state.players;
      var res = [];
      var i = 0;
      var emptyPlayer = {"_id":"","account_id":"","name":"","country":"","role":"","team_id":"","team":""};

      if ( players == undefined || players.length < 1) {
          players = [emptyPlayer, emptyPlayer, emptyPlayer, emptyPlayer, emptyPlayer];
      } else if ( players.length < 5 ) {
          for (i = players.length-1; i < 5; i++) {
              players[i] = emptyPlayer;
          }
      }

      for (i = 0; i < players.length; i++){
          res[i] = <Col xs={XS} sm={SM} md={MD} lg={LG}>
                        <Thumbnail src={PLAYERIMG} alt="Error">
                            <h4> {players[i].name} </h4>
                            <p>
                                Country : {players[i].country} <br></br>
                                Team name : {players[i].team} <br></br>
                                Role : {players[i].role}
                            </p>
                            <PlayerStats playerName={players[i].name}/>
                            <Button onClick={this.removePlayer.bind(this,players[i])}>Remove</Button>
                        </Thumbnail>
                    </Col>;
      }
      return <ListGroup>{res}</ListGroup>;
    },

    componentDidMount() {
        this.getTeamMembers();
        //setInterval(this.getTeamMembers, 1000);
    },

    render() {
        return (
            <Grid>
                <Row>
                    <h1>Team name: {this.props.activeTeam}</h1>
                    {this.buildPlayerList()}
                </Row>
            </Grid>
        );
    }
    });


module.exports = TeamBar;
