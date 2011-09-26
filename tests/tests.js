if (typeof module !== 'undefined' && module.exports) {
  var s = require('sink-test')
    , start = s.start
    , sink = s.sink
    , v = require('../src/valentine')
}

sink.timeout = 3000

sink('Arrays', function(test, ok, before, after) {
  test('each', 3, function () {
    v.each(['a', 'b'], function (el, i, ar) {
      ok(el == ar[i], 'each of arrays ' + i);
    });
    v.each({ foo: 'bar' }, function (k, v, ar) {
      ok(v == ar[k], 'each of objects');
    });
  });

  test('map', 2, function () {
    var m = v.map(['a', 'b'], function (el) {
      return el.toUpperCase();
    });

    ok(m[0] === 'A' && m[1] === 'B', 'map of arrays');

    var om = v.map({
      foo: 'bar',
      baz: 'thunk'
    }, function (k, v) {
      return v;
    });

    ok(om[0] === 'bar' && om[1] === 'thunk', 'map of objects');

  });

  test('every', 2, function () {
    var a1 = ['a', 'a', 'a'];
    var a2 = ['a', 'a', 'b'];

    ok(v.every(a1, function (el) {
      return el == 'a'
    }), 'all elements in array are "a"');

    ok(!v.every(a2, function (el) {
      return el == 'a'
    }), 'all elements in array are not "a"');
  });

  test('some', 2, function () {
    var a1 = ['a', 'a', 'a'];
    var a2 = ['a', 'a', 'b'];

    ok(!v.some(a1, function (el) {
      return el == 'b'
    }), 'no elements in array have "b"');

    ok(v.some(a2, function (el) {
      return el == 'b'
    }), 'some elements in array have "b"');
  });

  test('filter', 1, function () {
    var a = v.filter(['a', 'b', 'virus', 'c'], function (el) {
      return el !== 'virus';
    });
    var expected = ['a', 'b', 'c'];
    ok(v.every(expected, function (el, i) {
      return el == a[i];
    }), 'filters out viruses');
  });

  test('reject', 1, function () {
    var a = v.reject(['a', 'b', 'virus', 'c'], function (el) {
      return el === 'virus';
    });
    var expected = ['a', 'b', 'c'];
    ok(v.every(expected, function (el, i) {
      return el == a[i];
    }), 'filters out viruses');
  });

  test('indexOf', 2, function () {
    ok(v.indexOf(['a', 'b', 'c'], 'b') == 1, 'indexOf b == 1');
    ok(v.indexOf(['x', 'y', 'z'], 'b') == -1, 'indexOf b == -1');
  });

  test('lastIndexOf', 2, function () {
    ok(v.lastIndexOf(['a', 'b', 'c'], 'c') == 2, 'indexOf c == 2');
    ok(v.lastIndexOf(['x', 'y', 'z'], 'b') == -1, 'indexOf b == -1');
  });

});

