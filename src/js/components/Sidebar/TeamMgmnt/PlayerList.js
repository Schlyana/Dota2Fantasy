var React = require('react');

var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var Thumbnail = require('react-bootstrap').Thumbnail;
var Col = require('react-bootstrap').Col;
var Row = require('react-bootstrap').Row;
var Grid = require('react-bootstrap').Grid;
var Button = require('react-bootstrap').Button;

const PLAYERIMG = "/dota2.jpg";
const XS = 6;
const SM = 3;
const MD = 2;
const LG = 2;

const PlayerList = React.createClass({

    // Set the initial state to empty.
    getInitialState() {
        return {};
    },

    // Gets all the players that  are available from the database and adds
    // them to the state.
    getPlayers() {
        var url = 'http://localhost:3000/getPlayers';
        fetch(url)
        .then((response) => response.text())
        .then((responseText) => {
            responseText = JSON.parse(responseText);
            responseText = responseText["data"];

            if (responseText.length > 0){
                var newState = {players : responseText};
                this.setState(newState);
            }
        })
        .catch((error) => {
            console.warn(error);
        });
    },

    // Generate an array of React components that represents the player "cards"
    // with a button to add them to the team.
    buildPlayerList() {
      var players = this.state.players;
      var res = [];
      var i = 0;

      if ( players == undefined || players.length < 1) return;

      for (i = 0; i < players.length; i++){

          res[i] = <Col key={ i } xs={XS} sm={SM} md={MD} lg={LG}>
                        <Thumbnail src={PLAYERIMG} alt="Error">
                            <h4> {players[i].name} </h4>
                            <p>
                                Country : {players[i].country} <br></br>
                                Team name : {players[i].team} <br></br>
                                Role : {players[i].role}
                            </p>
                            <Button onClick={this.addPlayer.bind(this,players[i])}>Select</Button>
                        </Thumbnail>
                    </Col>;
      }
      return <ListGroup>{res}</ListGroup>;
    },

    // If this component loaded call getPlayers().
    componentDidMount() {
        this.getPlayers();
    },

    // Add the selected player to the DB
    addPlayer(player) {
        var data = {"data": {
            "player" : player,
            "user" : localStorage.email,
            "team" : this.props.activeTeam }};

        data = JSON.stringify(data);

        var url = "http://localhost:3000/team/registerPlayer";
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
    },

    render() {
        return (
            <div>
                {this.buildPlayerList()}
            </div>
        );
    }
});

module.exports = PlayerList;
