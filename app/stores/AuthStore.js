var AuthStoreFunction = function (socket) {

var alt_obj = require('./../controllers/alt_obj');
var AuthActions = require('./../actions/AuthActions');

function AuthStore() {
  this.messages = [];
  this.displayName = 'AuthStore';
  this.bindListeners({
    logOut: AuthActions.LOG_OUT
  });
}

AuthStore.prototype.logOut = function (newState) {
  var _this = this;
  for (key in newState) {
    _this[key] = newState[key];
  }
  localStorage.removeItem('userName');
  localStorage.removeItem('userPass');
};

  return alt_obj.createStore(AuthStore);
};

module.exports = AuthStoreFunction;