sink('Utility', function (test, ok, b, a, assert) {
  test('extend', 2, function () {
    var o = {
      foo: 'bar'
    };
    var out = v.extend(o, { baz: 'thunk' });
    ok(out.foo == 'bar', 'contains foo property');
    ok(out.baz == 'thunk', 'contains baz property');
  });

  test('extend deep', 2, function () {


    var o = {
      foo: {
        baz: 'thunk'
      }
    , dog: {
        bag: 'of stuff'
      , junk: 'murr'
      }
    }
    var o2 = {
      foo: {
        bar: 'baz'
      }
    , cat: {
        bag: 'of more stuff'
      }
    , dog: {
        junk: 'not murr'
      }
    }
    var out = v.extend(o, o2);
    ok(v.is.def(out.foo.baz), 'contains baz property');
    ok(v.is.def(out.foo.bar), 'contains bar property');
  })

  test('pluck', 1, function () {
    var o = [
      {a: 'foo'},
      {a: 'bar'},
      {a: 'baz'}
    ];
    var expected = ['foo', 'bar', 'baz'];
    ok(v.every(v.pluck(o, 'a'), function (el, i) {
      return el == expected[i];
    }, 'plucked foo bar baz'));
  });

  test('toArray', 1, function () {
    !function () {
      ok(v.toArray(arguments) instanceof Array, 'element collection is now an array');
    }('a', 'b', 'c')
  });

  test('size', 1, function () {
    ok(v.size(['a', 'b', 'c']) == 3, 'size is 3');
  });

  test('find', 1, function () {
    ok(v.find(['a', 'b', 'c'], function (el) {
      return el === 'a';
    }) === 'a', 'found element "a"');
  });

  test('compact', 1, function () {
    ok(v.compact([,,,1,false,0,null,'']).length == 1, 'compacted [,,,1,false,0,null,""] to [1]');
  });

  test('flatten', 1, function () {
    var actual = v.flatten([['a', [[['b']], ['c']], 'd']])
      , expected = ['a', 'b', 'c', 'd']
    ok(v.every(actual, function (el, i) {
      return el == expected[i]
    }), 'flattened a really crappy looking array')
  })

  test('uniq', 1, function () {
    var actual = v.uniq(['a', 'a', 'a', 'b', 'b', 'c'])
      , expected = ['a', 'b', 'c']
    ok(v.every(actual, function (el, i) {
      return el == expected[i]
    }), "turned ['a', 'a', 'a', 'b', 'b', 'c'] into ['a', 'b', 'c']")
  })

  test('merge', 2, function () {
    // object style
    var actual = v(['a', 'b', 'c']).merge(['e', 'f', 'g'])
      , expected = ['a', 'b', 'c', 'e', 'f', 'g']

    ok(v.every(expected, function (el, i) {
      return el == actual[i]
    }), "merged ['a', 'b', 'c'] and ['d', 'e', 'f']");

    // functional style
    actual = v.merge(['a', 'b', 'c'], ['e', 'f', 'g']);
    ok(v.every(expected, function (el, i) {
      return el == actual[i];
    }), "merged ['a', 'b', 'c'] and ['d', 'e', 'f']");

  })

  test('inArray', 4, function () {
    ok(v(['a', 'b', 'c']).inArray('b'), 'found b in ["a", "b", "c"]')
    ok(v.inArray(['a', 'b', 'c'], 'b'), 'found b in ["a", "b", "c"]')
    ok(!v(['a', 'b', 'c']).inArray('d'), 'did not find d in ["a", "b", "c"]')
    ok(!v.inArray(['a', 'b', 'c'], 'd'), 'did not find d in ["a", "b", "c"]')
  })

  test('first', 1, function () {
    ok(v.first(['a', 'b', 'c']) == 'a', 'a is first');
  })

  test('last', 1, function () {
    ok(v.last(['a', 'b', 'c']) == 'c', 'c is last');
  })

  test('keys', 1, function () {
    var actual = v.keys({
      a: 'foo',
      b: 'bar',
      c: 'baz'
    });
    var expected = ['a', 'b', 'c']
    ok(v.every(actual, function (el, i) {
      return el == expected[i]
    }), "a, b, c were keys")
  })

  test('values', 1, function () {
    var actual = v.values({
        a: 'foo'
      , b: 'bar'
      , c: 'baz'
    })
    var expected = ['foo', 'bar', 'baz']
    ok(v.every(actual, function (el, i) {
      return el == expected[i]
    }), "foo, bar, baz values were found")
  })

  test('trim', 1, function () {
    ok(v.trim(' \n\r  omg bbq wtf  \n\n ') === 'omg bbq wtf', 'string was trimmed');
  })

  test('bind', 1, function () {
    var o = {
      foo: 'bar'
    };
    function wha() {
      ok(this.foo == 'bar', 'this.foo == "bar"');
    }
    var bound = v.bind(o, wha)
    bound();
  })

  test('parallel', 3, function () {
    function getTimeline(fn) {
      setTimeout(function() {
        fn(null, 'one', 'two')
      }, 50)
    }
    function getUser(fn) {
      setTimeout(function() {
        fn(null, 'three')
      }, 25)
    }
    v.parallel(
      function (fn) {
        getTimeline(function (e, one, two) {
          fn(e, one, two)
        })
      }
    , function (fn) {
        getUser(function (e, three) {
          fn(e, three)
        })
      }
    , function (e, one, two, three) {
        if (e) return console.log(e)
        assert(one, 'one', 'first result is "one"')
        assert(two, 'two', 'second result is "two"')
        assert(three, 'three', 'third result is "three"')
      }
    )
  })

  test('waterfall', 7, function () {
    var index = 0
      , results = ['first', 'second', 'third']
    v.waterfall([
      function (callback) {
        setTimeout(function() {
          ok(results[index++] == 'first', 'first waterfall method is fired')
          callback(null, 'obvious', 'corp')
        }, 150)
      }
    , function (a, b, callback) {
        setTimeout(function() {
          ok(results[index++] == 'second', 'second waterfall method is fired')
          ok('obvious' == a, 'a == "obvious"')
          ok('corp' == b, 'b == "corp"')
          callback(null, 'final result')
        }, 50)
      }]
    , function (err, rez) {
        ok(results[index++] == 'third', 'final callback is fired with result "third"')
        ok(rez == 'final result', 'rez is "final results"')
        ok(err == null, 'there is no error')
    })
  })

  test('waterfall with unlimitted args', 7, function () {
    var index = 0
      , results = ['first', 'second', 'third']
    v.waterfall(
      function (callback) {
        setTimeout(function() {
          ok(results[index++] == 'first', 'first waterfall method is fired')
          callback(null, 'obvious', 'corp')
        }, 150)
      }
    , function (a, b, callback) {
        setTimeout(function() {
          ok(results[index++] == 'second', 'second waterfall method is fired')
          ok('obvious' == a, 'a == "obvious"')
          ok('corp' == b, 'b == "corp"')
          callback(null, 'final result')
        }, 50)
      }
    , function (err, rez) {
        ok(results[index++] == 'third', 'final callback is fired with result "third"')
        ok(rez == 'final result', 'rez is "final results"')
        ok(err == null, 'there is no error')
    })
  })

  test('function queue', 3, function () {
    var results = ['first', 'second', 'third']
      , index = 0

    var q = v.queue(
      function () {
        ok(results[index++] == 'first', 'first queue method is fired')
        q.next()
      }
    , function () {
        ok(results[index++] == 'second', 'second queue method is fired')
        q.next()
      }
    , function () {
        ok(results[index++] == 'third', 'third queue method is fired')
        q.next()
      })
      q.next()
  })

  test('function queue as an array', 3, function () {
    var results = ['first', 'second', 'third']
      , index = 0

    var q = v.queue([
      function() {
        ok(results[index++] == 'first', 'first queue method is fired')
        q.next()
      }
    , function () {
        ok(results[index++] == 'second', 'second queue method is fired')
        q.next()
      }
    , function () {
        ok(results[index++] == 'third', 'third queue method is fired')
        q.next()
      }])
    q.next()
  })

})

