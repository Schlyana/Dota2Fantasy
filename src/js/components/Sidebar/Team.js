var React = require('react');

var Col = require('react-bootstrap').Col;
var Row = require('react-bootstrap').Row;
var Grid = require('react-bootstrap').Grid;
var Thumbnail = require('react-bootstrap').Thumbnail;
var Button = require('react-bootstrap').Button;

var LeagueTable = require('./Team/LeagueTable');
var TeamBar = require('./TeamMgmnt/TeamBar');

const PLAYERIMG = "/dota2.jpg";
const XS = 6;
const SM = 3;
const MD = 2;
const LG = 2;

const Team = React.createClass({

    getInitialState() {
        return {};
    },

    getTeamMemebers() {
        var url = 'http://localhost:3000/user/getData/' + localStorage.email;
        fetch(url)
        .then((response) => response.text())
        .then((responseText) => {
            var teamMembers = JSON.parse(responseText)["data"];

            if (teamMembers.length > 0){
                var newState = {players : teamMembers};
                this.setState(newState);
            }
        })
        .catch((error) => {
            console.warn(error);
        });
    },

    buildPlayerList() {
      var players = this.state.players;
      var res = [];
      var i = 0;

      if ( players == undefined || players.length < 1) return;

      for (i = 0; i < players.length; i++){
          res[i] = <Col xs={XS} sm={SM} md={MD} lg={LG}>
                        <Thumbnail src={PLAYERIMG} alt="Error">
                            <h4> {players[i].name} </h4>
                            <p>
                                Country : {players[i].country} <br></br>
                                Team name : {players[i].team} <br></br>
                                Role : {players[i].role}
                            </p>
                        </Thumbnail>
                    </Col>;
      }
      return <ListGroup>{res}</ListGroup>;
    },

    componentDidMount() {
        this.getTeamMemebers();
    },

    render() {
        return (
            <div>
                <TeamBar activeTeam={this.props.activeTeam}/>
                <LeagueTable activeTeam={this.props.activeTeam}/>
            </div>
        );
    }
});

module.exports = Team;
