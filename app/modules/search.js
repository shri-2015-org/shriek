var MessageModel = require('../models/message');

var searchModule = function(socket) {

  /**
   * Find text in channels
   * @param  data
   * @param data.channels list of channels
   * @param data.text text for search
   */
  socket.on('search text', function (data) {
    var searchMessage = new Promise(function (resolve, reject) {

      function normalizeQuery(queryString, findterms, normspace) {
        findterms = findterms || /"([^"]+)"|(\S+)/g;
        normspace = normspace || /\s{2,}/g;

        var terms = [];
        while ((term = findterms.exec(queryString)) !== null) {
          terms.push(new RegExp(term[0].replace(normspace, ' '), 'i'));
        }
        if (terms.length > 1) {
          terms.push(new RegExp(queryString.replace(normspace, ' '), 'i'));
        }

        return terms;
      }

      MessageModel.find({
        text: {$in: normalizeQuery(data.text)},
        channel: {$in: data.channels}
      }, function (err, data) {
        var out = {};

        if (!err) {
          out.status = 'ok';
          out.messages = data;
          resolve(out);
        } else {
          var error = new Error('Ошибка поиска');
          reject(error);
        }
      });
    });

    searchMessage
      .then(function (data) {
        socket.emit('search text', data);
      })
      .catch(function (error) {
        console.log(error);
      });
  });
}

module.exports = searchModule;
