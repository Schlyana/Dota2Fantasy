var React = require('react');

/* Components */
var Sidebar = require('./Sidebar');
var SignIn = require('./SignIn');

const Layout = React.createClass({

    render() {
        return (
            <div>
                <Sidebar />
            </div>
        );
    }
});

module.exports = Layout;
