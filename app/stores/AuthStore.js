var AuthStoreFunction = function (socket) {

var alt_obj = require('./../controllers/alt_obj');
var AuthActions = require('./../actions/AuthActions');

function AuthStore() {
  this.messages = []; // это бывший initState у компонента
  this.displayName = 'AuthStore'; // обязательное поле для ES5
  this.bindListeners({
  	logOut: AuthActions.LOG_OUT
  });
}


// тут описываем все функции стора (в основном это присваение стейта нового значения)
AuthStore.prototype.logOut = function (newState) {
	var _this = this;
	for (key in newState) {
		_this[key] = newState[key];
	}
};


  return alt_obj.createStore(AuthStore);
};

module.exports = AuthStoreFunction;