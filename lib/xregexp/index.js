var XRegExp = require('./xregexp');

require('./unicode-base')(XRegExp);
require('./unicode-categories')(XRegExp);

module.exports = XRegExp;
