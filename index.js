const XXH = require('xxhashjs')
const bplist = require('./lib/bplist.js')

var p = {
  start: 2,
  end: 7
}

var t = {}

var Ut = {
  $UID: "j",
  $defaultRootUID: 4,
  $keys: "z",
  $vals: "k",
  getRealUID: function (t) {
    if (t >= p.start) {
      var e = p.end - p.start;
      if (t < p.end)
        return t + e;
      if (t < p.end + e)
        return t - e
    }
    return t
  },
  getType: function o(t) {
    return Object.prototype.toString.call(t).slice(8, -1)
  }

}

function rc4_decrypt(e) {
  var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "hjasbdn2ih823rgwudsde7e2dhsdhas";
  "string" == typeof r && (r = [].map.call(r, function (t) {
    return t.charCodeAt(0)
  }));
  for (var n, o = [], i = 0, a = Buffer.alloc(e.length), s = 0; s < 256; s++)
    o[s] = s;
  for (s = 0; s < 256; s++)
    i = (i + o[s] + r[s % r.length]) % 256,
      n = o[s],
      o[s] = o[i],
      o[i] = n;
  s = 0,
    i = 0;
  for (var u = 0; u < e.length; u++)
    s = (s + 1) % 256,
      i = (i + o[s]) % 256,
      n = o[s],
      o[s] = o[i],
      o[i] = n,
      a[u] = e[u] ^ o[(o[s] + o[i]) % 256];
  return a
}

function kt(t) {
  var i = Ut;

  function n(e) {
    if (1 === Object.keys(e).length && void 0 !== e[i.$UID])
      return o(e[i.$UID]);
    if (i.$vals in e) {
      var t = e[i.$keys]
        , n = e[i.$vals];
      return t ? t.reduce(function (e, t, i) {
        return e[o(t)] = r(n[i]),
          e
      }, {}) : n.map(function (e) {
        return o(e)
      })
    }
    return Object.keys(e).reduce(function (t, n) {
      var o = e[n];
      return t[n] = r(o),
        t
    }, {})
  }

  function r(t) {
    return "Object" === (0,
      i.getType)(t) ? n(t) : "Array" === (0,
      i.getType)(t) ? t.map(function (e) {
      return r(e)
    }) : t instanceof Buffer ? (0 === t[t.length - 1] && (t = t.slice(0, t.length - 1)),
      t.toString()) : t
  }

  function o(e) {
    return r(t[(0,
      i.getRealUID)(e)])
  }

  return o(arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : (0,
    i.getRealUID)(i.$defaultRootUID))
}


function n_n(r) {
  return e_e(t)(r_r)(r)
}


function e_e(e) {
  return function (e) {
    return function (t) {
      var n = Object.keys(t)[0]
        , r = rc4_decrypt(t[n], n);
      return e(r)
    }
  }
}


function r_r(r) {
  return e_e_decrypt(t)(e_e_decrypt_n)(r)
}

function e_e_decrypt(e) {
  return function (e) {
    return function (t) {
      return e(bplist.parseBuffer(t))
    }
  }
}

function e_e_decrypt_n(r) {
  return playload(t)(e_playload)(r)
}

function playload(e) {
  return function (e) {
    return function (t) {
      return e(kt(t))
    }
  }
}

function e_playload(r) {
  return r
}

function decrypt(r) {
  let a = Buffer.from(r, "base64");
  let i = 16;
  let s = Math.max(Math.floor((a.length - 2 * i) / 3), 0);
  let u = a.slice(s, s + i);

  a = Buffer.concat([a.slice(0, s), a.slice(s + i)]);

  let sec_key = XXH.h64(41405).update(
    Buffer.concat([u, Buffer.from("")])
  ).digest().toString(16);

  let l = {}
  l[sec_key] = a
  return n_n(l)
}