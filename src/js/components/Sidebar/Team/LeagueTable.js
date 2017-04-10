var React = require('react');
var Table = require('react-bootstrap').Table;


const LeagueTable = React.createClass({

    // Set the initial state to empty.
    getInitialState() {
        return {};
    },

    getLeague() {
        var url = 'http://localhost:3000/getLeagueData/';
        fetch(url)
        .then((response) => response.text())
        .then((responseText) => {
            responseText = JSON.parse(responseText);
            var league = responseText['data'][0];

            if (league != undefined){
                var newState = {leagueData:league};
                this.setState(newState);
            }
        })
        .catch((error) => {
            console.warn(error);
        });
    },

    generateTable () {
        var league = this.state.leagueData;

        var teams = [{name:'First team', points:'0', pos:'1'},
                            {name:'2nd team', points:'0', pos:'2'},
                            {name:'3rd team', points:'0', pos:'3'},
                            {name:'4th team', points:'0', pos:'4'}];
        var i = 0;
        var res = [];

        if (league == undefined) return;

        res[0] = <LeagueTableRow key={0} pos={0} team={league["name"]} owner={league["owner"]} points={0}/>

        for (i = 1; i < teams.length; i++) {
            res[i] = <LeagueTableRow key={i} pos={0} team={teams[i].name} owner={1} points={0}/>
        }

        return res;
    },

    componentDidMount() {
        this.getLeague();
    },

    render() {
        return (
            <Table striped bordered hover condensed style={{maxWidth:80+'%'}}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Team Name</th>
                  <th>Owner</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                  {this.generateTable()}
              </tbody>
            </Table>
        );
    }
});

const LeagueTableRow = React.createClass ({
    render () {
        return (
            <tr>
                <td>{this.props.pos}</td>
                <td>{this.props.team}</td>
                <td>{this.props.owner}</td>
                <td>{this.props.points}</td>
            </tr>
        );
    }
});

module.exports = LeagueTable;
