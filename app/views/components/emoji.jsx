
var EmojiBtn = React.createClass({
  getInitialState: function () {
    return { showEmojiMenu : false };
  },
  toggleEmojiMenu: function () {
    var active = this.state.showEmojiMenu ? false : true;
    this.setState({ showEmojiMenu : active });
  },
  render: function () {
    var emojiValues = ['smile',
      'grin',
      'wink',
      'laugh',
      'tongue',
      'yum',
      'inlove',
      'business',
      'sad',
      'yeah',
      'pensive',
      'tears',
      'cry',
      'weary',
      'shout',
      'pokerface',
      'relieved',
      'angry',
      'rage',
      'angel',
      'fearful',
      'shoked',
      'astonished',
      'mask',
      'kisses',
      'devil',
      'heart',
      'thumbsup',
      'thumbsdown',
      'pointup',
      'victory',
      'okey'
    ];
    module.exports.emojiValues = emojiValues;
    var classes = this.state.showEmojiMenu ? 'emoji-btn active' : 'emoji-btn';
    return (
      <div>
        <a className={classes} onClick={this.toggleEmojiMenu}></a>
        <EmojiMenu show={this.state.showEmojiMenu} items={emojiValues}/>
      </div>
    )
  }
});

var EmojiMenu = React.createClass({
  addEmoji: function(type) {
    var emoji = ' :' + type + ': ';
    var area = document.getElementsByName('text').item(0);
    if ( (area.selectionStart) || (area.selectionStart == '0') ) {
      var start = area.selectionStart;
      var end = area.selectionEnd;
      area.value = area.value.substring(0, start) + emoji + area.value.substring(end, area.value.length);
    }
  },
  render: function () {
    var _this = this;
    var cx = require('classnames');

    var classesEmojiMenu = cx({
      'emoji-menu': true,
      'active': this.props.show
    });
    var classesEmojiItems = cx({
      'emoji': true,
    });

    return (
      <div className={classesEmojiMenu}>
        { this.props.items.map(function(value){
          return <span className={classesEmojiItems + ' emoji-' + value} onClick={_this.addEmoji.bind(_this, value)}></span>;
        }) }
      </div>
    )
  }
});


module.exports = EmojiBtn;

