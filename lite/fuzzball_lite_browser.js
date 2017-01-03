require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/**
 * @license
 * Lodash (Custom Build) lodash.com/license | Underscore.js 1.8.3 underscorejs.org/LICENSE
 * Build: `lodash include="intersection,difference,uniq" -p -o ./lite/lodash.custom.min.js`
 */
;(function(){function t(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)}function e(t,e){var r;if(r=!(null==t||!t.length)){if(e===e)t:{r=-1;for(var o=t.length;++r<o;)if(t[r]===e)break t;r=-1}else t:{r=n;for(var o=t.length,i=-1;++i<o;)if(r(t[i],i,t)){r=i;break t}r=-1}r=-1<r}return r}function n(t){return t!==t}function r(t,e){return t.has(e)}function o(t){var e=-1,n=Array(t.size);return t.forEach(function(t){
n[++e]=t}),n}function i(){}function u(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function a(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function l(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function c(t){var e=-1,n=null==t?0:t.length;for(this.__data__=new l;++e<n;)this.add(t[e])}function s(t,e){for(var n=t.length;n--;)if(j(t[n][0],e))return n;return-1}function f(t,e,n,r,o){
var i=-1,u=t.length;for(n||(n=g),o||(o=[]);++i<u;){var a=t[i];if(0<e&&n(a))if(1<e)f(a,e-1,n,r,o);else for(var l=o,c=-1,s=a.length,h=l.length;++c<s;)l[h+c]=a[c];else r||(o[o.length]=a)}return o}function h(t){if(null==t)return t===$?"[object Undefined]":"[object Null]";if(K&&K in Object(t)){var e=N.call(t,K),n=t[K];try{t[K]=$;var r=true}catch(t){}var o=G.call(t);r&&(e?t[K]=n:delete t[K]),t=o}else t=G.call(t);return t}function _(t){return x(t)&&"[object Arguments]"==h(t)}function p(t,e){return rt(v(t,e,k),t+"");
}function y(t,e){var n=t.__data__,r=typeof e;return("string"==r||"number"==r||"symbol"==r||"boolean"==r?"__proto__"!==e:null===e)?n[typeof e=="string"?"string":"hash"]:n.map}function d(t,e){var n,r=null==t?$:t[e];return n=!(!z(r)||D&&D in r)&&(w(r)?U:P).test(b(r)),n?r:$}function g(t){return it(t)||ot(t)||!!(J&&t&&t[J])}function v(e,n,r){return n=W(n===$?e.length-1:n,0),function(){for(var o=arguments,i=-1,u=W(o.length-n,0),a=Array(u);++i<u;)a[i]=o[n+i];for(i=-1,u=Array(n+1);++i<n;)u[i]=o[i];return u[n]=r(a),
t(e,this,u)}}function b(t){if(null!=t){try{return C.call(t)}catch(t){}return t+""}return""}function j(t,e){return t===e||t!==t&&e!==e}function m(t){return null!=t&&A(t.length)&&!w(t)}function O(t){return x(t)&&m(t)}function w(t){return!!z(t)&&(t=h(t),"[object Function]"==t||"[object GeneratorFunction]"==t||"[object AsyncFunction]"==t||"[object Proxy]"==t)}function A(t){return typeof t=="number"&&-1<t&&0==t%1&&9007199254740991>=t}function z(t){var e=typeof t;return null!=t&&("object"==e||"function"==e);
}function x(t){return null!=t&&typeof t=="object"}function S(t){return function(){return t}}function k(t){return t}function F(){}var $,E=1/0,P=/^\[object .+?Constructor\]$/,L=typeof self=="object"&&self&&self.Object===Object&&self,L=typeof global=="object"&&global&&global.Object===Object&&global||L||Function("return this")(),T=typeof exports=="object"&&exports&&!exports.nodeType&&exports,I=T&&typeof module=="object"&&module&&!module.nodeType&&module,M=Array.prototype,R=Object.prototype,q=L["__core-js_shared__"],C=Function.prototype.toString,N=R.hasOwnProperty,D=function(){
var t=/[^.]+$/.exec(q&&q.keys&&q.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}(),G=R.toString,U=RegExp("^"+C.call(N).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),V=L.Symbol,B=R.propertyIsEnumerable,H=M.splice,J=V?V.isConcatSpreadable:$,K=V?V.toStringTag:$,Q=function(){try{var t=d(Object,"defineProperty");return t({},"",{}),t}catch(t){}}(),W=Math.max,X=Math.min,Y=Date.now,Z=d(L,"Map"),tt=d(L,"Set"),et=d(Object,"create");u.prototype.clear=function(){
this.__data__=et?et(null):{},this.size=0},u.prototype.delete=function(t){return t=this.has(t)&&delete this.__data__[t],this.size-=t?1:0,t},u.prototype.get=function(t){var e=this.__data__;return et?(t=e[t],"__lodash_hash_undefined__"===t?$:t):N.call(e,t)?e[t]:$},u.prototype.has=function(t){var e=this.__data__;return et?e[t]!==$:N.call(e,t)},u.prototype.set=function(t,e){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=et&&e===$?"__lodash_hash_undefined__":e,this},a.prototype.clear=function(){
this.__data__=[],this.size=0},a.prototype.delete=function(t){var e=this.__data__;return t=s(e,t),!(0>t)&&(t==e.length-1?e.pop():H.call(e,t,1),--this.size,true)},a.prototype.get=function(t){var e=this.__data__;return t=s(e,t),0>t?$:e[t][1]},a.prototype.has=function(t){return-1<s(this.__data__,t)},a.prototype.set=function(t,e){var n=this.__data__,r=s(n,t);return 0>r?(++this.size,n.push([t,e])):n[r][1]=e,this},l.prototype.clear=function(){this.size=0,this.__data__={hash:new u,map:new(Z||a),string:new u
}},l.prototype.delete=function(t){return t=y(this,t).delete(t),this.size-=t?1:0,t},l.prototype.get=function(t){return y(this,t).get(t)},l.prototype.has=function(t){return y(this,t).has(t)},l.prototype.set=function(t,e){var n=y(this,t),r=n.size;return n.set(t,e),this.size+=n.size==r?0:1,this},c.prototype.add=c.prototype.push=function(t){return this.__data__.set(t,"__lodash_hash_undefined__"),this},c.prototype.has=function(t){return this.__data__.has(t)};var M=Q?function(t,e){return Q(t,"toString",{
configurable:true,enumerable:false,value:S(e),writable:true})}:k,nt=tt&&1/o(new tt([,-0]))[1]==E?function(t){return new tt(t)}:F,rt=function(t){var e=0,n=0;return function(){var r=Y(),o=16-(r-n);if(n=r,0<o){if(800<=++e)return arguments[0]}else e=0;return t.apply($,arguments)}}(M),E=p(function(t,n){var o;if(O(t)){o=f(n,1,O,true);var i=-1,u=e,a=true,l=t.length,s=[],h=o.length;if(l)t:for(200<=o.length&&(u=r,a=false,o=new c(o));++i<l;){var _=t[i],p=_,_=0!==_?_:0;if(a&&p===p){for(var y=h;y--;)if(o[y]===p)continue t;
s.push(_)}else u(o,p,void 0)||s.push(_)}o=s}else o=[];return o}),M=p(function(t){for(var n=-1,o=null==t?0:t.length,i=Array(o);++n<o;){var u,a=n;u=t[n],u=O(u)?u:[],i[a]=u}if(i.length&&i[0]===t[0]){t=i[0].length,o=n=i.length,a=Array(n),u=1/0;for(var l=[];o--;){var s=i[o];u=X(s.length,u),a[o]=120<=t&&120<=s.length?new c(o&&s):$}var s=i[0],f=-1,h=a[0];t:for(;++f<t&&l.length<u;){var _=s[f],p=_,_=0!==_?_:0;if(h?!r(h,p):!e(l,p,void 0)){for(o=n;--o;){var y=a[o];if(y?!r(y,p):!e(i[o],p,void 0))continue t}h&&h.push(p),
l.push(_)}}i=l}else i=[];return i}),ot=_(function(){return arguments}())?_:function(t){return x(t)&&N.call(t,"callee")&&!B.call(t,"callee")},it=Array.isArray;i.constant=S,i.difference=E,i.intersection=M,i.uniq=function(t){if(t&&t.length)t:{var n=-1,i=e,u=t.length,a=true,l=[],s=l;if(200<=u){if(i=nt(t)){t=o(i);break t}a=false,i=r,s=new c}else s=l;e:for(;++n<u;){var f=t[n],h=f,f=0!==f?f:0;if(a&&h===h){for(var _=s.length;_--;)if(s[_]===h)continue e;l.push(f)}else i(s,h,void 0)||(s!==l&&s.push(h),l.push(f));
}t=l}else t=[];return t},i.eq=j,i.identity=k,i.isArguments=ot,i.isArray=it,i.isArrayLike=m,i.isArrayLikeObject=O,i.isFunction=w,i.isLength=A,i.isObject=z,i.isObjectLike=x,i.noop=F,i.VERSION="4.17.3",typeof define=="function"&&typeof define.amd=="object"&&define.amd?(L._=i, define(function(){return i})):I?((I.exports=i)._=i,T._=i):L._=i}).call(this);
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
module.exports = require('./lib/heap');

},{"./lib/heap":3}],3:[function(require,module,exports){
// Generated by CoffeeScript 1.8.0
(function() {
  var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;

  floor = Math.floor, min = Math.min;


  /*
  Default comparison function to be used
   */

  defaultCmp = function(x, y) {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  };


  /*
  Insert item x in list a, and keep it sorted assuming a is sorted.
  
  If x is already in a, insert it to the right of the rightmost x.
  
  Optional args lo (default 0) and hi (default a.length) bound the slice
  of a to be searched.
   */

  insort = function(a, x, lo, hi, cmp) {
    var mid;
    if (lo == null) {
      lo = 0;
    }
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (lo < 0) {
      throw new Error('lo must be non-negative');
    }
    if (hi == null) {
      hi = a.length;
    }
    while (lo < hi) {
      mid = floor((lo + hi) / 2);
      if (cmp(x, a[mid]) < 0) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
  };


  /*
  Push item onto heap, maintaining the heap invariant.
   */

  heappush = function(array, item, cmp) {
    if (cmp == null) {
      cmp = defaultCmp;
    }
    array.push(item);
    return _siftdown(array, 0, array.length - 1, cmp);
  };


  /*
  Pop the smallest item off the heap, maintaining the heap invariant.
   */

  heappop = function(array, cmp) {
    var lastelt, returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    lastelt = array.pop();
    if (array.length) {
      returnitem = array[0];
      array[0] = lastelt;
      _siftup(array, 0, cmp);
    } else {
      returnitem = lastelt;
    }
    return returnitem;
  };


  /*
  Pop and return the current smallest value, and add the new item.
  
  This is more efficient than heappop() followed by heappush(), and can be
  more appropriate when using a fixed size heap. Note that the value
  returned may be larger than item! That constrains reasonable use of
  this routine unless written as part of a conditional replacement:
      if item > array[0]
        item = heapreplace(array, item)
   */

  heapreplace = function(array, item, cmp) {
    var returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    returnitem = array[0];
    array[0] = item;
    _siftup(array, 0, cmp);
    return returnitem;
  };


  /*
  Fast version of a heappush followed by a heappop.
   */

  heappushpop = function(array, item, cmp) {
    var _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (array.length && cmp(array[0], item) < 0) {
      _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
      _siftup(array, 0, cmp);
    }
    return item;
  };


  /*
  Transform list into a heap, in-place, in O(array.length) time.
   */

  heapify = function(array, cmp) {
    var i, _i, _j, _len, _ref, _ref1, _results, _results1;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    _ref1 = (function() {
      _results1 = [];
      for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this).reverse();
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      i = _ref1[_i];
      _results.push(_siftup(array, i, cmp));
    }
    return _results;
  };


  /*
  Update the position of the given item in the heap.
  This function should be called every time the item is being modified.
   */

  updateItem = function(array, item, cmp) {
    var pos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    pos = array.indexOf(item);
    if (pos === -1) {
      return;
    }
    _siftdown(array, 0, pos, cmp);
    return _siftup(array, pos, cmp);
  };


  /*
  Find the n largest elements in a dataset.
   */

  nlargest = function(array, n, cmp) {
    var elem, result, _i, _len, _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    result = array.slice(0, n);
    if (!result.length) {
      return result;
    }
    heapify(result, cmp);
    _ref = array.slice(n);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      heappushpop(result, elem, cmp);
    }
    return result.sort(cmp).reverse();
  };


  /*
  Find the n smallest elements in a dataset.
   */

  nsmallest = function(array, n, cmp) {
    var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (n * 10 <= array.length) {
      result = array.slice(0, n).sort(cmp);
      if (!result.length) {
        return result;
      }
      los = result[result.length - 1];
      _ref = array.slice(n);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        if (cmp(elem, los) < 0) {
          insort(result, elem, 0, null, cmp);
          result.pop();
          los = result[result.length - 1];
        }
      }
      return result;
    }
    heapify(array, cmp);
    _results = [];
    for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      _results.push(heappop(array, cmp));
    }
    return _results;
  };

  _siftdown = function(array, startpos, pos, cmp) {
    var newitem, parent, parentpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    newitem = array[pos];
    while (pos > startpos) {
      parentpos = (pos - 1) >> 1;
      parent = array[parentpos];
      if (cmp(newitem, parent) < 0) {
        array[pos] = parent;
        pos = parentpos;
        continue;
      }
      break;
    }
    return array[pos] = newitem;
  };

  _siftup = function(array, pos, cmp) {
    var childpos, endpos, newitem, rightpos, startpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    endpos = array.length;
    startpos = pos;
    newitem = array[pos];
    childpos = 2 * pos + 1;
    while (childpos < endpos) {
      rightpos = childpos + 1;
      if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
        childpos = rightpos;
      }
      array[pos] = array[childpos];
      pos = childpos;
      childpos = 2 * pos + 1;
    }
    array[pos] = newitem;
    return _siftdown(array, startpos, pos, cmp);
  };

  Heap = (function() {
    Heap.push = heappush;

    Heap.pop = heappop;

    Heap.replace = heapreplace;

    Heap.pushpop = heappushpop;

    Heap.heapify = heapify;

    Heap.updateItem = updateItem;

    Heap.nlargest = nlargest;

    Heap.nsmallest = nsmallest;

    function Heap(cmp) {
      this.cmp = cmp != null ? cmp : defaultCmp;
      this.nodes = [];
    }

    Heap.prototype.push = function(x) {
      return heappush(this.nodes, x, this.cmp);
    };

    Heap.prototype.pop = function() {
      return heappop(this.nodes, this.cmp);
    };

    Heap.prototype.peek = function() {
      return this.nodes[0];
    };

    Heap.prototype.contains = function(x) {
      return this.nodes.indexOf(x) !== -1;
    };

    Heap.prototype.replace = function(x) {
      return heapreplace(this.nodes, x, this.cmp);
    };

    Heap.prototype.pushpop = function(x) {
      return heappushpop(this.nodes, x, this.cmp);
    };

    Heap.prototype.heapify = function() {
      return heapify(this.nodes, this.cmp);
    };

    Heap.prototype.updateItem = function(x) {
      return updateItem(this.nodes, x, this.cmp);
    };

    Heap.prototype.clear = function() {
      return this.nodes = [];
    };

    Heap.prototype.empty = function() {
      return this.nodes.length === 0;
    };

    Heap.prototype.size = function() {
      return this.nodes.length;
    };

    Heap.prototype.clone = function() {
      var heap;
      heap = new Heap();
      heap.nodes = this.nodes.slice(0);
      return heap;
    };

    Heap.prototype.toArray = function() {
      return this.nodes.slice(0);
    };

    Heap.prototype.insert = Heap.prototype.push;

    Heap.prototype.top = Heap.prototype.peek;

    Heap.prototype.front = Heap.prototype.peek;

    Heap.prototype.has = Heap.prototype.contains;

    Heap.prototype.copy = Heap.prototype.clone;

    return Heap;

  })();

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      return define([], factory);
    } else if (typeof exports === 'object') {
      return module.exports = factory();
    } else {
      return root.Heap = factory();
    }
  })(this, function() {
    return Heap;
  });

}).call(this);

},{}],"fuzzball":[function(require,module,exports){
(function () {
    'use strict';
    var Heap = require('heap');
    var _intersect = require('./lodash.custom.min.js').intersection;
    var _difference = require('./lodash.custom.min.js').difference;
    var _uniq = require('./lodash.custom.min.js').uniq;
/** Mostly follows after python fuzzywuzzy, https://github.com/seatgeek/fuzzywuzzy */


/** Public functions */

    function distance(str1, str2, options_p) {
        /**
         * Calculate levenshtein distance of the two strings.
         *
         * @param {string} str1 - the first string.
         * @param {string} str2 - the second string.
         * @param {Object} [options_p] - Additional options.
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @returns {number} - the levenshtein distance (0 and above).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options.force_ascii) : str1;
        str2 = options.full_process ? full_process(str2, options.force_ascii) : str2;
        if (typeof options.subcost === "undefined") options.subcost = 1;
        return _lev_distance(str1, str2, options);
    }

    function QRatio(str1, str2, options_p) {
        /**
         * Calculate levenshtein ratio of the two strings.
         *
         * @param {string} str1 - the first string.
         * @param {string} str2 - the second string.
         * @param {Object} [options_p] - Additional options.
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @returns {number} - the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options.force_ascii) : str1;
        str2 = options.full_process ? full_process(str2, options.force_ascii) : str2;
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        return _ratio(str1, str2, options);
    }

    function token_set_ratio(str1, str2, options_p) {
        /**
         * Calculate token set ratio of the two strings.
         *
         * @param {string} str1 - the first string.
         * @param {string} str2 - the second string.
         * @param {Object} [options_p] - Additional options.
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @returns {number} - the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options.force_ascii) : str1;
        str2 = options.full_process ? full_process(str2, options.force_ascii) : str2;
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        return _token_set(str1, str2, options);
    }

    function token_sort_ratio(str1, str2, options_p) {
        /**
         * Calculate token sort ratio of the two strings.
         *
         * @param {string} str1 - the first string.
         * @param {string} str2 - the second string.
         * @param {Object} [options_p] - Additional options.
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @returns {number} - the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        str1 = options.full_process ? full_process(str1, options.force_ascii) : str1;
        str2 = options.full_process ? full_process(str2, options.force_ascii) : str2;
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        if (!options.proc_sorted) {
            str1 = process_and_sort(str1);
            str2 = process_and_sort(str2);
        }
        return _ratio(str1, str2, options);
    }

    function extract(query, choices, options_p) {
        /**
         * Return the top scoring items from an array (or assoc array) of choices
         *
         * @param {string} query - the search term.
         * @param {String[]|Object[]|Object} choices - array of strings, or array of choice objects if processor is supplied, or object of form {key: choice}
         * @param {Object} [options_p] - Additional options.
         * @param {function} [options_p.scorer] - takes two strings and returns a score
         * @param {function} [options_p.processor] - takes each choice and outputs a string to be used for Scoring
         * @param {number} [options_p.limit] - optional max number of results to return, returns all if not supplied
         * @param {number} [options_p.cutoff] - minimum score that will get returned 0-100
         * @param {boolean} [options_p.useCollator] - Use `Intl.Collator` for locale-sensitive string comparison.
         * @param {boolean} [options_p.full_process] - Apply basic cleanup, non-alphanumeric to whitespace etc. if true. default true
         * @param {boolean} [options_p.force_ascii] - Strip non-ascii in full_process if true (non-ascii will not become whtespace), only applied if full_process is true as well, default true TODO: Unicode stuff
         * @param {number} [options_p.subcost] - Substitution cost, default 1 for distance, 2 for all ratios
         * @returns {number} - the levenshtein ratio (0-100).
         */
        var options = _clone_and_set_option_defaults(options_p);
        var isArray = false;
        var numchoices;
        if (choices && choices.length && Array.isArray(choices)) {
            numchoices = choices.length;
            isArray = true; //if array don't check hasOwnProperty every time below
        }
        else numchoices = Object.keys(choices).length;
        if (!choices || numchoices === 0) console.log("No choices");
        if (options.processor && typeof options.processor !== "function") console.log("Invalid Processor");
        if (!options.processor) options.processor = function(x) {return x;}
        if (!options.scorer || typeof options.scorer !== "function") {
            options.scorer = QRatio;
            console.log("Using default scorer");
        }
        if (!options.cutoff || typeof options.cutoff !== "number") { options.cutoff = -1;}
        var pre_processor = function(choice, force_ascii) {return choice;}
        if (options.full_process) pre_processor = full_process;
        options.full_process = false;
        query = pre_processor(query, options.force_ascii);
        if (query.length === 0) console.log("Processed query is empty string");
        var results = [];
        var anyblank = false;
        var tsort = false;
        var tset = false;
        if (options.scorer.name === "token_sort_ratio" || options.scorer.name === "partial_token_sort_ratio") {
            var proc_sorted_query = process_and_sort(query);
            tsort = true;
        }
        else if (options.scorer.name === "token_set_ratio" || options.scorer.name === "partial_token_set_ratio") {
            var query_tokens = tokenize(query);
            tset = true;
        }

        for (var c in choices) {
            if (isArray || choices.hasOwnProperty(c)) {
                options.tokens = undefined;
                options.proc_sorted = false;
                if (tsort) {
                    options.proc_sorted = true;
                    if (choices[c].proc_sorted) var mychoice = choices[c].proc_sorted;
                    else {
                        var mychoice = pre_processor(options.processor(choices[c]), options.force_ascii);
                        mychoice = process_and_sort(mychoice);
                    }
                    var result = options.scorer(proc_sorted_query, mychoice, options);
                }
                else if (tset) {
                    var mychoice = pre_processor(options.processor(choices[c]), options.force_ascii);
                    if (choices[c].tokens) options.tokens = [query_tokens, choices[c].tokens];
                    else options.tokens = [query_tokens, tokenize(mychoice)]
                    //query and mychoice only used for validation here
                    var result = options.scorer(query, mychoice, options);
                }
                else {
                    var mychoice = pre_processor(options.processor(choices[c]), options.force_ascii);
                    if (typeof mychoice !== "string" || (typeof mychoice === "string" && mychoice.length === 0)) anyblank = true;
                    var result = options.scorer(query, mychoice, options);
                }
                if (result > options.cutoff) results.push([choices[c], result, c]);
            }
        }
        if(anyblank) console.log("One or more choices were empty. (post-processing if applied)")
        if (options.limit && typeof options.limit === "number" && options.limit > 0 && options.limit < numchoices) {
            var cmp = function(a, b) { return a[1] - b[1]; }
            results = Heap.nlargest(results, options.limit, cmp);
        }
        else {
            results = results.sort(function(a,b){return b[1]-a[1];});
        }
        return results;
    }

/** Main Scoring Code */

    function _lev_distance(str1, str2, options) {
      return _leven(str1, str2, options); // was more options so separate func still, may add back
    }

    function _token_set(str1, str2, options) {

        if (!options.tokens) {
            var tokens1 = tokenize(str1);
            var tokens2 = tokenize(str2);
        }
        else {
            var tokens1 = options.tokens[0];
            var tokens2 = options.tokens[1];
        }

        var intersection = _intersect(tokens1, tokens2);
        var diff1to2 = _difference(tokens1, tokens2);
        var diff2to1 = _difference(tokens2, tokens1);

        var sorted_sect = intersection.sort().join(" ");
        var sorted_1to2 = diff1to2.sort().join(" ");
        var sorted_2to1 = diff2to1.sort().join(" ");
        var combined_1to2 = sorted_sect + " " + sorted_1to2;
        var combined_2to1 = sorted_sect + " " + sorted_2to1;
        
        sorted_sect = sorted_sect.trim();
        combined_1to2 = combined_1to2.trim();
        combined_2to1 = combined_2to1.trim();
        var ratio_func = _ratio;
        //if (options.partial) ratio_func = _partial_ratio;

        var pairwise = [
            ratio_func(sorted_sect, combined_1to2, options),
            ratio_func(sorted_sect, combined_2to1, options),
            ratio_func(combined_1to2, combined_2to1, options)
        ]
        return Math.max.apply(null, pairwise);
    }

    function _ratio(str1, str2, options) {
        if (!_validate(str1)) return 0;
        if (!_validate(str2)) return 0;
        //to match behavior of python-Levenshtein/fuzzywuzzy, substitution cost is 2 if not specified, or would default to 1
        if (typeof options.subcost === "undefined") options.subcost = 2;
        var levdistance = _lev_distance(str1, str2, options);
        var lensum = str1.length + str2.length ; //TODO: account for unicode double byte astral stuff
        return Math.round(100 * ((lensum - levdistance)/lensum));
    }

    function process_and_sort(str) {
        return str.match(/\S+/g).sort().join(" ").trim();
    }

     function tokenize(str) {
        //uniqe tokens
        return _uniq(str.match(/\S+/g));
    }

    /** from https://github.com/hiddentao/fast-levenshtein slightly modified to double weight replacements as done by python-Levenshtein/fuzzywuzzy */

    // arrays to re-use

    var collator;
    try {
        collator = (typeof Intl !== "undefined" && typeof Intl.Collator !== "undefined") ? Intl.Collator("generic", { sensitivity: "base" }) : null;
    } catch (err) {
        console.log("Collator could not be initialized and wouldn't be used");
    }

    // testing if faster than fast-levenshtein..
    /** from https://github.com/sindresorhus/leven slightly modified to double weight replacements as done by python-Levenshtein/fuzzywuzzy */
    var arr = [];
    var charCodeCache = [];

    var _leven = function (a, b, options) {
        var useCollator = (options && collator && options.useCollator);
        var subcost = 1;
        //to match behavior of python-Levenshtein and fuzzywuzzy
        if (options && options.subcost && typeof options.subcost === "number") subcost = options.subcost;

        if (a === b) {
            return 0;
        }

        var aLen = a.length;
        var bLen = b.length;

        if (aLen === 0) {
            return bLen;
        }

        if (bLen === 0) {
            return aLen;
        }

        var bCharCode;
        var ret;
        var tmp;
        var tmp2;
        var i = 0;
        var j = 0;

        while (i < aLen) {
            charCodeCache[i] = a.charCodeAt(i);
            arr[i] = ++i;
        }
        if (!useCollator) {  //checking for collator inside while 2x slower
            while (j < bLen) {
                bCharCode = b.charCodeAt(j);
                tmp = j++;
                ret = j;
                for (i = 0; i < aLen; i++) {
                    tmp2 = bCharCode === charCodeCache[i] ? tmp : tmp + subcost;
                    tmp = arr[i];
                    ret = arr[i] = tmp > ret ? tmp2 > ret ? ret + 1 : tmp2 : tmp2 > tmp ? tmp + 1 : tmp2;
                }
            }
        }
        else {
            while (j < bLen) {
                bCharCode = b.charCodeAt(j);
                tmp = j++;
                ret = j;

                for (i = 0; i < aLen; i++) {
                    tmp2 = 0 === collator.compare(String.fromCharCode(bCharCode), String.fromCharCode(charCodeCache[i])) ? tmp : tmp + subcost;
                    //tmp2 = bCharCode === charCodeCache[i] ? tmp : tmp + subcost;
                    tmp = arr[i];
                    ret = arr[i] = tmp > ret ? tmp2 > ret ? ret + 1 : tmp2 : tmp2 > tmp ? tmp + 1 : tmp2;
                }
            }
        }
        return ret;
    };


/**    Utils   */

    function _validate(str) {
        if ((typeof str === "string" || str instanceof String) && str.length > 0) return true;
        else return false;
    }

    function full_process(str, force_ascii) {
        if (!(str instanceof String) && typeof str !== "string") return "";
        // Non-ascii won't turn into whitespace if force_ascii
        if (force_ascii !== false) str = str.replace(/[^\x00-\x7F]/g, "");
        // Non-alphanumeric (roman alphabet) to whitespace
        return str.replace(/\W|_/g,' ').toLowerCase().trim();
    }

    // clone/shallow copy whatev
    function _clone_and_set_option_defaults(options) {
        // don't run more than once if usign extract functions
        if(options && options.isAClone) return options;
        var optclone = {isAClone: true};
        if (options) {
            var i, keys = Object.keys(options);
            for (i = 0; i < keys.length; i++) {
                optclone[keys[i]] = options[keys[i]];
            }
        }
        if (!(typeof optclone.full_process !== 'undefined' && optclone.full_process === false)) optclone.full_process = true;
        if (!(typeof optclone.force_ascii !== 'undefined' && optclone.force_ascii === false)) optclone.force_ascii = true ;
        return optclone;
    }
    //polyfill for Object.keys
    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {
        Object.keys = (function () {
            'use strict';
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function (obj) {
                if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                    throw new TypeError('Object.keys called on non-object');
                }

                var result = [], prop, i;

                for (prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) {
                        result.push(prop);
                    }
                }

                if (hasDontEnumBug) {
                    for (i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        } ());
    }
    // isArray polyfill
    if (typeof Array.isArray === 'undefined') {
        Array.isArray = function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
    };

    var fuzzball = {
        distance: distance,
        ratio: QRatio,
        token_set_ratio: token_set_ratio,
        token_sort_ratio: token_sort_ratio,
        full_process: full_process,
        extract: extract,
        process_and_sort: process_and_sort,
        unique_tokens: tokenize
    };

    // amd
    if (typeof define !== "undefined" && define !== null && define.amd) {
        define(function () {
            return fuzzball;
        });
    }
    // commonjs
    else if (typeof module !== "undefined" && module !== null && typeof exports !== "undefined" && module.exports === exports) {
        module.exports = fuzzball;
    }
    // web worker
    else if (typeof self !== "undefined" && typeof self.postMessage === 'function' && typeof self.importScripts === 'function') {
        self.fuzzball = fuzzball;
    }
    // browser main thread
    else if (typeof window !== "undefined" && window !== null) {
        window.fuzzball = fuzzball;
    }
} ());

},{"./lodash.custom.min.js":1,"heap":2}]},{},[]);