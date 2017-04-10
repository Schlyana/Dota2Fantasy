var React = require('react');

var Col = require('react-bootstrap').Col;
var Row = require('react-bootstrap').Row;
var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;
var Thumbnail = require('react-bootstrap').Thumbnail;
var Tab = require('react-bootstrap').Tab;
var NavDropdown = require('react-bootstrap').NavDropdown;
var MenuItem = require('react-bootstrap').MenuItem;
var DropdownButton = require('react-bootstrap').DropdownButton;

var Team = require('./Sidebar/Team');
var Leagues = require('./Sidebar/Leagues');
var TeamMgmnt = require('./Sidebar/TeamMgmnt');

const imgPath = "/dota2.jpg";

var style = {backgroundColor:'black', height:100 +'%', width:20 + "%", position:'fixed'};

const Sidebar = React.createClass({

    getInitialState() {
        return { teams : [], activeTeam : "", leagueState : false };
    },

    // Get all teams that a user has from the database.
    getTeams () {
        var url = 'http://localhost:3000/user/getData/' + localStorage.email;
        fetch(url)
        .then((response) => response.text())
        .then((responseText) => {
            responseText = JSON.parse(responseText);
            var teams = responseText['data'][0]['teams'];

            if (teams.length > 0){
                var newState = {teams : teams, activeTeam : teams[0]};
                this.setState(newState);
            }
        })
        .catch((error) => {
            console.warn(error);
        });
    },

    // Generate menu items depending on the number of teams a user has.
    generateMyTeams () {
        var teams = this.state.teams;
        var res = [];
        var i;

        if ( teams == undefined || teams.length < 1) return;

        for (i = 0; i < teams.length; i++){
            res[i] = <NavItem key={ i } style={{paddingLeft: 15 + 'px'}} eventKey={1} onClick={this.handleClick} name={teams[i]}> {"   " + teams[i]} </NavItem>
        }

        return <Nav style={{backgroundColor:'#121F1F', paddingTop: 2+ 'px'}} bsStyle="tabs" stacked>{res}</Nav>;
    },

    // Update the team that is displayed when it is clicked in the menu
    handleClick (event) {
        this.state.activeTeam = event.target.name;
        this.forceUpdate();
    },

    setLeagueState () {
        this.setState({ leagueState: !this.state.leagueState });
    },

    componentDidMount() {
        this.getTeams();
    },

    render() {

        return (
            <Tab.Container id="left-tabs-example" defaultActiveKey={1}>
                <Row className="clearfix">
                  <Col sm={2} xs={3} style={style}>
                    <Nav bsStyle="tabs" stacked>
                      <Thumbnail src={imgPath} alt="Error" />
                      <NavItem eventKey={1} onClick={ this.getTeams }>
                          My teams
                      </NavItem>
                      {this.generateMyTeams()}
                      <NavItem eventKey={2} onClick={ this.getTeams }>
                        Manage team
                      </NavItem>
                      <NavItem eventKey={3} onClick={ this.setLeagueState }>
                        Manage league
                      </NavItem>
                    </Nav>
                  </Col>
                  <Col sm={8} style={{width:80 + "%", float: 'right'}}>
                    <Tab.Content animation>
                      <Tab.Pane eventKey={1}>
                          <Team activeTeam={this.state.activeTeam}/>
                      </Tab.Pane>
                      <Tab.Pane eventKey={2}>
                          <TeamMgmnt activeTeam={this.state.activeTeam}/>
                      </Tab.Pane>
                      <Tab.Pane eventKey={3}>
                          <Leagues leagueState={ this.state.leagueState } />
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
        );
    }
});

module.exports = Sidebar;
