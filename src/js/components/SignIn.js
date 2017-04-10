var React = require('react');

const SignIn = React.createClass({

      onSignIn(googleUser) {
          console.log(googleUser);
          // Useful data for your client-side scripts:
          var profile = googleUser.getBasicProfile();
          // The ID token you need to pass to your backend:
          var id_token = googleUser.getAuthResponse().id_token;

          var user = {
              "user" : {
                  "name" : profile.getName(),
                  "given_name" : profile.getGivenName(),
                  "family_name" : profile.getFamilyName(),
                  "email" : profile.getEmail(),
                  "token" : id_token
              }
        };

        user = JSON.stringify(user);

        var request = new Request('http://localhost:3000/user/register', {
            method: 'POST',
            body: user,
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
    },
    renderGoogleLoginButton(){
        gapi.signin2.render('g-signin2', {
            'scope': 'https://www.googleapis.com/auth/plus.login',
            'width': 200,
            'height': 50,
            'longtitle': true,
            'theme': 'dark',
            'onsuccess': this.onSignIn,
        });
    },

    componentDidMount() {
        window.addEventListener('google-loaded',this.renderGoogleLoginButton);
    },

    render() {
        return (
            <div class="g-signin2" onClick={this.onSignIn} data-theme="dark"></div>
        );
    }
});

module.exports = SignIn;
