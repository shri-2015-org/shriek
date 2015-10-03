var altObj = require('./../controllers/alt_obj');

var AuthActions = altObj.createActions({
  displayName: 'AuthActions',

  logOut: function (newState) {
    this.dispatch(newState);
  },

  makeLogOut: function () {
    var newState = {
      logged: false,
      userInit: true,
      passInit: true,
      passportInit: false,
      passportUser: false
    };

    this.actions.logOut(newState);
  }

});

module.exports = altObj.createActions('AuthActions', AuthActions);