sink('Type Checking', function (test, ok) {

  test('String', 3, function () {
    ok(v.is.str('hello'), 'v.is.str("hello")');
    ok(v.is.str(''), 'v.is.str("")');
    ok(!v.is.str(null), '!v.is.str(null)');
  });

  test('Function', 6, function () {
    ok(v.is.fun(function () {}), 'function () {}');
    ok(v.is.fun(Function), 'Function');
    ok(v.is.fun(new Function), 'new Function');
    ok(!v.is.fun({}), 'not {}');
    ok(!v.is.fun([]), 'not []');
    ok(!v.is.fun(''), 'not ""');
  });

  test('Array', 4, function () {
    ok(v.is.arr([]), '[]');
    ok(v.is.arr(Array(1)), 'Array(1)');
    ok(v.is.arr(new Array), 'new Array');
    ok(!v.is.arr(Object), 'not Object');
  });

  test('Number', 3, function () {
    ok(v.is.num(1), '1');
    ok(v.is.num(1.1), '1.1');
    ok(!v.is.num('1'), '"1"');
  });

  test('Boolean', 6, function () {
    ok(v.is.bool(false), 'false');
    ok(v.is.bool(true), 'true');
    ok(v.is.bool(!0), '!0');
    ok(v.is.bool(!!1), '!!1');
    ok(!v.is.bool('true'), '"true"');
    ok(!v.is.bool('false'), '"false"');
  });

  test('Arguments', 1, function () {
    (function () {
      ok(v.is.args(arguments), 'arguments');
    })();
  });

  test('Empty', 6, function () {
    ok(v.is.emp({}), '{}');
    ok(v.is.emp([]), '[]');
    ok(v.is.emp(''), '""');
    ok(!v.is.emp({foo:'bar'}), '{foo:bar}');
    ok(!v.is.emp([1]), '[1]');
    ok(!v.is.emp('i'), '"i"');
  });

  test('Date', 1, function () {
    ok(v.is.dat(new Date), 'new Date');
  });

  test('RegExp', 2, function () {
    ok(v.is.reg(/i/), '/i/');
    ok(v.is.reg(new RegExp("i")), 'new RegExp("i")');
  });

  test('Null', 3, function () {
    ok(v.is.nil(null), 'null');
    ok(!v.is.nil(""), '""');
    ok(!v.is.nil(), 'undefined');
  });

  test('Undefined', 3, function () {
    ok(v.is.und(), 'no args');
    ok(v.is.und(undefined), 'undefined');
    ok(!v.is.und(null), 'undefined');
  });

  test('Object', 4, function () {
    ok(v.is.obj({}), '{}');
    ok(v.is.obj(new Object), 'Object');
    ok(!v.is.obj([]), 'not []');
    ok(!v.is.obj(function() {}), 'not function(){}');
  });

});

sink('OO Style and chaining', function (test, ok) {

  test('method chains', 1, function () {
    var expected = ['A', 'B', 'C'];
    var actual = v(['a', 'b', [['c']], 0, false,,,null,['a', 'b', 'c']])
      .chain().flatten().compact().uniq().map(function (letter) {
        return letter.toUpperCase();
      }).value();
    ok(v.every(actual, function (el, i) {
      return el == expected[i];
    }), "all methods chained together");
  });

});

sink('Funny business', function (test, ok) {
  test('can call each on nodeList', 1, function () {
    if (typeof document !== 'undefined') {
      // this is a browser test
      v.each(document.getElementsByTagName('body'), function (el) {
        ok(el.tagName.match(/body/i), 'element was found by each() iteration');
      })
    } else {
      ok(true, 'noop test')
    }
  })
})

start()