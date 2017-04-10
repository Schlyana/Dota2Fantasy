var React = require('react');

var TeamBar = require('./TeamMgmnt/TeamBar');
var PlayerList = require('./TeamMgmnt/PlayerList');

const TeamMgmnt = React.createClass({

    render() {
        return (
            <div>
                <TeamBar activeTeam={this.props.activeTeam}/>
                <div>
                    <PlayerList activeTeam={this.props.activeTeam}/>
                </div>
            </div>
        );
    }
});

module.exports = TeamMgmnt;
