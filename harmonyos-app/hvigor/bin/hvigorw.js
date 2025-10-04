"use strict";

var e, t = require("fs"), r = require("path"), n = require("process"), o = require("crypto"), i = require("child_process"), a = require("os"), u = require("constants"), s = require("stream"), l = require("util"), c = require("assert"), f = require("tty"), d = require("url"), p = require("zlib"), v = require("net"), h = require("fs/promises"), g = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, y = {}, m = {}, E = {};

e = E, Object.defineProperty(e, "__esModule", {
    value: !0
}), e.isCI = void 0, e.isCI = function() {
    return !("false" === process.env.CI || !(process.env.BUILD_ID || process.env.BUILD_NUMBER || process.env.CI || process.env.CI_APP_ID || process.env.CI_BUILD_ID || process.env.CI_BUILD_NUMBER || process.env.CI_NAME || process.env.CONTINUOUS_INTEGRATION || process.env.RUN_ID || e.name));
};

var _ = {};

!function(e) {
    var t = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.isSubPath = void 0;
    const n = t(r);
    e.isSubPath = function(e, t) {
        try {
            const r = n.default.relative(e, t);
            if ("" === r) {
                return !0;
            }
            const o = r.split(n.default.sep);
            for (let e of o) {
                if (".." !== e) {
                    return !1;
                }
            }
            return !0;
        } catch (e) {
            return !1;
        }
    };
}(_);

var D = {};

!function(e) {
    var r = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.hashFile = e.hash = e.createHash = void 0;
    const n = r(o), i = r(t);
    e.createHash = (e = "MD5") => n.default.createHash(e);
    e.hash = (t, r) => (0, e.createHash)(r).update(t).digest("hex");
    e.hashFile = (t, r) => {
        if (i.default.existsSync(t)) {
            return (0, e.hash)(i.default.readFileSync(t, "utf-8"), r);
        }
    };
}(D);

var b = {};

Object.defineProperty(b, "__esModule", {
    value: !0
});

b.default = {
    preset: "ts-jest",
    testEnvironment: "node",
    maxConcurrency: 8,
    maxWorkers: 8,
    testPathIgnorePatterns: [ "/node_modules/", "/test/resources/", "/test/temp/" ],
    testTimeout: 3e5,
    testMatch: [ "**/e2e-test/**/*.ts?(x)", "**/jest-test/**/*.ts?(x)", "**/__tests__/**/*.ts?(x)", "**/?(*.)?(long|unit)+(spec|test).ts?(x)" ],
    collectCoverageFrom: [ "**/src/**/*.js" ],
    coverageReporters: [ "json", "lcov", "text", "clover" ]
};

var O = {}, A = {};

!function(e) {
    var t = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.maxPathLength = e.isMac = e.isLinux = e.isWindows = void 0;
    const r = t(a);
    function n() {
        return "Windows_NT" === r.default.type();
    }
    function o() {
        return "Darwin" === r.default.type();
    }
    e.isWindows = n, e.isLinux = function() {
        return "Linux" === r.default.type();
    }, e.isMac = o, e.maxPathLength = function() {
        return o() ? 1016 : n() ? 259 : 4095;
    };
}(A), function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.getOsLanguage = e.countryEnum = void 0;
    const t = i, r = A;
    var n;
    let o;
    !function(e) {
        e.CN = "cn", e.EN = "en";
    }(n = e.countryEnum || (e.countryEnum = {})), e.getOsLanguage = function() {
        if (o) {
            return o;
        }
        let e = n.CN;
        return (0, r.isWindows)() ? e = function() {
            const e = (0, t.spawnSync)("wmic", [ "os", "get", "locale" ]);
            return 0 !== e.status || 2052 === Number.parseInt(e.stdout.toString().replace("Locale", ""), 16) ? n.CN : n.EN;
        }() : (0, r.isMac)() ? e = function() {
            const e = (0, t.spawnSync)("defaults", [ "read", "-globalDomain", "AppleLocale" ]);
            return 0 !== e.status || e.stdout.toString().indexOf("zh_CN") >= 0 ? n.CN : n.EN;
        }() : (0, r.isLinux)() && (e = function() {
            var e;
            const r = (0, t.spawnSync)("locale");
            if (0 !== r.status) {
                return n.CN;
            }
            const o = {};
            for (const t of r.stdout.toString().split("\n")) {
                const [r, n] = t.split("=");
                o[r] = null !== (e = null == n ? void 0 : n.replace(/^"|"$/g, "")) && void 0 !== e ? e : "";
            }
            return (o.LC_ALL || o.LC_MESSAGES || o.LANG || o.LANGUAGE).indexOf("zh_CN") >= 0 ? n.CN : n.EN;
        }()), process.env["user.country"] && (e = "CN" === process.env["user.country"].toString() ? n.CN : n.EN), 
        o = e, e;
    };
}(O), function(e) {
    var t = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.maxPathLength = e.isLinux = e.isMac = e.isWindows = e.getOsLanguage = e.countryEnum = e.config = e.hashFile = e.hash = e.createHash = e.isSubPath = e.isCI = void 0;
    var r = E;
    Object.defineProperty(e, "isCI", {
        enumerable: !0,
        get: function() {
            return r.isCI;
        }
    });
    var n = _;
    Object.defineProperty(e, "isSubPath", {
        enumerable: !0,
        get: function() {
            return n.isSubPath;
        }
    });
    var o = D;
    Object.defineProperty(e, "createHash", {
        enumerable: !0,
        get: function() {
            return o.createHash;
        }
    }), Object.defineProperty(e, "hash", {
        enumerable: !0,
        get: function() {
            return o.hash;
        }
    }), Object.defineProperty(e, "hashFile", {
        enumerable: !0,
        get: function() {
            return o.hashFile;
        }
    });
    var i = b;
    Object.defineProperty(e, "config", {
        enumerable: !0,
        get: function() {
            return t(i).default;
        }
    });
    var a = O;
    Object.defineProperty(e, "countryEnum", {
        enumerable: !0,
        get: function() {
            return a.countryEnum;
        }
    }), Object.defineProperty(e, "getOsLanguage", {
        enumerable: !0,
        get: function() {
            return a.getOsLanguage;
        }
    });
    var u = A;
    Object.defineProperty(e, "isWindows", {
        enumerable: !0,
        get: function() {
            return u.isWindows;
        }
    }), Object.defineProperty(e, "isMac", {
        enumerable: !0,
        get: function() {
            return u.isMac;
        }
    }), Object.defineProperty(e, "isLinux", {
        enumerable: !0,
        get: function() {
            return u.isLinux;
        }
    }), Object.defineProperty(e, "maxPathLength", {
        enumerable: !0,
        get: function() {
            return u.maxPathLength;
        }
    });
}(m);

var C = {
    exports: {}
};

var S = {
    MAX_LENGTH: 256,
    MAX_SAFE_COMPONENT_LENGTH: 16,
    MAX_SAFE_BUILD_LENGTH: 250,
    MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER || 9007199254740991,
    RELEASE_TYPES: [ "major", "premajor", "minor", "preminor", "patch", "prepatch", "prerelease" ],
    SEMVER_SPEC_VERSION: "2.0.0",
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
};

var M = "object" == typeof process && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {};

!function(e, t) {
    const {MAX_SAFE_COMPONENT_LENGTH: r, MAX_SAFE_BUILD_LENGTH: n, MAX_LENGTH: o} = S, i = M, a = (t = e.exports = {}).re = [], u = t.safeRe = [], s = t.src = [], l = t.t = {};
    let c = 0;
    const f = "[a-zA-Z0-9-]", d = [ [ "\\s", 1 ], [ "\\d", o ], [ f, n ] ], p = (e, t, r) => {
        const n = (e => {
            for (const [t, r] of d) {
                e = e.split(`${t}*`).join(`${t}{0,${r}}`).split(`${t}+`).join(`${t}{1,${r}}`);
            }
            return e;
        })(t), o = c++;
        i(e, o, t), l[e] = o, s[o] = t, a[o] = new RegExp(t, r ? "g" : void 0), u[o] = new RegExp(n, r ? "g" : void 0);
    };
    p("NUMERICIDENTIFIER", "0|[1-9]\\d*"), p("NUMERICIDENTIFIERLOOSE", "\\d+"), p("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${f}*`), 
    p("MAINVERSION", `(${s[l.NUMERICIDENTIFIER]})\\.(${s[l.NUMERICIDENTIFIER]})\\.(${s[l.NUMERICIDENTIFIER]})`), 
    p("MAINVERSIONLOOSE", `(${s[l.NUMERICIDENTIFIERLOOSE]})\\.(${s[l.NUMERICIDENTIFIERLOOSE]})\\.(${s[l.NUMERICIDENTIFIERLOOSE]})`), 
    p("PRERELEASEIDENTIFIER", `(?:${s[l.NUMERICIDENTIFIER]}|${s[l.NONNUMERICIDENTIFIER]})`), 
    p("PRERELEASEIDENTIFIERLOOSE", `(?:${s[l.NUMERICIDENTIFIERLOOSE]}|${s[l.NONNUMERICIDENTIFIER]})`), 
    p("PRERELEASE", `(?:-(${s[l.PRERELEASEIDENTIFIER]}(?:\\.${s[l.PRERELEASEIDENTIFIER]})*))`), 
    p("PRERELEASELOOSE", `(?:-?(${s[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${s[l.PRERELEASEIDENTIFIERLOOSE]})*))`), 
    p("BUILDIDENTIFIER", `${f}+`), p("BUILD", `(?:\\+(${s[l.BUILDIDENTIFIER]}(?:\\.${s[l.BUILDIDENTIFIER]})*))`), 
    p("FULLPLAIN", `v?${s[l.MAINVERSION]}${s[l.PRERELEASE]}?${s[l.BUILD]}?`), p("FULL", `^${s[l.FULLPLAIN]}$`), 
    p("LOOSEPLAIN", `[v=\\s]*${s[l.MAINVERSIONLOOSE]}${s[l.PRERELEASELOOSE]}?${s[l.BUILD]}?`), 
    p("LOOSE", `^${s[l.LOOSEPLAIN]}$`), p("GTLT", "((?:<|>)?=?)"), p("XRANGEIDENTIFIERLOOSE", `${s[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), 
    p("XRANGEIDENTIFIER", `${s[l.NUMERICIDENTIFIER]}|x|X|\\*`), p("XRANGEPLAIN", `[v=\\s]*(${s[l.XRANGEIDENTIFIER]})(?:\\.(${s[l.XRANGEIDENTIFIER]})(?:\\.(${s[l.XRANGEIDENTIFIER]})(?:${s[l.PRERELEASE]})?${s[l.BUILD]}?)?)?`), 
    p("XRANGEPLAINLOOSE", `[v=\\s]*(${s[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${s[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${s[l.XRANGEIDENTIFIERLOOSE]})(?:${s[l.PRERELEASELOOSE]})?${s[l.BUILD]}?)?)?`), 
    p("XRANGE", `^${s[l.GTLT]}\\s*${s[l.XRANGEPLAIN]}$`), p("XRANGELOOSE", `^${s[l.GTLT]}\\s*${s[l.XRANGEPLAINLOOSE]}$`), 
    p("COERCE", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?(?:$|[^\\d])`), 
    p("COERCERTL", s[l.COERCE], !0), p("LONETILDE", "(?:~>?)"), p("TILDETRIM", `(\\s*)${s[l.LONETILDE]}\\s+`, !0), 
    t.tildeTrimReplace = "$1~", p("TILDE", `^${s[l.LONETILDE]}${s[l.XRANGEPLAIN]}$`), 
    p("TILDELOOSE", `^${s[l.LONETILDE]}${s[l.XRANGEPLAINLOOSE]}$`), p("LONECARET", "(?:\\^)"), 
    p("CARETTRIM", `(\\s*)${s[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", p("CARET", `^${s[l.LONECARET]}${s[l.XRANGEPLAIN]}$`), 
    p("CARETLOOSE", `^${s[l.LONECARET]}${s[l.XRANGEPLAINLOOSE]}$`), p("COMPARATORLOOSE", `^${s[l.GTLT]}\\s*(${s[l.LOOSEPLAIN]})$|^$`), 
    p("COMPARATOR", `^${s[l.GTLT]}\\s*(${s[l.FULLPLAIN]})$|^$`), p("COMPARATORTRIM", `(\\s*)${s[l.GTLT]}\\s*(${s[l.LOOSEPLAIN]}|${s[l.XRANGEPLAIN]})`, !0), 
    t.comparatorTrimReplace = "$1$2$3", p("HYPHENRANGE", `^\\s*(${s[l.XRANGEPLAIN]})\\s+-\\s+(${s[l.XRANGEPLAIN]})\\s*$`), 
    p("HYPHENRANGELOOSE", `^\\s*(${s[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${s[l.XRANGEPLAINLOOSE]})\\s*$`), 
    p("STAR", "(<|>)?=?\\s*\\*"), p("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), p("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
}(C, C.exports);

var w = C.exports;

const F = Object.freeze({
    loose: !0
}), P = Object.freeze({});

var I = e => e ? "object" != typeof e ? F : e : P;

const R = /^[0-9]+$/, T = (e, t) => {
    const r = R.test(e), n = R.test(t);
    return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
};

var L = {
    compareIdentifiers: T,
    rcompareIdentifiers: (e, t) => T(t, e)
};

const j = M, {MAX_LENGTH: N, MAX_SAFE_INTEGER: x} = S, {safeRe: k, t: B} = w, $ = I, {compareIdentifiers: H} = L;

var U = class e {
    constructor(t, r) {
        if (r = $(r), t instanceof e) {
            if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease) {
                return t;
            }
            t = t.version;
        } else if ("string" != typeof t) {
            throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
        }
        if (t.length > N) {
            throw new TypeError(`version is longer than ${N} characters`);
        }
        j("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
        const n = t.trim().match(r.loose ? k[B.LOOSE] : k[B.FULL]);
        if (!n) {
            throw new TypeError(`Invalid Version: ${t}`);
        }
        if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > x || this.major < 0) {
            throw new TypeError("Invalid major version");
        }
        if (this.minor > x || this.minor < 0) {
            throw new TypeError("Invalid minor version");
        }
        if (this.patch > x || this.patch < 0) {
            throw new TypeError("Invalid patch version");
        }
        n[4] ? this.prerelease = n[4].split(".").map(e => {
            if (/^[0-9]+$/.test(e)) {
                const t = +e;
                if (t >= 0 && t < x) {
                    return t;
                }
            }
            return e;
        }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
    }
    format() {
        return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), 
        this.version;
    }
    toString() {
        return this.version;
    }
    compare(t) {
        if (j("SemVer.compare", this.version, this.options, t), !(t instanceof e)) {
            if ("string" == typeof t && t === this.version) {
                return 0;
            }
            t = new e(t, this.options);
        }
        return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
    }
    compareMain(t) {
        return t instanceof e || (t = new e(t, this.options)), H(this.major, t.major) || H(this.minor, t.minor) || H(this.patch, t.patch);
    }
    comparePre(t) {
        if (t instanceof e || (t = new e(t, this.options)), this.prerelease.length && !t.prerelease.length) {
            return -1;
        }
        if (!this.prerelease.length && t.prerelease.length) {
            return 1;
        }
        if (!this.prerelease.length && !t.prerelease.length) {
            return 0;
        }
        let r = 0;
        do {
            const e = this.prerelease[r], n = t.prerelease[r];
            if (j("prerelease compare", r, e, n), void 0 === e && void 0 === n) {
                return 0;
            }
            if (void 0 === n) {
                return 1;
            }
            if (void 0 === e) {
                return -1;
            }
            if (e !== n) {
                return H(e, n);
            }
        } while (++r);
    }
    compareBuild(t) {
        t instanceof e || (t = new e(t, this.options));
        let r = 0;
        do {
            const e = this.build[r], n = t.build[r];
            if (j("prerelease compare", r, e, n), void 0 === e && void 0 === n) {
                return 0;
            }
            if (void 0 === n) {
                return 1;
            }
            if (void 0 === e) {
                return -1;
            }
            if (e !== n) {
                return H(e, n);
            }
        } while (++r);
    }
    inc(e, t, r) {
        switch (e) {
          case "premajor":
            this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", t, r);
            break;

          case "preminor":
            this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", t, r);
            break;

          case "prepatch":
            this.prerelease.length = 0, this.inc("patch", t, r), this.inc("pre", t, r);
            break;

          case "prerelease":
            0 === this.prerelease.length && this.inc("patch", t, r), this.inc("pre", t, r);
            break;

          case "major":
            0 === this.minor && 0 === this.patch && 0 !== this.prerelease.length || this.major++, 
            this.minor = 0, this.patch = 0, this.prerelease = [];
            break;

          case "minor":
            0 === this.patch && 0 !== this.prerelease.length || this.minor++, this.patch = 0, 
            this.prerelease = [];
            break;

          case "patch":
            0 === this.prerelease.length && this.patch++, this.prerelease = [];
            break;

          case "pre":
            {
                const e = Number(r) ? 1 : 0;
                if (!t && !1 === r) {
                    throw new Error("invalid increment argument: identifier is empty");
                }
                if (0 === this.prerelease.length) {
                    this.prerelease = [ e ];
                } else {
                    let n = this.prerelease.length;
                    for (;--n >= 0; ) {
                        "number" == typeof this.prerelease[n] && (this.prerelease[n]++, n = -2);
                    }
                    if (-1 === n) {
                        if (t === this.prerelease.join(".") && !1 === r) {
                            throw new Error("invalid increment argument: identifier already exists");
                        }
                        this.prerelease.push(e);
                    }
                }
                if (t) {
                    let n = [ t, e ];
                    !1 === r && (n = [ t ]), 0 === H(this.prerelease[0], t) ? isNaN(this.prerelease[1]) && (this.prerelease = n) : this.prerelease = n;
                }
                break;
            }

          default:
            throw new Error(`invalid increment argument: ${e}`);
        }
        return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), 
        this;
    }
};

const G = U;

var V = (e, t, r = !1) => {
    if (e instanceof G) {
        return e;
    }
    try {
        return new G(e, t);
    } catch (e) {
        if (!r) {
            return null;
        }
        throw e;
    }
};

const W = V;

var z = (e, t) => {
    const r = W(e, t);
    return r ? r.version : null;
};

const J = V;

var K = (e, t) => {
    const r = J(e.trim().replace(/^[=v]+/, ""), t);
    return r ? r.version : null;
};

const q = U;

var X = (e, t, r, n, o) => {
    "string" == typeof r && (o = n, n = r, r = void 0);
    try {
        return new q(e instanceof q ? e.version : e, r).inc(t, n, o).version;
    } catch (e) {
        return null;
    }
};

const Y = V;

var Z = (e, t) => {
    const r = Y(e, null, !0), n = Y(t, null, !0), o = r.compare(n);
    if (0 === o) {
        return null;
    }
    const i = o > 0, a = i ? r : n, u = i ? n : r, s = !!a.prerelease.length;
    if (!!u.prerelease.length && !s) {
        return u.patch || u.minor ? a.patch ? "patch" : a.minor ? "minor" : "major" : "major";
    }
    const l = s ? "pre" : "";
    return r.major !== n.major ? l + "major" : r.minor !== n.minor ? l + "minor" : r.patch !== n.patch ? l + "patch" : "prerelease";
};

const Q = U;

var ee = (e, t) => new Q(e, t).major;

const te = U;

var re = (e, t) => new te(e, t).minor;

const ne = U;

var oe = (e, t) => new ne(e, t).patch;

const ie = V;

var ae = (e, t) => {
    const r = ie(e, t);
    return r && r.prerelease.length ? r.prerelease : null;
};

const ue = U;

var se = (e, t, r) => new ue(e, r).compare(new ue(t, r));

const le = se;

var ce = (e, t, r) => le(t, e, r);

const fe = se;

var de = (e, t) => fe(e, t, !0);

const pe = U;

var ve = (e, t, r) => {
    const n = new pe(e, r), o = new pe(t, r);
    return n.compare(o) || n.compareBuild(o);
};

const he = ve;

var ge = (e, t) => e.sort((e, r) => he(e, r, t));

const ye = ve;

var me = (e, t) => e.sort((e, r) => ye(r, e, t));

const Ee = se;

var _e = (e, t, r) => Ee(e, t, r) > 0;

const De = se;

var be = (e, t, r) => De(e, t, r) < 0;

const Oe = se;

var Ae = (e, t, r) => 0 === Oe(e, t, r);

const Ce = se;

var Se = (e, t, r) => 0 !== Ce(e, t, r);

const Me = se;

var we = (e, t, r) => Me(e, t, r) >= 0;

const Fe = se;

var Pe = (e, t, r) => Fe(e, t, r) <= 0;

const Ie = Ae, Re = Se, Te = _e, Le = we, je = be, Ne = Pe;

var xe = (e, t, r, n) => {
    switch (t) {
      case "===":
        return "object" == typeof e && (e = e.version), "object" == typeof r && (r = r.version), 
        e === r;

      case "!==":
        return "object" == typeof e && (e = e.version), "object" == typeof r && (r = r.version), 
        e !== r;

      case "":
      case "=":
      case "==":
        return Ie(e, r, n);

      case "!=":
        return Re(e, r, n);

      case ">":
        return Te(e, r, n);

      case ">=":
        return Le(e, r, n);

      case "<":
        return je(e, r, n);

      case "<=":
        return Ne(e, r, n);

      default:
        throw new TypeError(`Invalid operator: ${t}`);
    }
};

const ke = U, Be = V, {safeRe: $e, t: He} = w;

var Ue, Ge, Ve, We, ze, Je, Ke, qe, Xe, Ye, Ze = (e, t) => {
    if (e instanceof ke) {
        return e;
    }
    if ("number" == typeof e && (e = String(e)), "string" != typeof e) {
        return null;
    }
    let r = null;
    if ((t = t || {}).rtl) {
        let t;
        for (;(t = $e[He.COERCERTL].exec(e)) && (!r || r.index + r[0].length !== e.length); ) {
            r && t.index + t[0].length === r.index + r[0].length || (r = t), $e[He.COERCERTL].lastIndex = t.index + t[1].length + t[2].length;
        }
        $e[He.COERCERTL].lastIndex = -1;
    } else {
        r = e.match($e[He.COERCE]);
    }
    return null === r ? null : Be(`${r[2]}.${r[3] || "0"}.${r[4] || "0"}`, t);
};

function Qe() {
    if (We) {
        return Ve;
    }
    function e(t) {
        var r = this;
        if (r instanceof e || (r = new e), r.tail = null, r.head = null, r.length = 0, t && "function" == typeof t.forEach) {
            t.forEach(function(e) {
                r.push(e);
            });
        } else if (arguments.length > 0) {
            for (var n = 0, o = arguments.length; n < o; n++) {
                r.push(arguments[n]);
            }
        }
        return r;
    }
    function t(e, t, r) {
        var n = t === e.head ? new o(r, null, t, e) : new o(r, t, t.next, e);
        return null === n.next && (e.tail = n), null === n.prev && (e.head = n), e.length++, 
        n;
    }
    function r(e, t) {
        e.tail = new o(t, e.tail, null, e), e.head || (e.head = e.tail), e.length++;
    }
    function n(e, t) {
        e.head = new o(t, null, e.head, e), e.tail || (e.tail = e.head), e.length++;
    }
    function o(e, t, r, n) {
        if (!(this instanceof o)) {
            return new o(e, t, r, n);
        }
        this.list = n, this.value = e, t ? (t.next = this, this.prev = t) : this.prev = null, 
        r ? (r.prev = this, this.next = r) : this.next = null;
    }
    We = 1, Ve = e, e.Node = o, e.create = e, e.prototype.removeNode = function(e) {
        if (e.list !== this) {
            throw new Error("removing node which does not belong to this list");
        }
        var t = e.next, r = e.prev;
        return t && (t.prev = r), r && (r.next = t), e === this.head && (this.head = t), 
        e === this.tail && (this.tail = r), e.list.length--, e.next = null, e.prev = null, 
        e.list = null, t;
    }, e.prototype.unshiftNode = function(e) {
        if (e !== this.head) {
            e.list && e.list.removeNode(e);
            var t = this.head;
            e.list = this, e.next = t, t && (t.prev = e), this.head = e, this.tail || (this.tail = e), 
            this.length++;
        }
    }, e.prototype.pushNode = function(e) {
        if (e !== this.tail) {
            e.list && e.list.removeNode(e);
            var t = this.tail;
            e.list = this, e.prev = t, t && (t.next = e), this.tail = e, this.head || (this.head = e), 
            this.length++;
        }
    }, e.prototype.push = function() {
        for (var e = 0, t = arguments.length; e < t; e++) {
            r(this, arguments[e]);
        }
        return this.length;
    }, e.prototype.unshift = function() {
        for (var e = 0, t = arguments.length; e < t; e++) {
            n(this, arguments[e]);
        }
        return this.length;
    }, e.prototype.pop = function() {
        if (this.tail) {
            var e = this.tail.value;
            return this.tail = this.tail.prev, this.tail ? this.tail.next = null : this.head = null, 
            this.length--, e;
        }
    }, e.prototype.shift = function() {
        if (this.head) {
            var e = this.head.value;
            return this.head = this.head.next, this.head ? this.head.prev = null : this.tail = null, 
            this.length--, e;
        }
    }, e.prototype.forEach = function(e, t) {
        t = t || this;
        for (var r = this.head, n = 0; null !== r; n++) {
            e.call(t, r.value, n, this), r = r.next;
        }
    }, e.prototype.forEachReverse = function(e, t) {
        t = t || this;
        for (var r = this.tail, n = this.length - 1; null !== r; n--) {
            e.call(t, r.value, n, this), r = r.prev;
        }
    }, e.prototype.get = function(e) {
        for (var t = 0, r = this.head; null !== r && t < e; t++) {
            r = r.next;
        }
        if (t === e && null !== r) {
            return r.value;
        }
    }, e.prototype.getReverse = function(e) {
        for (var t = 0, r = this.tail; null !== r && t < e; t++) {
            r = r.prev;
        }
        if (t === e && null !== r) {
            return r.value;
        }
    }, e.prototype.map = function(t, r) {
        r = r || this;
        for (var n = new e, o = this.head; null !== o; ) {
            n.push(t.call(r, o.value, this)), o = o.next;
        }
        return n;
    }, e.prototype.mapReverse = function(t, r) {
        r = r || this;
        for (var n = new e, o = this.tail; null !== o; ) {
            n.push(t.call(r, o.value, this)), o = o.prev;
        }
        return n;
    }, e.prototype.reduce = function(e, t) {
        var r, n = this.head;
        if (arguments.length > 1) {
            r = t;
        } else {
            if (!this.head) {
                throw new TypeError("Reduce of empty list with no initial value");
            }
            n = this.head.next, r = this.head.value;
        }
        for (var o = 0; null !== n; o++) {
            r = e(r, n.value, o), n = n.next;
        }
        return r;
    }, e.prototype.reduceReverse = function(e, t) {
        var r, n = this.tail;
        if (arguments.length > 1) {
            r = t;
        } else {
            if (!this.tail) {
                throw new TypeError("Reduce of empty list with no initial value");
            }
            n = this.tail.prev, r = this.tail.value;
        }
        for (var o = this.length - 1; null !== n; o--) {
            r = e(r, n.value, o), n = n.prev;
        }
        return r;
    }, e.prototype.toArray = function() {
        for (var e = new Array(this.length), t = 0, r = this.head; null !== r; t++) {
            e[t] = r.value, r = r.next;
        }
        return e;
    }, e.prototype.toArrayReverse = function() {
        for (var e = new Array(this.length), t = 0, r = this.tail; null !== r; t++) {
            e[t] = r.value, r = r.prev;
        }
        return e;
    }, e.prototype.slice = function(t, r) {
        (r = r || this.length) < 0 && (r += this.length), (t = t || 0) < 0 && (t += this.length);
        var n = new e;
        if (r < t || r < 0) {
            return n;
        }
        t < 0 && (t = 0), r > this.length && (r = this.length);
        for (var o = 0, i = this.head; null !== i && o < t; o++) {
            i = i.next;
        }
        for (;null !== i && o < r; o++, i = i.next) {
            n.push(i.value);
        }
        return n;
    }, e.prototype.sliceReverse = function(t, r) {
        (r = r || this.length) < 0 && (r += this.length), (t = t || 0) < 0 && (t += this.length);
        var n = new e;
        if (r < t || r < 0) {
            return n;
        }
        t < 0 && (t = 0), r > this.length && (r = this.length);
        for (var o = this.length, i = this.tail; null !== i && o > r; o--) {
            i = i.prev;
        }
        for (;null !== i && o > t; o--, i = i.prev) {
            n.push(i.value);
        }
        return n;
    }, e.prototype.splice = function(e, r, ...n) {
        e > this.length && (e = this.length - 1), e < 0 && (e = this.length + e);
        for (var o = 0, i = this.head; null !== i && o < e; o++) {
            i = i.next;
        }
        var a = [];
        for (o = 0; i && o < r; o++) {
            a.push(i.value), i = this.removeNode(i);
        }
        null === i && (i = this.tail), i !== this.head && i !== this.tail && (i = i.prev);
        for (o = 0; o < n.length; o++) {
            i = t(this, i, n[o]);
        }
        return a;
    }, e.prototype.reverse = function() {
        for (var e = this.head, t = this.tail, r = e; null !== r; r = r.prev) {
            var n = r.prev;
            r.prev = r.next, r.next = n;
        }
        return this.head = t, this.tail = e, this;
    };
    try {
        (Ge ? Ue : (Ge = 1, Ue = function(e) {
            e.prototype[Symbol.iterator] = function*() {
                for (let e = this.head; e; e = e.next) {
                    yield e.value;
                }
            };
        }))(e);
    } catch (e) {}
    return Ve;
}

function et() {
    if (qe) {
        return Ke;
    }
    qe = 1;
    class e {
        constructor(t, r) {
            if (r = n(r), t instanceof e) {
                return t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease ? t : new e(t.raw, r);
            }
            if (t instanceof o) {
                return this.raw = t.value, this.set = [ [ t ] ], this.format(), this;
            }
            if (this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease, 
            this.raw = t.trim().split(/\s+/).join(" "), this.set = this.raw.split("||").map(e => this.parseRange(e.trim())).filter(e => e.length), 
            !this.set.length) {
                throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
            }
            if (this.set.length > 1) {
                const e = this.set[0];
                if (this.set = this.set.filter(e => !v(e[0])), 0 === this.set.length) {
                    this.set = [ e ];
                } else if (this.set.length > 1) {
                    for (const e of this.set) {
                        if (1 === e.length && h(e[0])) {
                            this.set = [ e ];
                            break;
                        }
                    }
                }
            }
            this.format();
        }
        format() {
            return this.range = this.set.map(e => e.join(" ").trim()).join("||").trim(), this.range;
        }
        toString() {
            return this.range;
        }
        parseRange(e) {
            const t = ((this.options.includePrerelease && d) | (this.options.loose && p)) + ":" + e, n = r.get(t);
            if (n) {
                return n;
            }
            const a = this.options.loose, h = a ? u[s.HYPHENRANGELOOSE] : u[s.HYPHENRANGE];
            e = e.replace(h, P(this.options.includePrerelease)), i("hyphen replace", e), e = e.replace(u[s.COMPARATORTRIM], l), 
            i("comparator trim", e), e = e.replace(u[s.TILDETRIM], c), i("tilde trim", e), e = e.replace(u[s.CARETTRIM], f), 
            i("caret trim", e);
            let g = e.split(" ").map(e => y(e, this.options)).join(" ").split(/\s+/).map(e => F(e, this.options));
            a && (g = g.filter(e => (i("loose invalid filter", e, this.options), !!e.match(u[s.COMPARATORLOOSE])))), 
            i("range list", g);
            const m = new Map, E = g.map(e => new o(e, this.options));
            for (const e of E) {
                if (v(e)) {
                    return [ e ];
                }
                m.set(e.value, e);
            }
            m.size > 1 && m.has("") && m.delete("");
            const _ = [ ...m.values() ];
            return r.set(t, _), _;
        }
        intersects(t, r) {
            if (!(t instanceof e)) {
                throw new TypeError("a Range is required");
            }
            return this.set.some(e => g(e, r) && t.set.some(t => g(t, r) && e.every(e => t.every(t => e.intersects(t, r)))));
        }
        test(e) {
            if (!e) {
                return !1;
            }
            if ("string" == typeof e) {
                try {
                    e = new a(e, this.options);
                } catch (e) {
                    return !1;
                }
            }
            for (let t = 0; t < this.set.length; t++) {
                if (R(this.set[t], e, this.options)) {
                    return !0;
                }
            }
            return !1;
        }
    }
    Ke = e;
    const t = function() {
        if (Je) {
            return ze;
        }
        Je = 1;
        const e = Qe(), t = Symbol("max"), r = Symbol("length"), n = Symbol("lengthCalculator"), o = Symbol("allowStale"), i = Symbol("maxAge"), a = Symbol("dispose"), u = Symbol("noDisposeOnSet"), s = Symbol("lruList"), l = Symbol("cache"), c = Symbol("updateAgeOnGet"), f = () => 1, d = (e, t, r) => {
            const n = e[l].get(t);
            if (n) {
                const t = n.value;
                if (p(e, t)) {
                    if (h(e, n), !e[o]) {
                        return;
                    }
                } else {
                    r && (e[c] && (n.value.now = Date.now()), e[s].unshiftNode(n));
                }
                return t.value;
            }
        }, p = (e, t) => {
            if (!t || !t.maxAge && !e[i]) {
                return !1;
            }
            const r = Date.now() - t.now;
            return t.maxAge ? r > t.maxAge : e[i] && r > e[i];
        }, v = e => {
            if (e[r] > e[t]) {
                for (let n = e[s].tail; e[r] > e[t] && null !== n; ) {
                    const t = n.prev;
                    h(e, n), n = t;
                }
            }
        }, h = (e, t) => {
            if (t) {
                const n = t.value;
                e[a] && e[a](n.key, n.value), e[r] -= n.length, e[l].delete(n.key), e[s].removeNode(t);
            }
        };
        class g {
            constructor(e, t, r, n, o) {
                this.key = e, this.value = t, this.length = r, this.now = n, this.maxAge = o || 0;
            }
        }
        const y = (e, t, r, n) => {
            let i = r.value;
            p(e, i) && (h(e, r), e[o] || (i = void 0)), i && t.call(n, i.value, i.key, e);
        };
        return ze = class {
            constructor(e) {
                if ("number" == typeof e && (e = {
                    max: e
                }), e || (e = {}), e.max && ("number" != typeof e.max || e.max < 0)) {
                    throw new TypeError("max must be a non-negative number");
                }
                this[t] = e.max || 1 / 0;
                const r = e.length || f;
                if (this[n] = "function" != typeof r ? f : r, this[o] = e.stale || !1, e.maxAge && "number" != typeof e.maxAge) {
                    throw new TypeError("maxAge must be a number");
                }
                this[i] = e.maxAge || 0, this[a] = e.dispose, this[u] = e.noDisposeOnSet || !1, 
                this[c] = e.updateAgeOnGet || !1, this.reset();
            }
            set max(e) {
                if ("number" != typeof e || e < 0) {
                    throw new TypeError("max must be a non-negative number");
                }
                this[t] = e || 1 / 0, v(this);
            }
            get max() {
                return this[t];
            }
            set allowStale(e) {
                this[o] = !!e;
            }
            get allowStale() {
                return this[o];
            }
            set maxAge(e) {
                if ("number" != typeof e) {
                    throw new TypeError("maxAge must be a non-negative number");
                }
                this[i] = e, v(this);
            }
            get maxAge() {
                return this[i];
            }
            set lengthCalculator(e) {
                "function" != typeof e && (e = f), e !== this[n] && (this[n] = e, this[r] = 0, this[s].forEach(e => {
                    e.length = this[n](e.value, e.key), this[r] += e.length;
                })), v(this);
            }
            get lengthCalculator() {
                return this[n];
            }
            get length() {
                return this[r];
            }
            get itemCount() {
                return this[s].length;
            }
            rforEach(e, t) {
                t = t || this;
                for (let r = this[s].tail; null !== r; ) {
                    const n = r.prev;
                    y(this, e, r, t), r = n;
                }
            }
            forEach(e, t) {
                t = t || this;
                for (let r = this[s].head; null !== r; ) {
                    const n = r.next;
                    y(this, e, r, t), r = n;
                }
            }
            keys() {
                return this[s].toArray().map(e => e.key);
            }
            values() {
                return this[s].toArray().map(e => e.value);
            }
            reset() {
                this[a] && this[s] && this[s].length && this[s].forEach(e => this[a](e.key, e.value)), 
                this[l] = new Map, this[s] = new e, this[r] = 0;
            }
            dump() {
                return this[s].map(e => !p(this, e) && {
                    k: e.key,
                    v: e.value,
                    e: e.now + (e.maxAge || 0)
                }).toArray().filter(e => e);
            }
            dumpLru() {
                return this[s];
            }
            set(e, o, c) {
                if ((c = c || this[i]) && "number" != typeof c) {
                    throw new TypeError("maxAge must be a number");
                }
                const f = c ? Date.now() : 0, d = this[n](o, e);
                if (this[l].has(e)) {
                    if (d > this[t]) {
                        return h(this, this[l].get(e)), !1;
                    }
                    const n = this[l].get(e).value;
                    return this[a] && (this[u] || this[a](e, n.value)), n.now = f, n.maxAge = c, n.value = o, 
                    this[r] += d - n.length, n.length = d, this.get(e), v(this), !0;
                }
                const p = new g(e, o, d, f, c);
                return p.length > this[t] ? (this[a] && this[a](e, o), !1) : (this[r] += p.length, 
                this[s].unshift(p), this[l].set(e, this[s].head), v(this), !0);
            }
            has(e) {
                if (!this[l].has(e)) {
                    return !1;
                }
                const t = this[l].get(e).value;
                return !p(this, t);
            }
            get(e) {
                return d(this, e, !0);
            }
            peek(e) {
                return d(this, e, !1);
            }
            pop() {
                const e = this[s].tail;
                return e ? (h(this, e), e.value) : null;
            }
            del(e) {
                h(this, this[l].get(e));
            }
            load(e) {
                this.reset();
                const t = Date.now();
                for (let r = e.length - 1; r >= 0; r--) {
                    const n = e[r], o = n.e || 0;
                    if (0 === o) {
                        this.set(n.k, n.v);
                    } else {
                        const e = o - t;
                        e > 0 && this.set(n.k, n.v, e);
                    }
                }
            }
            prune() {
                this[l].forEach((e, t) => d(this, t, !1));
            }
        }, ze;
    }(), r = new t({
        max: 1e3
    }), n = I, o = tt(), i = M, a = U, {safeRe: u, t: s, comparatorTrimReplace: l, tildeTrimReplace: c, caretTrimReplace: f} = w, {FLAG_INCLUDE_PRERELEASE: d, FLAG_LOOSE: p} = S, v = e => "<0.0.0-0" === e.value, h = e => "" === e.value, g = (e, t) => {
        let r = !0;
        const n = e.slice();
        let o = n.pop();
        for (;r && n.length; ) {
            r = n.every(e => o.intersects(e, t)), o = n.pop();
        }
        return r;
    }, y = (e, t) => (i("comp", e, t), e = D(e, t), i("caret", e), e = E(e, t), i("tildes", e), 
    e = O(e, t), i("xrange", e), e = C(e, t), i("stars", e), e), m = e => !e || "x" === e.toLowerCase() || "*" === e, E = (e, t) => e.trim().split(/\s+/).map(e => _(e, t)).join(" "), _ = (e, t) => {
        const r = t.loose ? u[s.TILDELOOSE] : u[s.TILDE];
        return e.replace(r, (t, r, n, o, a) => {
            let u;
            return i("tilde", e, t, r, n, o, a), m(r) ? u = "" : m(n) ? u = `>=${r}.0.0 <${+r + 1}.0.0-0` : m(o) ? u = `>=${r}.${n}.0 <${r}.${+n + 1}.0-0` : a ? (i("replaceTilde pr", a), 
            u = `>=${r}.${n}.${o}-${a} <${r}.${+n + 1}.0-0`) : u = `>=${r}.${n}.${o} <${r}.${+n + 1}.0-0`, 
            i("tilde return", u), u;
        });
    }, D = (e, t) => e.trim().split(/\s+/).map(e => b(e, t)).join(" "), b = (e, t) => {
        i("caret", e, t);
        const r = t.loose ? u[s.CARETLOOSE] : u[s.CARET], n = t.includePrerelease ? "-0" : "";
        return e.replace(r, (t, r, o, a, u) => {
            let s;
            return i("caret", e, t, r, o, a, u), m(r) ? s = "" : m(o) ? s = `>=${r}.0.0${n} <${+r + 1}.0.0-0` : m(a) ? s = "0" === r ? `>=${r}.${o}.0${n} <${r}.${+o + 1}.0-0` : `>=${r}.${o}.0${n} <${+r + 1}.0.0-0` : u ? (i("replaceCaret pr", u), 
            s = "0" === r ? "0" === o ? `>=${r}.${o}.${a}-${u} <${r}.${o}.${+a + 1}-0` : `>=${r}.${o}.${a}-${u} <${r}.${+o + 1}.0-0` : `>=${r}.${o}.${a}-${u} <${+r + 1}.0.0-0`) : (i("no pr"), 
            s = "0" === r ? "0" === o ? `>=${r}.${o}.${a}${n} <${r}.${o}.${+a + 1}-0` : `>=${r}.${o}.${a}${n} <${r}.${+o + 1}.0-0` : `>=${r}.${o}.${a} <${+r + 1}.0.0-0`), 
            i("caret return", s), s;
        });
    }, O = (e, t) => (i("replaceXRanges", e, t), e.split(/\s+/).map(e => A(e, t)).join(" ")), A = (e, t) => {
        e = e.trim();
        const r = t.loose ? u[s.XRANGELOOSE] : u[s.XRANGE];
        return e.replace(r, (r, n, o, a, u, s) => {
            i("xRange", e, r, n, o, a, u, s);
            const l = m(o), c = l || m(a), f = c || m(u), d = f;
            return "=" === n && d && (n = ""), s = t.includePrerelease ? "-0" : "", l ? r = ">" === n || "<" === n ? "<0.0.0-0" : "*" : n && d ? (c && (a = 0), 
            u = 0, ">" === n ? (n = ">=", c ? (o = +o + 1, a = 0, u = 0) : (a = +a + 1, u = 0)) : "<=" === n && (n = "<", 
            c ? o = +o + 1 : a = +a + 1), "<" === n && (s = "-0"), r = `${n + o}.${a}.${u}${s}`) : c ? r = `>=${o}.0.0${s} <${+o + 1}.0.0-0` : f && (r = `>=${o}.${a}.0${s} <${o}.${+a + 1}.0-0`), 
            i("xRange return", r), r;
        });
    }, C = (e, t) => (i("replaceStars", e, t), e.trim().replace(u[s.STAR], "")), F = (e, t) => (i("replaceGTE0", e, t), 
    e.trim().replace(u[t.includePrerelease ? s.GTE0PRE : s.GTE0], "")), P = e => (t, r, n, o, i, a, u, s, l, c, f, d, p) => `${r = m(n) ? "" : m(o) ? `>=${n}.0.0${e ? "-0" : ""}` : m(i) ? `>=${n}.${o}.0${e ? "-0" : ""}` : a ? `>=${r}` : `>=${r}${e ? "-0" : ""}`} ${s = m(l) ? "" : m(c) ? `<${+l + 1}.0.0-0` : m(f) ? `<${l}.${+c + 1}.0-0` : d ? `<=${l}.${c}.${f}-${d}` : e ? `<${l}.${c}.${+f + 1}-0` : `<=${s}`}`.trim(), R = (e, t, r) => {
        for (let r = 0; r < e.length; r++) {
            if (!e[r].test(t)) {
                return !1;
            }
        }
        if (t.prerelease.length && !r.includePrerelease) {
            for (let r = 0; r < e.length; r++) {
                if (i(e[r].semver), e[r].semver !== o.ANY && e[r].semver.prerelease.length > 0) {
                    const n = e[r].semver;
                    if (n.major === t.major && n.minor === t.minor && n.patch === t.patch) {
                        return !0;
                    }
                }
            }
            return !1;
        }
        return !0;
    };
    return Ke;
}

function tt() {
    if (Ye) {
        return Xe;
    }
    Ye = 1;
    const e = Symbol("SemVer ANY");
    class t {
        static get ANY() {
            return e;
        }
        constructor(n, o) {
            if (o = r(o), n instanceof t) {
                if (n.loose === !!o.loose) {
                    return n;
                }
                n = n.value;
            }
            n = n.trim().split(/\s+/).join(" "), a("comparator", n, o), this.options = o, this.loose = !!o.loose, 
            this.parse(n), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, 
            a("comp", this);
        }
        parse(t) {
            const r = this.options.loose ? n[o.COMPARATORLOOSE] : n[o.COMPARATOR], i = t.match(r);
            if (!i) {
                throw new TypeError(`Invalid comparator: ${t}`);
            }
            this.operator = void 0 !== i[1] ? i[1] : "", "=" === this.operator && (this.operator = ""), 
            i[2] ? this.semver = new u(i[2], this.options.loose) : this.semver = e;
        }
        toString() {
            return this.value;
        }
        test(t) {
            if (a("Comparator.test", t, this.options.loose), this.semver === e || t === e) {
                return !0;
            }
            if ("string" == typeof t) {
                try {
                    t = new u(t, this.options);
                } catch (e) {
                    return !1;
                }
            }
            return i(t, this.operator, this.semver, this.options);
        }
        intersects(e, n) {
            if (!(e instanceof t)) {
                throw new TypeError("a Comparator is required");
            }
            return "" === this.operator ? "" === this.value || new s(e.value, n).test(this.value) : "" === e.operator ? "" === e.value || new s(this.value, n).test(e.semver) : (!(n = r(n)).includePrerelease || "<0.0.0-0" !== this.value && "<0.0.0-0" !== e.value) && (!(!n.includePrerelease && (this.value.startsWith("<0.0.0") || e.value.startsWith("<0.0.0"))) && (!(!this.operator.startsWith(">") || !e.operator.startsWith(">")) || (!(!this.operator.startsWith("<") || !e.operator.startsWith("<")) || (!(this.semver.version !== e.semver.version || !this.operator.includes("=") || !e.operator.includes("=")) || (!!(i(this.semver, "<", e.semver, n) && this.operator.startsWith(">") && e.operator.startsWith("<")) || !!(i(this.semver, ">", e.semver, n) && this.operator.startsWith("<") && e.operator.startsWith(">")))))));
        }
    }
    Xe = t;
    const r = I, {safeRe: n, t: o} = w, i = xe, a = M, u = U, s = et();
    return Xe;
}

const rt = et();

var nt = (e, t, r) => {
    try {
        t = new rt(t, r);
    } catch (e) {
        return !1;
    }
    return t.test(e);
};

const ot = et();

var it = (e, t) => new ot(e, t).set.map(e => e.map(e => e.value).join(" ").trim().split(" "));

const at = U, ut = et();

var st = (e, t, r) => {
    let n = null, o = null, i = null;
    try {
        i = new ut(t, r);
    } catch (e) {
        return null;
    }
    return e.forEach(e => {
        i.test(e) && (n && -1 !== o.compare(e) || (n = e, o = new at(n, r)));
    }), n;
};

const lt = U, ct = et();

var ft = (e, t, r) => {
    let n = null, o = null, i = null;
    try {
        i = new ct(t, r);
    } catch (e) {
        return null;
    }
    return e.forEach(e => {
        i.test(e) && (n && 1 !== o.compare(e) || (n = e, o = new lt(n, r)));
    }), n;
};

const dt = U, pt = et(), vt = _e;

var ht = (e, t) => {
    e = new pt(e, t);
    let r = new dt("0.0.0");
    if (e.test(r)) {
        return r;
    }
    if (r = new dt("0.0.0-0"), e.test(r)) {
        return r;
    }
    r = null;
    for (let t = 0; t < e.set.length; ++t) {
        const n = e.set[t];
        let o = null;
        n.forEach(e => {
            const t = new dt(e.semver.version);
            switch (e.operator) {
              case ">":
                0 === t.prerelease.length ? t.patch++ : t.prerelease.push(0), t.raw = t.format();

              case "":
              case ">=":
                o && !vt(t, o) || (o = t);
                break;

              case "<":
              case "<=":
                break;

              default:
                throw new Error(`Unexpected operation: ${e.operator}`);
            }
        }), !o || r && !vt(r, o) || (r = o);
    }
    return r && e.test(r) ? r : null;
};

const gt = et();

var yt = (e, t) => {
    try {
        return new gt(e, t).range || "*";
    } catch (e) {
        return null;
    }
};

const mt = U, Et = tt(), {ANY: _t} = Et, Dt = et(), bt = nt, Ot = _e, At = be, Ct = Pe, St = we;

var Mt = (e, t, r, n) => {
    let o, i, a, u, s;
    switch (e = new mt(e, n), t = new Dt(t, n), r) {
      case ">":
        o = Ot, i = Ct, a = At, u = ">", s = ">=";
        break;

      case "<":
        o = At, i = St, a = Ot, u = "<", s = "<=";
        break;

      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (bt(e, t, n)) {
        return !1;
    }
    for (let r = 0; r < t.set.length; ++r) {
        const l = t.set[r];
        let c = null, f = null;
        if (l.forEach(e => {
            e.semver === _t && (e = new Et(">=0.0.0")), c = c || e, f = f || e, o(e.semver, c.semver, n) ? c = e : a(e.semver, f.semver, n) && (f = e);
        }), c.operator === u || c.operator === s) {
            return !1;
        }
        if ((!f.operator || f.operator === u) && i(e, f.semver)) {
            return !1;
        }
        if (f.operator === s && a(e, f.semver)) {
            return !1;
        }
    }
    return !0;
};

const wt = Mt;

var Ft = (e, t, r) => wt(e, t, ">", r);

const Pt = Mt;

var It = (e, t, r) => Pt(e, t, "<", r);

const Rt = et();

var Tt = (e, t, r) => (e = new Rt(e, r), t = new Rt(t, r), e.intersects(t, r));

const Lt = nt, jt = se;

const Nt = et(), xt = tt(), {ANY: kt} = xt, Bt = nt, $t = se, Ht = [ new xt(">=0.0.0-0") ], Ut = [ new xt(">=0.0.0") ], Gt = (e, t, r) => {
    if (e === t) {
        return !0;
    }
    if (1 === e.length && e[0].semver === kt) {
        if (1 === t.length && t[0].semver === kt) {
            return !0;
        }
        e = r.includePrerelease ? Ht : Ut;
    }
    if (1 === t.length && t[0].semver === kt) {
        if (r.includePrerelease) {
            return !0;
        }
        t = Ut;
    }
    const n = new Set;
    let o, i, a, u, s, l, c;
    for (const t of e) {
        ">" === t.operator || ">=" === t.operator ? o = Vt(o, t, r) : "<" === t.operator || "<=" === t.operator ? i = Wt(i, t, r) : n.add(t.semver);
    }
    if (n.size > 1) {
        return null;
    }
    if (o && i) {
        if (a = $t(o.semver, i.semver, r), a > 0) {
            return null;
        }
        if (0 === a && (">=" !== o.operator || "<=" !== i.operator)) {
            return null;
        }
    }
    for (const e of n) {
        if (o && !Bt(e, String(o), r)) {
            return null;
        }
        if (i && !Bt(e, String(i), r)) {
            return null;
        }
        for (const n of t) {
            if (!Bt(e, String(n), r)) {
                return !1;
            }
        }
        return !0;
    }
    let f = !(!i || r.includePrerelease || !i.semver.prerelease.length) && i.semver, d = !(!o || r.includePrerelease || !o.semver.prerelease.length) && o.semver;
    f && 1 === f.prerelease.length && "<" === i.operator && 0 === f.prerelease[0] && (f = !1);
    for (const e of t) {
        if (c = c || ">" === e.operator || ">=" === e.operator, l = l || "<" === e.operator || "<=" === e.operator, 
        o) {
            if (d && e.semver.prerelease && e.semver.prerelease.length && e.semver.major === d.major && e.semver.minor === d.minor && e.semver.patch === d.patch && (d = !1), 
            ">" === e.operator || ">=" === e.operator) {
                if (u = Vt(o, e, r), u === e && u !== o) {
                    return !1;
                }
            } else if (">=" === o.operator && !Bt(o.semver, String(e), r)) {
                return !1;
            }
        }
        if (i) {
            if (f && e.semver.prerelease && e.semver.prerelease.length && e.semver.major === f.major && e.semver.minor === f.minor && e.semver.patch === f.patch && (f = !1), 
            "<" === e.operator || "<=" === e.operator) {
                if (s = Wt(i, e, r), s === e && s !== i) {
                    return !1;
                }
            } else if ("<=" === i.operator && !Bt(i.semver, String(e), r)) {
                return !1;
            }
        }
        if (!e.operator && (i || o) && 0 !== a) {
            return !1;
        }
    }
    return !(o && l && !i && 0 !== a) && (!(i && c && !o && 0 !== a) && (!d && !f));
}, Vt = (e, t, r) => {
    if (!e) {
        return t;
    }
    const n = $t(e.semver, t.semver, r);
    return n > 0 ? e : n < 0 || ">" === t.operator && ">=" === e.operator ? t : e;
}, Wt = (e, t, r) => {
    if (!e) {
        return t;
    }
    const n = $t(e.semver, t.semver, r);
    return n < 0 ? e : n > 0 || "<" === t.operator && "<=" === e.operator ? t : e;
};

var zt = (e, t, r = {}) => {
    if (e === t) {
        return !0;
    }
    e = new Nt(e, r), t = new Nt(t, r);
    let n = !1;
    e: for (const o of e.set) {
        for (const e of t.set) {
            const t = Gt(o, e, r);
            if (n = n || null !== t, t) {
                continue e;
            }
        }
        if (n) {
            return !1;
        }
    }
    return !0;
};

const Jt = w, Kt = S, qt = U, Xt = L, Yt = (e, t, r) => {
    const n = [];
    let o = null, i = null;
    const a = e.sort((e, t) => jt(e, t, r));
    for (const e of a) {
        Lt(e, t, r) ? (i = e, o || (o = e)) : (i && n.push([ o, i ]), i = null, o = null);
    }
    o && n.push([ o, null ]);
    const u = [];
    for (const [e, t] of n) {
        e === t ? u.push(e) : t || e !== a[0] ? t ? e === a[0] ? u.push(`<=${t}`) : u.push(`${e} - ${t}`) : u.push(`>=${e}`) : u.push("*");
    }
    const s = u.join(" || "), l = "string" == typeof t.raw ? t.raw : String(t);
    return s.length < l.length ? s : t;
};

var Zt = {
    parse: V,
    valid: z,
    clean: K,
    inc: X,
    diff: Z,
    major: ee,
    minor: re,
    patch: oe,
    prerelease: ae,
    compare: se,
    rcompare: ce,
    compareLoose: de,
    compareBuild: ve,
    sort: ge,
    rsort: me,
    gt: _e,
    lt: be,
    eq: Ae,
    neq: Se,
    gte: we,
    lte: Pe,
    cmp: xe,
    coerce: Ze,
    Comparator: tt(),
    Range: et(),
    satisfies: nt,
    toComparators: it,
    maxSatisfying: st,
    minSatisfying: ft,
    minVersion: ht,
    validRange: yt,
    outside: Mt,
    gtr: Ft,
    ltr: It,
    intersects: Tt,
    simplifyRange: Yt,
    subset: zt,
    SemVer: qt,
    re: Jt.re,
    src: Jt.src,
    tokens: Jt.t,
    SEMVER_SPEC_VERSION: Kt.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: Kt.RELEASE_TYPES,
    compareIdentifiers: Xt.compareIdentifiers,
    rcompareIdentifiers: Xt.rcompareIdentifiers
}, Qt = {}, er = {}, tr = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(er, "__esModule", {
    value: !0
}), er.logFormatedErrorAndExit = er.logFormatedError = er.logError = er.logInfo = er.logErrorAndExit = void 0;

const rr = tr(a);

function nr(e, t, r) {
    let n = "";
    const o = "[31m", i = function(e) {
        if (!e || e.length < 5) {
            return;
        }
        return e.slice(3, 5);
    }(e);
    let a = "";
    if (i) {
        const e = ir[i];
        a = null != e ? e : a;
    }
    n += `${o}> hvigor ERROR: ${e} ${a}`, n += `${o}${rr.default.EOL}Error Message: ${t}`, 
    n += `${o}${rr.default.EOL}${rr.default.EOL}* Try the following: `, r.forEach(e => {
        n += `${o}${rr.default.EOL}  > ${e}[39m`;
    }), console.error(n);
}

var or;

er.logErrorAndExit = function(e) {
    e instanceof Error ? console.error(e.message) : console.error(e), process.exit(-1);
}, er.logInfo = function(e) {
    console.log(e);
}, er.logError = function(e) {
    console.error(e);
}, er.logFormatedError = nr, er.logFormatedErrorAndExit = function(e, t, r) {
    nr(e, t, r), process.exit(-1);
}, function(e) {
    e.ERROR_00 = "00", e.ERROR_01 = "01", e.ERROR_02 = "02", e.ERROR_03 = "03", e.ERROR_04 = "04", 
    e.ERROR_05 = "05", e.ERROR_06 = "06", e.ERROR_07 = "07", e.ERROR_08 = "08";
}(or || (or = {}));

const ir = {
    [or.ERROR_00]: "Unknown Error",
    [or.ERROR_01]: "Dependency Error",
    [or.ERROR_02]: "Script Error",
    [or.ERROR_03]: "Configuration Error",
    [or.ERROR_04]: "Not Found",
    [or.ERROR_05]: "Syntax Error",
    [or.ERROR_06]: "Specification Limit Violation",
    [or.ERROR_07]: "Permissions Error",
    [or.ERROR_08]: "Operation Error"
};

var ar = {}, ur = {}, sr = {};

Object.defineProperty(sr, "__esModule", {
    value: !0
}), sr.ENABLE_OVERRIDES_DEPENDENCY_MAP = sr.INCREMENTAL_OPTIMIZATION = sr.INCREMENTAL_INPUT_OUTPUT_CACHE = sr.LOG_LEVEL = sr.ANALYZE = sr.PARALLEL = sr.INCREMENTAL = sr.DAEMON = sr.DOT = sr.PROPERTIES = sr.HVIGOR_MEMORY_THRESHOLD = sr.OHOS_ARK_COMPILE_SOURCE_MAP_DIR = sr.HVIGOR_ENABLE_MEMORY_CACHE = sr.OHOS_ARK_COMPILE_MAX_SIZE = sr.HVIGOR_POOL_CACHE_TTL = sr.HVIGOR_POOL_CACHE_CAPACITY = sr.HVIGOR_POOL_MAX_CORE_SIZE = sr.HVIGOR_POOL_MAX_SIZE = sr.BUILD_CACHE_DIR = sr.ENABLE_SIGN_TASK_KEY = sr.HVIGOR_CACHE_DIR_KEY = sr.WORK_SPACE = sr.PROJECT_CACHES = sr.HVIGOR_USER_HOME_DIR_NAME = sr.DEFAULT_PACKAGE_JSON = sr.DEFAULT_OH_PACKAGE_JSON_FILE_NAME = sr.DEFAULT_HVIGOR_CONFIG_JSON_FILE_NAME = sr.PNPM = sr.HVIGOR = sr.NPM_TOOL = sr.PNPM_TOOL = sr.HVIGOR_ENGINE_PACKAGE_NAME = void 0;

const lr = m;

sr.HVIGOR_ENGINE_PACKAGE_NAME = "@ohos/hvigor", sr.PNPM_TOOL = (0, lr.isWindows)() ? "pnpm.cmd" : "pnpm", 
sr.NPM_TOOL = (0, lr.isWindows)() ? "npm.cmd" : "npm", sr.HVIGOR = "hvigor", sr.PNPM = "pnpm", 
sr.DEFAULT_HVIGOR_CONFIG_JSON_FILE_NAME = "hvigor-config.json5", sr.DEFAULT_OH_PACKAGE_JSON_FILE_NAME = "oh-package.json5", 
sr.DEFAULT_PACKAGE_JSON = "package.json", sr.HVIGOR_USER_HOME_DIR_NAME = ".hvigor", 
sr.PROJECT_CACHES = "project_caches", sr.WORK_SPACE = "workspace", sr.HVIGOR_CACHE_DIR_KEY = "hvigor.cacheDir", 
sr.ENABLE_SIGN_TASK_KEY = "enableSignTask", sr.BUILD_CACHE_DIR = "build-cache-dir", 
sr.HVIGOR_POOL_MAX_SIZE = "hvigor.pool.maxSize", sr.HVIGOR_POOL_MAX_CORE_SIZE = "hvigor.pool.maxCoreSize", 
sr.HVIGOR_POOL_CACHE_CAPACITY = "hvigor.pool.cache.capacity", sr.HVIGOR_POOL_CACHE_TTL = "hvigor.pool.cache.ttl", 
sr.OHOS_ARK_COMPILE_MAX_SIZE = "ohos.arkCompile.maxSize", sr.HVIGOR_ENABLE_MEMORY_CACHE = "hvigor.enableMemoryCache", 
sr.OHOS_ARK_COMPILE_SOURCE_MAP_DIR = "ohos.arkCompile.sourceMapDir", sr.HVIGOR_MEMORY_THRESHOLD = "hvigor.memoryThreshold", 
sr.PROPERTIES = "properties", sr.DOT = ".", sr.DAEMON = "daemon", sr.INCREMENTAL = "incremental", 
sr.PARALLEL = "typeCheck", sr.ANALYZE = "analyze", sr.LOG_LEVEL = "logLevel", sr.INCREMENTAL_INPUT_OUTPUT_CACHE = "hvigor.incremental.optimization", 
sr.INCREMENTAL_OPTIMIZATION = "hvigor.task.schedule.optimization", sr.ENABLE_OVERRIDES_DEPENDENCY_MAP = "enableOverridesDependencyMap";

var cr = {}, fr = {}, dr = {}, pr = {
    fromCallback: function(e) {
        return Object.defineProperty(function(...t) {
            if ("function" != typeof t[t.length - 1]) {
                return new Promise((r, n) => {
                    t.push((e, t) => null != e ? n(e) : r(t)), e.apply(this, t);
                });
            }
            e.apply(this, t);
        }, "name", {
            value: e.name
        });
    },
    fromPromise: function(e) {
        return Object.defineProperty(function(...t) {
            const r = t[t.length - 1];
            if ("function" != typeof r) {
                return e.apply(this, t);
            }
            t.pop(), e.apply(this, t).then(e => r(null, e), r);
        }, "name", {
            value: e.name
        });
    }
}, vr = u, hr = process.cwd, gr = null, yr = process.env.GRACEFUL_FS_PLATFORM || process.platform;

process.cwd = function() {
    return gr || (gr = hr.call(process)), gr;
};

try {
    process.cwd();
} catch (e) {}

if ("function" == typeof process.chdir) {
    var mr = process.chdir;
    process.chdir = function(e) {
        gr = null, mr.call(process, e);
    }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, mr);
}

var Er = function(e) {
    vr.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && function(e) {
        e.lchmod = function(t, r, n) {
            e.open(t, vr.O_WRONLY | vr.O_SYMLINK, r, function(t, o) {
                t ? n && n(t) : e.fchmod(o, r, function(t) {
                    e.close(o, function(e) {
                        n && n(t || e);
                    });
                });
            });
        }, e.lchmodSync = function(t, r) {
            var n, o = e.openSync(t, vr.O_WRONLY | vr.O_SYMLINK, r), i = !0;
            try {
                n = e.fchmodSync(o, r), i = !1;
            } finally {
                if (i) {
                    try {
                        e.closeSync(o);
                    } catch (e) {}
                } else {
                    e.closeSync(o);
                }
            }
            return n;
        };
    }(e);
    e.lutimes || function(e) {
        vr.hasOwnProperty("O_SYMLINK") && e.futimes ? (e.lutimes = function(t, r, n, o) {
            e.open(t, vr.O_SYMLINK, function(t, i) {
                t ? o && o(t) : e.futimes(i, r, n, function(t) {
                    e.close(i, function(e) {
                        o && o(t || e);
                    });
                });
            });
        }, e.lutimesSync = function(t, r, n) {
            var o, i = e.openSync(t, vr.O_SYMLINK), a = !0;
            try {
                o = e.futimesSync(i, r, n), a = !1;
            } finally {
                if (a) {
                    try {
                        e.closeSync(i);
                    } catch (e) {}
                } else {
                    e.closeSync(i);
                }
            }
            return o;
        }) : e.futimes && (e.lutimes = function(e, t, r, n) {
            n && process.nextTick(n);
        }, e.lutimesSync = function() {});
    }(e);
    e.chown = n(e.chown), e.fchown = n(e.fchown), e.lchown = n(e.lchown), e.chmod = t(e.chmod), 
    e.fchmod = t(e.fchmod), e.lchmod = t(e.lchmod), e.chownSync = o(e.chownSync), e.fchownSync = o(e.fchownSync), 
    e.lchownSync = o(e.lchownSync), e.chmodSync = r(e.chmodSync), e.fchmodSync = r(e.fchmodSync), 
    e.lchmodSync = r(e.lchmodSync), e.stat = i(e.stat), e.fstat = i(e.fstat), e.lstat = i(e.lstat), 
    e.statSync = a(e.statSync), e.fstatSync = a(e.fstatSync), e.lstatSync = a(e.lstatSync), 
    e.chmod && !e.lchmod && (e.lchmod = function(e, t, r) {
        r && process.nextTick(r);
    }, e.lchmodSync = function() {});
    e.chown && !e.lchown && (e.lchown = function(e, t, r, n) {
        n && process.nextTick(n);
    }, e.lchownSync = function() {});
    "win32" === yr && (e.rename = "function" != typeof e.rename ? e.rename : function(t) {
        function r(r, n, o) {
            var i = Date.now(), a = 0;
            t(r, n, function u(s) {
                if (s && ("EACCES" === s.code || "EPERM" === s.code || "EBUSY" === s.code) && Date.now() - i < 6e4) {
                    return setTimeout(function() {
                        e.stat(n, function(e, i) {
                            e && "ENOENT" === e.code ? t(r, n, u) : o(s);
                        });
                    }, a), void (a < 100 && (a += 10));
                }
                o && o(s);
            });
        }
        return Object.setPrototypeOf && Object.setPrototypeOf(r, t), r;
    }(e.rename));
    function t(t) {
        return t ? function(r, n, o) {
            return t.call(e, r, n, function(e) {
                u(e) && (e = null), o && o.apply(this, arguments);
            });
        } : t;
    }
    function r(t) {
        return t ? function(r, n) {
            try {
                return t.call(e, r, n);
            } catch (e) {
                if (!u(e)) {
                    throw e;
                }
            }
        } : t;
    }
    function n(t) {
        return t ? function(r, n, o, i) {
            return t.call(e, r, n, o, function(e) {
                u(e) && (e = null), i && i.apply(this, arguments);
            });
        } : t;
    }
    function o(t) {
        return t ? function(r, n, o) {
            try {
                return t.call(e, r, n, o);
            } catch (e) {
                if (!u(e)) {
                    throw e;
                }
            }
        } : t;
    }
    function i(t) {
        return t ? function(r, n, o) {
            function i(e, t) {
                t && (t.uid < 0 && (t.uid += 4294967296), t.gid < 0 && (t.gid += 4294967296)), o && o.apply(this, arguments);
            }
            return "function" == typeof n && (o = n, n = null), n ? t.call(e, r, n, i) : t.call(e, r, i);
        } : t;
    }
    function a(t) {
        return t ? function(r, n) {
            var o = n ? t.call(e, r, n) : t.call(e, r);
            return o && (o.uid < 0 && (o.uid += 4294967296), o.gid < 0 && (o.gid += 4294967296)), 
            o;
        } : t;
    }
    function u(e) {
        return !e || ("ENOSYS" === e.code || !(process.getuid && 0 === process.getuid() || "EINVAL" !== e.code && "EPERM" !== e.code));
    }
    e.read = "function" != typeof e.read ? e.read : function(t) {
        function r(r, n, o, i, a, u) {
            var s;
            if (u && "function" == typeof u) {
                var l = 0;
                s = function(c, f, d) {
                    if (c && "EAGAIN" === c.code && l < 10) {
                        return l++, t.call(e, r, n, o, i, a, s);
                    }
                    u.apply(this, arguments);
                };
            }
            return t.call(e, r, n, o, i, a, s);
        }
        return Object.setPrototypeOf && Object.setPrototypeOf(r, t), r;
    }(e.read), e.readSync = "function" != typeof e.readSync ? e.readSync : (s = e.readSync, 
    function(t, r, n, o, i) {
        for (var a = 0; ;) {
            try {
                return s.call(e, t, r, n, o, i);
            } catch (e) {
                if ("EAGAIN" === e.code && a < 10) {
                    a++;
                    continue;
                }
                throw e;
            }
        }
    });
    var s;
};

var _r = s.Stream, Dr = function(e) {
    return {
        ReadStream: function t(r, n) {
            if (!(this instanceof t)) {
                return new t(r, n);
            }
            _r.call(this);
            var o = this;
            this.path = r, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", 
            this.mode = 438, this.bufferSize = 65536, n = n || {};
            for (var i = Object.keys(n), a = 0, u = i.length; a < u; a++) {
                var s = i[a];
                this[s] = n[s];
            }
            this.encoding && this.setEncoding(this.encoding);
            if (void 0 !== this.start) {
                if ("number" != typeof this.start) {
                    throw TypeError("start must be a Number");
                }
                if (void 0 === this.end) {
                    this.end = 1 / 0;
                } else if ("number" != typeof this.end) {
                    throw TypeError("end must be a Number");
                }
                if (this.start > this.end) {
                    throw new Error("start must be <= end");
                }
                this.pos = this.start;
            }
            if (null !== this.fd) {
                return void process.nextTick(function() {
                    o._read();
                });
            }
            e.open(this.path, this.flags, this.mode, function(e, t) {
                if (e) {
                    return o.emit("error", e), void (o.readable = !1);
                }
                o.fd = t, o.emit("open", t), o._read();
            });
        },
        WriteStream: function t(r, n) {
            if (!(this instanceof t)) {
                return new t(r, n);
            }
            _r.call(this), this.path = r, this.fd = null, this.writable = !0, this.flags = "w", 
            this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, n = n || {};
            for (var o = Object.keys(n), i = 0, a = o.length; i < a; i++) {
                var u = o[i];
                this[u] = n[u];
            }
            if (void 0 !== this.start) {
                if ("number" != typeof this.start) {
                    throw TypeError("start must be a Number");
                }
                if (this.start < 0) {
                    throw new Error("start must be >= zero");
                }
                this.pos = this.start;
            }
            this.busy = !1, this._queue = [], null === this.fd && (this._open = e.open, this._queue.push([ this._open, this.path, this.flags, this.mode, void 0 ]), 
            this.flush());
        }
    };
};

var br = function(e) {
    if (null === e || "object" != typeof e) {
        return e;
    }
    if (e instanceof Object) {
        var t = {
            __proto__: Or(e)
        };
    } else {
        t = Object.create(null);
    }
    return Object.getOwnPropertyNames(e).forEach(function(r) {
        Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
    }), t;
}, Or = Object.getPrototypeOf || function(e) {
    return e.__proto__;
};

var Ar, Cr, Sr = t, Mr = Er, wr = Dr, Fr = br, Pr = l;

function Ir(e, t) {
    Object.defineProperty(e, Ar, {
        get: function() {
            return t;
        }
    });
}

"function" == typeof Symbol && "function" == typeof Symbol.for ? (Ar = Symbol.for("graceful-fs.queue"), 
Cr = Symbol.for("graceful-fs.previous")) : (Ar = "___graceful-fs.queue", Cr = "___graceful-fs.previous");

var Rr = function() {};

if (Pr.debuglog ? Rr = Pr.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Rr = function() {
    var e = Pr.format.apply(Pr, arguments);
    e = "GFS4: " + e.split(/\n/).join("\nGFS4: "), console.error(e);
}), !Sr[Ar]) {
    var Tr = g[Ar] || [];
    Ir(Sr, Tr), Sr.close = function(e) {
        function t(t, r) {
            return e.call(Sr, t, function(e) {
                e || kr(), "function" == typeof r && r.apply(this, arguments);
            });
        }
        return Object.defineProperty(t, Cr, {
            value: e
        }), t;
    }(Sr.close), Sr.closeSync = function(e) {
        function t(t) {
            e.apply(Sr, arguments), kr();
        }
        return Object.defineProperty(t, Cr, {
            value: e
        }), t;
    }(Sr.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
        Rr(Sr[Ar]), c.equal(Sr[Ar].length, 0);
    });
}

g[Ar] || Ir(g, Sr[Ar]);

var Lr, jr = Nr(Fr(Sr));

function Nr(e) {
    Mr(e), e.gracefulify = Nr, e.createReadStream = function(t, r) {
        return new e.ReadStream(t, r);
    }, e.createWriteStream = function(t, r) {
        return new e.WriteStream(t, r);
    };
    var t = e.readFile;
    e.readFile = function(e, r, n) {
        "function" == typeof r && (n = r, r = null);
        return function e(r, n, o, i) {
            return t(r, n, function(t) {
                !t || "EMFILE" !== t.code && "ENFILE" !== t.code ? "function" == typeof o && o.apply(this, arguments) : xr([ e, [ r, n, o ], t, i || Date.now(), Date.now() ]);
            });
        }(e, r, n);
    };
    var r = e.writeFile;
    e.writeFile = function(e, t, n, o) {
        "function" == typeof n && (o = n, n = null);
        return function e(t, n, o, i, a) {
            return r(t, n, o, function(r) {
                !r || "EMFILE" !== r.code && "ENFILE" !== r.code ? "function" == typeof i && i.apply(this, arguments) : xr([ e, [ t, n, o, i ], r, a || Date.now(), Date.now() ]);
            });
        }(e, t, n, o);
    };
    var n = e.appendFile;
    n && (e.appendFile = function(e, t, r, o) {
        "function" == typeof r && (o = r, r = null);
        return function e(t, r, o, i, a) {
            return n(t, r, o, function(n) {
                !n || "EMFILE" !== n.code && "ENFILE" !== n.code ? "function" == typeof i && i.apply(this, arguments) : xr([ e, [ t, r, o, i ], n, a || Date.now(), Date.now() ]);
            });
        }(e, t, r, o);
    });
    var o = e.copyFile;
    o && (e.copyFile = function(e, t, r, n) {
        "function" == typeof r && (n = r, r = 0);
        return function e(t, r, n, i, a) {
            return o(t, r, n, function(o) {
                !o || "EMFILE" !== o.code && "ENFILE" !== o.code ? "function" == typeof i && i.apply(this, arguments) : xr([ e, [ t, r, n, i ], o, a || Date.now(), Date.now() ]);
            });
        }(e, t, r, n);
    });
    var i = e.readdir;
    e.readdir = function(e, t, r) {
        "function" == typeof t && (r = t, t = null);
        var n = a.test(process.version) ? function(e, t, r, n) {
            return i(e, o(e, t, r, n));
        } : function(e, t, r, n) {
            return i(e, t, o(e, t, r, n));
        };
        return n(e, t, r);
        function o(e, t, r, o) {
            return function(i, a) {
                !i || "EMFILE" !== i.code && "ENFILE" !== i.code ? (a && a.sort && a.sort(), "function" == typeof r && r.call(this, i, a)) : xr([ n, [ e, t, r ], i, o || Date.now(), Date.now() ]);
            };
        }
    };
    var a = /^v[0-5]\./;
    if ("v0.8" === process.version.substr(0, 4)) {
        var u = wr(e);
        d = u.ReadStream, p = u.WriteStream;
    }
    var s = e.ReadStream;
    s && (d.prototype = Object.create(s.prototype), d.prototype.open = function() {
        var e = this;
        h(e.path, e.flags, e.mode, function(t, r) {
            t ? (e.autoClose && e.destroy(), e.emit("error", t)) : (e.fd = r, e.emit("open", r), 
            e.read());
        });
    });
    var l = e.WriteStream;
    l && (p.prototype = Object.create(l.prototype), p.prototype.open = function() {
        var e = this;
        h(e.path, e.flags, e.mode, function(t, r) {
            t ? (e.destroy(), e.emit("error", t)) : (e.fd = r, e.emit("open", r));
        });
    }), Object.defineProperty(e, "ReadStream", {
        get: function() {
            return d;
        },
        set: function(e) {
            d = e;
        },
        enumerable: !0,
        configurable: !0
    }), Object.defineProperty(e, "WriteStream", {
        get: function() {
            return p;
        },
        set: function(e) {
            p = e;
        },
        enumerable: !0,
        configurable: !0
    });
    var c = d;
    Object.defineProperty(e, "FileReadStream", {
        get: function() {
            return c;
        },
        set: function(e) {
            c = e;
        },
        enumerable: !0,
        configurable: !0
    });
    var f = p;
    function d(e, t) {
        return this instanceof d ? (s.apply(this, arguments), this) : d.apply(Object.create(d.prototype), arguments);
    }
    function p(e, t) {
        return this instanceof p ? (l.apply(this, arguments), this) : p.apply(Object.create(p.prototype), arguments);
    }
    Object.defineProperty(e, "FileWriteStream", {
        get: function() {
            return f;
        },
        set: function(e) {
            f = e;
        },
        enumerable: !0,
        configurable: !0
    });
    var v = e.open;
    function h(e, t, r, n) {
        return "function" == typeof r && (n = r, r = null), function e(t, r, n, o, i) {
            return v(t, r, n, function(a, u) {
                !a || "EMFILE" !== a.code && "ENFILE" !== a.code ? "function" == typeof o && o.apply(this, arguments) : xr([ e, [ t, r, n, o ], a, i || Date.now(), Date.now() ]);
            });
        }(e, t, r, n);
    }
    return e.open = h, e;
}

function xr(e) {
    Rr("ENQUEUE", e[0].name, e[1]), Sr[Ar].push(e), Br();
}

function kr() {
    for (var e = Date.now(), t = 0; t < Sr[Ar].length; ++t) {
        Sr[Ar][t].length > 2 && (Sr[Ar][t][3] = e, Sr[Ar][t][4] = e);
    }
    Br();
}

function Br() {
    if (clearTimeout(Lr), Lr = void 0, 0 !== Sr[Ar].length) {
        var e = Sr[Ar].shift(), t = e[0], r = e[1], n = e[2], o = e[3], i = e[4];
        if (void 0 === o) {
            Rr("RETRY", t.name, r), t.apply(null, r);
        } else if (Date.now() - o >= 6e4) {
            Rr("TIMEOUT", t.name, r);
            var a = r.pop();
            "function" == typeof a && a.call(null, n);
        } else {
            var u = Date.now() - i, s = Math.max(i - o, 1);
            u >= Math.min(1.2 * s, 100) ? (Rr("RETRY", t.name, r), t.apply(null, r.concat([ o ]))) : Sr[Ar].push(e);
        }
        void 0 === Lr && (Lr = setTimeout(Br, 0));
    }
}

process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !Sr.__patched && (jr = Nr(Sr), Sr.__patched = !0), 
function(e) {
    const t = pr.fromCallback, r = jr, n = [ "access", "appendFile", "chmod", "chown", "close", "copyFile", "fchmod", "fchown", "fdatasync", "fstat", "fsync", "ftruncate", "futimes", "lchmod", "lchown", "link", "lstat", "mkdir", "mkdtemp", "open", "opendir", "readdir", "readFile", "readlink", "realpath", "rename", "rm", "rmdir", "stat", "symlink", "truncate", "unlink", "utimes", "writeFile" ].filter(e => "function" == typeof r[e]);
    Object.assign(e, r), n.forEach(n => {
        e[n] = t(r[n]);
    }), e.exists = function(e, t) {
        return "function" == typeof t ? r.exists(e, t) : new Promise(t => r.exists(e, t));
    }, e.read = function(e, t, n, o, i, a) {
        return "function" == typeof a ? r.read(e, t, n, o, i, a) : new Promise((a, u) => {
            r.read(e, t, n, o, i, (e, t, r) => {
                if (e) {
                    return u(e);
                }
                a({
                    bytesRead: t,
                    buffer: r
                });
            });
        });
    }, e.write = function(e, t, ...n) {
        return "function" == typeof n[n.length - 1] ? r.write(e, t, ...n) : new Promise((o, i) => {
            r.write(e, t, ...n, (e, t, r) => {
                if (e) {
                    return i(e);
                }
                o({
                    bytesWritten: t,
                    buffer: r
                });
            });
        });
    }, e.readv = function(e, t, ...n) {
        return "function" == typeof n[n.length - 1] ? r.readv(e, t, ...n) : new Promise((o, i) => {
            r.readv(e, t, ...n, (e, t, r) => {
                if (e) {
                    return i(e);
                }
                o({
                    bytesRead: t,
                    buffers: r
                });
            });
        });
    }, e.writev = function(e, t, ...n) {
        return "function" == typeof n[n.length - 1] ? r.writev(e, t, ...n) : new Promise((o, i) => {
            r.writev(e, t, ...n, (e, t, r) => {
                if (e) {
                    return i(e);
                }
                o({
                    bytesWritten: t,
                    buffers: r
                });
            });
        });
    }, "function" == typeof r.realpath.native ? e.realpath.native = t(r.realpath.native) : process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?", "Warning", "fs-extra-WARN0003");
}(dr);

var $r = {}, Hr = {};

const Ur = r;

Hr.checkPath = function(e) {
    if ("win32" === process.platform) {
        if (/[<>:"|?*]/.test(e.replace(Ur.parse(e).root, ""))) {
            const t = new Error(`Path contains invalid characters: ${e}`);
            throw t.code = "EINVAL", t;
        }
    }
};

const Gr = dr, {checkPath: Vr} = Hr, Wr = e => "number" == typeof e ? e : {
    mode: 511,
    ...e
}.mode;

$r.makeDir = async (e, t) => (Vr(e), Gr.mkdir(e, {
    mode: Wr(t),
    recursive: !0
})), $r.makeDirSync = (e, t) => (Vr(e), Gr.mkdirSync(e, {
    mode: Wr(t),
    recursive: !0
}));

const zr = pr.fromPromise, {makeDir: Jr, makeDirSync: Kr} = $r, qr = zr(Jr);

var Xr = {
    mkdirs: qr,
    mkdirsSync: Kr,
    mkdirp: qr,
    mkdirpSync: Kr,
    ensureDir: qr,
    ensureDirSync: Kr
};

const Yr = pr.fromPromise, Zr = dr;

var Qr = {
    pathExists: Yr(function(e) {
        return Zr.access(e).then(() => !0).catch(() => !1);
    }),
    pathExistsSync: Zr.existsSync
};

const en = dr;

var tn = {
    utimesMillis: (0, pr.fromPromise)(async function(e, t, r) {
        const n = await en.open(e, "r+");
        let o = null;
        try {
            await en.futimes(n, t, r);
        } finally {
            try {
                await en.close(n);
            } catch (e) {
                o = e;
            }
        }
        if (o) {
            throw o;
        }
    }),
    utimesMillisSync: function(e, t, r) {
        const n = en.openSync(e, "r+");
        return en.futimesSync(n, t, r), en.closeSync(n);
    }
};

const rn = dr, nn = r, on = pr.fromPromise;

function an(e, t) {
    return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}

function un(e, t) {
    const r = nn.resolve(e).split(nn.sep).filter(e => e), n = nn.resolve(t).split(nn.sep).filter(e => e);
    return r.every((e, t) => n[t] === e);
}

function sn(e, t, r) {
    return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}

var ln = {
    checkPaths: on(async function(e, t, r, n) {
        const {srcStat: o, destStat: i} = await function(e, t, r) {
            const n = r.dereference ? e => rn.stat(e, {
                bigint: !0
            }) : e => rn.lstat(e, {
                bigint: !0
            });
            return Promise.all([ n(e), n(t).catch(e => {
                if ("ENOENT" === e.code) {
                    return null;
                }
                throw e;
            }) ]).then(([e, t]) => ({
                srcStat: e,
                destStat: t
            }));
        }(e, t, n);
        if (i) {
            if (an(o, i)) {
                const n = nn.basename(e), a = nn.basename(t);
                if ("move" === r && n !== a && n.toLowerCase() === a.toLowerCase()) {
                    return {
                        srcStat: o,
                        destStat: i,
                        isChangingCase: !0
                    };
                }
                throw new Error("Source and destination must not be the same.");
            }
            if (o.isDirectory() && !i.isDirectory()) {
                throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
            }
            if (!o.isDirectory() && i.isDirectory()) {
                throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
            }
        }
        if (o.isDirectory() && un(e, t)) {
            throw new Error(sn(e, t, r));
        }
        return {
            srcStat: o,
            destStat: i
        };
    }),
    checkPathsSync: function(e, t, r, n) {
        const {srcStat: o, destStat: i} = function(e, t, r) {
            let n;
            const o = r.dereference ? e => rn.statSync(e, {
                bigint: !0
            }) : e => rn.lstatSync(e, {
                bigint: !0
            }), i = o(e);
            try {
                n = o(t);
            } catch (e) {
                if ("ENOENT" === e.code) {
                    return {
                        srcStat: i,
                        destStat: null
                    };
                }
                throw e;
            }
            return {
                srcStat: i,
                destStat: n
            };
        }(e, t, n);
        if (i) {
            if (an(o, i)) {
                const n = nn.basename(e), a = nn.basename(t);
                if ("move" === r && n !== a && n.toLowerCase() === a.toLowerCase()) {
                    return {
                        srcStat: o,
                        destStat: i,
                        isChangingCase: !0
                    };
                }
                throw new Error("Source and destination must not be the same.");
            }
            if (o.isDirectory() && !i.isDirectory()) {
                throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
            }
            if (!o.isDirectory() && i.isDirectory()) {
                throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
            }
        }
        if (o.isDirectory() && un(e, t)) {
            throw new Error(sn(e, t, r));
        }
        return {
            srcStat: o,
            destStat: i
        };
    },
    checkParentPaths: on(async function e(t, r, n, o) {
        const i = nn.resolve(nn.dirname(t)), a = nn.resolve(nn.dirname(n));
        if (a === i || a === nn.parse(a).root) {
            return;
        }
        let u;
        try {
            u = await rn.stat(a, {
                bigint: !0
            });
        } catch (e) {
            if ("ENOENT" === e.code) {
                return;
            }
            throw e;
        }
        if (an(r, u)) {
            throw new Error(sn(t, n, o));
        }
        return e(t, r, a, o);
    }),
    checkParentPathsSync: function e(t, r, n, o) {
        const i = nn.resolve(nn.dirname(t)), a = nn.resolve(nn.dirname(n));
        if (a === i || a === nn.parse(a).root) {
            return;
        }
        let u;
        try {
            u = rn.statSync(a, {
                bigint: !0
            });
        } catch (e) {
            if ("ENOENT" === e.code) {
                return;
            }
            throw e;
        }
        if (an(r, u)) {
            throw new Error(sn(t, n, o));
        }
        return e(t, r, a, o);
    },
    isSrcSubdir: un,
    areIdentical: an
};

const cn = dr, fn = r, {mkdirs: dn} = Xr, {pathExists: pn} = Qr, {utimesMillis: vn} = tn, hn = ln;

async function gn(e, t, r) {
    return !r.filter || r.filter(e, t);
}

async function yn(e, t, r, n) {
    const o = n.dereference ? cn.stat : cn.lstat, i = await o(t);
    if (i.isDirectory()) {
        return async function(e, t, r, n, o) {
            t || await cn.mkdir(n);
            const i = await cn.readdir(r);
            await Promise.all(i.map(async e => {
                const t = fn.join(r, e), i = fn.join(n, e);
                if (!await gn(t, i, o)) {
                    return;
                }
                const {destStat: a} = await hn.checkPaths(t, i, "copy", o);
                return yn(a, t, i, o);
            })), t || await cn.chmod(n, e.mode);
        }(i, e, t, r, n);
    }
    if (i.isFile() || i.isCharacterDevice() || i.isBlockDevice()) {
        return async function(e, t, r, n, o) {
            if (!t) {
                return mn(e, r, n, o);
            }
            if (o.overwrite) {
                return await cn.unlink(n), mn(e, r, n, o);
            }
            if (o.errorOnExist) {
                throw new Error(`'${n}' already exists`);
            }
        }(i, e, t, r, n);
    }
    if (i.isSymbolicLink()) {
        return async function(e, t, r, n) {
            let o = await cn.readlink(t);
            n.dereference && (o = fn.resolve(process.cwd(), o));
            if (!e) {
                return cn.symlink(o, r);
            }
            let i = null;
            try {
                i = await cn.readlink(r);
            } catch (e) {
                if ("EINVAL" === e.code || "UNKNOWN" === e.code) {
                    return cn.symlink(o, r);
                }
                throw e;
            }
            n.dereference && (i = fn.resolve(process.cwd(), i));
            if (hn.isSrcSubdir(o, i)) {
                throw new Error(`Cannot copy '${o}' to a subdirectory of itself, '${i}'.`);
            }
            if (hn.isSrcSubdir(i, o)) {
                throw new Error(`Cannot overwrite '${i}' with '${o}'.`);
            }
            return await cn.unlink(r), cn.symlink(o, r);
        }(e, t, r, n);
    }
    if (i.isSocket()) {
        throw new Error(`Cannot copy a socket file: ${t}`);
    }
    if (i.isFIFO()) {
        throw new Error(`Cannot copy a FIFO pipe: ${t}`);
    }
    throw new Error(`Unknown file: ${t}`);
}

async function mn(e, t, r, n) {
    if (await cn.copyFile(t, r), n.preserveTimestamps) {
        128 & e.mode || await function(e, t) {
            return cn.chmod(e, 128 | t);
        }(r, e.mode);
        const n = await cn.stat(t);
        await vn(r, n.atime, n.mtime);
    }
    return cn.chmod(r, e.mode);
}

var En = async function(e, t, r = {}) {
    "function" == typeof r && (r = {
        filter: r
    }), r.clobber = !("clobber" in r) || !!r.clobber, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, 
    r.preserveTimestamps && "ia32" === process.arch && process.emitWarning("Using the preserveTimestamps option in 32-bit node is not recommended;\n\n\tsee https://github.com/jprichardson/node-fs-extra/issues/269", "Warning", "fs-extra-WARN0001");
    const {srcStat: n, destStat: o} = await hn.checkPaths(e, t, "copy", r);
    if (await hn.checkParentPaths(e, n, t, "copy"), !await gn(e, t, r)) {
        return;
    }
    const i = fn.dirname(t);
    await pn(i) || await dn(i), await yn(o, e, t, r);
};

const _n = jr, Dn = r, bn = Xr.mkdirsSync, On = tn.utimesMillisSync, An = ln;

function Cn(e, t, r, n) {
    const o = (n.dereference ? _n.statSync : _n.lstatSync)(t);
    if (o.isDirectory()) {
        return function(e, t, r, n, o) {
            return t ? wn(r, n, o) : function(e, t, r, n) {
                return _n.mkdirSync(r), wn(t, r, n), Mn(r, e);
            }(e.mode, r, n, o);
        }(o, e, t, r, n);
    }
    if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) {
        return function(e, t, r, n, o) {
            return t ? function(e, t, r, n) {
                if (n.overwrite) {
                    return _n.unlinkSync(r), Sn(e, t, r, n);
                }
                if (n.errorOnExist) {
                    throw new Error(`'${r}' already exists`);
                }
            }(e, r, n, o) : Sn(e, r, n, o);
        }(o, e, t, r, n);
    }
    if (o.isSymbolicLink()) {
        return function(e, t, r, n) {
            let o = _n.readlinkSync(t);
            n.dereference && (o = Dn.resolve(process.cwd(), o));
            if (e) {
                let e;
                try {
                    e = _n.readlinkSync(r);
                } catch (e) {
                    if ("EINVAL" === e.code || "UNKNOWN" === e.code) {
                        return _n.symlinkSync(o, r);
                    }
                    throw e;
                }
                if (n.dereference && (e = Dn.resolve(process.cwd(), e)), An.isSrcSubdir(o, e)) {
                    throw new Error(`Cannot copy '${o}' to a subdirectory of itself, '${e}'.`);
                }
                if (An.isSrcSubdir(e, o)) {
                    throw new Error(`Cannot overwrite '${e}' with '${o}'.`);
                }
                return function(e, t) {
                    return _n.unlinkSync(t), _n.symlinkSync(e, t);
                }(o, r);
            }
            return _n.symlinkSync(o, r);
        }(e, t, r, n);
    }
    if (o.isSocket()) {
        throw new Error(`Cannot copy a socket file: ${t}`);
    }
    if (o.isFIFO()) {
        throw new Error(`Cannot copy a FIFO pipe: ${t}`);
    }
    throw new Error(`Unknown file: ${t}`);
}

function Sn(e, t, r, n) {
    return _n.copyFileSync(t, r), n.preserveTimestamps && function(e, t, r) {
        (function(e) {
            return !(128 & e);
        })(e) && function(e, t) {
            Mn(e, 128 | t);
        }(r, e);
        (function(e, t) {
            const r = _n.statSync(e);
            On(t, r.atime, r.mtime);
        })(t, r);
    }(e.mode, t, r), Mn(r, e.mode);
}

function Mn(e, t) {
    return _n.chmodSync(e, t);
}

function wn(e, t, r) {
    _n.readdirSync(e).forEach(n => function(e, t, r, n) {
        const o = Dn.join(t, e), i = Dn.join(r, e);
        if (n.filter && !n.filter(o, i)) {
            return;
        }
        const {destStat: a} = An.checkPathsSync(o, i, "copy", n);
        return Cn(a, o, i, n);
    }(n, e, t, r));
}

var Fn = function(e, t, r) {
    "function" == typeof r && (r = {
        filter: r
    }), (r = r || {}).clobber = !("clobber" in r) || !!r.clobber, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, 
    r.preserveTimestamps && "ia32" === process.arch && process.emitWarning("Using the preserveTimestamps option in 32-bit node is not recommended;\n\n\tsee https://github.com/jprichardson/node-fs-extra/issues/269", "Warning", "fs-extra-WARN0002");
    const {srcStat: n, destStat: o} = An.checkPathsSync(e, t, "copy", r);
    if (An.checkParentPathsSync(e, n, t, "copy"), r.filter && !r.filter(e, t)) {
        return;
    }
    const i = Dn.dirname(t);
    return _n.existsSync(i) || bn(i), Cn(o, e, t, r);
};

var Pn = {
    copy: (0, pr.fromPromise)(En),
    copySync: Fn
};

const In = jr;

var Rn = {
    remove: (0, pr.fromCallback)(function(e, t) {
        In.rm(e, {
            recursive: !0,
            force: !0
        }, t);
    }),
    removeSync: function(e) {
        In.rmSync(e, {
            recursive: !0,
            force: !0
        });
    }
};

const Tn = pr.fromPromise, Ln = dr, jn = r, Nn = Xr, xn = Rn, kn = Tn(async function(e) {
    let t;
    try {
        t = await Ln.readdir(e);
    } catch {
        return Nn.mkdirs(e);
    }
    return Promise.all(t.map(t => xn.remove(jn.join(e, t))));
});

function Bn(e) {
    let t;
    try {
        t = Ln.readdirSync(e);
    } catch {
        return Nn.mkdirsSync(e);
    }
    t.forEach(t => {
        t = jn.join(e, t), xn.removeSync(t);
    });
}

var $n = {
    emptyDirSync: Bn,
    emptydirSync: Bn,
    emptyDir: kn,
    emptydir: kn
};

const Hn = pr.fromPromise, Un = r, Gn = dr, Vn = Xr;

var Wn = {
    createFile: Hn(async function(e) {
        let t;
        try {
            t = await Gn.stat(e);
        } catch {}
        if (t && t.isFile()) {
            return;
        }
        const r = Un.dirname(e);
        let n = null;
        try {
            n = await Gn.stat(r);
        } catch (t) {
            if ("ENOENT" === t.code) {
                return await Vn.mkdirs(r), void await Gn.writeFile(e, "");
            }
            throw t;
        }
        n.isDirectory() ? await Gn.writeFile(e, "") : await Gn.readdir(r);
    }),
    createFileSync: function(e) {
        let t;
        try {
            t = Gn.statSync(e);
        } catch {}
        if (t && t.isFile()) {
            return;
        }
        const r = Un.dirname(e);
        try {
            Gn.statSync(r).isDirectory() || Gn.readdirSync(r);
        } catch (e) {
            if (!e || "ENOENT" !== e.code) {
                throw e;
            }
            Vn.mkdirsSync(r);
        }
        Gn.writeFileSync(e, "");
    }
};

const zn = pr.fromPromise, Jn = r, Kn = dr, qn = Xr, {pathExists: Xn} = Qr, {areIdentical: Yn} = ln;

var Zn = {
    createLink: zn(async function(e, t) {
        let r, n;
        try {
            r = await Kn.lstat(t);
        } catch {}
        try {
            n = await Kn.lstat(e);
        } catch (e) {
            throw e.message = e.message.replace("lstat", "ensureLink"), e;
        }
        if (r && Yn(n, r)) {
            return;
        }
        const o = Jn.dirname(t);
        await Xn(o) || await qn.mkdirs(o), await Kn.link(e, t);
    }),
    createLinkSync: function(e, t) {
        let r;
        try {
            r = Kn.lstatSync(t);
        } catch {}
        try {
            const t = Kn.lstatSync(e);
            if (r && Yn(t, r)) {
                return;
            }
        } catch (e) {
            throw e.message = e.message.replace("lstat", "ensureLink"), e;
        }
        const n = Jn.dirname(t);
        return Kn.existsSync(n) || qn.mkdirsSync(n), Kn.linkSync(e, t);
    }
};

const Qn = r, eo = dr, {pathExists: to} = Qr;

var ro = {
    symlinkPaths: (0, pr.fromPromise)(async function(e, t) {
        if (Qn.isAbsolute(e)) {
            try {
                await eo.lstat(e);
            } catch (e) {
                throw e.message = e.message.replace("lstat", "ensureSymlink"), e;
            }
            return {
                toCwd: e,
                toDst: e
            };
        }
        const r = Qn.dirname(t), n = Qn.join(r, e);
        if (await to(n)) {
            return {
                toCwd: n,
                toDst: e
            };
        }
        try {
            await eo.lstat(e);
        } catch (e) {
            throw e.message = e.message.replace("lstat", "ensureSymlink"), e;
        }
        return {
            toCwd: e,
            toDst: Qn.relative(r, e)
        };
    }),
    symlinkPathsSync: function(e, t) {
        if (Qn.isAbsolute(e)) {
            if (!eo.existsSync(e)) {
                throw new Error("absolute srcpath does not exist");
            }
            return {
                toCwd: e,
                toDst: e
            };
        }
        const r = Qn.dirname(t), n = Qn.join(r, e);
        if (eo.existsSync(n)) {
            return {
                toCwd: n,
                toDst: e
            };
        }
        if (!eo.existsSync(e)) {
            throw new Error("relative srcpath does not exist");
        }
        return {
            toCwd: e,
            toDst: Qn.relative(r, e)
        };
    }
};

const no = dr;

var oo = {
    symlinkType: (0, pr.fromPromise)(async function(e, t) {
        if (t) {
            return t;
        }
        let r;
        try {
            r = await no.lstat(e);
        } catch {
            return "file";
        }
        return r && r.isDirectory() ? "dir" : "file";
    }),
    symlinkTypeSync: function(e, t) {
        if (t) {
            return t;
        }
        let r;
        try {
            r = no.lstatSync(e);
        } catch {
            return "file";
        }
        return r && r.isDirectory() ? "dir" : "file";
    }
};

const io = pr.fromPromise, ao = r, uo = dr, {mkdirs: so, mkdirsSync: lo} = Xr, {symlinkPaths: co, symlinkPathsSync: fo} = ro, {symlinkType: po, symlinkTypeSync: vo} = oo, {pathExists: ho} = Qr, {areIdentical: go} = ln;

var yo = {
    createSymlink: io(async function(e, t, r) {
        let n;
        try {
            n = await uo.lstat(t);
        } catch {}
        if (n && n.isSymbolicLink()) {
            const [r, n] = await Promise.all([ uo.stat(e), uo.stat(t) ]);
            if (go(r, n)) {
                return;
            }
        }
        const o = await co(e, t);
        e = o.toDst;
        const i = await po(o.toCwd, r), a = ao.dirname(t);
        return await ho(a) || await so(a), uo.symlink(e, t, i);
    }),
    createSymlinkSync: function(e, t, r) {
        let n;
        try {
            n = uo.lstatSync(t);
        } catch {}
        if (n && n.isSymbolicLink()) {
            const r = uo.statSync(e), n = uo.statSync(t);
            if (go(r, n)) {
                return;
            }
        }
        const o = fo(e, t);
        e = o.toDst, r = vo(o.toCwd, r);
        const i = ao.dirname(t);
        return uo.existsSync(i) || lo(i), uo.symlinkSync(e, t, r);
    }
};

const {createFile: mo, createFileSync: Eo} = Wn, {createLink: _o, createLinkSync: Do} = Zn, {createSymlink: bo, createSymlinkSync: Oo} = yo;

var Ao = {
    createFile: mo,
    createFileSync: Eo,
    ensureFile: mo,
    ensureFileSync: Eo,
    createLink: _o,
    createLinkSync: Do,
    ensureLink: _o,
    ensureLinkSync: Do,
    createSymlink: bo,
    createSymlinkSync: Oo,
    ensureSymlink: bo,
    ensureSymlinkSync: Oo
};

var Co = {
    stringify: function(e, {EOL: t = "\n", finalEOL: r = !0, replacer: n = null, spaces: o} = {}) {
        const i = r ? t : "";
        return JSON.stringify(e, n, o).replace(/\n/g, t) + i;
    },
    stripBom: function(e) {
        return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
    }
};

let So;

try {
    So = jr;
} catch (TF) {
    So = t;
}

const Mo = pr, {stringify: wo, stripBom: Fo} = Co;

const Po = Mo.fromPromise(async function(e, t = {}) {
    "string" == typeof t && (t = {
        encoding: t
    });
    const r = t.fs || So, n = !("throws" in t) || t.throws;
    let o, i = await Mo.fromCallback(r.readFile)(e, t);
    i = Fo(i);
    try {
        o = JSON.parse(i, t ? t.reviver : null);
    } catch (t) {
        if (n) {
            throw t.message = `${e}: ${t.message}`, t;
        }
        return null;
    }
    return o;
});

const Io = Mo.fromPromise(async function(e, t, r = {}) {
    const n = r.fs || So, o = wo(t, r);
    await Mo.fromCallback(n.writeFile)(e, o, r);
});

const Ro = {
    readFile: Po,
    readFileSync: function(e, t = {}) {
        "string" == typeof t && (t = {
            encoding: t
        });
        const r = t.fs || So, n = !("throws" in t) || t.throws;
        try {
            let n = r.readFileSync(e, t);
            return n = Fo(n), JSON.parse(n, t.reviver);
        } catch (t) {
            if (n) {
                throw t.message = `${e}: ${t.message}`, t;
            }
            return null;
        }
    },
    writeFile: Io,
    writeFileSync: function(e, t, r = {}) {
        const n = r.fs || So, o = wo(t, r);
        return n.writeFileSync(e, o, r);
    }
};

var To = {
    readJson: Ro.readFile,
    readJsonSync: Ro.readFileSync,
    writeJson: Ro.writeFile,
    writeJsonSync: Ro.writeFileSync
};

const Lo = pr.fromPromise, jo = dr, No = r, xo = Xr, ko = Qr.pathExists;

var Bo = {
    outputFile: Lo(async function(e, t, r = "utf-8") {
        const n = No.dirname(e);
        return await ko(n) || await xo.mkdirs(n), jo.writeFile(e, t, r);
    }),
    outputFileSync: function(e, ...t) {
        const r = No.dirname(e);
        jo.existsSync(r) || xo.mkdirsSync(r), jo.writeFileSync(e, ...t);
    }
};

const {stringify: $o} = Co, {outputFile: Ho} = Bo;

var Uo = async function(e, t, r = {}) {
    const n = $o(t, r);
    await Ho(e, n, r);
};

const {stringify: Go} = Co, {outputFileSync: Vo} = Bo;

var Wo = function(e, t, r) {
    const n = Go(t, r);
    Vo(e, n, r);
};

const zo = pr.fromPromise, Jo = To;

Jo.outputJson = zo(Uo), Jo.outputJsonSync = Wo, Jo.outputJSON = Jo.outputJson, Jo.outputJSONSync = Jo.outputJsonSync, 
Jo.writeJSON = Jo.writeJson, Jo.writeJSONSync = Jo.writeJsonSync, Jo.readJSON = Jo.readJson, 
Jo.readJSONSync = Jo.readJsonSync;

var Ko = Jo;

const qo = dr, Xo = r, {copy: Yo} = Pn, {remove: Zo} = Rn, {mkdirp: Qo} = Xr, {pathExists: ei} = Qr, ti = ln;

var ri = async function(e, t, r = {}) {
    const n = r.overwrite || r.clobber || !1, {srcStat: o, isChangingCase: i = !1} = await ti.checkPaths(e, t, "move", r);
    await ti.checkParentPaths(e, o, t, "move");
    const a = Xo.dirname(t);
    return Xo.parse(a).root !== a && await Qo(a), async function(e, t, r, n) {
        if (!n) {
            if (r) {
                await Zo(t);
            } else if (await ei(t)) {
                throw new Error("dest already exists.");
            }
        }
        try {
            await qo.rename(e, t);
        } catch (n) {
            if ("EXDEV" !== n.code) {
                throw n;
            }
            await async function(e, t, r) {
                const n = {
                    overwrite: r,
                    errorOnExist: !0,
                    preserveTimestamps: !0
                };
                return await Yo(e, t, n), Zo(e);
            }(e, t, r);
        }
    }(e, t, n, i);
};

const ni = jr, oi = r, ii = Pn.copySync, ai = Rn.removeSync, ui = Xr.mkdirpSync, si = ln;

function li(e, t, r) {
    try {
        ni.renameSync(e, t);
    } catch (n) {
        if ("EXDEV" !== n.code) {
            throw n;
        }
        return function(e, t, r) {
            const n = {
                overwrite: r,
                errorOnExist: !0,
                preserveTimestamps: !0
            };
            return ii(e, t, n), ai(e);
        }(e, t, r);
    }
}

var ci = function(e, t, r) {
    const n = (r = r || {}).overwrite || r.clobber || !1, {srcStat: o, isChangingCase: i = !1} = si.checkPathsSync(e, t, "move", r);
    return si.checkParentPathsSync(e, o, t, "move"), function(e) {
        const t = oi.dirname(e);
        return oi.parse(t).root === t;
    }(t) || ui(oi.dirname(t)), function(e, t, r, n) {
        if (n) {
            return li(e, t, r);
        }
        if (r) {
            return ai(t), li(e, t, r);
        }
        if (ni.existsSync(t)) {
            throw new Error("dest already exists.");
        }
        return li(e, t, r);
    }(e, t, n, i);
};

var fi = {
    move: (0, pr.fromPromise)(ri),
    moveSync: ci
}, di = {
    ...dr,
    ...Pn,
    ...$n,
    ...Ao,
    ...Ko,
    ...Xr,
    ...fi,
    ...Bo,
    ...Qr,
    ...Rn
}, pi = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(fr, "__esModule", {
    value: !0
}), fr.getHvigorUserHomeCacheDir = void 0;

const vi = pi(di), hi = pi(a), gi = pi(r), yi = sr;

fr.getHvigorUserHomeCacheDir = function() {
    const e = gi.default.resolve(hi.default.homedir(), yi.HVIGOR_USER_HOME_DIR_NAME), t = process.env.HVIGOR_USER_HOME;
    return void 0 !== t && gi.default.isAbsolute(t) ? (vi.default.ensureDirSync(t), 
    t) : e;
}, function(e) {
    var t = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.HVIGOR_CONFIG_SCHEMA_PATH = e.HVIGOR_PROJECT_WRAPPER_HOME = e.HVIGOR_PROJECT_ROOT_DIR = e.HVIGOR_PROJECT_CACHES_HOME = e.HVIGOR_PNPM_STORE_PATH = e.HVIGOR_WRAPPER_PNPM_SCRIPT_PATH = e.HVIGOR_WRAPPER_TOOLS_HOME = e.HVIGOR_USER_HOME = void 0;
    const n = t(r), o = fr, i = sr;
    e.HVIGOR_USER_HOME = (0, o.getHvigorUserHomeCacheDir)(), e.HVIGOR_WRAPPER_TOOLS_HOME = n.default.resolve(e.HVIGOR_USER_HOME, "wrapper", "tools"), 
    e.HVIGOR_WRAPPER_PNPM_SCRIPT_PATH = n.default.resolve(e.HVIGOR_WRAPPER_TOOLS_HOME, "node_modules", ".bin", i.PNPM_TOOL), 
    e.HVIGOR_PNPM_STORE_PATH = n.default.resolve(e.HVIGOR_USER_HOME, "caches"), e.HVIGOR_PROJECT_CACHES_HOME = n.default.resolve(e.HVIGOR_USER_HOME, i.PROJECT_CACHES), 
    e.HVIGOR_PROJECT_ROOT_DIR = process.cwd(), e.HVIGOR_PROJECT_WRAPPER_HOME = n.default.resolve(e.HVIGOR_PROJECT_ROOT_DIR, i.HVIGOR), 
    e.HVIGOR_CONFIG_SCHEMA_PATH = n.default.resolve(__dirname, "../../../res/hvigor-config-schema.json");
}(cr);

var mi, Ei, _i, Di, bi, Oi = {}, Ai = {}, Ci = {
    exports: {}
}, Si = {
    exports: {}
};

function Mi() {
    if (Ei) {
        return mi;
    }
    Ei = 1;
    var e = 1e3, t = 60 * e, r = 60 * t, n = 24 * r, o = 7 * n, i = 365.25 * n;
    function a(e, t, r, n) {
        var o = t >= 1.5 * r;
        return Math.round(e / r) + " " + n + (o ? "s" : "");
    }
    return mi = function(u, s) {
        s = s || {};
        var l = typeof u;
        if ("string" === l && u.length > 0) {
            return function(a) {
                if ((a = String(a)).length > 100) {
                    return;
                }
                var u = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(a);
                if (!u) {
                    return;
                }
                var s = parseFloat(u[1]);
                switch ((u[2] || "ms").toLowerCase()) {
                  case "years":
                  case "year":
                  case "yrs":
                  case "yr":
                  case "y":
                    return s * i;

                  case "weeks":
                  case "week":
                  case "w":
                    return s * o;

                  case "days":
                  case "day":
                  case "d":
                    return s * n;

                  case "hours":
                  case "hour":
                  case "hrs":
                  case "hr":
                  case "h":
                    return s * r;

                  case "minutes":
                  case "minute":
                  case "mins":
                  case "min":
                  case "m":
                    return s * t;

                  case "seconds":
                  case "second":
                  case "secs":
                  case "sec":
                  case "s":
                    return s * e;

                  case "milliseconds":
                  case "millisecond":
                  case "msecs":
                  case "msec":
                  case "ms":
                    return s;

                  default:
                    return;
                }
            }(u);
        }
        if ("number" === l && isFinite(u)) {
            return s.long ? function(o) {
                var i = Math.abs(o);
                if (i >= n) {
                    return a(o, i, n, "day");
                }
                if (i >= r) {
                    return a(o, i, r, "hour");
                }
                if (i >= t) {
                    return a(o, i, t, "minute");
                }
                if (i >= e) {
                    return a(o, i, e, "second");
                }
                return o + " ms";
            }(u) : function(o) {
                var i = Math.abs(o);
                if (i >= n) {
                    return Math.round(o / n) + "d";
                }
                if (i >= r) {
                    return Math.round(o / r) + "h";
                }
                if (i >= t) {
                    return Math.round(o / t) + "m";
                }
                if (i >= e) {
                    return Math.round(o / e) + "s";
                }
                return o + "ms";
            }(u);
        }
        throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(u));
    }, mi;
}

function wi() {
    if (Di) {
        return _i;
    }
    return Di = 1, _i = function(e) {
        function t(e) {
            let n, o, i, a = null;
            function u(...e) {
                if (!u.enabled) {
                    return;
                }
                const r = u, o = Number(new Date), i = o - (n || o);
                r.diff = i, r.prev = n, r.curr = o, n = o, e[0] = t.coerce(e[0]), "string" != typeof e[0] && e.unshift("%O");
                let a = 0;
                e[0] = e[0].replace(/%([a-zA-Z%])/g, (n, o) => {
                    if ("%%" === n) {
                        return "%";
                    }
                    a++;
                    const i = t.formatters[o];
                    if ("function" == typeof i) {
                        const t = e[a];
                        n = i.call(r, t), e.splice(a, 1), a--;
                    }
                    return n;
                }), t.formatArgs.call(r, e);
                (r.log || t.log).apply(r, e);
            }
            return u.namespace = e, u.useColors = t.useColors(), u.color = t.selectColor(e), 
            u.extend = r, u.destroy = t.destroy, Object.defineProperty(u, "enabled", {
                enumerable: !0,
                configurable: !1,
                get: () => null !== a ? a : (o !== t.namespaces && (o = t.namespaces, i = t.enabled(e)), 
                i),
                set: e => {
                    a = e;
                }
            }), "function" == typeof t.init && t.init(u), u;
        }
        function r(e, r) {
            const n = t(this.namespace + (void 0 === r ? ":" : r) + e);
            return n.log = this.log, n;
        }
        function n(e, t) {
            let r = 0, n = 0, o = -1, i = 0;
            for (;r < e.length; ) {
                if (n < t.length && (t[n] === e[r] || "*" === t[n])) {
                    "*" === t[n] ? (o = n, i = r, n++) : (r++, n++);
                } else {
                    if (-1 === o) {
                        return !1;
                    }
                    n = o + 1, i++, r = i;
                }
            }
            for (;n < t.length && "*" === t[n]; ) {
                n++;
            }
            return n === t.length;
        }
        return t.debug = t, t.default = t, t.coerce = function(e) {
            if (e instanceof Error) {
                return e.stack || e.message;
            }
            return e;
        }, t.disable = function() {
            const e = [ ...t.names, ...t.skips.map(e => "-" + e) ].join(",");
            return t.enable(""), e;
        }, t.enable = function(e) {
            t.save(e), t.namespaces = e, t.names = [], t.skips = [];
            const r = ("string" == typeof e ? e : "").trim().replace(" ", ",").split(",").filter(Boolean);
            for (const e of r) {
                "-" === e[0] ? t.skips.push(e.slice(1)) : t.names.push(e);
            }
        }, t.enabled = function(e) {
            for (const r of t.skips) {
                if (n(e, r)) {
                    return !1;
                }
            }
            for (const r of t.names) {
                if (n(e, r)) {
                    return !0;
                }
            }
            return !1;
        }, t.humanize = Mi(), t.destroy = function() {
            console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }, Object.keys(e).forEach(r => {
            t[r] = e[r];
        }), t.names = [], t.skips = [], t.formatters = {}, t.selectColor = function(e) {
            let r = 0;
            for (let t = 0; t < e.length; t++) {
                r = (r << 5) - r + e.charCodeAt(t), r |= 0;
            }
            return t.colors[Math.abs(r) % t.colors.length];
        }, t.enable(t.load()), t;
    }, _i;
}

var Fi, Pi, Ii, Ri, Ti, Li = {
    exports: {}
};

function ji() {
    return Pi ? Fi : (Pi = 1, Fi = (e, t = process.argv) => {
        const r = e.startsWith("-") ? "" : 1 === e.length ? "-" : "--", n = t.indexOf(r + e), o = t.indexOf("--");
        return -1 !== n && (-1 === o || n < o);
    });
}

"undefined" == typeof process || "renderer" === process.type || !0 === process.browser || process.__nwjs ? Ci.exports = (bi || (bi = 1, 
function(e, t) {
    t.formatArgs = function(t) {
        if (t[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + t[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), 
        !this.useColors) {
            return;
        }
        const r = "color: " + this.color;
        t.splice(1, 0, r, "color: inherit");
        let n = 0, o = 0;
        t[0].replace(/%[a-zA-Z%]/g, e => {
            "%%" !== e && (n++, "%c" === e && (o = n));
        }), t.splice(o, 0, r);
    }, t.save = function(e) {
        try {
            e ? t.storage.setItem("debug", e) : t.storage.removeItem("debug");
        } catch (e) {}
    }, t.load = function() {
        let e;
        try {
            e = t.storage.getItem("debug");
        } catch (e) {}
        return !e && "undefined" != typeof process && "env" in process && (e = process.env.DEBUG), 
        e;
    }, t.useColors = function() {
        if ("undefined" != typeof window && window.process && ("renderer" === window.process.type || window.process.__nwjs)) {
            return !0;
        }
        if ("undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
            return !1;
        }
        let e;
        return "undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || "undefined" != typeof navigator && navigator.userAgent && (e = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(e[1], 10) >= 31 || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }, t.storage = function() {
        try {
            return localStorage;
        } catch (e) {}
    }(), t.destroy = (() => {
        let e = !1;
        return () => {
            e || (e = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
        };
    })(), t.colors = [ "#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33" ], 
    t.log = console.debug || console.log || (() => {}), e.exports = wi()(t);
    const {formatters: r} = e.exports;
    r.j = function(e) {
        try {
            return JSON.stringify(e);
        } catch (e) {
            return "[UnexpectedJSONParseError]: " + e.message;
        }
    };
}(Si, Si.exports)), Si.exports) : Ci.exports = (Ti || (Ti = 1, function(e, t) {
    const r = f, n = l;
    t.init = function(e) {
        e.inspectOpts = {};
        const r = Object.keys(t.inspectOpts);
        for (let n = 0; n < r.length; n++) {
            e.inspectOpts[r[n]] = t.inspectOpts[r[n]];
        }
    }, t.log = function(...e) {
        return process.stderr.write(n.formatWithOptions(t.inspectOpts, ...e) + "\n");
    }, t.formatArgs = function(r) {
        const {namespace: n, useColors: o} = this;
        if (o) {
            const t = this.color, o = "[3" + (t < 8 ? t : "8;5;" + t), i = `  ${o};1m${n} [0m`;
            r[0] = i + r[0].split("\n").join("\n" + i), r.push(o + "m+" + e.exports.humanize(this.diff) + "[0m");
        } else {
            r[0] = (t.inspectOpts.hideDate ? "" : (new Date).toISOString() + " ") + n + " " + r[0];
        }
    }, t.save = function(e) {
        e ? process.env.DEBUG = e : delete process.env.DEBUG;
    }, t.load = function() {
        return process.env.DEBUG;
    }, t.useColors = function() {
        return "colors" in t.inspectOpts ? Boolean(t.inspectOpts.colors) : r.isatty(process.stderr.fd);
    }, t.destroy = n.deprecate(() => {}, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."), 
    t.colors = [ 6, 2, 3, 4, 5, 1 ];
    try {
        const e = function() {
            if (Ri) {
                return Ii;
            }
            Ri = 1;
            const e = a, t = f, r = ji(), {env: n} = process;
            let o;
            function i(e) {
                return 0 !== e && {
                    level: e,
                    hasBasic: !0,
                    has256: e >= 2,
                    has16m: e >= 3
                };
            }
            function u(t, i) {
                if (0 === o) {
                    return 0;
                }
                if (r("color=16m") || r("color=full") || r("color=truecolor")) {
                    return 3;
                }
                if (r("color=256")) {
                    return 2;
                }
                if (t && !i && void 0 === o) {
                    return 0;
                }
                const a = o || 0;
                if ("dumb" === n.TERM) {
                    return a;
                }
                if ("win32" === process.platform) {
                    const t = e.release().split(".");
                    return Number(t[0]) >= 10 && Number(t[2]) >= 10586 ? Number(t[2]) >= 14931 ? 3 : 2 : 1;
                }
                if ("CI" in n) {
                    return [ "TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE" ].some(e => e in n) || "codeship" === n.CI_NAME ? 1 : a;
                }
                if ("TEAMCITY_VERSION" in n) {
                    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(n.TEAMCITY_VERSION) ? 1 : 0;
                }
                if ("truecolor" === n.COLORTERM) {
                    return 3;
                }
                if ("TERM_PROGRAM" in n) {
                    const e = parseInt((n.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
                    switch (n.TERM_PROGRAM) {
                      case "iTerm.app":
                        return e >= 3 ? 3 : 2;

                      case "Apple_Terminal":
                        return 2;
                    }
                }
                return /-256(color)?$/i.test(n.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(n.TERM) || "COLORTERM" in n ? 1 : a;
            }
            return r("no-color") || r("no-colors") || r("color=false") || r("color=never") ? o = 0 : (r("color") || r("colors") || r("color=true") || r("color=always")) && (o = 1), 
            "FORCE_COLOR" in n && (o = "true" === n.FORCE_COLOR ? 1 : "false" === n.FORCE_COLOR ? 0 : 0 === n.FORCE_COLOR.length ? 1 : Math.min(parseInt(n.FORCE_COLOR, 10), 3)), 
            Ii = {
                supportsColor: function(e) {
                    return i(u(e, e && e.isTTY));
                },
                stdout: i(u(!0, t.isatty(1))),
                stderr: i(u(!0, t.isatty(2)))
            };
        }();
        e && (e.stderr || e).level >= 2 && (t.colors = [ 20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221 ]);
    } catch (e) {}
    t.inspectOpts = Object.keys(process.env).filter(e => /^debug_/i.test(e)).reduce((e, t) => {
        const r = t.substring(6).toLowerCase().replace(/_([a-z])/g, (e, t) => t.toUpperCase());
        let n = process.env[t];
        return n = !!/^(yes|on|true|enabled)$/i.test(n) || !/^(no|off|false|disabled)$/i.test(n) && ("null" === n ? null : Number(n)), 
        e[r] = n, e;
    }, {}), e.exports = wi()(t);
    const {formatters: o} = e.exports;
    o.o = function(e) {
        return this.inspectOpts.colors = this.useColors, n.inspect(e, this.inspectOpts).split("\n").map(e => e.trim()).join(" ");
    }, o.O = function(e) {
        return this.inspectOpts.colors = this.useColors, n.inspect(e, this.inspectOpts);
    };
}(Li, Li.exports)), Li.exports);

var Ni = Ci.exports, xi = function(e) {
    return (e = e || {}).circles ? function(e) {
        var t = [], r = [];
        return e.proto ? function e(o) {
            if ("object" != typeof o || null === o) {
                return o;
            }
            if (o instanceof Date) {
                return new Date(o);
            }
            if (Array.isArray(o)) {
                return n(o, e);
            }
            if (o instanceof Map) {
                return new Map(n(Array.from(o), e));
            }
            if (o instanceof Set) {
                return new Set(n(Array.from(o), e));
            }
            var i = {};
            for (var a in t.push(o), r.push(i), o) {
                var u = o[a];
                if ("object" != typeof u || null === u) {
                    i[a] = u;
                } else if (u instanceof Date) {
                    i[a] = new Date(u);
                } else if (u instanceof Map) {
                    i[a] = new Map(n(Array.from(u), e));
                } else if (u instanceof Set) {
                    i[a] = new Set(n(Array.from(u), e));
                } else if (ArrayBuffer.isView(u)) {
                    i[a] = ki(u);
                } else {
                    var s = t.indexOf(u);
                    i[a] = -1 !== s ? r[s] : e(u);
                }
            }
            return t.pop(), r.pop(), i;
        } : function e(o) {
            if ("object" != typeof o || null === o) {
                return o;
            }
            if (o instanceof Date) {
                return new Date(o);
            }
            if (Array.isArray(o)) {
                return n(o, e);
            }
            if (o instanceof Map) {
                return new Map(n(Array.from(o), e));
            }
            if (o instanceof Set) {
                return new Set(n(Array.from(o), e));
            }
            var i = {};
            for (var a in t.push(o), r.push(i), o) {
                if (!1 !== Object.hasOwnProperty.call(o, a)) {
                    var u = o[a];
                    if ("object" != typeof u || null === u) {
                        i[a] = u;
                    } else if (u instanceof Date) {
                        i[a] = new Date(u);
                    } else if (u instanceof Map) {
                        i[a] = new Map(n(Array.from(u), e));
                    } else if (u instanceof Set) {
                        i[a] = new Set(n(Array.from(u), e));
                    } else if (ArrayBuffer.isView(u)) {
                        i[a] = ki(u);
                    } else {
                        var s = t.indexOf(u);
                        i[a] = -1 !== s ? r[s] : e(u);
                    }
                }
            }
            return t.pop(), r.pop(), i;
        };
        function n(e, n) {
            for (var o = Object.keys(e), i = new Array(o.length), a = 0; a < o.length; a++) {
                var u = o[a], s = e[u];
                if ("object" != typeof s || null === s) {
                    i[u] = s;
                } else if (s instanceof Date) {
                    i[u] = new Date(s);
                } else if (ArrayBuffer.isView(s)) {
                    i[u] = ki(s);
                } else {
                    var l = t.indexOf(s);
                    i[u] = -1 !== l ? r[l] : n(s);
                }
            }
            return i;
        }
    }(e) : e.proto ? function e(r) {
        if ("object" != typeof r || null === r) {
            return r;
        }
        if (r instanceof Date) {
            return new Date(r);
        }
        if (Array.isArray(r)) {
            return t(r, e);
        }
        if (r instanceof Map) {
            return new Map(t(Array.from(r), e));
        }
        if (r instanceof Set) {
            return new Set(t(Array.from(r), e));
        }
        var n = {};
        for (var o in r) {
            var i = r[o];
            "object" != typeof i || null === i ? n[o] = i : i instanceof Date ? n[o] = new Date(i) : i instanceof Map ? n[o] = new Map(t(Array.from(i), e)) : i instanceof Set ? n[o] = new Set(t(Array.from(i), e)) : ArrayBuffer.isView(i) ? n[o] = ki(i) : n[o] = e(i);
        }
        return n;
    } : r;
    function t(e, t) {
        for (var r = Object.keys(e), n = new Array(r.length), o = 0; o < r.length; o++) {
            var i = r[o], a = e[i];
            "object" != typeof a || null === a ? n[i] = a : a instanceof Date ? n[i] = new Date(a) : ArrayBuffer.isView(a) ? n[i] = ki(a) : n[i] = t(a);
        }
        return n;
    }
    function r(e) {
        if ("object" != typeof e || null === e) {
            return e;
        }
        if (e instanceof Date) {
            return new Date(e);
        }
        if (Array.isArray(e)) {
            return t(e, r);
        }
        if (e instanceof Map) {
            return new Map(t(Array.from(e), r));
        }
        if (e instanceof Set) {
            return new Set(t(Array.from(e), r));
        }
        var n = {};
        for (var o in e) {
            if (!1 !== Object.hasOwnProperty.call(e, o)) {
                var i = e[o];
                "object" != typeof i || null === i ? n[o] = i : i instanceof Date ? n[o] = new Date(i) : i instanceof Map ? n[o] = new Map(t(Array.from(i), r)) : i instanceof Set ? n[o] = new Set(t(Array.from(i), r)) : ArrayBuffer.isView(i) ? n[o] = ki(i) : n[o] = r(i);
            }
        }
        return n;
    }
};

function ki(e) {
    return e instanceof Buffer ? Buffer.from(e) : new e.constructor(e.buffer.slice(), e.byteOffset, e.length);
}

const Bi = l, $i = Ni("log4js:configuration"), Hi = [], Ui = [], Gi = e => !e, Vi = e => e && "object" == typeof e && !Array.isArray(e), Wi = (e, t, r) => {
    (Array.isArray(t) ? t : [ t ]).forEach(t => {
        if (t) {
            throw new Error(`Problem with log4js configuration: (${Bi.inspect(e, {
                depth: 5
            })}) - ${r}`);
        }
    });
};

var zi = {
    configure: e => {
        $i("New configuration to be validated: ", e), Wi(e, Gi(Vi(e)), "must be an object."), 
        $i(`Calling pre-processing listeners (${Hi.length})`), Hi.forEach(t => t(e)), $i("Configuration pre-processing finished."), 
        $i(`Calling configuration listeners (${Ui.length})`), Ui.forEach(t => t(e)), $i("Configuration finished.");
    },
    addListener: e => {
        Ui.push(e), $i(`Added listener, now ${Ui.length} listeners`);
    },
    addPreProcessingListener: e => {
        Hi.push(e), $i(`Added pre-processing listener, now ${Hi.length} listeners`);
    },
    throwExceptionIf: Wi,
    anObject: Vi,
    anInteger: e => e && "number" == typeof e && Number.isInteger(e),
    validIdentifier: e => /^[A-Za-z][A-Za-z0-9_]*$/g.test(e),
    not: Gi
}, Ji = {
    exports: {}
};

!function(e) {
    function t(e, t) {
        for (var r = e.toString(); r.length < t; ) {
            r = "0" + r;
        }
        return r;
    }
    function r(e) {
        return t(e, 2);
    }
    function n(n, o) {
        "string" != typeof n && (o = n, n = e.exports.ISO8601_FORMAT), o || (o = e.exports.now());
        var i = r(o.getDate()), a = r(o.getMonth() + 1), u = r(o.getFullYear()), s = r(u.substring(2, 4)), l = n.indexOf("yyyy") > -1 ? u : s, c = r(o.getHours()), f = r(o.getMinutes()), d = r(o.getSeconds()), p = t(o.getMilliseconds(), 3), v = function(e) {
            var t = Math.abs(e), r = String(Math.floor(t / 60)), n = String(t % 60);
            return r = ("0" + r).slice(-2), n = ("0" + n).slice(-2), 0 === e ? "Z" : (e < 0 ? "+" : "-") + r + ":" + n;
        }(o.getTimezoneOffset());
        return n.replace(/dd/g, i).replace(/MM/g, a).replace(/y{1,4}/g, l).replace(/hh/g, c).replace(/mm/g, f).replace(/ss/g, d).replace(/SSS/g, p).replace(/O/g, v);
    }
    function o(e, t, r, n) {
        e["set" + (n ? "" : "UTC") + t](r);
    }
    e.exports = n, e.exports.asString = n, e.exports.parse = function(t, r, n) {
        if (!t) {
            throw new Error("pattern must be supplied");
        }
        return function(t, r, n) {
            var i = t.indexOf("O") < 0, a = !1, u = [ {
                pattern: /y{1,4}/,
                regexp: "\\d{1,4}",
                fn: function(e, t) {
                    o(e, "FullYear", t, i);
                }
            }, {
                pattern: /MM/,
                regexp: "\\d{1,2}",
                fn: function(e, t) {
                    o(e, "Month", t - 1, i), e.getMonth() !== t - 1 && (a = !0);
                }
            }, {
                pattern: /dd/,
                regexp: "\\d{1,2}",
                fn: function(e, t) {
                    a && o(e, "Month", e.getMonth() - 1, i), o(e, "Date", t, i);
                }
            }, {
                pattern: /hh/,
                regexp: "\\d{1,2}",
                fn: function(e, t) {
                    o(e, "Hours", t, i);
                }
            }, {
                pattern: /mm/,
                regexp: "\\d\\d",
                fn: function(e, t) {
                    o(e, "Minutes", t, i);
                }
            }, {
                pattern: /ss/,
                regexp: "\\d\\d",
                fn: function(e, t) {
                    o(e, "Seconds", t, i);
                }
            }, {
                pattern: /SSS/,
                regexp: "\\d\\d\\d",
                fn: function(e, t) {
                    o(e, "Milliseconds", t, i);
                }
            }, {
                pattern: /O/,
                regexp: "[+-]\\d{1,2}:?\\d{2}?|Z",
                fn: function(e, t) {
                    t = "Z" === t ? 0 : t.replace(":", "");
                    var r = Math.abs(t), n = (t > 0 ? -1 : 1) * (r % 100 + 60 * Math.floor(r / 100));
                    e.setUTCMinutes(e.getUTCMinutes() + n);
                }
            } ], s = u.reduce(function(e, t) {
                return t.pattern.test(e.regexp) ? (t.index = e.regexp.match(t.pattern).index, e.regexp = e.regexp.replace(t.pattern, "(" + t.regexp + ")")) : t.index = -1, 
                e;
            }, {
                regexp: t,
                index: []
            }), l = u.filter(function(e) {
                return e.index > -1;
            });
            l.sort(function(e, t) {
                return e.index - t.index;
            });
            var c = new RegExp(s.regexp).exec(r);
            if (c) {
                var f = n || e.exports.now();
                return l.forEach(function(e, t) {
                    e.fn(f, c[t + 1]);
                }), f;
            }
            throw new Error("String '" + r + "' could not be parsed as '" + t + "'");
        }(t, r, n);
    }, e.exports.now = function() {
        return new Date;
    }, e.exports.ISO8601_FORMAT = "yyyy-MM-ddThh:mm:ss.SSS", e.exports.ISO8601_WITH_TZ_OFFSET_FORMAT = "yyyy-MM-ddThh:mm:ss.SSSO", 
    e.exports.DATETIME_FORMAT = "dd MM yyyy hh:mm:ss.SSS", e.exports.ABSOLUTETIME_FORMAT = "hh:mm:ss.SSS";
}(Ji);

var Ki = Ji.exports;

const qi = Ki, Xi = a, Yi = l, Zi = r, Qi = d, ea = Ni("log4js:layouts"), ta = {
    bold: [ 1, 22 ],
    italic: [ 3, 23 ],
    underline: [ 4, 24 ],
    inverse: [ 7, 27 ],
    white: [ 37, 39 ],
    grey: [ 90, 39 ],
    black: [ 90, 39 ],
    blue: [ 34, 39 ],
    cyan: [ 36, 39 ],
    green: [ 32, 39 ],
    magenta: [ 35, 39 ],
    red: [ 91, 39 ],
    yellow: [ 33, 39 ]
};

function ra(e) {
    return e ? `[${ta[e][0]}m` : "";
}

function na(e) {
    return e ? `[${ta[e][1]}m` : "";
}

function oa(e, t) {
    return r = Yi.format("[%s] [%s] %s - ", qi.asString(e.startTime), e.level.toString(), e.categoryName), 
    ra(n = t) + r + na(n);
    var r, n;
}

function ia(e) {
    return oa(e) + Yi.format(...e.data);
}

function aa(e) {
    return oa(e, e.level.colour) + Yi.format(...e.data);
}

function ua(e) {
    return Yi.format(...e.data);
}

function sa(e) {
    return e.data[0];
}

function la(e, t) {
    const r = /%(-?[0-9]+)?(\.?-?[0-9]+)?([[\]cdhmnprzxXyflosCMAF%])(\{([^}]+)\})?|([^%]+)/;
    function n(e) {
        return e && e.pid ? e.pid.toString() : process.pid.toString();
    }
    e = e || "%r %p %c - %m%n";
    const o = {
        c: function(e, t) {
            let r = e.categoryName;
            if (t) {
                const e = parseInt(t, 10), n = r.split(".");
                e < n.length && (r = n.slice(n.length - e).join("."));
            }
            return r;
        },
        d: function(e, t) {
            let r = qi.ISO8601_FORMAT;
            if (t) {
                switch (r = t, r) {
                  case "ISO8601":
                  case "ISO8601_FORMAT":
                    r = qi.ISO8601_FORMAT;
                    break;

                  case "ISO8601_WITH_TZ_OFFSET":
                  case "ISO8601_WITH_TZ_OFFSET_FORMAT":
                    r = qi.ISO8601_WITH_TZ_OFFSET_FORMAT;
                    break;

                  case "ABSOLUTE":
                    process.emitWarning("Pattern %d{ABSOLUTE} is deprecated in favor of %d{ABSOLUTETIME}. Please use %d{ABSOLUTETIME} instead.", "DeprecationWarning", "log4js-node-DEP0003"), 
                    ea("[log4js-node-DEP0003]", "DEPRECATION: Pattern %d{ABSOLUTE} is deprecated and replaced by %d{ABSOLUTETIME}.");

                  case "ABSOLUTETIME":
                  case "ABSOLUTETIME_FORMAT":
                    r = qi.ABSOLUTETIME_FORMAT;
                    break;

                  case "DATE":
                    process.emitWarning("Pattern %d{DATE} is deprecated due to the confusion it causes when used. Please use %d{DATETIME} instead.", "DeprecationWarning", "log4js-node-DEP0004"), 
                    ea("[log4js-node-DEP0004]", "DEPRECATION: Pattern %d{DATE} is deprecated and replaced by %d{DATETIME}.");

                  case "DATETIME":
                  case "DATETIME_FORMAT":
                    r = qi.DATETIME_FORMAT;
                }
            }
            return qi.asString(r, e.startTime);
        },
        h: function() {
            return Xi.hostname().toString();
        },
        m: function(e) {
            return Yi.format(...e.data);
        },
        n: function() {
            return Xi.EOL;
        },
        p: function(e) {
            return e.level.toString();
        },
        r: function(e) {
            return qi.asString("hh:mm:ss", e.startTime);
        },
        "[": function(e) {
            return ra(e.level.colour);
        },
        "]": function(e) {
            return na(e.level.colour);
        },
        y: function() {
            return n();
        },
        z: n,
        "%": function() {
            return "%";
        },
        x: function(e, r) {
            return void 0 !== t[r] ? "function" == typeof t[r] ? t[r](e) : t[r] : null;
        },
        X: function(e, t) {
            const r = e.context[t];
            return void 0 !== r ? "function" == typeof r ? r(e) : r : null;
        },
        f: function(e, t) {
            let r = e.fileName || "";
            if (r = function(e) {
                const t = "file://";
                return e.startsWith(t) && ("function" == typeof Qi.fileURLToPath ? e = Qi.fileURLToPath(e) : (e = Zi.normalize(e.replace(new RegExp(`^${t}`), "")), 
                "win32" === process.platform && (e = e.startsWith("\\") ? e.slice(1) : Zi.sep + Zi.sep + e))), 
                e;
            }(r), t) {
                const e = parseInt(t, 10), n = r.split(Zi.sep);
                n.length > e && (r = n.slice(-e).join(Zi.sep));
            }
            return r;
        },
        l: function(e) {
            return e.lineNumber ? `${e.lineNumber}` : "";
        },
        o: function(e) {
            return e.columnNumber ? `${e.columnNumber}` : "";
        },
        s: function(e) {
            return e.callStack || "";
        },
        C: function(e) {
            return e.className || "";
        },
        M: function(e) {
            return e.functionName || "";
        },
        A: function(e) {
            return e.functionAlias || "";
        },
        F: function(e) {
            return e.callerName || "";
        }
    };
    function i(e, t, r) {
        return o[e](t, r);
    }
    function a(e, t, r) {
        let n = e;
        return n = function(e, t) {
            let r;
            return e ? (r = parseInt(e.slice(1), 10), r > 0 ? t.slice(0, r) : t.slice(r)) : t;
        }(t, n), n = function(e, t) {
            let r;
            if (e) {
                if ("-" === e.charAt(0)) {
                    for (r = parseInt(e.slice(1), 10); t.length < r; ) {
                        t += " ";
                    }
                } else {
                    for (r = parseInt(e, 10); t.length < r; ) {
                        t = ` ${t}`;
                    }
                }
            }
            return t;
        }(r, n), n;
    }
    return function(t) {
        let n, o = "", u = e;
        for (;null !== (n = r.exec(u)); ) {
            const e = n[1], r = n[2], s = n[3], l = n[5], c = n[6];
            if (c) {
                o += c.toString();
            } else {
                o += a(i(s, t, l), r, e);
            }
            u = u.slice(n.index + n[0].length);
        }
        return o;
    };
}

const ca = {
    messagePassThrough: () => ua,
    basic: () => ia,
    colored: () => aa,
    coloured: () => aa,
    pattern: e => la(e && e.pattern, e && e.tokens),
    dummy: () => sa
};

var fa = {
    basicLayout: ia,
    messagePassThroughLayout: ua,
    patternLayout: la,
    colouredLayout: aa,
    coloredLayout: aa,
    dummyLayout: sa,
    addLayout(e, t) {
        ca[e] = t;
    },
    layout: (e, t) => ca[e] && ca[e](t)
};

const da = zi, pa = [ "white", "grey", "black", "blue", "cyan", "green", "magenta", "red", "yellow" ];

class va {
    constructor(e, t, r) {
        this.level = e, this.levelStr = t, this.colour = r;
    }
    toString() {
        return this.levelStr;
    }
    static getLevel(e, t) {
        return e ? e instanceof va ? e : (e instanceof Object && e.levelStr && (e = e.levelStr), 
        va[e.toString().toUpperCase()] || t) : t;
    }
    static addLevels(e) {
        if (e) {
            Object.keys(e).forEach(t => {
                const r = t.toUpperCase();
                va[r] = new va(e[t].value, r, e[t].colour);
                const n = va.levels.findIndex(e => e.levelStr === r);
                n > -1 ? va.levels[n] = va[r] : va.levels.push(va[r]);
            }), va.levels.sort((e, t) => e.level - t.level);
        }
    }
    isLessThanOrEqualTo(e) {
        return "string" == typeof e && (e = va.getLevel(e)), this.level <= e.level;
    }
    isGreaterThanOrEqualTo(e) {
        return "string" == typeof e && (e = va.getLevel(e)), this.level >= e.level;
    }
    isEqualTo(e) {
        return "string" == typeof e && (e = va.getLevel(e)), this.level === e.level;
    }
}

va.levels = [], va.addLevels({
    ALL: {
        value: Number.MIN_VALUE,
        colour: "grey"
    },
    TRACE: {
        value: 5e3,
        colour: "blue"
    },
    DEBUG: {
        value: 1e4,
        colour: "cyan"
    },
    INFO: {
        value: 2e4,
        colour: "green"
    },
    WARN: {
        value: 3e4,
        colour: "yellow"
    },
    ERROR: {
        value: 4e4,
        colour: "red"
    },
    FATAL: {
        value: 5e4,
        colour: "magenta"
    },
    MARK: {
        value: 9007199254740992,
        colour: "grey"
    },
    OFF: {
        value: Number.MAX_VALUE,
        colour: "grey"
    }
}), da.addListener(e => {
    const t = e.levels;
    if (t) {
        da.throwExceptionIf(e, da.not(da.anObject(t)), "levels must be an object");
        Object.keys(t).forEach(r => {
            da.throwExceptionIf(e, da.not(da.validIdentifier(r)), `level name "${r}" is not a valid identifier (must start with a letter, only contain A-Z,a-z,0-9,_)`), 
            da.throwExceptionIf(e, da.not(da.anObject(t[r])), `level "${r}" must be an object`), 
            da.throwExceptionIf(e, da.not(t[r].value), `level "${r}" must have a 'value' property`), 
            da.throwExceptionIf(e, da.not(da.anInteger(t[r].value)), `level "${r}".value must have an integer value`), 
            da.throwExceptionIf(e, da.not(t[r].colour), `level "${r}" must have a 'colour' property`), 
            da.throwExceptionIf(e, da.not(pa.indexOf(t[r].colour) > -1), `level "${r}".colour must be one of ${pa.join(", ")}`);
        });
    }
}), da.addListener(e => {
    va.addLevels(e.levels);
});

var ha = va, ga = {
    exports: {}
}, ya = {};

/*! (c) 2020 Andrea Giammarchi */
const {parse: ma, stringify: Ea} = JSON, {keys: _a} = Object, Da = String, ba = "string", Oa = {}, Aa = "object", Ca = (e, t) => t, Sa = e => e instanceof Da ? Da(e) : e, Ma = (e, t) => typeof t === ba ? new Da(t) : t, wa = (e, t, r, n) => {
    const o = [];
    for (let i = _a(r), {length: a} = i, u = 0; u < a; u++) {
        const a = i[u], s = r[a];
        if (s instanceof Da) {
            const i = e[s];
            typeof i !== Aa || t.has(i) ? r[a] = n.call(r, a, i) : (t.add(i), r[a] = Oa, o.push({
                k: a,
                a: [ e, t, i, n ]
            }));
        } else {
            r[a] !== Oa && (r[a] = n.call(r, a, s));
        }
    }
    for (let {length: e} = o, t = 0; t < e; t++) {
        const {k: e, a: i} = o[t];
        r[e] = n.call(r, e, wa.apply(null, i));
    }
    return r;
}, Fa = (e, t, r) => {
    const n = Da(t.push(r) - 1);
    return e.set(r, n), n;
}, Pa = (e, t) => {
    const r = ma(e, Ma).map(Sa), n = r[0], o = t || Ca, i = typeof n === Aa && n ? wa(r, new Set, n, o) : n;
    return o.call({
        "": i
    }, "", i);
};

ya.parse = Pa;

const Ia = (e, t, r) => {
    const n = t && typeof t === Aa ? (e, r) => "" === e || -1 < t.indexOf(e) ? r : void 0 : t || Ca, o = new Map, i = [], a = [];
    let u = +Fa(o, i, n.call({
        "": e
    }, "", e)), s = !u;
    for (;u < i.length; ) {
        s = !0, a[u] = Ea(i[u++], l, r);
    }
    return "[" + a.join(",") + "]";
    function l(e, t) {
        if (s) {
            return s = !s, t;
        }
        const r = n.call(this, e, t);
        switch (typeof r) {
          case Aa:
            if (null === r) {
                return r;
            }

          case ba:
            return o.get(r) || Fa(o, i, r);
        }
        return r;
    }
};

ya.stringify = Ia;

ya.toJSON = e => ma(Ia(e));

ya.fromJSON = e => Pa(Ea(e));

const Ra = ya, Ta = ha;

const La = new class {
    constructor() {
        const e = {
            __LOG4JS_undefined__: void 0,
            __LOG4JS_NaN__: Number("abc"),
            __LOG4JS_Infinity__: 1 / 0,
            "__LOG4JS_-Infinity__": -1 / 0
        };
        this.deMap = e, this.serMap = {}, Object.keys(this.deMap).forEach(e => {
            const t = this.deMap[e];
            this.serMap[t] = e;
        });
    }
    canSerialise(e) {
        return "string" != typeof e && e in this.serMap;
    }
    serialise(e) {
        return this.canSerialise(e) ? this.serMap[e] : e;
    }
    canDeserialise(e) {
        return e in this.deMap;
    }
    deserialise(e) {
        return this.canDeserialise(e) ? this.deMap[e] : e;
    }
};

var ja = class e {
    constructor(e, t, r, n, o, i) {
        if (this.startTime = new Date, this.categoryName = e, this.data = r, this.level = t, 
        this.context = Object.assign({}, n), this.pid = process.pid, this.error = i, void 0 !== o) {
            if (!o || "object" != typeof o || Array.isArray(o)) {
                throw new TypeError("Invalid location type passed to LoggingEvent constructor");
            }
            this.constructor._getLocationKeys().forEach(e => {
                void 0 !== o[e] && (this[e] = o[e]);
            });
        }
    }
    static _getLocationKeys() {
        return [ "fileName", "lineNumber", "columnNumber", "callStack", "className", "functionName", "functionAlias", "callerName" ];
    }
    serialise() {
        return Ra.stringify(this, (e, t) => (t instanceof Error && (t = Object.assign({
            message: t.message,
            stack: t.stack
        }, t)), La.serialise(t)));
    }
    static deserialise(t) {
        let r;
        try {
            const n = Ra.parse(t, (e, t) => {
                if (t && t.message && t.stack) {
                    const e = new Error(t);
                    Object.keys(t).forEach(r => {
                        e[r] = t[r];
                    }), t = e;
                }
                return La.deserialise(t);
            });
            this._getLocationKeys().forEach(e => {
                void 0 !== n[e] && (n.location || (n.location = {}), n.location[e] = n[e]);
            }), r = new e(n.categoryName, Ta.getLevel(n.level.levelStr), n.data, n.context, n.location, n.error), 
            r.startTime = new Date(n.startTime), r.pid = n.pid, n.cluster && (r.cluster = n.cluster);
        } catch (n) {
            r = new e("log4js", Ta.ERROR, [ "Unable to parse log:", t, "because: ", n ]);
        }
        return r;
    }
};

const Na = Ni("log4js:clustering"), xa = ja, ka = zi;

let Ba = !1, $a = null;

try {
    $a = require("cluster");
} catch (e) {
    Na("cluster module not present"), Ba = !0;
}

const Ha = [];

let Ua = !1, Ga = "NODE_APP_INSTANCE";

const Va = () => Ua && "0" === process.env[Ga], Wa = () => Ba || $a && $a.isMaster || Va(), za = e => {
    Ha.forEach(t => t(e));
}, Ja = (e, t) => {
    if (Na("cluster message received from worker ", e, ": ", t), e.topic && e.data && (t = e, 
    e = void 0), t && t.topic && "log4js:message" === t.topic) {
        Na("received message: ", t.data);
        const e = xa.deserialise(t.data);
        za(e);
    }
};

Ba || ka.addListener(e => {
    Ha.length = 0, ({pm2: Ua, disableClustering: Ba, pm2InstanceVar: Ga = "NODE_APP_INSTANCE"} = e), 
    Na(`clustering disabled ? ${Ba}`), Na(`cluster.isMaster ? ${$a && $a.isMaster}`), 
    Na(`pm2 enabled ? ${Ua}`), Na(`pm2InstanceVar = ${Ga}`), Na(`process.env[${Ga}] = ${process.env[Ga]}`), 
    Ua && process.removeListener("message", Ja), $a && $a.removeListener && $a.removeListener("message", Ja), 
    Ba || e.disableClustering ? Na("Not listening for cluster messages, because clustering disabled.") : Va() ? (Na("listening for PM2 broadcast messages"), 
    process.on("message", Ja)) : $a && $a.isMaster ? (Na("listening for cluster messages"), 
    $a.on("message", Ja)) : Na("not listening for messages, because we are not a master process");
});

var Ka = {
    onlyOnMaster: (e, t) => Wa() ? e() : t,
    isMaster: Wa,
    send: e => {
        Wa() ? za(e) : (Ua || (e.cluster = {
            workerId: $a.worker.id,
            worker: process.pid
        }), process.send({
            topic: "log4js:message",
            data: e.serialise()
        }));
    },
    onMessage: e => {
        Ha.push(e);
    }
}, qa = {};

function Xa(e) {
    if ("number" == typeof e && Number.isInteger(e)) {
        return e;
    }
    const t = {
        K: 1024,
        M: 1048576,
        G: 1073741824
    }, r = Object.keys(t), n = e.slice(-1).toLocaleUpperCase(), o = e.slice(0, -1).trim();
    if (r.indexOf(n) < 0 || !Number.isInteger(Number(o))) {
        throw Error(`maxLogSize: "${e}" is invalid`);
    }
    return o * t[n];
}

function Ya(e) {
    return function(e, t) {
        const r = Object.assign({}, t);
        return Object.keys(e).forEach(n => {
            r[n] && (r[n] = e[n](t[n]));
        }), r;
    }({
        maxLogSize: Xa
    }, e);
}

const Za = {
    dateFile: Ya,
    file: Ya,
    fileSync: Ya
};

qa.modifyConfig = e => Za[e.type] ? Za[e.type](e) : e;

var Qa = {};

const eu = console.log.bind(console);

Qa.configure = function(e, t) {
    let r = t.colouredLayout;
    return e.layout && (r = t.layout(e.layout.type, e.layout)), function(e, t) {
        return r => {
            eu(e(r, t));
        };
    }(r, e.timezoneOffset);
};

var tu = {};

tu.configure = function(e, t) {
    let r = t.colouredLayout;
    return e.layout && (r = t.layout(e.layout.type, e.layout)), function(e, t) {
        return r => {
            process.stdout.write(`${e(r, t)}\n`);
        };
    }(r, e.timezoneOffset);
};

var ru = {};

ru.configure = function(e, t) {
    let r = t.colouredLayout;
    return e.layout && (r = t.layout(e.layout.type, e.layout)), function(e, t) {
        return r => {
            process.stderr.write(`${e(r, t)}\n`);
        };
    }(r, e.timezoneOffset);
};

var nu = {};

nu.configure = function(e, t, r, n) {
    const o = r(e.appender);
    return function(e, t, r, n) {
        const o = n.getLevel(e), i = n.getLevel(t, n.FATAL);
        return e => {
            const t = e.level;
            o.isLessThanOrEqualTo(t) && i.isGreaterThanOrEqualTo(t) && r(e);
        };
    }(e.level, e.maxLevel, o, n);
};

var ou = {};

const iu = Ni("log4js:categoryFilter");

ou.configure = function(e, t, r) {
    const n = r(e.appender);
    return function(e, t) {
        return "string" == typeof e && (e = [ e ]), r => {
            iu(`Checking ${r.categoryName} against ${e}`), -1 === e.indexOf(r.categoryName) && (iu("Not excluded, sending to appender"), 
            t(r));
        };
    }(e.exclude, n);
};

var au = {};

const uu = Ni("log4js:noLogFilter");

au.configure = function(e, t, r) {
    const n = r(e.appender);
    return function(e, t) {
        return r => {
            uu(`Checking data: ${r.data} against filters: ${e}`), "string" == typeof e && (e = [ e ]), 
            e = e.filter(e => null != e && "" !== e);
            const n = new RegExp(e.join("|"), "i");
            (0 === e.length || r.data.findIndex(e => n.test(e)) < 0) && (uu("Not excluded, sending to appender"), 
            t(r));
        };
    }(e.exclude, n);
};

var su = {}, lu = {
    exports: {}
}, cu = {}, fu = {
    fromCallback: function(e) {
        return Object.defineProperty(function() {
            if ("function" != typeof arguments[arguments.length - 1]) {
                return new Promise((t, r) => {
                    arguments[arguments.length] = (e, n) => {
                        if (e) {
                            return r(e);
                        }
                        t(n);
                    }, arguments.length++, e.apply(this, arguments);
                });
            }
            e.apply(this, arguments);
        }, "name", {
            value: e.name
        });
    },
    fromPromise: function(e) {
        return Object.defineProperty(function() {
            const t = arguments[arguments.length - 1];
            if ("function" != typeof t) {
                return e.apply(this, arguments);
            }
            e.apply(this, arguments).then(e => t(null, e), t);
        }, "name", {
            value: e.name
        });
    }
};

!function(e) {
    const t = fu.fromCallback, r = jr, n = [ "access", "appendFile", "chmod", "chown", "close", "copyFile", "fchmod", "fchown", "fdatasync", "fstat", "fsync", "ftruncate", "futimes", "lchown", "lchmod", "link", "lstat", "mkdir", "mkdtemp", "open", "readFile", "readdir", "readlink", "realpath", "rename", "rmdir", "stat", "symlink", "truncate", "unlink", "utimes", "writeFile" ].filter(e => "function" == typeof r[e]);
    Object.keys(r).forEach(t => {
        "promises" !== t && (e[t] = r[t]);
    }), n.forEach(n => {
        e[n] = t(r[n]);
    }), e.exists = function(e, t) {
        return "function" == typeof t ? r.exists(e, t) : new Promise(t => r.exists(e, t));
    }, e.read = function(e, t, n, o, i, a) {
        return "function" == typeof a ? r.read(e, t, n, o, i, a) : new Promise((a, u) => {
            r.read(e, t, n, o, i, (e, t, r) => {
                if (e) {
                    return u(e);
                }
                a({
                    bytesRead: t,
                    buffer: r
                });
            });
        });
    }, e.write = function(e, t, ...n) {
        return "function" == typeof n[n.length - 1] ? r.write(e, t, ...n) : new Promise((o, i) => {
            r.write(e, t, ...n, (e, t, r) => {
                if (e) {
                    return i(e);
                }
                o({
                    bytesWritten: t,
                    buffer: r
                });
            });
        });
    }, "function" == typeof r.realpath.native && (e.realpath.native = t(r.realpath.native));
}(cu);

const du = r;

function pu(e) {
    return (e = du.normalize(du.resolve(e)).split(du.sep)).length > 0 ? e[0] : null;
}

const vu = /[<>:"|?*]/;

var hu = function(e) {
    const t = pu(e);
    return e = e.replace(t, ""), vu.test(e);
};

const gu = jr, yu = r, mu = hu, Eu = parseInt("0777", 8);

var _u = function e(t, r, n, o) {
    if ("function" == typeof r ? (n = r, r = {}) : r && "object" == typeof r || (r = {
        mode: r
    }), "win32" === process.platform && mu(t)) {
        const e = new Error(t + " contains invalid WIN32 path characters.");
        return e.code = "EINVAL", n(e);
    }
    let i = r.mode;
    const a = r.fs || gu;
    void 0 === i && (i = Eu & ~process.umask()), o || (o = null), n = n || function() {}, 
    t = yu.resolve(t), a.mkdir(t, i, i => {
        if (!i) {
            return n(null, o = o || t);
        }
        if ("ENOENT" === i.code) {
            if (yu.dirname(t) === t) {
                return n(i);
            }
            e(yu.dirname(t), r, (o, i) => {
                o ? n(o, i) : e(t, r, n, i);
            });
        } else {
            a.stat(t, (e, t) => {
                e || !t.isDirectory() ? n(i, o) : n(null, o);
            });
        }
    });
};

const Du = jr, bu = r, Ou = hu, Au = parseInt("0777", 8);

var Cu = function e(t, r, n) {
    r && "object" == typeof r || (r = {
        mode: r
    });
    let o = r.mode;
    const i = r.fs || Du;
    if ("win32" === process.platform && Ou(t)) {
        const e = new Error(t + " contains invalid WIN32 path characters.");
        throw e.code = "EINVAL", e;
    }
    void 0 === o && (o = Au & ~process.umask()), n || (n = null), t = bu.resolve(t);
    try {
        i.mkdirSync(t, o), n = n || t;
    } catch (o) {
        if ("ENOENT" === o.code) {
            if (bu.dirname(t) === t) {
                throw o;
            }
            n = e(bu.dirname(t), r, n), e(t, r, n);
        } else {
            let e;
            try {
                e = i.statSync(t);
            } catch (e) {
                throw o;
            }
            if (!e.isDirectory()) {
                throw o;
            }
        }
    }
    return n;
};

const Su = (0, fu.fromCallback)(_u);

var Mu = {
    mkdirs: Su,
    mkdirsSync: Cu,
    mkdirp: Su,
    mkdirpSync: Cu,
    ensureDir: Su,
    ensureDirSync: Cu
};

const wu = jr;

var Fu = function(e, t, r, n) {
    wu.open(e, "r+", (e, o) => {
        if (e) {
            return n(e);
        }
        wu.futimes(o, t, r, e => {
            wu.close(o, t => {
                n && n(e || t);
            });
        });
    });
}, Pu = function(e, t, r) {
    const n = wu.openSync(e, "r+");
    return wu.futimesSync(n, t, r), wu.closeSync(n);
};

const Iu = jr, Ru = r, Tu = process.versions.node.split("."), Lu = Number.parseInt(Tu[0], 10), ju = Number.parseInt(Tu[1], 10), Nu = Number.parseInt(Tu[2], 10);

function xu() {
    if (Lu > 10) {
        return !0;
    }
    if (10 === Lu) {
        if (ju > 5) {
            return !0;
        }
        if (5 === ju && Nu >= 0) {
            return !0;
        }
    }
    return !1;
}

function ku(e, t) {
    const r = Ru.resolve(e).split(Ru.sep).filter(e => e), n = Ru.resolve(t).split(Ru.sep).filter(e => e);
    return r.reduce((e, t, r) => e && n[r] === t, !0);
}

function Bu(e, t, r) {
    return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}

var $u, Hu, Uu = {
    checkPaths: function(e, t, r, n) {
        !function(e, t, r) {
            xu() ? Iu.stat(e, {
                bigint: !0
            }, (e, n) => {
                if (e) {
                    return r(e);
                }
                Iu.stat(t, {
                    bigint: !0
                }, (e, t) => e ? "ENOENT" === e.code ? r(null, {
                    srcStat: n,
                    destStat: null
                }) : r(e) : r(null, {
                    srcStat: n,
                    destStat: t
                }));
            }) : Iu.stat(e, (e, n) => {
                if (e) {
                    return r(e);
                }
                Iu.stat(t, (e, t) => e ? "ENOENT" === e.code ? r(null, {
                    srcStat: n,
                    destStat: null
                }) : r(e) : r(null, {
                    srcStat: n,
                    destStat: t
                }));
            });
        }(e, t, (o, i) => {
            if (o) {
                return n(o);
            }
            const {srcStat: a, destStat: u} = i;
            return u && u.ino && u.dev && u.ino === a.ino && u.dev === a.dev ? n(new Error("Source and destination must not be the same.")) : a.isDirectory() && ku(e, t) ? n(new Error(Bu(e, t, r))) : n(null, {
                srcStat: a,
                destStat: u
            });
        });
    },
    checkPathsSync: function(e, t, r) {
        const {srcStat: n, destStat: o} = function(e, t) {
            let r, n;
            r = xu() ? Iu.statSync(e, {
                bigint: !0
            }) : Iu.statSync(e);
            try {
                n = xu() ? Iu.statSync(t, {
                    bigint: !0
                }) : Iu.statSync(t);
            } catch (e) {
                if ("ENOENT" === e.code) {
                    return {
                        srcStat: r,
                        destStat: null
                    };
                }
                throw e;
            }
            return {
                srcStat: r,
                destStat: n
            };
        }(e, t);
        if (o && o.ino && o.dev && o.ino === n.ino && o.dev === n.dev) {
            throw new Error("Source and destination must not be the same.");
        }
        if (n.isDirectory() && ku(e, t)) {
            throw new Error(Bu(e, t, r));
        }
        return {
            srcStat: n,
            destStat: o
        };
    },
    checkParentPaths: function e(t, r, n, o, i) {
        const a = Ru.resolve(Ru.dirname(t)), u = Ru.resolve(Ru.dirname(n));
        if (u === a || u === Ru.parse(u).root) {
            return i();
        }
        xu() ? Iu.stat(u, {
            bigint: !0
        }, (a, s) => a ? "ENOENT" === a.code ? i() : i(a) : s.ino && s.dev && s.ino === r.ino && s.dev === r.dev ? i(new Error(Bu(t, n, o))) : e(t, r, u, o, i)) : Iu.stat(u, (a, s) => a ? "ENOENT" === a.code ? i() : i(a) : s.ino && s.dev && s.ino === r.ino && s.dev === r.dev ? i(new Error(Bu(t, n, o))) : e(t, r, u, o, i));
    },
    checkParentPathsSync: function e(t, r, n, o) {
        const i = Ru.resolve(Ru.dirname(t)), a = Ru.resolve(Ru.dirname(n));
        if (a === i || a === Ru.parse(a).root) {
            return;
        }
        let u;
        try {
            u = xu() ? Iu.statSync(a, {
                bigint: !0
            }) : Iu.statSync(a);
        } catch (e) {
            if ("ENOENT" === e.code) {
                return;
            }
            throw e;
        }
        if (u.ino && u.dev && u.ino === r.ino && u.dev === r.dev) {
            throw new Error(Bu(t, n, o));
        }
        return e(t, r, a, o);
    },
    isSrcSubdir: ku
};

const Gu = jr, Vu = r, Wu = Mu.mkdirsSync, zu = Pu, Ju = Uu;

function Ku(e, t, r, n) {
    if (!n.filter || n.filter(t, r)) {
        return function(e, t, r, n) {
            const o = n.dereference ? Gu.statSync : Gu.lstatSync, i = o(t);
            if (i.isDirectory()) {
                return function(e, t, r, n, o) {
                    if (!t) {
                        return function(e, t, r, n) {
                            return Gu.mkdirSync(r), Xu(t, r, n), Gu.chmodSync(r, e.mode);
                        }(e, r, n, o);
                    }
                    if (t && !t.isDirectory()) {
                        throw new Error(`Cannot overwrite non-directory '${n}' with directory '${r}'.`);
                    }
                    return Xu(r, n, o);
                }(i, e, t, r, n);
            }
            if (i.isFile() || i.isCharacterDevice() || i.isBlockDevice()) {
                return function(e, t, r, n, o) {
                    return t ? function(e, t, r, n) {
                        if (n.overwrite) {
                            return Gu.unlinkSync(r), qu(e, t, r, n);
                        }
                        if (n.errorOnExist) {
                            throw new Error(`'${r}' already exists`);
                        }
                    }(e, r, n, o) : qu(e, r, n, o);
                }(i, e, t, r, n);
            }
            if (i.isSymbolicLink()) {
                return function(e, t, r, n) {
                    let o = Gu.readlinkSync(t);
                    n.dereference && (o = Vu.resolve(process.cwd(), o));
                    if (e) {
                        let e;
                        try {
                            e = Gu.readlinkSync(r);
                        } catch (e) {
                            if ("EINVAL" === e.code || "UNKNOWN" === e.code) {
                                return Gu.symlinkSync(o, r);
                            }
                            throw e;
                        }
                        if (n.dereference && (e = Vu.resolve(process.cwd(), e)), Ju.isSrcSubdir(o, e)) {
                            throw new Error(`Cannot copy '${o}' to a subdirectory of itself, '${e}'.`);
                        }
                        if (Gu.statSync(r).isDirectory() && Ju.isSrcSubdir(e, o)) {
                            throw new Error(`Cannot overwrite '${e}' with '${o}'.`);
                        }
                        return function(e, t) {
                            return Gu.unlinkSync(t), Gu.symlinkSync(e, t);
                        }(o, r);
                    }
                    return Gu.symlinkSync(o, r);
                }(e, t, r, n);
            }
        }(e, t, r, n);
    }
}

function qu(e, t, r, n) {
    return "function" == typeof Gu.copyFileSync ? (Gu.copyFileSync(t, r), Gu.chmodSync(r, e.mode), 
    n.preserveTimestamps ? zu(r, e.atime, e.mtime) : void 0) : function(e, t, r, n) {
        const o = 65536, i = (Hu || (Hu = 1, $u = function(e) {
            if ("function" == typeof Buffer.allocUnsafe) {
                try {
                    return Buffer.allocUnsafe(e);
                } catch (t) {
                    return new Buffer(e);
                }
            }
            return new Buffer(e);
        }), $u)(o), a = Gu.openSync(t, "r"), u = Gu.openSync(r, "w", e.mode);
        let s = 0;
        for (;s < e.size; ) {
            const e = Gu.readSync(a, i, 0, o, s);
            Gu.writeSync(u, i, 0, e), s += e;
        }
        n.preserveTimestamps && Gu.futimesSync(u, e.atime, e.mtime);
        Gu.closeSync(a), Gu.closeSync(u);
    }(e, t, r, n);
}

function Xu(e, t, r) {
    Gu.readdirSync(e).forEach(n => function(e, t, r, n) {
        const o = Vu.join(t, e), i = Vu.join(r, e), {destStat: a} = Ju.checkPathsSync(o, i, "copy");
        return Ku(a, o, i, n);
    }(n, e, t, r));
}

var Yu = function(e, t, r) {
    "function" == typeof r && (r = {
        filter: r
    }), (r = r || {}).clobber = !("clobber" in r) || !!r.clobber, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, 
    r.preserveTimestamps && "ia32" === process.arch && console.warn("fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n\n    see https://github.com/jprichardson/node-fs-extra/issues/269");
    const {srcStat: n, destStat: o} = Ju.checkPathsSync(e, t, "copy");
    return Ju.checkParentPathsSync(e, n, t, "copy"), function(e, t, r, n) {
        if (n.filter && !n.filter(t, r)) {
            return;
        }
        const o = Vu.dirname(r);
        Gu.existsSync(o) || Wu(o);
        return Ku(e, t, r, n);
    }(o, e, t, r);
}, Zu = {
    copySync: Yu
};

const Qu = fu.fromPromise, es = cu;

var ts = {
    pathExists: Qu(function(e) {
        return es.access(e).then(() => !0).catch(() => !1);
    }),
    pathExistsSync: es.existsSync
};

const rs = jr, ns = r, os = Mu.mkdirs, is = ts.pathExists, as = Fu, us = Uu;

function ss(e, t, r, n, o) {
    const i = ns.dirname(r);
    is(i, (a, u) => a ? o(a) : u ? cs(e, t, r, n, o) : void os(i, i => i ? o(i) : cs(e, t, r, n, o)));
}

function ls(e, t, r, n, o, i) {
    Promise.resolve(o.filter(r, n)).then(a => a ? e(t, r, n, o, i) : i(), e => i(e));
}

function cs(e, t, r, n, o) {
    return n.filter ? ls(fs, e, t, r, n, o) : fs(e, t, r, n, o);
}

function fs(e, t, r, n, o) {
    (n.dereference ? rs.stat : rs.lstat)(t, (i, a) => i ? o(i) : a.isDirectory() ? function(e, t, r, n, o, i) {
        if (!t) {
            return function(e, t, r, n, o) {
                rs.mkdir(r, i => {
                    if (i) {
                        return o(i);
                    }
                    vs(t, r, n, t => t ? o(t) : rs.chmod(r, e.mode, o));
                });
            }(e, r, n, o, i);
        }
        if (t && !t.isDirectory()) {
            return i(new Error(`Cannot overwrite non-directory '${n}' with directory '${r}'.`));
        }
        return vs(r, n, o, i);
    }(a, e, t, r, n, o) : a.isFile() || a.isCharacterDevice() || a.isBlockDevice() ? function(e, t, r, n, o, i) {
        return t ? function(e, t, r, n, o) {
            if (!n.overwrite) {
                return n.errorOnExist ? o(new Error(`'${r}' already exists`)) : o();
            }
            rs.unlink(r, i => i ? o(i) : ds(e, t, r, n, o));
        }(e, r, n, o, i) : ds(e, r, n, o, i);
    }(a, e, t, r, n, o) : a.isSymbolicLink() ? function(e, t, r, n, o) {
        rs.readlink(t, (t, i) => t ? o(t) : (n.dereference && (i = ns.resolve(process.cwd(), i)), 
        e ? void rs.readlink(r, (t, a) => t ? "EINVAL" === t.code || "UNKNOWN" === t.code ? rs.symlink(i, r, o) : o(t) : (n.dereference && (a = ns.resolve(process.cwd(), a)), 
        us.isSrcSubdir(i, a) ? o(new Error(`Cannot copy '${i}' to a subdirectory of itself, '${a}'.`)) : e.isDirectory() && us.isSrcSubdir(a, i) ? o(new Error(`Cannot overwrite '${a}' with '${i}'.`)) : function(e, t, r) {
            rs.unlink(t, n => n ? r(n) : rs.symlink(e, t, r));
        }(i, r, o))) : rs.symlink(i, r, o)));
    }(e, t, r, n, o) : void 0);
}

function ds(e, t, r, n, o) {
    return "function" == typeof rs.copyFile ? rs.copyFile(t, r, t => t ? o(t) : ps(e, r, n, o)) : function(e, t, r, n, o) {
        const i = rs.createReadStream(t);
        i.on("error", e => o(e)).once("open", () => {
            const t = rs.createWriteStream(r, {
                mode: e.mode
            });
            t.on("error", e => o(e)).on("open", () => i.pipe(t)).once("close", () => ps(e, r, n, o));
        });
    }(e, t, r, n, o);
}

function ps(e, t, r, n) {
    rs.chmod(t, e.mode, o => o ? n(o) : r.preserveTimestamps ? as(t, e.atime, e.mtime, n) : n());
}

function vs(e, t, r, n) {
    rs.readdir(e, (o, i) => o ? n(o) : hs(i, e, t, r, n));
}

function hs(e, t, r, n, o) {
    const i = e.pop();
    return i ? function(e, t, r, n, o, i) {
        const a = ns.join(r, t), u = ns.join(n, t);
        us.checkPaths(a, u, "copy", (t, s) => {
            if (t) {
                return i(t);
            }
            const {destStat: l} = s;
            cs(l, a, u, o, t => t ? i(t) : hs(e, r, n, o, i));
        });
    }(e, i, t, r, n, o) : o();
}

var gs = function(e, t, r, n) {
    "function" != typeof r || n ? "function" == typeof r && (r = {
        filter: r
    }) : (n = r, r = {}), n = n || function() {}, (r = r || {}).clobber = !("clobber" in r) || !!r.clobber, 
    r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && "ia32" === process.arch && console.warn("fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n\n    see https://github.com/jprichardson/node-fs-extra/issues/269"), 
    us.checkPaths(e, t, "copy", (o, i) => {
        if (o) {
            return n(o);
        }
        const {srcStat: a, destStat: u} = i;
        us.checkParentPaths(e, a, t, "copy", o => o ? n(o) : r.filter ? ls(ss, u, e, t, r, n) : ss(u, e, t, r, n));
    });
};

var ys = {
    copy: (0, fu.fromCallback)(gs)
};

const ms = jr, Es = r, _s = c, Ds = "win32" === process.platform;

function bs(e) {
    [ "unlink", "chmod", "stat", "lstat", "rmdir", "readdir" ].forEach(t => {
        e[t] = e[t] || ms[t], e[t += "Sync"] = e[t] || ms[t];
    }), e.maxBusyTries = e.maxBusyTries || 3;
}

function Os(e, t, r) {
    let n = 0;
    "function" == typeof t && (r = t, t = {}), _s(e, "rimraf: missing path"), _s.strictEqual(typeof e, "string", "rimraf: path should be a string"), 
    _s.strictEqual(typeof r, "function", "rimraf: callback function required"), _s(t, "rimraf: invalid options argument provided"), 
    _s.strictEqual(typeof t, "object", "rimraf: options should be object"), bs(t), As(e, t, function o(i) {
        if (i) {
            if (("EBUSY" === i.code || "ENOTEMPTY" === i.code || "EPERM" === i.code) && n < t.maxBusyTries) {
                n++;
                return setTimeout(() => As(e, t, o), 100 * n);
            }
            "ENOENT" === i.code && (i = null);
        }
        r(i);
    });
}

function As(e, t, r) {
    _s(e), _s(t), _s("function" == typeof r), t.lstat(e, (n, o) => n && "ENOENT" === n.code ? r(null) : n && "EPERM" === n.code && Ds ? Cs(e, t, n, r) : o && o.isDirectory() ? Ms(e, t, n, r) : void t.unlink(e, n => {
        if (n) {
            if ("ENOENT" === n.code) {
                return r(null);
            }
            if ("EPERM" === n.code) {
                return Ds ? Cs(e, t, n, r) : Ms(e, t, n, r);
            }
            if ("EISDIR" === n.code) {
                return Ms(e, t, n, r);
            }
        }
        return r(n);
    }));
}

function Cs(e, t, r, n) {
    _s(e), _s(t), _s("function" == typeof n), r && _s(r instanceof Error), t.chmod(e, 438, o => {
        o ? n("ENOENT" === o.code ? null : r) : t.stat(e, (o, i) => {
            o ? n("ENOENT" === o.code ? null : r) : i.isDirectory() ? Ms(e, t, r, n) : t.unlink(e, n);
        });
    });
}

function Ss(e, t, r) {
    let n;
    _s(e), _s(t), r && _s(r instanceof Error);
    try {
        t.chmodSync(e, 438);
    } catch (e) {
        if ("ENOENT" === e.code) {
            return;
        }
        throw r;
    }
    try {
        n = t.statSync(e);
    } catch (e) {
        if ("ENOENT" === e.code) {
            return;
        }
        throw r;
    }
    n.isDirectory() ? Fs(e, t, r) : t.unlinkSync(e);
}

function Ms(e, t, r, n) {
    _s(e), _s(t), r && _s(r instanceof Error), _s("function" == typeof n), t.rmdir(e, o => {
        !o || "ENOTEMPTY" !== o.code && "EEXIST" !== o.code && "EPERM" !== o.code ? o && "ENOTDIR" === o.code ? n(r) : n(o) : function(e, t, r) {
            _s(e), _s(t), _s("function" == typeof r), t.readdir(e, (n, o) => {
                if (n) {
                    return r(n);
                }
                let i, a = o.length;
                if (0 === a) {
                    return t.rmdir(e, r);
                }
                o.forEach(n => {
                    Os(Es.join(e, n), t, n => {
                        if (!i) {
                            return n ? r(i = n) : void (0 === --a && t.rmdir(e, r));
                        }
                    });
                });
            });
        }(e, t, n);
    });
}

function ws(e, t) {
    let r;
    bs(t = t || {}), _s(e, "rimraf: missing path"), _s.strictEqual(typeof e, "string", "rimraf: path should be a string"), 
    _s(t, "rimraf: missing options"), _s.strictEqual(typeof t, "object", "rimraf: options should be object");
    try {
        r = t.lstatSync(e);
    } catch (r) {
        if ("ENOENT" === r.code) {
            return;
        }
        "EPERM" === r.code && Ds && Ss(e, t, r);
    }
    try {
        r && r.isDirectory() ? Fs(e, t, null) : t.unlinkSync(e);
    } catch (r) {
        if ("ENOENT" === r.code) {
            return;
        }
        if ("EPERM" === r.code) {
            return Ds ? Ss(e, t, r) : Fs(e, t, r);
        }
        if ("EISDIR" !== r.code) {
            throw r;
        }
        Fs(e, t, r);
    }
}

function Fs(e, t, r) {
    _s(e), _s(t), r && _s(r instanceof Error);
    try {
        t.rmdirSync(e);
    } catch (n) {
        if ("ENOTDIR" === n.code) {
            throw r;
        }
        if ("ENOTEMPTY" === n.code || "EEXIST" === n.code || "EPERM" === n.code) {
            !function(e, t) {
                if (_s(e), _s(t), t.readdirSync(e).forEach(r => ws(Es.join(e, r), t)), !Ds) {
                    return t.rmdirSync(e, t);
                }
                {
                    const r = Date.now();
                    do {
                        try {
                            return t.rmdirSync(e, t);
                        } catch (e) {}
                    } while (Date.now() - r < 500);
                }
            }(e, t);
        } else if ("ENOENT" !== n.code) {
            throw n;
        }
    }
}

var Ps = Os;

Os.sync = ws;

const Is = Ps;

var Rs = {
    remove: (0, fu.fromCallback)(Is),
    removeSync: Is.sync
};

const Ts = fu.fromCallback, Ls = jr, js = r, Ns = Mu, xs = Rs, ks = Ts(function(e, t) {
    t = t || function() {}, Ls.readdir(e, (r, n) => {
        if (r) {
            return Ns.mkdirs(e, t);
        }
        n = n.map(t => js.join(e, t)), function e() {
            const r = n.pop();
            if (!r) {
                return t();
            }
            xs.remove(r, r => {
                if (r) {
                    return t(r);
                }
                e();
            });
        }();
    });
});

function Bs(e) {
    let t;
    try {
        t = Ls.readdirSync(e);
    } catch (t) {
        return Ns.mkdirsSync(e);
    }
    t.forEach(t => {
        t = js.join(e, t), xs.removeSync(t);
    });
}

var $s = {
    emptyDirSync: Bs,
    emptydirSync: Bs,
    emptyDir: ks,
    emptydir: ks
};

const Hs = fu.fromCallback, Us = r, Gs = jr, Vs = Mu, Ws = ts.pathExists;

var zs = {
    createFile: Hs(function(e, t) {
        function r() {
            Gs.writeFile(e, "", e => {
                if (e) {
                    return t(e);
                }
                t();
            });
        }
        Gs.stat(e, (n, o) => {
            if (!n && o.isFile()) {
                return t();
            }
            const i = Us.dirname(e);
            Ws(i, (e, n) => e ? t(e) : n ? r() : void Vs.mkdirs(i, e => {
                if (e) {
                    return t(e);
                }
                r();
            }));
        });
    }),
    createFileSync: function(e) {
        let t;
        try {
            t = Gs.statSync(e);
        } catch (e) {}
        if (t && t.isFile()) {
            return;
        }
        const r = Us.dirname(e);
        Gs.existsSync(r) || Vs.mkdirsSync(r), Gs.writeFileSync(e, "");
    }
};

const Js = fu.fromCallback, Ks = r, qs = jr, Xs = Mu, Ys = ts.pathExists;

var Zs = {
    createLink: Js(function(e, t, r) {
        function n(e, t) {
            qs.link(e, t, e => {
                if (e) {
                    return r(e);
                }
                r(null);
            });
        }
        Ys(t, (o, i) => o ? r(o) : i ? r(null) : void qs.lstat(e, o => {
            if (o) {
                return o.message = o.message.replace("lstat", "ensureLink"), r(o);
            }
            const i = Ks.dirname(t);
            Ys(i, (o, a) => o ? r(o) : a ? n(e, t) : void Xs.mkdirs(i, o => {
                if (o) {
                    return r(o);
                }
                n(e, t);
            }));
        }));
    }),
    createLinkSync: function(e, t) {
        if (qs.existsSync(t)) {
            return;
        }
        try {
            qs.lstatSync(e);
        } catch (e) {
            throw e.message = e.message.replace("lstat", "ensureLink"), e;
        }
        const r = Ks.dirname(t);
        return qs.existsSync(r) || Xs.mkdirsSync(r), qs.linkSync(e, t);
    }
};

const Qs = r, el = jr, tl = ts.pathExists;

var rl = {
    symlinkPaths: function(e, t, r) {
        if (Qs.isAbsolute(e)) {
            return el.lstat(e, t => t ? (t.message = t.message.replace("lstat", "ensureSymlink"), 
            r(t)) : r(null, {
                toCwd: e,
                toDst: e
            }));
        }
        {
            const n = Qs.dirname(t), o = Qs.join(n, e);
            return tl(o, (t, i) => t ? r(t) : i ? r(null, {
                toCwd: o,
                toDst: e
            }) : el.lstat(e, t => t ? (t.message = t.message.replace("lstat", "ensureSymlink"), 
            r(t)) : r(null, {
                toCwd: e,
                toDst: Qs.relative(n, e)
            })));
        }
    },
    symlinkPathsSync: function(e, t) {
        let r;
        if (Qs.isAbsolute(e)) {
            if (r = el.existsSync(e), !r) {
                throw new Error("absolute srcpath does not exist");
            }
            return {
                toCwd: e,
                toDst: e
            };
        }
        {
            const n = Qs.dirname(t), o = Qs.join(n, e);
            if (r = el.existsSync(o), r) {
                return {
                    toCwd: o,
                    toDst: e
                };
            }
            if (r = el.existsSync(e), !r) {
                throw new Error("relative srcpath does not exist");
            }
            return {
                toCwd: e,
                toDst: Qs.relative(n, e)
            };
        }
    }
};

const nl = jr;

var ol = {
    symlinkType: function(e, t, r) {
        if (r = "function" == typeof t ? t : r, t = "function" != typeof t && t) {
            return r(null, t);
        }
        nl.lstat(e, (e, n) => {
            if (e) {
                return r(null, "file");
            }
            t = n && n.isDirectory() ? "dir" : "file", r(null, t);
        });
    },
    symlinkTypeSync: function(e, t) {
        let r;
        if (t) {
            return t;
        }
        try {
            r = nl.lstatSync(e);
        } catch (e) {
            return "file";
        }
        return r && r.isDirectory() ? "dir" : "file";
    }
};

const il = fu.fromCallback, al = r, ul = jr, sl = Mu.mkdirs, ll = Mu.mkdirsSync, cl = rl.symlinkPaths, fl = rl.symlinkPathsSync, dl = ol.symlinkType, pl = ol.symlinkTypeSync, vl = ts.pathExists;

var hl = {
    createSymlink: il(function(e, t, r, n) {
        n = "function" == typeof r ? r : n, r = "function" != typeof r && r, vl(t, (o, i) => o ? n(o) : i ? n(null) : void cl(e, t, (o, i) => {
            if (o) {
                return n(o);
            }
            e = i.toDst, dl(i.toCwd, r, (r, o) => {
                if (r) {
                    return n(r);
                }
                const i = al.dirname(t);
                vl(i, (r, a) => r ? n(r) : a ? ul.symlink(e, t, o, n) : void sl(i, r => {
                    if (r) {
                        return n(r);
                    }
                    ul.symlink(e, t, o, n);
                }));
            });
        }));
    }),
    createSymlinkSync: function(e, t, r) {
        if (ul.existsSync(t)) {
            return;
        }
        const n = fl(e, t);
        e = n.toDst, r = pl(n.toCwd, r);
        const o = al.dirname(t);
        return ul.existsSync(o) || ll(o), ul.symlinkSync(e, t, r);
    }
};

var gl, yl = {
    createFile: zs.createFile,
    createFileSync: zs.createFileSync,
    ensureFile: zs.createFile,
    ensureFileSync: zs.createFileSync,
    createLink: Zs.createLink,
    createLinkSync: Zs.createLinkSync,
    ensureLink: Zs.createLink,
    ensureLinkSync: Zs.createLinkSync,
    createSymlink: hl.createSymlink,
    createSymlinkSync: hl.createSymlinkSync,
    ensureSymlink: hl.createSymlink,
    ensureSymlinkSync: hl.createSymlinkSync
};

try {
    gl = jr;
} catch (TF) {
    gl = t;
}

function ml(e, t) {
    var r, n = "\n";
    return "object" == typeof t && null !== t && (t.spaces && (r = t.spaces), t.EOL && (n = t.EOL)), 
    JSON.stringify(e, t ? t.replacer : null, r).replace(/\n/g, n) + n;
}

function El(e) {
    return Buffer.isBuffer(e) && (e = e.toString("utf8")), e = e.replace(/^\uFEFF/, "");
}

var _l = {
    readFile: function(e, t, r) {
        null == r && (r = t, t = {}), "string" == typeof t && (t = {
            encoding: t
        });
        var n = (t = t || {}).fs || gl, o = !0;
        "throws" in t && (o = t.throws), n.readFile(e, t, function(n, i) {
            if (n) {
                return r(n);
            }
            var a;
            i = El(i);
            try {
                a = JSON.parse(i, t ? t.reviver : null);
            } catch (t) {
                return o ? (t.message = e + ": " + t.message, r(t)) : r(null, null);
            }
            r(null, a);
        });
    },
    readFileSync: function(e, t) {
        "string" == typeof (t = t || {}) && (t = {
            encoding: t
        });
        var r = t.fs || gl, n = !0;
        "throws" in t && (n = t.throws);
        try {
            var o = r.readFileSync(e, t);
            return o = El(o), JSON.parse(o, t.reviver);
        } catch (t) {
            if (n) {
                throw t.message = e + ": " + t.message, t;
            }
            return null;
        }
    },
    writeFile: function(e, t, r, n) {
        null == n && (n = r, r = {});
        var o = (r = r || {}).fs || gl, i = "";
        try {
            i = ml(t, r);
        } catch (e) {
            return void (n && n(e, null));
        }
        o.writeFile(e, i, r, n);
    },
    writeFileSync: function(e, t, r) {
        var n = (r = r || {}).fs || gl, o = ml(t, r);
        return n.writeFileSync(e, o, r);
    }
}, Dl = _l;

const bl = fu.fromCallback, Ol = Dl;

var Al = {
    readJson: bl(Ol.readFile),
    readJsonSync: Ol.readFileSync,
    writeJson: bl(Ol.writeFile),
    writeJsonSync: Ol.writeFileSync
};

const Cl = r, Sl = Mu, Ml = ts.pathExists, wl = Al;

var Fl = function(e, t, r, n) {
    "function" == typeof r && (n = r, r = {});
    const o = Cl.dirname(e);
    Ml(o, (i, a) => i ? n(i) : a ? wl.writeJson(e, t, r, n) : void Sl.mkdirs(o, o => {
        if (o) {
            return n(o);
        }
        wl.writeJson(e, t, r, n);
    }));
};

const Pl = jr, Il = r, Rl = Mu, Tl = Al;

var Ll = function(e, t, r) {
    const n = Il.dirname(e);
    Pl.existsSync(n) || Rl.mkdirsSync(n), Tl.writeJsonSync(e, t, r);
};

const jl = fu.fromCallback, Nl = Al;

Nl.outputJson = jl(Fl), Nl.outputJsonSync = Ll, Nl.outputJSON = Nl.outputJson, Nl.outputJSONSync = Nl.outputJsonSync, 
Nl.writeJSON = Nl.writeJson, Nl.writeJSONSync = Nl.writeJsonSync, Nl.readJSON = Nl.readJson, 
Nl.readJSONSync = Nl.readJsonSync;

var xl = Nl;

const kl = jr, Bl = r, $l = Zu.copySync, Hl = Rs.removeSync, Ul = Mu.mkdirpSync, Gl = Uu;

function Vl(e, t, r) {
    try {
        kl.renameSync(e, t);
    } catch (n) {
        if ("EXDEV" !== n.code) {
            throw n;
        }
        return function(e, t, r) {
            const n = {
                overwrite: r,
                errorOnExist: !0
            };
            return $l(e, t, n), Hl(e);
        }(e, t, r);
    }
}

var Wl = function(e, t, r) {
    const n = (r = r || {}).overwrite || r.clobber || !1, {srcStat: o} = Gl.checkPathsSync(e, t, "move");
    return Gl.checkParentPathsSync(e, o, t, "move"), Ul(Bl.dirname(t)), function(e, t, r) {
        if (r) {
            return Hl(t), Vl(e, t, r);
        }
        if (kl.existsSync(t)) {
            throw new Error("dest already exists.");
        }
        return Vl(e, t, r);
    }(e, t, n);
}, zl = {
    moveSync: Wl
};

const Jl = jr, Kl = r, ql = ys.copy, Xl = Rs.remove, Yl = Mu.mkdirp, Zl = ts.pathExists, Ql = Uu;

function ec(e, t, r, n) {
    Jl.rename(e, t, o => o ? "EXDEV" !== o.code ? n(o) : function(e, t, r, n) {
        const o = {
            overwrite: r,
            errorOnExist: !0
        };
        ql(e, t, o, t => t ? n(t) : Xl(e, n));
    }(e, t, r, n) : n());
}

var tc = function(e, t, r, n) {
    "function" == typeof r && (n = r, r = {});
    const o = r.overwrite || r.clobber || !1;
    Ql.checkPaths(e, t, "move", (r, i) => {
        if (r) {
            return n(r);
        }
        const {srcStat: a} = i;
        Ql.checkParentPaths(e, a, t, "move", r => {
            if (r) {
                return n(r);
            }
            Yl(Kl.dirname(t), r => r ? n(r) : function(e, t, r, n) {
                if (r) {
                    return Xl(t, o => o ? n(o) : ec(e, t, r, n));
                }
                Zl(t, (o, i) => o ? n(o) : i ? n(new Error("dest already exists.")) : ec(e, t, r, n));
            }(e, t, o, n));
        });
    });
};

var rc = {
    move: (0, fu.fromCallback)(tc)
};

const nc = fu.fromCallback, oc = jr, ic = r, ac = Mu, uc = ts.pathExists;

var sc = {
    outputFile: nc(function(e, t, r, n) {
        "function" == typeof r && (n = r, r = "utf8");
        const o = ic.dirname(e);
        uc(o, (i, a) => i ? n(i) : a ? oc.writeFile(e, t, r, n) : void ac.mkdirs(o, o => {
            if (o) {
                return n(o);
            }
            oc.writeFile(e, t, r, n);
        }));
    }),
    outputFileSync: function(e, ...t) {
        const r = ic.dirname(e);
        if (oc.existsSync(r)) {
            return oc.writeFileSync(e, ...t);
        }
        ac.mkdirsSync(r), oc.writeFileSync(e, ...t);
    }
};

!function(e) {
    e.exports = Object.assign({}, cu, Zu, ys, $s, yl, xl, Mu, zl, rc, sc, ts, Rs);
    const r = t;
    Object.getOwnPropertyDescriptor(r, "promises") && Object.defineProperty(e.exports, "promises", {
        get: () => r.promises
    });
}(lu);

var lc = lu.exports;

const cc = Ni("streamroller:fileNameFormatter"), fc = r;

const dc = Ni("streamroller:fileNameParser"), pc = Ki;

const vc = Ni("streamroller:moveAndMaybeCompressFile"), hc = lc, gc = p;

var yc = async (e, t, r) => {
    if (r = function(e) {
        const t = {
            mode: parseInt("0600", 8),
            compress: !1
        }, r = Object.assign({}, t, e);
        return vc(`_parseOption: moveAndMaybeCompressFile called with option=${JSON.stringify(r)}`), 
        r;
    }(r), e !== t) {
        if (await hc.pathExists(e)) {
            if (vc(`moveAndMaybeCompressFile: moving file from ${e} to ${t} ${r.compress ? "with" : "without"} compress`), 
            r.compress) {
                await new Promise((n, o) => {
                    let i = !1;
                    const a = hc.createWriteStream(t, {
                        mode: r.mode,
                        flags: "wx"
                    }).on("open", () => {
                        i = !0;
                        const t = hc.createReadStream(e).on("open", () => {
                            t.pipe(gc.createGzip()).pipe(a);
                        }).on("error", t => {
                            vc(`moveAndMaybeCompressFile: error reading ${e}`, t), a.destroy(t);
                        });
                    }).on("finish", () => {
                        vc(`moveAndMaybeCompressFile: finished compressing ${t}, deleting ${e}`), hc.unlink(e).then(n).catch(t => {
                            vc(`moveAndMaybeCompressFile: error deleting ${e}, truncating instead`, t), hc.truncate(e).then(n).catch(t => {
                                vc(`moveAndMaybeCompressFile: error truncating ${e}`, t), o(t);
                            });
                        });
                    }).on("error", e => {
                        i ? (vc(`moveAndMaybeCompressFile: error writing ${t}, deleting`, e), hc.unlink(t).then(() => {
                            o(e);
                        }).catch(e => {
                            vc(`moveAndMaybeCompressFile: error deleting ${t}`, e), o(e);
                        })) : (vc(`moveAndMaybeCompressFile: error creating ${t}`, e), o(e));
                    });
                }).catch(() => {});
            } else {
                vc(`moveAndMaybeCompressFile: renaming ${e} to ${t}`);
                try {
                    await hc.move(e, t, {
                        overwrite: !0
                    });
                } catch (r) {
                    if (vc(`moveAndMaybeCompressFile: error renaming ${e} to ${t}`, r), "ENOENT" !== r.code) {
                        vc("moveAndMaybeCompressFile: trying copy+truncate instead");
                        try {
                            await hc.copy(e, t, {
                                overwrite: !0
                            }), await hc.truncate(e);
                        } catch (e) {
                            vc("moveAndMaybeCompressFile: error copy+truncate", e);
                        }
                    }
                }
            }
        }
    } else {
        vc("moveAndMaybeCompressFile: source and target are the same, not doing anything");
    }
};

const mc = Ni("streamroller:RollingFileWriteStream"), Ec = lc, _c = r, Dc = a, bc = () => new Date, Oc = Ki, {Writable: Ac} = s, Cc = ({file: e, keepFileExt: t, needsIndex: r, alwaysIncludeDate: n, compress: o, fileNameSep: i}) => {
    let a = i || ".";
    const u = fc.join(e.dir, e.name), s = t => t + e.ext, l = (e, t, n) => !r && n || !t ? e : e + a + t, c = (e, t, r) => (t > 0 || n) && r ? e + a + r : e, f = (e, t) => t && o ? e + ".gz" : e, d = t ? [ c, l, s, f ] : [ s, c, l, f ];
    return ({date: e, index: t}) => (cc(`_formatFileName: date=${e}, index=${t}`), d.reduce((r, n) => n(r, t, e), u));
}, Sc = ({file: e, keepFileExt: t, pattern: r, fileNameSep: n}) => {
    let o = n || ".";
    const i = "__NOT_MATCHING__";
    let a = [ (e, t) => e.endsWith(".gz") ? (dc("it is gzipped"), t.isCompressed = !0, 
    e.slice(0, -3)) : e, t ? t => t.startsWith(e.name) && t.endsWith(e.ext) ? (dc("it starts and ends with the right things"), 
    t.slice(e.name.length + 1, -1 * e.ext.length)) : i : t => t.startsWith(e.base) ? (dc("it starts with the right things"), 
    t.slice(e.base.length + 1)) : i, r ? (e, t) => {
        const n = e.split(o);
        let i = n[n.length - 1];
        dc("items: ", n, ", indexStr: ", i);
        let a = e;
        void 0 !== i && i.match(/^\d+$/) ? (a = e.slice(0, -1 * (i.length + 1)), dc(`dateStr is ${a}`), 
        r && !a && (a = i, i = "0")) : i = "0";
        try {
            const n = pc.parse(r, a, new Date(0, 0));
            return pc.asString(r, n) !== a ? e : (t.index = parseInt(i, 10), t.date = a, t.timestamp = n.getTime(), 
            "");
        } catch (t) {
            return dc(`Problem parsing ${a} as ${r}, error was: `, t), e;
        }
    } : (e, t) => e.match(/^\d+$/) ? (dc("it has an index"), t.index = parseInt(e, 10), 
    "") : e ];
    return e => {
        let t = {
            filename: e,
            index: 0,
            isCompressed: !1
        };
        return a.reduce((e, r) => r(e, t), e) ? null : t;
    };
}, Mc = yc;

var wc = class extends Ac {
    constructor(e, t) {
        if (mc(`constructor: creating RollingFileWriteStream. path=${e}`), "string" != typeof e || 0 === e.length) {
            throw new Error(`Invalid filename: ${e}`);
        }
        if (e.endsWith(_c.sep)) {
            throw new Error(`Filename is a directory: ${e}`);
        }
        0 === e.indexOf(`~${_c.sep}`) && (e = e.replace("~", Dc.homedir())), super(t), this.options = this._parseOption(t), 
        this.fileObject = _c.parse(e), "" === this.fileObject.dir && (this.fileObject = _c.parse(_c.join(process.cwd(), e))), 
        this.fileFormatter = Cc({
            file: this.fileObject,
            alwaysIncludeDate: this.options.alwaysIncludePattern,
            needsIndex: this.options.maxSize < Number.MAX_SAFE_INTEGER,
            compress: this.options.compress,
            keepFileExt: this.options.keepFileExt,
            fileNameSep: this.options.fileNameSep
        }), this.fileNameParser = Sc({
            file: this.fileObject,
            keepFileExt: this.options.keepFileExt,
            pattern: this.options.pattern,
            fileNameSep: this.options.fileNameSep
        }), this.state = {
            currentSize: 0
        }, this.options.pattern && (this.state.currentDate = Oc(this.options.pattern, bc())), 
        this.filename = this.fileFormatter({
            index: 0,
            date: this.state.currentDate
        }), [ "a", "a+", "as", "as+" ].includes(this.options.flags) && this._setExistingSizeAndDate(), 
        mc(`constructor: create new file ${this.filename}, state=${JSON.stringify(this.state)}`), 
        this._renewWriteStream();
    }
    _setExistingSizeAndDate() {
        try {
            const e = Ec.statSync(this.filename);
            this.state.currentSize = e.size, this.options.pattern && (this.state.currentDate = Oc(this.options.pattern, e.mtime));
        } catch (e) {
            return;
        }
    }
    _parseOption(e) {
        const t = {
            maxSize: 0,
            numToKeep: Number.MAX_SAFE_INTEGER,
            encoding: "utf8",
            mode: parseInt("0600", 8),
            flags: "a",
            compress: !1,
            keepFileExt: !1,
            alwaysIncludePattern: !1
        }, r = Object.assign({}, t, e);
        if (r.maxSize) {
            if (r.maxSize <= 0) {
                throw new Error(`options.maxSize (${r.maxSize}) should be > 0`);
            }
        } else {
            delete r.maxSize;
        }
        if (r.numBackups || 0 === r.numBackups) {
            if (r.numBackups < 0) {
                throw new Error(`options.numBackups (${r.numBackups}) should be >= 0`);
            }
            if (r.numBackups >= Number.MAX_SAFE_INTEGER) {
                throw new Error(`options.numBackups (${r.numBackups}) should be < Number.MAX_SAFE_INTEGER`);
            }
            r.numToKeep = r.numBackups + 1;
        } else if (r.numToKeep <= 0) {
            throw new Error(`options.numToKeep (${r.numToKeep}) should be > 0`);
        }
        return mc(`_parseOption: creating stream with option=${JSON.stringify(r)}`), r;
    }
    _final(e) {
        this.currentFileStream.end("", this.options.encoding, e);
    }
    _write(e, t, r) {
        this._shouldRoll().then(() => {
            mc(`_write: writing chunk. file=${this.currentFileStream.path} state=${JSON.stringify(this.state)} chunk=${e}`), 
            this.currentFileStream.write(e, t, t => {
                this.state.currentSize += e.length, r(t);
            });
        });
    }
    async _shouldRoll() {
        (this._dateChanged() || this._tooBig()) && (mc(`_shouldRoll: rolling because dateChanged? ${this._dateChanged()} or tooBig? ${this._tooBig()}`), 
        await this._roll());
    }
    _dateChanged() {
        return this.state.currentDate && this.state.currentDate !== Oc(this.options.pattern, bc());
    }
    _tooBig() {
        return this.state.currentSize >= this.options.maxSize;
    }
    _roll() {
        return mc("_roll: closing the current stream"), new Promise((e, t) => {
            this.currentFileStream.end("", this.options.encoding, () => {
                this._moveOldFiles().then(e).catch(t);
            });
        });
    }
    async _moveOldFiles() {
        const e = await this._getExistingFiles();
        for (let t = (this.state.currentDate ? e.filter(e => e.date === this.state.currentDate) : e).length; t >= 0; t--) {
            mc(`_moveOldFiles: i = ${t}`);
            const e = this.fileFormatter({
                date: this.state.currentDate,
                index: t
            }), r = this.fileFormatter({
                date: this.state.currentDate,
                index: t + 1
            }), n = {
                compress: this.options.compress && 0 === t,
                mode: this.options.mode
            };
            await Mc(e, r, n);
        }
        this.state.currentSize = 0, this.state.currentDate = this.state.currentDate ? Oc(this.options.pattern, bc()) : null, 
        mc(`_moveOldFiles: finished rolling files. state=${JSON.stringify(this.state)}`), 
        this._renewWriteStream(), await new Promise((e, t) => {
            this.currentFileStream.write("", "utf8", () => {
                this._clean().then(e).catch(t);
            });
        });
    }
    async _getExistingFiles() {
        const e = await Ec.readdir(this.fileObject.dir).catch(() => []);
        mc(`_getExistingFiles: files=${e}`);
        const t = e.map(e => this.fileNameParser(e)).filter(e => e), r = e => (e.timestamp ? e.timestamp : bc().getTime()) - e.index;
        return t.sort((e, t) => r(e) - r(t)), t;
    }
    _renewWriteStream() {
        const e = this.fileFormatter({
            date: this.state.currentDate,
            index: 0
        }), t = e => {
            try {
                return Ec.mkdirSync(e, {
                    recursive: !0
                });
            } catch (r) {
                if ("ENOENT" === r.code) {
                    return t(_c.dirname(e)), t(e);
                }
                if ("EEXIST" !== r.code && "EROFS" !== r.code) {
                    throw r;
                }
                try {
                    if (Ec.statSync(e).isDirectory()) {
                        return e;
                    }
                    throw r;
                } catch (e) {
                    throw r;
                }
            }
        };
        t(this.fileObject.dir);
        const r = {
            flags: this.options.flags,
            encoding: this.options.encoding,
            mode: this.options.mode
        };
        var n, o;
        Ec.appendFileSync(e, "", (n = {
            ...r
        }, o = "flags", n["flag"] = n[o], delete n[o], n)), this.currentFileStream = Ec.createWriteStream(e, r), 
        this.currentFileStream.on("error", e => {
            this.emit("error", e);
        });
    }
    async _clean() {
        const e = await this._getExistingFiles();
        if (mc(`_clean: numToKeep = ${this.options.numToKeep}, existingFiles = ${e.length}`), 
        mc("_clean: existing files are: ", e), this._tooManyFiles(e.length)) {
            const r = e.slice(0, e.length - this.options.numToKeep).map(e => _c.format({
                dir: this.fileObject.dir,
                base: e.filename
            }));
            await (t = r, mc(`deleteFiles: files to delete: ${t}`), Promise.all(t.map(e => Ec.unlink(e).catch(t => {
                mc(`deleteFiles: error when unlinking ${e}, ignoring. Error was ${t}`);
            }))));
        }
        var t;
    }
    _tooManyFiles(e) {
        return this.options.numToKeep > 0 && e > this.options.numToKeep;
    }
};

const Fc = wc;

var Pc = class extends Fc {
    constructor(e, t, r, n) {
        n || (n = {}), t && (n.maxSize = t), n.numBackups || 0 === n.numBackups || (r || 0 === r || (r = 1), 
        n.numBackups = r), super(e, n), this.backups = n.numBackups, this.size = this.options.maxSize;
    }
    get theStream() {
        return this.currentFileStream;
    }
};

const Ic = wc;

var Rc = class extends Ic {
    constructor(e, t, r) {
        t && "object" == typeof t && (r = t, t = null), r || (r = {}), t || (t = "yyyy-MM-dd"), 
        r.pattern = t, r.numBackups || 0 === r.numBackups ? r.daysToKeep = r.numBackups : (r.daysToKeep || 0 === r.daysToKeep ? process.emitWarning("options.daysToKeep is deprecated due to the confusion it causes when used together with file size rolling. Please use options.numBackups instead.", "DeprecationWarning", "streamroller-DEP0001") : r.daysToKeep = 1, 
        r.numBackups = r.daysToKeep), super(e, r), this.mode = this.options.mode;
    }
    get theStream() {
        return this.currentFileStream;
    }
}, Tc = {
    RollingFileWriteStream: wc,
    RollingFileStream: Pc,
    DateRollingFileStream: Rc
};

const Lc = Ni("log4js:file"), jc = r, Nc = Tc, xc = a, kc = xc.EOL;

let Bc = !1;

const $c = new Set;

function Hc() {
    $c.forEach(e => {
        e.sighupHandler();
    });
}

su.configure = function(e, t) {
    let r = t.basicLayout;
    return e.layout && (r = t.layout(e.layout.type, e.layout)), e.mode = e.mode || 384, 
    function(e, t, r, n, o, i) {
        if ("string" != typeof e || 0 === e.length) {
            throw new Error(`Invalid filename: ${e}`);
        }
        if (e.endsWith(jc.sep)) {
            throw new Error(`Filename is a directory: ${e}`);
        }
        function a(e, t, r, n) {
            const o = new Nc.RollingFileStream(e, t, r, n);
            return o.on("error", t => {
                console.error("log4js.fileAppender - Writing to file %s, error happened ", e, t);
            }), o.on("drain", () => {
                process.emit("log4js:pause", !1);
            }), o;
        }
        e = e.replace(new RegExp(`^~(?=${jc.sep}.+)`), xc.homedir()), e = jc.normalize(e), 
        Lc("Creating file appender (", e, ", ", r, ", ", n = n || 0 === n ? n : 5, ", ", o, ", ", i, ")");
        let u = a(e, r, n, o);
        const s = function(e) {
            if (u.writable) {
                if (!0 === o.removeColor) {
                    const t = /\x1b[[0-9;]*m/g;
                    e.data = e.data.map(e => "string" == typeof e ? e.replace(t, "") : e);
                }
                u.write(t(e, i) + kc, "utf8") || process.emit("log4js:pause", !0);
            }
        };
        return s.reopen = function() {
            u.end(() => {
                u = a(e, r, n, o);
            });
        }, s.sighupHandler = function() {
            Lc("SIGHUP handler called."), s.reopen();
        }, s.shutdown = function(e) {
            $c.delete(s), 0 === $c.size && Bc && (process.removeListener("SIGHUP", Hc), Bc = !1), 
            u.end("", "utf-8", e);
        }, $c.add(s), Bc || (process.on("SIGHUP", Hc), Bc = !0), s;
    }(e.filename, r, e.maxLogSize, e.backups, e, e.timezoneOffset);
};

var Uc = {};

const Gc = Tc, Vc = a.EOL;

function Wc(e, t, r, n, o) {
    n.maxSize = n.maxLogSize;
    const i = function(e, t, r) {
        const n = new Gc.DateRollingFileStream(e, t, r);
        return n.on("error", t => {
            console.error("log4js.dateFileAppender - Writing to file %s, error happened ", e, t);
        }), n.on("drain", () => {
            process.emit("log4js:pause", !1);
        }), n;
    }(e, t, n), a = function(e) {
        i.writable && (i.write(r(e, o) + Vc, "utf8") || process.emit("log4js:pause", !0));
    };
    return a.shutdown = function(e) {
        i.end("", "utf-8", e);
    }, a;
}

Uc.configure = function(e, t) {
    let r = t.basicLayout;
    return e.layout && (r = t.layout(e.layout.type, e.layout)), e.alwaysIncludePattern || (e.alwaysIncludePattern = !1), 
    e.mode = e.mode || 384, Wc(e.filename, e.pattern, r, e, e.timezoneOffset);
};

var zc = {};

const Jc = Ni("log4js:fileSync"), Kc = r, qc = t, Xc = a, Yc = Xc.EOL;

function Zc(e, t) {
    const r = e => {
        try {
            return qc.mkdirSync(e, {
                recursive: !0
            });
        } catch (t) {
            if ("ENOENT" === t.code) {
                return r(Kc.dirname(e)), r(e);
            }
            if ("EEXIST" !== t.code && "EROFS" !== t.code) {
                throw t;
            }
            try {
                if (qc.statSync(e).isDirectory()) {
                    return e;
                }
                throw t;
            } catch (e) {
                throw t;
            }
        }
    };
    r(Kc.dirname(e)), qc.appendFileSync(e, "", {
        mode: t.mode,
        flag: t.flags
    });
}

class Qc {
    constructor(e, t, r, n) {
        if (Jc("In RollingFileStream"), t < 0) {
            throw new Error(`maxLogSize (${t}) should be > 0`);
        }
        this.filename = e, this.size = t, this.backups = r, this.options = n, this.currentSize = 0, 
        this.currentSize = function(e) {
            let t = 0;
            try {
                t = qc.statSync(e).size;
            } catch (t) {
                Zc(e, n);
            }
            return t;
        }(this.filename);
    }
    shouldRoll() {
        return Jc("should roll with current size %d, and max size %d", this.currentSize, this.size), 
        this.currentSize >= this.size;
    }
    roll(e) {
        const t = this, r = new RegExp(`^${Kc.basename(e)}`);
        function n(e) {
            return r.test(e);
        }
        function o(t) {
            return parseInt(t.slice(`${Kc.basename(e)}.`.length), 10) || 0;
        }
        function i(e, t) {
            return o(e) - o(t);
        }
        function a(r) {
            const n = o(r);
            if (Jc(`Index of ${r} is ${n}`), 0 === t.backups) {
                qc.truncateSync(e, 0);
            } else if (n < t.backups) {
                try {
                    qc.unlinkSync(`${e}.${n + 1}`);
                } catch (e) {}
                Jc(`Renaming ${r} -> ${e}.${n + 1}`), qc.renameSync(Kc.join(Kc.dirname(e), r), `${e}.${n + 1}`);
            }
        }
        Jc("Rolling, rolling, rolling"), Jc("Renaming the old files"), qc.readdirSync(Kc.dirname(e)).filter(n).sort(i).reverse().forEach(a);
    }
    write(e, t) {
        const r = this;
        Jc("in write"), this.shouldRoll() && (this.currentSize = 0, this.roll(this.filename)), 
        Jc("writing the chunk to the file"), r.currentSize += e.length, qc.appendFileSync(r.filename, e);
    }
}

zc.configure = function(e, t) {
    let r = t.basicLayout;
    e.layout && (r = t.layout(e.layout.type, e.layout));
    const n = {
        flags: e.flags || "a",
        encoding: e.encoding || "utf8",
        mode: e.mode || 384
    };
    return function(e, t, r, n, o, i) {
        if ("string" != typeof e || 0 === e.length) {
            throw new Error(`Invalid filename: ${e}`);
        }
        if (e.endsWith(Kc.sep)) {
            throw new Error(`Filename is a directory: ${e}`);
        }
        e = e.replace(new RegExp(`^~(?=${Kc.sep}.+)`), Xc.homedir()), e = Kc.normalize(e), 
        Jc("Creating fileSync appender (", e, ", ", r, ", ", n = n || 0 === n ? n : 5, ", ", o, ", ", i, ")");
        const a = function(e, t, r) {
            let n;
            var i;
            return t ? n = new Qc(e, t, r, o) : (Zc(i = e, o), n = {
                write(e) {
                    qc.appendFileSync(i, e);
                }
            }), n;
        }(e, r, n);
        return e => {
            a.write(t(e, i) + Yc);
        };
    }(e.filename, r, e.maxLogSize, e.backups, n, e.timezoneOffset);
};

var ef = {};

const tf = Ni("log4js:tcp"), rf = v;

ef.configure = function(e, t) {
    tf(`configure with config = ${e}`);
    let r = function(e) {
        return e.serialise();
    };
    return e.layout && (r = t.layout(e.layout.type, e.layout)), function(e, t) {
        let r = !1;
        const n = [];
        let o, i = 3, a = "__LOG4JS__";
        function u(e) {
            tf("Writing log event to socket"), r = o.write(`${t(e)}${a}`, "utf8");
        }
        function s() {
            let e;
            for (tf("emptying buffer"); e = n.shift(); ) {
                u(e);
            }
        }
        function l(e) {
            r ? u(e) : (tf("buffering log event because it cannot write at the moment"), n.push(e));
        }
        return function t() {
            tf(`appender creating socket to ${e.host || "localhost"}:${e.port || 5e3}`), a = `${e.endMsg || "__LOG4JS__"}`, 
            o = rf.createConnection(e.port || 5e3, e.host || "localhost"), o.on("connect", () => {
                tf("socket connected"), s(), r = !0;
            }), o.on("drain", () => {
                tf("drain event received, emptying buffer"), r = !0, s();
            }), o.on("timeout", o.end.bind(o)), o.on("error", e => {
                tf("connection error", e), r = !1, s();
            }), o.on("close", t);
        }(), l.shutdown = function(e) {
            tf("shutdown called"), n.length && i ? (tf("buffer has items, waiting 100ms to empty"), 
            i -= 1, setTimeout(() => {
                l.shutdown(e);
            }, 100)) : (o.removeAllListeners("close"), o.end(e));
        }, l;
    }(e, r);
};

const nf = r, of = Ni("log4js:appenders"), af = zi, uf = Ka, sf = ha, lf = fa, cf = qa, ff = new Map;

ff.set("console", Qa), ff.set("stdout", tu), ff.set("stderr", ru), ff.set("logLevelFilter", nu), 
ff.set("categoryFilter", ou), ff.set("noLogFilter", au), ff.set("file", su), ff.set("dateFile", Uc), 
ff.set("fileSync", zc), ff.set("tcp", ef);

const df = new Map, pf = (e, t) => {
    let r;
    try {
        const t = `${e}.cjs`;
        r = require.resolve(t), of("Loading module from ", t);
    } catch (t) {
        r = e, of("Loading module from ", e);
    }
    try {
        return require(r);
    } catch (r) {
        return void af.throwExceptionIf(t, "MODULE_NOT_FOUND" !== r.code, `appender "${e}" could not be loaded (error was: ${r})`);
    }
}, vf = new Set, hf = (e, t) => {
    if (df.has(e)) {
        return df.get(e);
    }
    if (!t.appenders[e]) {
        return !1;
    }
    if (vf.has(e)) {
        throw new Error(`Dependency loop detected for appender ${e}.`);
    }
    vf.add(e), of(`Creating appender ${e}`);
    const r = gf(e, t);
    return vf.delete(e), df.set(e, r), r;
}, gf = (e, t) => {
    const r = t.appenders[e], n = r.type.configure ? r.type : ((e, t) => ff.get(e) || pf(`./${e}`, t) || pf(e, t) || require.main && require.main.filename && pf(nf.join(nf.dirname(require.main.filename), e), t) || pf(nf.join(process.cwd(), e), t))(r.type, t);
    return af.throwExceptionIf(t, af.not(n), `appender "${e}" is not valid (type "${r.type}" could not be found)`), 
    n.appender && (process.emitWarning(`Appender ${r.type} exports an appender function.`, "DeprecationWarning", "log4js-node-DEP0001"), 
    of("[log4js-node-DEP0001]", `DEPRECATION: Appender ${r.type} exports an appender function.`)), 
    n.shutdown && (process.emitWarning(`Appender ${r.type} exports a shutdown function.`, "DeprecationWarning", "log4js-node-DEP0002"), 
    of("[log4js-node-DEP0002]", `DEPRECATION: Appender ${r.type} exports a shutdown function.`)), 
    of(`${e}: clustering.isMaster ? ${uf.isMaster()}`), of(`${e}: appenderModule is ${l.inspect(n)}`), 
    uf.onlyOnMaster(() => (of(`calling appenderModule.configure for ${e} / ${r.type}`), 
    n.configure(cf.modifyConfig(r), lf, e => hf(e, t), sf)), () => {});
}, yf = e => {
    if (df.clear(), vf.clear(), !e) {
        return;
    }
    const t = [];
    Object.values(e.categories).forEach(e => {
        t.push(...e.appenders);
    }), Object.keys(e.appenders).forEach(r => {
        (t.includes(r) || "tcp-server" === e.appenders[r].type || "multiprocess" === e.appenders[r].type) && hf(r, e);
    });
}, mf = () => {
    yf();
};

mf(), af.addListener(e => {
    af.throwExceptionIf(e, af.not(af.anObject(e.appenders)), 'must have a property "appenders" of type object.');
    const t = Object.keys(e.appenders);
    af.throwExceptionIf(e, af.not(t.length), "must define at least one appender."), 
    t.forEach(t => {
        af.throwExceptionIf(e, af.not(e.appenders[t].type), `appender "${t}" is not valid (must be an object with property "type")`);
    });
}), af.addListener(yf), ga.exports = df, ga.exports.init = mf;

var Ef = ga.exports, _f = {
    exports: {}
};

!function(e) {
    const t = Ni("log4js:categories"), r = zi, n = ha, o = Ef, i = new Map;
    function a(e, t, r) {
        if (!1 === t.inherit) {
            return;
        }
        const n = r.lastIndexOf(".");
        if (n < 0) {
            return;
        }
        const o = r.slice(0, n);
        let i = e.categories[o];
        i || (i = {
            inherit: !0,
            appenders: []
        }), a(e, i, o), !e.categories[o] && i.appenders && i.appenders.length && i.level && (e.categories[o] = i), 
        t.appenders = t.appenders || [], t.level = t.level || i.level, i.appenders.forEach(e => {
            t.appenders.includes(e) || t.appenders.push(e);
        }), t.parent = i;
    }
    function u(e) {
        if (!e.categories) {
            return;
        }
        Object.keys(e.categories).forEach(t => {
            const r = e.categories[t];
            a(e, r, t);
        });
    }
    r.addPreProcessingListener(e => u(e)), r.addListener(e => {
        r.throwExceptionIf(e, r.not(r.anObject(e.categories)), 'must have a property "categories" of type object.');
        const t = Object.keys(e.categories);
        r.throwExceptionIf(e, r.not(t.length), "must define at least one category."), t.forEach(t => {
            const i = e.categories[t];
            r.throwExceptionIf(e, [ r.not(i.appenders), r.not(i.level) ], `category "${t}" is not valid (must be an object with properties "appenders" and "level")`), 
            r.throwExceptionIf(e, r.not(Array.isArray(i.appenders)), `category "${t}" is not valid (appenders must be an array of appender names)`), 
            r.throwExceptionIf(e, r.not(i.appenders.length), `category "${t}" is not valid (appenders must contain at least one appender name)`), 
            Object.prototype.hasOwnProperty.call(i, "enableCallStack") && r.throwExceptionIf(e, "boolean" != typeof i.enableCallStack, `category "${t}" is not valid (enableCallStack must be boolean type)`), 
            i.appenders.forEach(n => {
                r.throwExceptionIf(e, r.not(o.get(n)), `category "${t}" is not valid (appender "${n}" is not defined)`);
            }), r.throwExceptionIf(e, r.not(n.getLevel(i.level)), `category "${t}" is not valid (level "${i.level}" not recognised; valid levels are ${n.levels.join(", ")})`);
        }), r.throwExceptionIf(e, r.not(e.categories.default), 'must define a "default" category.');
    });
    const s = e => {
        if (i.clear(), !e) {
            return;
        }
        Object.keys(e.categories).forEach(r => {
            const a = e.categories[r], u = [];
            a.appenders.forEach(e => {
                u.push(o.get(e)), t(`Creating category ${r}`), i.set(r, {
                    appenders: u,
                    level: n.getLevel(a.level),
                    enableCallStack: a.enableCallStack || !1
                });
            });
        });
    }, l = () => {
        s();
    };
    l(), r.addListener(s);
    const c = e => {
        if (t(`configForCategory: searching for config for ${e}`), i.has(e)) {
            return t(`configForCategory: ${e} exists in config, returning it`), i.get(e);
        }
        let r;
        return e.indexOf(".") > 0 ? (t(`configForCategory: ${e} has hierarchy, cloning from parents`), 
        r = {
            ...c(e.slice(0, e.lastIndexOf(".")))
        }) : (i.has("default") || s({
            categories: {
                default: {
                    appenders: [ "out" ],
                    level: "OFF"
                }
            }
        }), t("configForCategory: cloning default category"), r = {
            ...i.get("default")
        }), i.set(e, r), r;
    };
    e.exports = i, e.exports = Object.assign(e.exports, {
        appendersForCategory: e => c(e).appenders,
        getLevelForCategory: e => c(e).level,
        setLevelForCategory: (e, t) => {
            c(e).level = t;
        },
        getEnableCallStackForCategory: e => !0 === c(e).enableCallStack,
        setEnableCallStackForCategory: (e, t) => {
            c(e).enableCallStack = t;
        },
        init: l
    });
}(_f);

var Df = _f.exports;

const bf = Ni("log4js:logger"), Of = ja, Af = ha, Cf = Ka, Sf = Df, Mf = zi, wf = /at (?:(.+)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/;

function Ff(e, t = 4) {
    try {
        const r = e.stack.split("\n").slice(t);
        if (!r.length) {
            return null;
        }
        const n = wf.exec(r[0]);
        if (n && 6 === n.length) {
            let e = "", t = "", o = "";
            return n[1] && "" !== n[1] && ([t, o] = n[1].replace(/[[\]]/g, "").split(" as "), 
            o = o || "", t.includes(".") && ([e, t] = t.split("."))), {
                fileName: n[2],
                lineNumber: parseInt(n[3], 10),
                columnNumber: parseInt(n[4], 10),
                callStack: r.join("\n"),
                className: e,
                functionName: t,
                functionAlias: o,
                callerName: n[1] || ""
            };
        }
        console.error("log4js.logger - defaultParseCallStack error");
    } catch (e) {
        console.error("log4js.logger - defaultParseCallStack error", e);
    }
    return null;
}

let Pf = class {
    constructor(e) {
        if (!e) {
            throw new Error("No category provided.");
        }
        this.category = e, this.context = {}, this.callStackSkipIndex = 0, this.parseCallStack = Ff, 
        bf(`Logger created (${this.category}, ${this.level})`);
    }
    get level() {
        return Af.getLevel(Sf.getLevelForCategory(this.category), Af.OFF);
    }
    set level(e) {
        Sf.setLevelForCategory(this.category, Af.getLevel(e, this.level));
    }
    get useCallStack() {
        return Sf.getEnableCallStackForCategory(this.category);
    }
    set useCallStack(e) {
        Sf.setEnableCallStackForCategory(this.category, !0 === e);
    }
    get callStackLinesToSkip() {
        return this.callStackSkipIndex;
    }
    set callStackLinesToSkip(e) {
        if ("number" != typeof e) {
            throw new TypeError("Must be a number");
        }
        if (e < 0) {
            throw new RangeError("Must be >= 0");
        }
        this.callStackSkipIndex = e;
    }
    log(e, ...t) {
        const r = Af.getLevel(e);
        r ? this.isLevelEnabled(r) && this._log(r, t) : Mf.validIdentifier(e) && t.length > 0 ? (this.log(Af.WARN, "log4js:logger.log: valid log-level not found as first parameter given:", e), 
        this.log(Af.INFO, `[${e}]`, ...t)) : this.log(Af.INFO, e, ...t);
    }
    isLevelEnabled(e) {
        return this.level.isLessThanOrEqualTo(e);
    }
    _log(e, t) {
        bf(`sending log data (${e}) to appenders`);
        const r = t.find(e => e instanceof Error);
        let n;
        if (this.useCallStack) {
            try {
                r && (n = this.parseCallStack(r, this.callStackSkipIndex + 1));
            } catch (e) {}
            n = n || this.parseCallStack(new Error, this.callStackSkipIndex + 3 + 1);
        }
        const o = new Of(this.category, e, t, this.context, n, r);
        Cf.send(o);
    }
    addContext(e, t) {
        this.context[e] = t;
    }
    removeContext(e) {
        delete this.context[e];
    }
    clearContext() {
        this.context = {};
    }
    setParseCallStackFunction(e) {
        if ("function" == typeof e) {
            this.parseCallStack = e;
        } else {
            if (void 0 !== e) {
                throw new TypeError("Invalid type passed to setParseCallStackFunction");
            }
            this.parseCallStack = Ff;
        }
    }
};

function If(e) {
    const t = Af.getLevel(e), r = t.toString().toLowerCase().replace(/_([a-z])/g, e => e[1].toUpperCase()), n = r[0].toUpperCase() + r.slice(1);
    Pf.prototype[`is${n}Enabled`] = function() {
        return this.isLevelEnabled(t);
    }, Pf.prototype[r] = function(...e) {
        this.log(t, ...e);
    };
}

Af.levels.forEach(If), Mf.addListener(() => {
    Af.levels.forEach(If);
});

var Rf = Pf;

const Tf = ha;

function Lf(e) {
    return e.originalUrl || e.url;
}

function jf(e, t) {
    for (let r = 0; r < t.length; r++) {
        e = e.replace(t[r].token, t[r].replacement);
    }
    return e;
}

const Nf = Ni("log4js:recording"), xf = [];

function kf() {
    return xf.slice();
}

function Bf() {
    xf.length = 0;
}

var $f = {
    configure: function() {
        return function(e) {
            Nf(`received logEvent, number of events now ${xf.length + 1}`), Nf("log event was ", e), 
            xf.push(e);
        };
    },
    replay: kf,
    playback: kf,
    reset: Bf,
    erase: Bf
};

const Hf = Ni("log4js:main"), Uf = t, Gf = xi({
    proto: !0
}), Vf = zi, Wf = Ef, zf = Df, Jf = Rf, Kf = Ka, qf = function(e, t) {
    t = "string" == typeof t || "function" == typeof t ? {
        format: t
    } : t || {};
    const r = e;
    let n = Tf.getLevel(t.level, Tf.INFO);
    const o = t.format || ':remote-addr - - ":method :url HTTP/:http-version" :status :content-length ":referrer" ":user-agent"';
    return (e, i, a) => {
        if (void 0 !== e._logging) {
            return a();
        }
        if ("function" != typeof t.nolog) {
            const r = function(e) {
                let t = null;
                if (e instanceof RegExp && (t = e), "string" == typeof e && (t = new RegExp(e)), 
                Array.isArray(e)) {
                    const r = e.map(e => e.source ? e.source : e);
                    t = new RegExp(r.join("|"));
                }
                return t;
            }(t.nolog);
            if (r && r.test(e.originalUrl)) {
                return a();
            }
        }
        if (r.isLevelEnabled(n) || "auto" === t.level) {
            const a = new Date, {writeHead: u} = i;
            e._logging = !0, i.writeHead = (e, t) => {
                i.writeHead = u, i.writeHead(e, t), i.__statusCode = e, i.__headers = t || {};
            };
            let s = !1;
            const l = () => {
                if (s) {
                    return;
                }
                if (s = !0, "function" == typeof t.nolog && !0 === t.nolog(e, i)) {
                    return void (e._logging = !1);
                }
                i.responseTime = new Date - a, i.statusCode && "auto" === t.level && (n = Tf.INFO, 
                i.statusCode >= 300 && (n = Tf.WARN), i.statusCode >= 400 && (n = Tf.ERROR)), n = function(e, t, r) {
                    let n = t;
                    if (r) {
                        const t = r.find(t => {
                            let r = !1;
                            return r = t.from && t.to ? e >= t.from && e <= t.to : -1 !== t.codes.indexOf(e), 
                            r;
                        });
                        t && (n = Tf.getLevel(t.level, n));
                    }
                    return n;
                }(i.statusCode, n, t.statusRules);
                const u = function(e, t, r) {
                    const n = [];
                    return n.push({
                        token: ":url",
                        replacement: Lf(e)
                    }), n.push({
                        token: ":protocol",
                        replacement: e.protocol
                    }), n.push({
                        token: ":hostname",
                        replacement: e.hostname
                    }), n.push({
                        token: ":method",
                        replacement: e.method
                    }), n.push({
                        token: ":status",
                        replacement: t.__statusCode || t.statusCode
                    }), n.push({
                        token: ":response-time",
                        replacement: t.responseTime
                    }), n.push({
                        token: ":date",
                        replacement: (new Date).toUTCString()
                    }), n.push({
                        token: ":referrer",
                        replacement: e.headers.referer || e.headers.referrer || ""
                    }), n.push({
                        token: ":http-version",
                        replacement: `${e.httpVersionMajor}.${e.httpVersionMinor}`
                    }), n.push({
                        token: ":remote-addr",
                        replacement: e.headers["x-forwarded-for"] || e.ip || e._remoteAddress || e.socket && (e.socket.remoteAddress || e.socket.socket && e.socket.socket.remoteAddress)
                    }), n.push({
                        token: ":user-agent",
                        replacement: e.headers["user-agent"]
                    }), n.push({
                        token: ":content-length",
                        replacement: t.getHeader("content-length") || t.__headers && t.__headers["Content-Length"] || "-"
                    }), n.push({
                        token: /:req\[([^\]]+)]/g,
                        replacement: (t, r) => e.headers[r.toLowerCase()]
                    }), n.push({
                        token: /:res\[([^\]]+)]/g,
                        replacement: (e, r) => t.getHeader(r.toLowerCase()) || t.__headers && t.__headers[r]
                    }), (e => {
                        const t = e.concat();
                        for (let e = 0; e < t.length; ++e) {
                            for (let r = e + 1; r < t.length; ++r) {
                                t[e].token == t[r].token && t.splice(r--, 1);
                            }
                        }
                        return t;
                    })(r.concat(n));
                }(e, i, t.tokens || []);
                if (t.context && r.addContext("res", i), "function" == typeof o) {
                    const t = o(e, i, e => jf(e, u));
                    t && r.log(n, t);
                } else {
                    r.log(n, jf(o, u));
                }
                t.context && r.removeContext("res");
            };
            i.on("end", l), i.on("finish", l), i.on("error", l), i.on("close", l);
        }
        return a();
    };
}, Xf = $f;

let Yf = !1;

function Zf(e) {
    if (!Yf) {
        return;
    }
    Hf("Received log event ", e);
    zf.appendersForCategory(e.categoryName).forEach(t => {
        t(e);
    });
}

function Qf(e) {
    Yf && ed();
    let t = e;
    return "string" == typeof t && (t = function(e) {
        Hf(`Loading configuration from ${e}`);
        try {
            return JSON.parse(Uf.readFileSync(e, "utf8"));
        } catch (t) {
            throw new Error(`Problem reading config from file "${e}". Error was ${t.message}`, t);
        }
    }(e)), Hf(`Configuration is ${t}`), Vf.configure(Gf(t)), Kf.onMessage(Zf), Yf = !0, 
    td;
}

function ed(e = () => {}) {
    if ("function" != typeof e) {
        throw new TypeError("Invalid callback passed to shutdown");
    }
    Hf("Shutdown called. Disabling all log writing."), Yf = !1;
    const t = Array.from(Wf.values());
    Wf.init(), zf.init();
    const r = t.reduce((e, t) => t.shutdown ? e + 1 : e, 0);
    0 === r && (Hf("No appenders with shutdown functions found."), e());
    let n, o = 0;
    function i(t) {
        n = n || t, o += 1, Hf(`Appender shutdowns complete: ${o} / ${r}`), o >= r && (Hf("All shutdown functions completed."), 
        e(n));
    }
    Hf(`Found ${r} appenders with shutdown functions.`), t.filter(e => e.shutdown).forEach(e => e.shutdown(i));
}

const td = {
    getLogger: function(e) {
        return Yf || Qf(process.env.LOG4JS_CONFIG || {
            appenders: {
                out: {
                    type: "stdout"
                }
            },
            categories: {
                default: {
                    appenders: [ "out" ],
                    level: "OFF"
                }
            }
        }), new Jf(e || "default");
    },
    configure: Qf,
    shutdown: ed,
    connectLogger: qf,
    levels: ha,
    addLayout: fa.addLayout,
    recording: function() {
        return Xf;
    }
};

var rd = td;

!function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.coreParameter = e.defaultProperties = e.defaultStartParam = e.LogLevelMap = e.AnalyzeModeKeyMap = e.OldAnalyzeModeMap = e.AnalyzeModeMap = e.OptimizationStrategy = e.AnalyzeMode = e.CoreParameter = void 0;
    const t = rd;
    class r {
        constructor() {
            this._properties = {}, this._extParams = {}, this._startParams = {
                ...e.defaultStartParam
            }, this._workspaceDir = "";
        }
        get properties() {
            return this._properties;
        }
        set properties(e) {
            this._properties = e;
        }
        get extParams() {
            return this._extParams;
        }
        set extParams(e) {
            this._extParams = e;
        }
        get startParams() {
            return this._startParams;
        }
        get workspaceDir() {
            return this._workspaceDir;
        }
        set workspaceDir(e) {
            this._workspaceDir = e;
        }
        clean() {
            this._properties = {}, this._extParams = {}, this._startParams = {
                ...e.defaultStartParam
            }, this._workspaceDir = "";
        }
    }
    var n, o;
    e.CoreParameter = r, function(e) {
        e[e.NORMAL = 0] = "NORMAL", e[e.ADVANCED = 1] = "ADVANCED", e[e.FALSE = 2] = "FALSE";
    }(n = e.AnalyzeMode || (e.AnalyzeMode = {})), function(e) {
        e.PERFORMANCE = "performance", e.MEMORY = "memory";
    }(o = e.OptimizationStrategy || (e.OptimizationStrategy = {})), e.AnalyzeModeMap = new Map([ [ "default", n.NORMAL ], [ "verbose", n.ADVANCED ], [ !1, n.FALSE ], [ "false", n.FALSE ], [ "normal", n.NORMAL ], [ "advanced", n.ADVANCED ] ]), 
    e.OldAnalyzeModeMap = new Map([ [ "default", "normal" ], [ "verbose", "advanced" ] ]), 
    e.AnalyzeModeKeyMap = new Map([ [ n.NORMAL, "normal" ], [ n.ADVANCED, "advanced" ], [ n.FALSE, !1 ] ]), 
    e.LogLevelMap = new Map([ [ "info", t.levels.INFO ], [ 'debug"', t.levels.DEBUG ], [ 'warn"', t.levels.WARN ], [ 'error"', t.levels.ERROR ] ]), 
    e.defaultStartParam = {
        hvigorfileTypeCheck: !1,
        parallelExecution: !0,
        incrementalExecution: !0,
        printStackTrace: !1,
        daemon: !0,
        analyze: n.NORMAL,
        logLevel: t.levels.INFO,
        optimizationStrategy: o.MEMORY,
        hotCompile: !1,
        hotReloadBuild: !1
    }, e.defaultProperties = {
        enableSignTask: !0,
        skipNativeIncremental: !1,
        "hvigor.keepDependency": !0
    }, e.coreParameter = new r;
}(Ai);

var nd = {}, od = {}, id = {};

Object.defineProperty(id, "__esModule", {
    value: !0
}), id.Unicode = void 0;

class ad {}

id.Unicode = ad, ad.SPACE_SEPARATOR = /[\u1680\u2000-\u200A\u202F\u205F\u3000]/, 
ad.ID_START = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/, 
ad.ID_CONTINUE = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/, 
Object.defineProperty(od, "__esModule", {
    value: !0
}), od.JudgeUtil = void 0;

const ud = id;

od.JudgeUtil = class {
    static isIgnoreChar(e) {
        return "string" == typeof e && ("\t" === e || "\v" === e || "\f" === e || " " === e || " " === e || "\ufeff" === e || "\n" === e || "\r" === e || "\u2028" === e || "\u2029" === e);
    }
    static isSpaceSeparator(e) {
        return "string" == typeof e && ud.Unicode.SPACE_SEPARATOR.test(e);
    }
    static isIdStartChar(e) {
        return "string" == typeof e && (e >= "a" && e <= "z" || e >= "A" && e <= "Z" || "$" === e || "_" === e || ud.Unicode.ID_START.test(e));
    }
    static isIdContinueChar(e) {
        return "string" == typeof e && (e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e >= "0" && e <= "9" || "$" === e || "_" === e || "‌" === e || "‍" === e || ud.Unicode.ID_CONTINUE.test(e));
    }
    static isDigitWithoutZero(e) {
        return /[1-9]/.test(e);
    }
    static isDigit(e) {
        return "string" == typeof e && /[0-9]/.test(e);
    }
    static isHexDigit(e) {
        return "string" == typeof e && /[0-9A-Fa-f]/.test(e);
    }
};

var sd = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(nd, "__esModule", {
    value: !0
}), nd.parseJsonText = nd.parseJsonFile = void 0;

const ld = sd(t), cd = sd(a), fd = sd(r), dd = od;

var pd;

!function(e) {
    e[e.Char = 0] = "Char", e[e.EOF = 1] = "EOF", e[e.Identifier = 2] = "Identifier";
}(pd || (pd = {}));

let vd, hd, gd, yd, md, Ed, _d = "start", Dd = [], bd = 0, Od = 1, Ad = 0, Cd = !1, Sd = "default", Md = "'", wd = 1;

function Fd(e, t = !1) {
    hd = String(e), _d = "start", Dd = [], bd = 0, Od = 1, Ad = 0, yd = void 0, Cd = t;
    do {
        vd = Pd(), xd[_d]();
    } while ("eof" !== vd.type);
    return yd;
}

function Pd() {
    for (Sd = "default", md = "", Md = "'", wd = 1; ;) {
        Ed = Id();
        const e = Td[Sd]();
        if (e) {
            return e;
        }
    }
}

function Id() {
    if (hd[bd]) {
        return String.fromCodePoint(hd.codePointAt(bd));
    }
}

function Rd() {
    const e = Id();
    return "\n" === e ? (Od++, Ad = 0) : e ? Ad += e.length : Ad++, e && (bd += e.length), 
    e;
}

nd.parseJsonFile = function(e, t = !1, r = "utf-8") {
    const n = ld.default.readFileSync(fd.default.resolve(e), {
        encoding: r
    });
    try {
        return Fd(n, t);
    } catch (t) {
        if (t instanceof SyntaxError) {
            const r = t.message.split("at");
            if (2 === r.length) {
                throw new Error(`${r[0].trim()}${cd.default.EOL}\t at ${e}:${r[1].trim()}`);
            }
        }
        throw new Error(`${e} is not in valid JSON/JSON5 format.`);
    }
}, nd.parseJsonText = Fd;

const Td = {
    default() {
        switch (Ed) {
          case "/":
            return Rd(), void (Sd = "comment");

          case void 0:
            return Rd(), Ld("eof");
        }
        if (!dd.JudgeUtil.isIgnoreChar(Ed) && !dd.JudgeUtil.isSpaceSeparator(Ed)) {
            return Td[_d]();
        }
        Rd();
    },
    start() {
        Sd = "value";
    },
    beforePropertyName() {
        switch (Ed) {
          case "$":
          case "_":
            return md = Rd(), void (Sd = "identifierName");

          case "\\":
            return Rd(), void (Sd = "identifierNameStartEscape");

          case "}":
            return Ld("punctuator", Rd());

          case '"':
          case "'":
            return Md = Ed, Rd(), void (Sd = "string");
        }
        if (dd.JudgeUtil.isIdStartChar(Ed)) {
            return md += Rd(), void (Sd = "identifierName");
        }
        throw Hd(pd.Char, Rd());
    },
    afterPropertyName() {
        if (":" === Ed) {
            return Ld("punctuator", Rd());
        }
        throw Hd(pd.Char, Rd());
    },
    beforePropertyValue() {
        Sd = "value";
    },
    afterPropertyValue() {
        switch (Ed) {
          case ",":
          case "}":
            return Ld("punctuator", Rd());
        }
        throw Hd(pd.Char, Rd());
    },
    beforeArrayValue() {
        if ("]" === Ed) {
            return Ld("punctuator", Rd());
        }
        Sd = "value";
    },
    afterArrayValue() {
        switch (Ed) {
          case ",":
          case "]":
            return Ld("punctuator", Rd());
        }
        throw Hd(pd.Char, Rd());
    },
    end() {
        throw Hd(pd.Char, Rd());
    },
    comment() {
        switch (Ed) {
          case "*":
            return Rd(), void (Sd = "multiLineComment");

          case "/":
            return Rd(), void (Sd = "singleLineComment");
        }
        throw Hd(pd.Char, Rd());
    },
    multiLineComment() {
        switch (Ed) {
          case "*":
            return Rd(), void (Sd = "multiLineCommentAsterisk");

          case void 0:
            throw Hd(pd.Char, Rd());
        }
        Rd();
    },
    multiLineCommentAsterisk() {
        switch (Ed) {
          case "*":
            return void Rd();

          case "/":
            return Rd(), void (Sd = "default");

          case void 0:
            throw Hd(pd.Char, Rd());
        }
        Rd(), Sd = "multiLineComment";
    },
    singleLineComment() {
        switch (Ed) {
          case "\n":
          case "\r":
          case "\u2028":
          case "\u2029":
            return Rd(), void (Sd = "default");

          case void 0:
            return Rd(), Ld("eof");
        }
        Rd();
    },
    value() {
        switch (Ed) {
          case "{":
          case "[":
            return Ld("punctuator", Rd());

          case "n":
            return Rd(), jd("ull"), Ld("null", null);

          case "t":
            return Rd(), jd("rue"), Ld("boolean", !0);

          case "f":
            return Rd(), jd("alse"), Ld("boolean", !1);

          case "-":
          case "+":
            return "-" === Rd() && (wd = -1), void (Sd = "numerical");

          case ".":
          case "0":
          case "I":
          case "N":
            return void (Sd = "numerical");

          case '"':
          case "'":
            return Md = Ed, Rd(), md = "", void (Sd = "string");
        }
        if (void 0 === Ed || !dd.JudgeUtil.isDigitWithoutZero(Ed)) {
            throw Hd(pd.Char, Rd());
        }
        Sd = "numerical";
    },
    numerical() {
        switch (Ed) {
          case ".":
            return md = Rd(), void (Sd = "decimalPointLeading");

          case "0":
            return md = Rd(), void (Sd = "zero");

          case "I":
            return Rd(), jd("nfinity"), Ld("numeric", wd * (1 / 0));

          case "N":
            return Rd(), jd("aN"), Ld("numeric", NaN);
        }
        if (void 0 !== Ed && dd.JudgeUtil.isDigitWithoutZero(Ed)) {
            return md = Rd(), void (Sd = "decimalInteger");
        }
        throw Hd(pd.Char, Rd());
    },
    zero() {
        switch (Ed) {
          case ".":
          case "e":
          case "E":
            return void (Sd = "decimal");

          case "x":
          case "X":
            return md += Rd(), void (Sd = "hexadecimal");
        }
        return Ld("numeric", 0);
    },
    decimalInteger() {
        switch (Ed) {
          case ".":
          case "e":
          case "E":
            return void (Sd = "decimal");
        }
        if (!dd.JudgeUtil.isDigit(Ed)) {
            return Ld("numeric", wd * Number(md));
        }
        md += Rd();
    },
    decimal() {
        switch (Ed) {
          case ".":
            md += Rd(), Sd = "decimalFraction";
            break;

          case "e":
          case "E":
            md += Rd(), Sd = "decimalExponent";
        }
    },
    decimalPointLeading() {
        if (dd.JudgeUtil.isDigit(Ed)) {
            return md += Rd(), void (Sd = "decimalFraction");
        }
        throw Hd(pd.Char, Rd());
    },
    decimalFraction() {
        switch (Ed) {
          case "e":
          case "E":
            return md += Rd(), void (Sd = "decimalExponent");
        }
        if (!dd.JudgeUtil.isDigit(Ed)) {
            return Ld("numeric", wd * Number(md));
        }
        md += Rd();
    },
    decimalExponent() {
        switch (Ed) {
          case "+":
          case "-":
            return md += Rd(), void (Sd = "decimalExponentSign");
        }
        if (dd.JudgeUtil.isDigit(Ed)) {
            return md += Rd(), void (Sd = "decimalExponentInteger");
        }
        throw Hd(pd.Char, Rd());
    },
    decimalExponentSign() {
        if (dd.JudgeUtil.isDigit(Ed)) {
            return md += Rd(), void (Sd = "decimalExponentInteger");
        }
        throw Hd(pd.Char, Rd());
    },
    decimalExponentInteger() {
        if (!dd.JudgeUtil.isDigit(Ed)) {
            return Ld("numeric", wd * Number(md));
        }
        md += Rd();
    },
    hexadecimal() {
        if (dd.JudgeUtil.isHexDigit(Ed)) {
            return md += Rd(), void (Sd = "hexadecimalInteger");
        }
        throw Hd(pd.Char, Rd());
    },
    hexadecimalInteger() {
        if (!dd.JudgeUtil.isHexDigit(Ed)) {
            return Ld("numeric", wd * Number(md));
        }
        md += Rd();
    },
    identifierNameStartEscape() {
        if ("u" !== Ed) {
            throw Hd(pd.Char, Rd());
        }
        Rd();
        const e = Nd();
        switch (e) {
          case "$":
          case "_":
            break;

          default:
            if (!dd.JudgeUtil.isIdStartChar(e)) {
                throw Hd(pd.Identifier);
            }
        }
        md += e, Sd = "identifierName";
    },
    identifierName() {
        switch (Ed) {
          case "$":
          case "_":
          case "‌":
          case "‍":
            return void (md += Rd());

          case "\\":
            return Rd(), void (Sd = "identifierNameEscape");
        }
        if (!dd.JudgeUtil.isIdContinueChar(Ed)) {
            return Ld("identifier", md);
        }
        md += Rd();
    },
    identifierNameEscape() {
        if ("u" !== Ed) {
            throw Hd(pd.Char, Rd());
        }
        Rd();
        const e = Nd();
        switch (e) {
          case "$":
          case "_":
          case "‌":
          case "‍":
            break;

          default:
            if (!dd.JudgeUtil.isIdContinueChar(e)) {
                throw Hd(pd.Identifier);
            }
        }
        md += e, Sd = "identifierName";
    },
    string() {
        switch (Ed) {
          case "\\":
            return Rd(), void (md += function() {
                const e = Id(), t = function() {
                    switch (Id()) {
                      case "b":
                        return Rd(), "\b";

                      case "f":
                        return Rd(), "\f";

                      case "n":
                        return Rd(), "\n";

                      case "r":
                        return Rd(), "\r";

                      case "t":
                        return Rd(), "\t";

                      case "v":
                        return Rd(), "\v";
                    }
                    return;
                }();
                if (t) {
                    return t;
                }
                switch (e) {
                  case "0":
                    if (Rd(), dd.JudgeUtil.isDigit(Id())) {
                        throw Hd(pd.Char, Rd());
                    }
                    return "\0";

                  case "x":
                    return Rd(), function() {
                        let e = "", t = Id();
                        if (!dd.JudgeUtil.isHexDigit(t)) {
                            throw Hd(pd.Char, Rd());
                        }
                        if (e += Rd(), t = Id(), !dd.JudgeUtil.isHexDigit(t)) {
                            throw Hd(pd.Char, Rd());
                        }
                        return e += Rd(), String.fromCodePoint(parseInt(e, 16));
                    }();

                  case "u":
                    return Rd(), Nd();

                  case "\n":
                  case "\u2028":
                  case "\u2029":
                    return Rd(), "";

                  case "\r":
                    return Rd(), "\n" === Id() && Rd(), "";
                }
                if (void 0 === e || dd.JudgeUtil.isDigitWithoutZero(e)) {
                    throw Hd(pd.Char, Rd());
                }
                return Rd();
            }());

          case '"':
          case "'":
            if (Ed === Md) {
                const e = Ld("string", md);
                return Rd(), e;
            }
            return void (md += Rd());

          case "\n":
          case "\r":
          case void 0:
            throw Hd(pd.Char, Rd());

          case "\u2028":
          case "\u2029":
            !function(e) {
                console.warn(`JSON5: '${$d(e)}' in strings is not valid ECMAScript; consider escaping.`);
            }(Ed);
        }
        md += Rd();
    }
};

function Ld(e, t) {
    return {
        type: e,
        value: t,
        line: Od,
        column: Ad
    };
}

function jd(e) {
    for (const t of e) {
        if (Id() !== t) {
            throw Hd(pd.Char, Rd());
        }
        Rd();
    }
}

function Nd() {
    let e = "", t = 4;
    for (;t-- > 0; ) {
        const t = Id();
        if (!dd.JudgeUtil.isHexDigit(t)) {
            throw Hd(pd.Char, Rd());
        }
        e += Rd();
    }
    return String.fromCodePoint(parseInt(e, 16));
}

const xd = {
    start() {
        if ("eof" === vd.type) {
            throw Hd(pd.EOF);
        }
        kd();
    },
    beforePropertyName() {
        switch (vd.type) {
          case "identifier":
          case "string":
            return gd = vd.value, void (_d = "afterPropertyName");

          case "punctuator":
            return void Bd();

          case "eof":
            throw Hd(pd.EOF);
        }
    },
    afterPropertyName() {
        if ("eof" === vd.type) {
            throw Hd(pd.EOF);
        }
        _d = "beforePropertyValue";
    },
    beforePropertyValue() {
        if ("eof" === vd.type) {
            throw Hd(pd.EOF);
        }
        kd();
    },
    afterPropertyValue() {
        if ("eof" === vd.type) {
            throw Hd(pd.EOF);
        }
        switch (vd.value) {
          case ",":
            return void (_d = "beforePropertyName");

          case "}":
            Bd();
        }
    },
    beforeArrayValue() {
        if ("eof" === vd.type) {
            throw Hd(pd.EOF);
        }
        "punctuator" !== vd.type || "]" !== vd.value ? kd() : Bd();
    },
    afterArrayValue() {
        if ("eof" === vd.type) {
            throw Hd(pd.EOF);
        }
        switch (vd.value) {
          case ",":
            return void (_d = "beforeArrayValue");

          case "]":
            Bd();
        }
    },
    end() {}
};

function kd() {
    const e = function() {
        let e;
        switch (vd.type) {
          case "punctuator":
            switch (vd.value) {
              case "{":
                e = {};
                break;

              case "[":
                e = [];
            }
            break;

          case "null":
          case "boolean":
          case "numeric":
          case "string":
            e = vd.value;
        }
        return e;
    }();
    if (Cd && "object" == typeof e && (e._line = Od, e._column = Ad), void 0 === yd) {
        yd = e;
    } else {
        const t = Dd[Dd.length - 1];
        Array.isArray(t) ? Cd && "object" != typeof e ? t.push({
            value: e,
            _line: Od,
            _column: Ad
        }) : t.push(e) : t[gd] = Cd && "object" != typeof e ? {
            value: e,
            _line: Od,
            _column: Ad
        } : e;
    }
    !function(e) {
        if (e && "object" == typeof e) {
            Dd.push(e), _d = Array.isArray(e) ? "beforeArrayValue" : "beforePropertyName";
        } else {
            const e = Dd[Dd.length - 1];
            _d = e ? Array.isArray(e) ? "afterArrayValue" : "afterPropertyValue" : "end";
        }
    }(e);
}

function Bd() {
    Dd.pop();
    const e = Dd[Dd.length - 1];
    _d = e ? Array.isArray(e) ? "afterArrayValue" : "afterPropertyValue" : "end";
}

function $d(e) {
    const t = {
        "'": "\\'",
        '"': '\\"',
        "\\": "\\\\",
        "\b": "\\b",
        "\f": "\\f",
        "\n": "\\n",
        "\r": "\\r",
        "\t": "\\t",
        "\v": "\\v",
        "\0": "\\0",
        "\u2028": "\\u2028",
        "\u2029": "\\u2029"
    };
    if (t[e]) {
        return t[e];
    }
    if (e < " ") {
        const t = e.charCodeAt(0).toString(16);
        return `\\x${`00${t}`.substring(t.length)}`;
    }
    return e;
}

function Hd(e, t) {
    let r = "";
    switch (e) {
      case pd.Char:
        r = void 0 === t ? `JSON5: invalid end of input at ${Od}:${Ad}` : `JSON5: invalid character '${$d(t)}' at ${Od}:${Ad}`;
        break;

      case pd.EOF:
        r = `JSON5: invalid end of input at ${Od}:${Ad}`;
        break;

      case pd.Identifier:
        Ad -= 5, r = `JSON5: invalid identifier character at ${Od}:${Ad}`;
    }
    const n = new Ud(r);
    return n.lineNumber = Od, n.columnNumber = Ad, n;
}

class Ud extends SyntaxError {}

var Gd = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Oi, "__esModule", {
    value: !0
}), Oi.HvigorConfigLoader = void 0;

const Vd = Gd(t), Wd = Gd(r), zd = Gd(n), Jd = Ai, Kd = sr, qd = cr, Xd = nd;

class Yd {
    constructor() {
        this.configPropertyMap = new Map;
        const e = Wd.default.resolve(qd.HVIGOR_PROJECT_WRAPPER_HOME, Kd.DEFAULT_HVIGOR_CONFIG_JSON_FILE_NAME);
        if (!Vd.default.existsSync(e)) {
            return;
        }
        const t = (0, Xd.parseJsonFile)(e), r = Wd.default.resolve(qd.HVIGOR_USER_HOME, Kd.DEFAULT_HVIGOR_CONFIG_JSON_FILE_NAME);
        let n;
        Vd.default.existsSync(r) && (n = (0, Xd.parseJsonFile)(r), t.properties = {
            ...n.properties,
            ...t.properties
        }), this.hvigorConfig = t;
    }
    static init(e) {
        var t, r;
        if (void 0 === e) {
            return void (zd.default.env.config = void 0);
        }
        const n = Yd.getConfigs();
        let o = {};
        null === (t = e.config) || void 0 === t || t.forEach(e => {
            const t = e.split("=");
            2 === t.length && (o[t[0]] = t[t.length - 1], this.initCommandLineProperties(t[0], t[t.length - 1]));
        }), Array.isArray(e.prop) && (null === (r = e.prop) || void 0 === r || r.forEach(e => {
            const t = e.split("=");
            2 === t.length && (o[t[0]] = t[t.length - 1], this.initCommandLineProperties(t[0], t[t.length - 1]));
        })), o = {
            ...n,
            ...o
        }, zd.default.env.config = JSON.stringify(o);
    }
    static initCommandLineProperties(e, t) {
        if (!e.startsWith(`${Kd.PROPERTIES + Kd.DOT}`)) {
            return;
        }
        const r = e.substring(`${Kd.PROPERTIES + Kd.DOT}`.length);
        Jd.coreParameter.properties[r] = this.convertToParamValue(t);
    }
    static convertToParamValue(e) {
        let t = Number(e);
        return e.length <= 16 && !isNaN(t) ? t : (t = "true" === e || "false" !== e && t, 
        "boolean" == typeof t ? t : e.trim());
    }
    getHvigorConfig() {
        return this.hvigorConfig;
    }
    getPropertiesConfigValue(e) {
        var t;
        if (this.configPropertyMap.has(e)) {
            return this.configPropertyMap.get(e);
        }
        const r = Yd.getConfigs()["properties.".concat(e)], n = void 0 !== zd.default.env.config && null !== (t = JSON.parse(zd.default.env.config)["properties.".concat(e)]) && void 0 !== t ? t : r;
        if (void 0 !== n) {
            const t = this.parseConfigValue(n);
            return this.configPropertyMap.set(e, t), t;
        }
        if (void 0 === this.hvigorConfig) {
            return void this.configPropertyMap.set(e, void 0);
        }
        const o = this.hvigorConfig.properties ? this.hvigorConfig.properties[e] : void 0;
        return this.configPropertyMap.set(e, o), o;
    }
    static clean() {
        Yd.instance && (Yd.instance = void 0), Yd.config && (Yd.config = void 0);
    }
    static getInstance() {
        return Yd.instance || (Yd.instance = new Yd), Yd.instance;
    }
    static getConfigs() {
        if (this.config) {
            return this.config;
        }
        const e = zd.default.argv.slice(2), t = /^(--config|-c).*/, r = /^(--config|-c)$/, n = {};
        for (const [o, i] of e.entries()) {
            if (r.test(i)) {
                const t = e[o + 1].split("=");
                2 === t.length && (n[t[0]] = t[t.length - 1]);
            } else if (t.test(i)) {
                const e = i.match(t);
                if (e && e[0].length < i.length) {
                    const t = i.substring(e[0].length).split("=");
                    2 === t.length && (n[t[0]] = t[t.length - 1]);
                }
            }
        }
        return this.config = n, n;
    }
    parseConfigValue(e) {
        if ("true" === e.toLowerCase()) {
            return !0;
        }
        if ("false" === e.toLowerCase()) {
            return !1;
        }
        const t = Number(e);
        return isNaN(t) ? e : t;
    }
}

Oi.HvigorConfigLoader = Yd, Yd.config = void 0;

var Zd = {}, Qd = {}, ep = {}, tp = {}, rp = {};

!function(e) {
    var t;
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.ToolErrorCode = e.ErrorOwnerShip = void 0, (t = e.ErrorOwnerShip || (e.ErrorOwnerShip = {})).EOS_0 = "0", 
    t.EOS_1 = "1", t.EOS_2 = "2", t.EOS_3 = "3", t.EOS_4 = "4", t.EOS_5 = "5", t.EOS_6 = "6", 
    t.EOS_7 = "7", function(e) {
        e.TEC_00 = "00", e.TEC_10 = "10", e.TEC_11 = "11", e.TEC_12 = "12", e.TEC_21 = "21", 
        e.TEC_22 = "22", e.TEC_23 = "23", e.TEC_24 = "24";
    }(e.ToolErrorCode || (e.ToolErrorCode = {}));
}(rp);

var np = {}, op = {}, ip = {};

!function(e) {
    var n = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.getUrl = e.DEVELOPER_URL = void 0;
    const o = n(t), i = n(r);
    e.DEVELOPER_URL = "DEVELOPER_URL";
    const a = i.default.resolve(__dirname, "../../res/config.json");
    e.getUrl = function(e) {
        const t = function(e, t = "utf-8") {
            if (o.default.existsSync(e)) {
                try {
                    const r = o.default.readFileSync(e, {
                        encoding: t
                    });
                    return JSON.parse(r);
                } catch (e) {
                    return;
                }
            }
        }(a);
        if (t && t[e]) {
            return t[e];
        }
    };
}(ip), function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.ErrorCodeDescription = e.ErrorCode = e.MetricLogType = e.LogLevel = e.SubSystemEnum = e.MergeKeyEnum = e.MergeType = e.CountryEnum = e.DEFAULT_MORE_INFO_URL_EN = e.DEFAULT_MORE_INFO_URL_CN = e.SPLIT_TAG = e.NORMAL_LOG_TYPE = e.PLUGIN_LOG_TYPE = e.HVIGOR_USER_HOME_DIR_NAME = e.BUILD_CACHE_DIR = e.UNDEFINED_POS = e.UNDEFINED_CAUSE = e.UNDEFINED_DESC = e.UNDEFINED_CODE = void 0;
    const t = ip;
    var r, n;
    e.UNDEFINED_CODE = "00000000", e.UNDEFINED_DESC = "", e.UNDEFINED_CAUSE = "Unknown", 
    e.UNDEFINED_POS = "", e.BUILD_CACHE_DIR = "build-cache-dir", e.HVIGOR_USER_HOME_DIR_NAME = ".hvigor", 
    e.PLUGIN_LOG_TYPE = "plugin_log", e.NORMAL_LOG_TYPE = "normal_log", e.SPLIT_TAG = "<HVIGOR_ERROR_SPLIT>", 
    e.DEFAULT_MORE_INFO_URL_CN = (0, t.getUrl)(t.DEVELOPER_URL) ? `${(0, t.getUrl)(t.DEVELOPER_URL)}/consumer/cn/customerService` : void 0, 
    e.DEFAULT_MORE_INFO_URL_EN = (0, t.getUrl)(t.DEVELOPER_URL) ? `${(0, t.getUrl)(t.DEVELOPER_URL)}/consumer/en/customerService` : void 0, 
    (n = e.CountryEnum || (e.CountryEnum = {})).CN = "cn", n.EN = "en", function(e) {
        e[e.COLLECT_LAST = 1] = "COLLECT_LAST", e[e.COLLECT_FIRST = 2] = "COLLECT_FIRST", 
        e[e.COLLECT_ALL = 3] = "COLLECT_ALL";
    }(e.MergeType || (e.MergeType = {})), function(e) {
        e.CODE = "code", e.CAUSE = "cause", e.POSITION = "position", e.SOLUTIONS = "solutions", 
        e.MORE_INFO = "moreInfo";
    }(e.MergeKeyEnum || (e.MergeKeyEnum = {})), function(e) {
        e.UNKNOWN = "000", e.HVIGOR = "103", e.PACKAGE = "200";
    }(e.SubSystemEnum || (e.SubSystemEnum = {})), function(e) {
        e.DEBUG = "debug", e.INFO = "info", e.WARN = "warn", e.ERROR = "error";
    }(e.LogLevel || (e.LogLevel = {})), function(e) {
        e.DEBUG = "debug", e.INFO = "info", e.WARN = "warn", e.ERROR = "error", e.DETAIL = "detail";
    }(e.MetricLogType || (e.MetricLogType = {})), function(e) {
        e.ERROR_00 = "00", e.ERROR_01 = "01", e.ERROR_02 = "02", e.ERROR_03 = "03", e.ERROR_04 = "04", 
        e.ERROR_05 = "05", e.ERROR_06 = "06", e.ERROR_07 = "07", e.ERROR_08 = "08", e.ERROR_09 = "09";
    }(r = e.ErrorCode || (e.ErrorCode = {})), e.ErrorCodeDescription = {
        [r.ERROR_00]: "Unknown Error",
        [r.ERROR_01]: "Dependency Error",
        [r.ERROR_02]: "Script Error",
        [r.ERROR_03]: "Configuration Error",
        [r.ERROR_04]: "Not Found",
        [r.ERROR_05]: "Syntax Error",
        [r.ERROR_06]: "Specification Limit Violation",
        [r.ERROR_07]: "Permissions Error",
        [r.ERROR_08]: "Operation Error",
        [r.ERROR_09]: "ArkTS Compiler Error"
    };
}(op);

var ap = {}, up = {};

!function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.AdaptorError = void 0;
    class t extends Error {
        constructor(e, r) {
            super(e), this.name = t.NAME, r && (this.stack = r);
        }
    }
    e.AdaptorError = t, t.NAME = "AdaptorError";
}(up);

var sp = {}, lp = {};

!function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.HvigorLogInfo = void 0;
    const t = op;
    e.HvigorLogInfo = class {
        constructor(e) {
            this.message = "", this.logLevel = t.LogLevel.DEBUG, e && (this.message = e.message, 
            this.logLevel = e.logLevel);
        }
        setMessage(e) {
            return this.message = e, this;
        }
        setLogLevel(e) {
            return this.logLevel = e, this;
        }
        getMessage() {
            return this.message;
        }
        getLogLevel() {
            return this.logLevel;
        }
    };
}(lp), function(e) {
    var t = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.HvigorErrorCommonAdapter = void 0;
    const r = t(a), n = m, o = lp, i = op;
    class u {
        convertErrorToLogInfo(e) {
            return new o.HvigorLogInfo({
                message: u.red + this.combinePhase(e) + u.reset,
                logLevel: i.LogLevel.ERROR
            });
        }
        convertWarnToLogInfo(e) {
            return new o.HvigorLogInfo({
                message: u.yellow + e + u.reset,
                logLevel: i.LogLevel.WARN
            });
        }
        convertInfoToLogInfo(e) {
            return new o.HvigorLogInfo({
                message: u.green + e + u.reset,
                logLevel: i.LogLevel.INFO
            });
        }
        convertDebugToLogInfo(e) {
            return new o.HvigorLogInfo({
                message: e,
                logLevel: i.LogLevel.DEBUG
            });
        }
        combinePhase(e) {
            return this.combinePhase1(e) + `${r.default.EOL}` + this.combinePhase2(e) + `${r.default.EOL}` + this.combinePhase3(e);
        }
        combinePhase1(e) {
            return `${e.getCode()} ${e.getDescription()}`;
        }
        combinePhase2(e) {
            const t = " At ", r = t + e.getPosition();
            return `Error Message: ${e.getCause()}${r === t ? "" : r}`.includes(i.SPLIT_TAG) ? this.composeCauseAndPosition(e.getCause(), e.getPosition()) : `Error Message: ${e.getCause()}${r === t ? "" : r}`;
        }
        composeCauseAndPosition(e, t) {
            let r = "Error Message: ";
            const n = " At ", o = e.split(i.SPLIT_TAG), a = t.split(i.SPLIT_TAG);
            return r = o.length === a.length ? this.composeCauseAndPositionWithSameLength(o, a, n, r) : this.composeCauseAndPositionWithUnSameLength(o, a, ` ${n}`, r), 
            r;
        }
        composeCauseAndPositionWithSameLength(e, t, n, o) {
            for (let i = 0; i < e.length; i++) {
                o += e[i] + (n + t[i]) + `${r.default.EOL}`;
            }
            return o.slice(0, -`${r.default.EOL}`.length);
        }
        composeCauseAndPositionWithUnSameLength(e, t, n, o) {
            for (let t = 0; t < e.length; t++) {
                o += e[t] + `${r.default.EOL}`;
            }
            for (let e = 0; e < t.length; e++) {
                o += n + t[e] + `${r.default.EOL}`;
            }
            return o.slice(0, -`${r.default.EOL}`.length);
        }
        combinePhase3(e) {
            let t = `${r.default.EOL}* Try the following:${r.default.EOL}`;
            const o = e.getSolutions();
            if (!(o instanceof Array && o.length > 0)) {
                return "";
            }
            o.forEach(e => {
                t += `  > ${e}${r.default.EOL}`;
            });
            const i = e.getMoreInfo();
            if (i) {
                const e = i[(0, n.getOsLanguage)()];
                t += `  > More info: ${e}${r.default.EOL}`;
            }
            return t;
        }
    }
    e.HvigorErrorCommonAdapter = u, u.red = "[31m", u.green = "[32m", u.yellow = "[33m", 
    u.blue = "[34m", u.reset = "[39m";
}(sp);

var cp = {};

!function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.HvigorErrorInfo = void 0;
    const t = op;
    e.HvigorErrorInfo = class {
        constructor(e) {
            this.code = t.UNDEFINED_CODE, this.description = t.UNDEFINED_DESC, this.cause = t.UNDEFINED_CAUSE, 
            this.position = t.UNDEFINED_POS, this.solutions = [], e && (this.code = e.code, 
            this.description = e.description, this.cause = e.cause, this.position = e.position, 
            this.solutions = e.solutions, this.moreInfo = e.moreInfo);
        }
        getCode() {
            return this.code;
        }
        getDescription() {
            return this.description;
        }
        getCause() {
            return this.cause;
        }
        getPosition() {
            return this.position;
        }
        getSolutions() {
            return this.solutions;
        }
        getMoreInfo() {
            return this.moreInfo;
        }
        checkInfo() {
            return this.checkCode() && this.checkCause();
        }
        checkCode() {
            return !!this.code && (8 === this.code.length && !!/[0-9]{8}/g.test(this.code));
        }
        checkCause() {
            return !!this.cause && (this.code === t.UNDEFINED_CODE ? this.cause === t.UNDEFINED_CAUSE : "" !== this.cause && void 0 !== this.cause && null !== this.cause);
        }
    };
}(cp), function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.ErrorUtil = void 0;
    const t = op, r = up, n = sp, o = cp;
    class i {
        static getRealError(e) {
            return e instanceof o.HvigorErrorInfo ? e : new o.HvigorErrorInfo({
                code: (null == e ? void 0 : e.code) || t.UNDEFINED_CODE,
                cause: (null == e ? void 0 : e.cause) || t.UNDEFINED_CAUSE,
                description: (null == e ? void 0 : e.description) || t.UNDEFINED_DESC,
                position: (null == e ? void 0 : e.position) || t.UNDEFINED_POS,
                solutions: (null == e ? void 0 : e.solutions) || [],
                moreInfo: null == e ? void 0 : e.moreInfo
            });
        }
        static combinePhase(e) {
            if (!e.description) {
                const r = this.getErrorTypeCodeFromErrorCode(e.code);
                if (r) {
                    const n = t.ErrorCodeDescription[r];
                    e.description = null != n ? n : e.description;
                }
            }
            const r = i.getRealError(e);
            return (new n.HvigorErrorCommonAdapter).convertErrorToLogInfo(r).getMessage();
        }
        static getErrorTypeCodeFromErrorCode(e) {
            if (e && !(e.length < 5)) {
                return e.slice(3, 5);
            }
        }
        static getFirstErrorAdaptorMessage(e) {
            var t;
            return null !== (t = e[0]) && void 0 !== t ? t : {
                message: ""
            };
        }
        static isAdaptorError(e) {
            return e.name === r.AdaptorError.NAME || e instanceof r.AdaptorError;
        }
    }
    e.ErrorUtil = i;
}(ap);

var fp = {}, dp = {};

!function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.ErrorAdaptor = void 0;
    e.ErrorAdaptor = class {};
}(dp);

var pp = {};

!function(e) {
    var t = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.EIGHT_DIGIT_ERROR_REGEXP = e.MATCH_FIELD_TYPES = e.ERROR_MESSAGE_HIDDEN = e.ERROR_NOT_MATCH = e.DEFAULT_ERROR_CODE = e.ErrorCodeToFile = e.ERROR_INFO_DIRCTORY_PATH = void 0;
    const n = t(r), o = rp;
    e.ERROR_INFO_DIRCTORY_PATH = n.default.resolve(__dirname, "../../res/error"), e.ErrorCodeToFile = {
        [o.ToolErrorCode.TEC_00]: "global.json",
        [o.ToolErrorCode.TEC_10]: "hvigor.json",
        [o.ToolErrorCode.TEC_11]: "hvigor-ohos-plugin.json",
        [o.ToolErrorCode.TEC_12]: "hvigor-compiler.json",
        [o.ToolErrorCode.TEC_21]: "ark-compiler-toolchain.json",
        [o.ToolErrorCode.TEC_22]: "pack-tool.json",
        [o.ToolErrorCode.TEC_23]: "restool.json",
        [o.ToolErrorCode.TEC_24]: "sign-tool.json"
    }, e.DEFAULT_ERROR_CODE = "00000000", e.ERROR_NOT_MATCH = "The error information does not match.", 
    e.ERROR_MESSAGE_HIDDEN = "Error message is hidden for security reasons", e.MATCH_FIELD_TYPES = [ "none", "id", "checkMessage", "code" ], 
    e.EIGHT_DIGIT_ERROR_REGEXP = {
        PATTERN: "ERROR.{0,12}(?<code>\\d{8})(?!\\d)",
        FLAGS: "gis"
    };
}(pp);

var vp, hp, gp = {}, yp = {};

function mp() {
    return vp || (vp = 1, function(e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.HvigorErrorAdaptor = void 0;
        const t = dp, r = pp, n = gp, o = rp, i = Ep();
        e.HvigorErrorAdaptor = class extends t.ErrorAdaptor {
            constructor(e, t = "id") {
                super(), this._hvigorError = new n.HvigorError(this.getErrorCodeJsonPath(), {
                    field: t,
                    value: e
                });
            }
            getErrorMessage() {
                var e;
                return [ {
                    timestamp: this._hvigorError.timestamp,
                    id: this._hvigorError.id,
                    code: this._hvigorError.code,
                    originMessage: this._hvigorError.originMessage,
                    originSolutions: this._hvigorError.originSolutions,
                    moreInfo: this._hvigorError.moreInfo,
                    stack: this._hvigorError.stack,
                    message: null !== (e = this._hvigorError.message) && void 0 !== e ? e : r.ERROR_NOT_MATCH,
                    solutions: this._hvigorError.solutions,
                    checkMessage: this._hvigorError.checkMessage
                } ];
            }
            getErrorCodeJsonPath() {
                return [ (0, i.getErrorInfoFilePath)(this.getToolErrorCode()) ];
            }
            getToolErrorCode() {
                return o.ToolErrorCode.TEC_10;
            }
            formatMessage(...e) {
                return this._hvigorError.formatMessage(...e), this;
            }
            formatSolutions(e, ...t) {
                return this._hvigorError.formatSolutions(e, ...t), this;
            }
            isMatchSuccess() {
                return this._hvigorError.isMatchSuccess();
            }
        };
    }(fp)), fp;
}

function Ep() {
    return hp || (hp = 1, function(e) {
        var t = g && g.__importDefault || function(e) {
            return e && e.__esModule ? e : {
                default: e
            };
        };
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.errorCode2Description = e.formatErrorAdaptorExport = e.getErrorInfoFilePath = void 0;
        const n = t(r), o = op, i = ap, a = mp(), u = pp, s = rp;
        e.getErrorInfoFilePath = function(e) {
            var t;
            const r = null !== (t = u.ErrorCodeToFile[e]) && void 0 !== t ? t : u.ErrorCodeToFile[s.ToolErrorCode.TEC_00];
            return n.default.resolve(u.ERROR_INFO_DIRCTORY_PATH, r);
        }, e.formatErrorAdaptorExport = function(e, t, r) {
            let n = new a.HvigorErrorAdaptor(e);
            return t && (n = n.formatMessage(...t)), r && r.forEach((e, t) => {
                n = n.formatSolutions(t, ...e);
            }), n;
        }, e.errorCode2Description = function(e) {
            const t = i.ErrorUtil.getErrorTypeCodeFromErrorCode(e);
            return t ? o.ErrorCodeDescription[t] : "";
        };
    }(np)), np;
}

!function(e) {
    var r = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.BaseError = void 0;
    const n = r(t), o = pp;
    class i {
        constructor(e, t) {
            this._timestamp = new Date, this._errorJsonPaths = e, this._matchOptions = t, this._errorInfo = this.findErrorInfo(), 
            this._errorInfo ? (this._id = this._errorInfo.id, this._code = this._errorInfo.code, 
            this._moreInfo = this._errorInfo.moreInfo, this._checkMessage = this._errorInfo.checkMessage, 
            this._solutions = this._errorInfo.solutions) : this._code = o.DEFAULT_ERROR_CODE;
        }
        isMatchSuccess() {
            return !!this._errorInfo;
        }
        findErrorInfo() {
            return this.match(this._matchOptions);
        }
        match(e) {
            if (i.validFields.includes(e.field) && e.value) {
                return "id" === e.field ? this.matchById(e.value) : this.matchByField(e);
            }
        }
        matchByField(e) {
            const t = this.getErrorInfoJson();
            if (t) {
                for (const r of Object.keys(t)) {
                    const n = t[r];
                    if ("checkMessage" === e.field) {
                        if (n.checkMessage && e.value.includes(n.checkMessage)) {
                            return this.putIdIntoErrorInfo(r, t[r]);
                        }
                    } else if (e.value === n[e.field]) {
                        return this.putIdIntoErrorInfo(r, t[r]);
                    }
                }
            }
        }
        matchById(e) {
            const t = this.getErrorInfoJson();
            return this.putIdIntoErrorInfo(e, null == t ? void 0 : t[e]);
        }
        putIdIntoErrorInfo(e, t) {
            if (t) {
                return {
                    ...t,
                    id: e
                };
            }
        }
        getErrorInfoJson() {
            return this._errorJsonPaths.length ? this._errorJsonPaths.reduce((e, t) => ({
                ...e,
                ...this.getJsonObj(t)
            }), {}) : void 0;
        }
        getJsonObj(e, t = "utf-8") {
            if (!n.default.existsSync(e)) {
                return;
            }
            const r = n.default.readFileSync(e, {
                encoding: t
            });
            try {
                return JSON.parse(r);
            } catch (e) {
                return;
            }
        }
        get timestamp() {
            return this._timestamp;
        }
        get errorJsonPaths() {
            return this._errorJsonPaths;
        }
        get id() {
            return this._id;
        }
        set id(e) {
            this._id = e;
        }
        get message() {
            return this._message;
        }
        set message(e) {
            this._message = e;
        }
        get solutions() {
            return this._solutions;
        }
        set solutions(e) {
            this._solutions = e;
        }
        get moreInfo() {
            return this._moreInfo;
        }
        set moreInfo(e) {
            this._moreInfo = e;
        }
        get code() {
            return this._code;
        }
        set code(e) {
            this._code = e;
        }
        get stack() {
            return this._stack;
        }
        set stack(e) {
            this._stack = e;
        }
        get checkMessage() {
            return this._checkMessage;
        }
        set checkMessage(e) {
            this._checkMessage = e;
        }
        get errorInfo() {
            return this._errorInfo;
        }
    }
    e.BaseError = i, i.validFields = [ "id", "checkMessage", "code" ];
}(yp), function(e) {
    var t = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.HvigorError = void 0;
    const r = t(l), n = yp;
    e.HvigorError = class extends n.BaseError {
        constructor(e, t) {
            super(e, t), this._errorInfo && (this._originMessage = this._errorInfo.message, 
            this._message = this._errorInfo.message, this._originSolutions = this._errorInfo.solutions);
        }
        formatMessage(...e) {
            this.originMessage && (this._message = r.default.format(this._originMessage, ...e));
        }
        formatSolutions(e, ...t) {
            this._originSolutions && this._originSolutions[e] && this._solutions && (this._solutions[e] = r.default.format(this._originSolutions[e], ...t));
        }
        get originMessage() {
            return this._originMessage;
        }
        get originSolutions() {
            return this._originSolutions;
        }
    };
}(gp);

var _p = {}, Dp = {};

!function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.ThirdPartyError = void 0;
    const t = yp;
    e.ThirdPartyError = class extends t.BaseError {
        constructor(e, t) {
            super(e, t), this._errorInfo && (this._toolName = this._errorInfo.toolName), "checkMessage" === t.field && (this._message = t.value);
        }
        get toolName() {
            return this._toolName;
        }
        set toolName(e) {
            this._toolName = e;
        }
    };
}(Dp), function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.ThirdPartyErrorAdaptor = void 0;
    const t = dp, r = pp, n = Dp, o = rp, i = Ep();
    class a extends t.ErrorAdaptor {
        constructor(e, t = "checkMessage") {
            if (super(), this._thirdPartyError = new n.ThirdPartyError(this.getErrorCodeJsonPath(), {
                field: t,
                value: e
            }), "checkMessage" === t) {
                this.errorMessage = e, this.analyze(e);
            } else if ("none" === t) {
                const t = e;
                this._thirdPartyError.code = t.code, this._thirdPartyError.message = t.message, 
                this._thirdPartyError.solutions = t.solutions, this._thirdPartyError.toolName = t.toolName;
            }
        }
        analyze(e) {
            if (!e.includes(a.SOLUTIONS)) {
                return;
            }
            const t = e.split(a.SOLUTIONS);
            this._thirdPartyError.message = t[0].trimEnd(), this._thirdPartyError.solutions = t[1].split(">").map(e => e.trimEnd().trim()).filter(e => e.length > 0), 
            this.checkEs2abc();
        }
        checkEs2abc() {
            const e = this._thirdPartyError.solutions;
            if (e && e[(null == e ? void 0 : e.length) - 1].includes("The size of programs is expected to be")) {
                const t = e[(null == e ? void 0 : e.length) - 1], r = t.indexOf("The size of programs is expected");
                e[(null == e ? void 0 : e.length) - 1] = `${t.substring(0, r)}\n\n${t.substring(r)}`, 
                this._thirdPartyError.solutions = e;
            }
        }
        getErrorMessage() {
            var e, t;
            return [ {
                timestamp: this._thirdPartyError.timestamp,
                id: this._thirdPartyError.id,
                code: this._thirdPartyError.code,
                moreInfo: this._thirdPartyError.moreInfo,
                stack: this._thirdPartyError.stack,
                message: null !== (t = null !== (e = this._thirdPartyError.message) && void 0 !== e ? e : this.errorMessage) && void 0 !== t ? t : r.ERROR_NOT_MATCH,
                solutions: this._thirdPartyError.solutions,
                checkMessage: this._thirdPartyError.checkMessage
            } ];
        }
        getErrorCodeJsonPath(e) {
            return e ? [ (0, i.getErrorInfoFilePath)(e) ] : a.otherErrorCode.map(e => (0, i.getErrorInfoFilePath)(e));
        }
    }
    e.ThirdPartyErrorAdaptor = a, a.SOLUTIONS = "Solutions:", a.otherErrorCode = [ o.ToolErrorCode.TEC_23, o.ToolErrorCode.TEC_24 ];
}(_p), function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.ArkTsErrorAdaptor = void 0;
    const t = rp, r = Ep(), n = _p;
    e.ArkTsErrorAdaptor = class extends n.ThirdPartyErrorAdaptor {
        constructor(e, t) {
            super(e, t);
        }
        getErrorCodeJsonPath() {
            return [ (0, r.getErrorInfoFilePath)(t.ToolErrorCode.TEC_21) ];
        }
    };
}(tp);

var bp = {};

!function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.HvigorGlobalErrorAdaptor = void 0;
    const t = rp, r = Ep(), n = mp();
    class o extends n.HvigorErrorAdaptor {
        constructor(e) {
            super(e, "checkMessage"), this._hvigorError.message ? "%s" === this._hvigorError.message && this.formatMessage(e) : this._hvigorError.message = e;
        }
        getErrorCodeJsonPath() {
            return [ (0, r.getErrorInfoFilePath)(t.ToolErrorCode.TEC_00) ];
        }
    }
    e.HvigorGlobalErrorAdaptor = o;
}(bp);

var Op = {};

!function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.HvigorOhosPluginAdaptor = void 0;
    const t = rp, r = Ep(), n = mp();
    class o extends n.HvigorErrorAdaptor {
        getErrorCodeJsonPath() {
            return [ (0, r.getErrorInfoFilePath)(t.ToolErrorCode.TEC_11) ];
        }
    }
    e.HvigorOhosPluginAdaptor = o;
}(Op);

var Ap = {}, Cp = {}, Sp = {};

!function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.EightDigitErrorCodeAdaptor = void 0;
    const t = dp, r = pp;
    e.EightDigitErrorCodeAdaptor = class extends t.ErrorAdaptor {
        constructor(e) {
            super(), this._errorMsg = e;
        }
        getErrorInfos() {
            var e;
            const t = new RegExp(r.EIGHT_DIGIT_ERROR_REGEXP.PATTERN, r.EIGHT_DIGIT_ERROR_REGEXP.FLAGS), n = this._errorMsg.matchAll(t), o = [];
            for (const t of n) {
                const n = {
                    code: (null === (e = t.groups) || void 0 === e ? void 0 : e.code) || r.DEFAULT_ERROR_CODE
                };
                o.push(n);
            }
            return o;
        }
        getErrorMessage() {
            const e = this.getErrorInfos().map(e => ({
                timestamp: new Date,
                code: e.code,
                message: ""
            }));
            return e[0] && (e[0].message = this._errorMsg), e;
        }
    };
}(Sp);

var Mp = {};

!function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.PackToolAdaptor = void 0;
    const t = rp, r = Ep(), n = _p;
    e.PackToolAdaptor = class extends n.ThirdPartyErrorAdaptor {
        constructor(e) {
            super(e);
        }
        analyze(e) {
            let t = "";
            e.split("\r\n").forEach(e => {
                if (e.includes(n.ThirdPartyErrorAdaptor.SOLUTIONS)) {
                    const t = e.split(n.ThirdPartyErrorAdaptor.SOLUTIONS);
                    t.length >= 2 && (this._thirdPartyError.solutions = t[1].split(">").map(e => e.trimEnd().trim()).filter(e => e.length > 0));
                } else {
                    t += `${e}\r\n`;
                }
            }), this._thirdPartyError.message = t.trimEnd();
        }
        getErrorCodeJsonPath() {
            return [ (0, r.getErrorInfoFilePath)(t.ToolErrorCode.TEC_22) ];
        }
    };
}(Mp), function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.AdaptorFactory = void 0;
    const t = pp, r = Sp, n = bp, o = Mp, i = _p;
    class a {
        static createErrorAdaptor(e) {
            return a.hasErrorCode(e) ? new r.EightDigitErrorCodeAdaptor(e) : a.isThirdPartyError(e) ? e.includes("BundleTool") ? new o.PackToolAdaptor(e) : new i.ThirdPartyErrorAdaptor(e) : new n.HvigorGlobalErrorAdaptor(e);
        }
        static isThirdPartyError(e) {
            return e.includes(i.ThirdPartyErrorAdaptor.SOLUTIONS);
        }
        static hasErrorCode(e) {
            return new RegExp(t.EIGHT_DIGIT_ERROR_REGEXP.PATTERN, t.EIGHT_DIGIT_ERROR_REGEXP.FLAGS).test(e);
        }
    }
    e.AdaptorFactory = a;
}(Cp), function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.MixAdaptor = void 0;
    const t = Cp;
    e.MixAdaptor = class {
        constructor(e) {
            this.adaptor = t.AdaptorFactory.createErrorAdaptor(e);
        }
        getErrorMessage() {
            return this.adaptor.getErrorMessage();
        }
    };
}(Ap);

var wp, Fp, Pp, Ip, Rp = {}, Tp = {}, Lp = {}, jp = {}, Np = {}, xp = {}, kp = {}, Bp = {}, $p = {};

function Hp() {
    return Fp || (Fp = 1, function(e) {
        var t = g && g.__importDefault || function(e) {
            return e && e.__esModule ? e : {
                default: e
            };
        };
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.HvigorLoggerConfig = void 0;
        const o = rd, i = t(r), a = (wp || (wp = 1, function(e) {
            var t = g && g.__importDefault || function(e) {
                return e && e.__esModule ? e : {
                    default: e
                };
            };
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), e.LogPathUtil = void 0;
            const o = t(r), i = t(n), a = Hp(), u = lp, s = op;
            class l {
                static logFilePath() {
                    let e;
                    try {
                        e = l.getHvigorCacheDir();
                    } catch {
                        e = o.default.resolve(l.HVIGOR_PROJECT_ROOT_DIR, l.HVIGOR_USER_HOME_DIR_NAME);
                    }
                    return o.default.resolve(e, "./outputs/build-logs");
                }
                static getHvigorCacheDir(e) {
                    var t;
                    let r = void 0 !== i.default.env.config ? JSON.parse(i.default.env.config)[s.BUILD_CACHE_DIR] : null !== (t = a.HvigorLoggerConfig.getExtraConfig(s.BUILD_CACHE_DIR)) && void 0 !== t ? t : l.getCommandHvigorCacheDir();
                    const n = o.default.resolve(l.HVIGOR_PROJECT_ROOT_DIR, l.HVIGOR_USER_HOME_DIR_NAME);
                    return r || (r = a.HvigorLoggerConfig.getHvigorCacheDir(), r) ? o.default.isAbsolute(r) ? (e && !this.hvigorCacheDirHasLogged && (e.warn((new u.HvigorLogInfo).setLogLevel(s.LogLevel.WARN).setMessage("Please ensure no projects of the same name have the same custom hvigor data dir.")), 
                    this.hvigorCacheDirHasLogged = !0), o.default.resolve(r, o.default.basename(i.default.cwd()), s.HVIGOR_USER_HOME_DIR_NAME)) : (e && !this.hvigorCacheDirHasLogged && (e.warn((new u.HvigorLogInfo).setLogLevel(s.LogLevel.WARN).setMessage(`Invalid custom hvigor data dir:${r}`)), 
                    this.hvigorCacheDirHasLogged = !0), n) : n;
                }
                static getCommandHvigorCacheDir() {
                    return i.default.argv.forEach(e => {
                        e.startsWith(s.BUILD_CACHE_DIR) && (i.default.env.BUILD_CACHE_DIR = e.substring(e.indexOf("=") + 1));
                    }), i.default.env.BUILD_CACHE_DIR;
                }
            }
            e.LogPathUtil = l, l.HVIGOR_PROJECT_ROOT_DIR = i.default.cwd(), l.HVIGOR_USER_HOME_DIR_NAME = ".hvigor", 
            l.hvigorCacheDirHasLogged = !1;
        }($p)), $p);
        class u {
            static setExtraConfig(e) {
                u.extraConfig = e;
            }
            static getExtraConfig(e) {
                return u.extraConfig.get(e);
            }
            static setHvigorCacheDir(e) {
                u.hvigorCacheDir = e;
            }
            static getHvigorCacheDir() {
                return u.hvigorCacheDir;
            }
            static updateConfiguration() {
                const e = u.configuration.appenders["debug-log-file"];
                return e && "filename" in e && (e.filename = i.default.resolve(a.LogPathUtil.logFilePath(), "build.log")), 
                u.configuration;
            }
            static setCategoriesLevel(e, t) {
                u.logLevel = e;
                const r = u.configuration.categories;
                for (const n in r) {
                    (null == t ? void 0 : t.includes(n)) || n.includes("file") || Object.prototype.hasOwnProperty.call(r, n) && (r[n].level = e.levelStr);
                }
            }
            static getLevel() {
                return u.logLevel;
            }
        }
        e.HvigorLoggerConfig = u, u.extraConfig = new Map, u.configuration = {
            appenders: {
                debug: {
                    type: "stdout",
                    layout: {
                        type: "pattern",
                        pattern: "[%d] > hvigor %p %c %[%m%]"
                    }
                },
                "debug-log-file": {
                    type: "file",
                    filename: i.default.resolve(a.LogPathUtil.logFilePath(), "build.log"),
                    maxLogSize: 2097152,
                    backups: 9,
                    encoding: "utf-8",
                    level: "debug"
                },
                info: {
                    type: "stdout",
                    layout: {
                        type: "pattern",
                        pattern: "[%d] > hvigor %[%m%]"
                    }
                },
                "no-pattern-info": {
                    type: "stdout",
                    layout: {
                        type: "pattern",
                        pattern: "%m"
                    }
                },
                wrong: {
                    type: "stderr",
                    layout: {
                        type: "pattern",
                        pattern: "[%d] > hvigor %[%p: %m%]"
                    }
                },
                "just-debug": {
                    type: "logLevelFilter",
                    appender: "debug",
                    level: "debug",
                    maxLevel: "debug"
                },
                "just-info": {
                    type: "logLevelFilter",
                    appender: "info",
                    level: "info",
                    maxLevel: "info"
                },
                "just-wrong": {
                    type: "logLevelFilter",
                    appender: "wrong",
                    level: "warn",
                    maxLevel: "error"
                }
            },
            categories: {
                default: {
                    appenders: [ "just-debug", "just-info", "just-wrong" ],
                    level: "debug"
                },
                "no-pattern-info": {
                    appenders: [ "no-pattern-info" ],
                    level: "info"
                },
                "debug-file": {
                    appenders: [ "debug-log-file" ],
                    level: "debug"
                }
            }
        }, u.logLevel = o.levels.DEBUG, u.setConfiguration = e => {
            u.configuration = e;
        }, u.getConfiguration = () => u.configuration;
    }(Bp)), Bp;
}

function Up() {
    return Ip || (Ip = 1, function(e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.GroupBase = void 0;
        const t = (Pp || (Pp = 1, function(e) {
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), e.HvigorFileLogger = void 0;
            const t = op, r = ap, n = Sv(), o = sp, i = kp;
            e.HvigorFileLogger = class {
                constructor(e) {
                    this.subSystem = t.SubSystemEnum.UNKNOWN, this.hvigorErrorCommonAdapter = new o.HvigorErrorCommonAdapter, 
                    this.hvigorLogList = [], this.subSystem = e;
                }
                printError(e) {
                    e = r.ErrorUtil.getRealError(e);
                    const t = this.hvigorErrorCommonAdapter.convertErrorToLogInfo(e);
                    i.HvigorLoggerForFile.getLogger(this.subSystem).error(t);
                }
                printErrorAndExit(e) {
                    e = r.ErrorUtil.getRealError(e);
                    const t = this.hvigorErrorCommonAdapter.convertErrorToLogInfo(e);
                    i.HvigorLoggerForFile.getLogger(this.subSystem).errorAndExit(t);
                }
                printWarn(e) {
                    const t = this.hvigorErrorCommonAdapter.convertWarnToLogInfo(e);
                    i.HvigorLoggerForFile.getLogger(this.subSystem).warn(t);
                }
                printInfo(e) {
                    const t = this.hvigorErrorCommonAdapter.convertInfoToLogInfo(e);
                    i.HvigorLoggerForFile.getLogger(this.subSystem).info(t);
                }
                printDebug(e) {
                    const t = this.hvigorErrorCommonAdapter.convertDebugToLogInfo(e);
                    i.HvigorLoggerForFile.getLogger(this.subSystem).debug(t);
                }
                pushError(e) {
                    this.hvigorLogList.push(r.ErrorUtil.getRealError(e));
                }
                printAllError(e) {
                    let t = this.hvigorLogList;
                    e && (t = e);
                    for (let e = 0; e < (null == t ? void 0 : t.length); e++) {
                        this.printError(t[e]);
                    }
                    e || (this.hvigorLogList = []);
                }
                printMergedError(e, t) {
                    let r = new n.MergeErrorList(this.hvigorLogList, e, t).getMergedErrorList();
                    this.printAllError(r), this.hvigorLogList = [];
                }
            };
        }(xp)), xp);
        e.GroupBase = class {
            constructor(e, r) {
                this.log = new t.HvigorFileLogger("hvigor"), this.hvigorLogList = e, this.mergeKey = r;
            }
            groupByKey(e, t) {
                this.hvigorLogList || (this.log.printWarn("hvigorLogList is undefined. Auto create empty list."), 
                this.hvigorLogList = []), e[this.mergeKey] && (this.log.printWarn(`mergeKey [${this.mergeKey}] can not exits in merge option. Auto delete this key.`), 
                delete e[this.mergeKey]), this._groupByKey(this.hvigorLogList, e, t);
            }
        };
    }(Np)), Np;
}

!function(e) {
    var t = g && g.__createBinding || (Object.create ? function(e, t, r, n) {
        void 0 === n && (n = r);
        var o = Object.getOwnPropertyDescriptor(t, r);
        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
            enumerable: !0,
            get: function() {
                return t[r];
            }
        }), Object.defineProperty(e, n, o);
    } : function(e, t, r, n) {
        void 0 === n && (n = r), e[n] = t[r];
    }), r = g && g.__setModuleDefault || (Object.create ? function(e, t) {
        Object.defineProperty(e, "default", {
            enumerable: !0,
            value: t
        });
    } : function(e, t) {
        e.default = t;
    }), n = g && g.__importStar || function(e) {
        if (e && e.__esModule) {
            return e;
        }
        var n = {};
        if (null != e) {
            for (var o in e) {
                "default" !== o && Object.prototype.hasOwnProperty.call(e, o) && t(n, e, o);
            }
        }
        return r(n, e), n;
    };
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.HvigorLoggerForFile = void 0;
    const o = n(rd), i = Hp();
    class a {
        constructor(e, t) {
            o.configure(i.HvigorLoggerConfig.updateConfiguration()), this.fileLogger = o.getLogger("debug-file");
        }
        static getLogger(e) {
            return e || (e = "undefined"), a.hvigorLoggerCache.has(e) || a.hvigorLoggerCache.set(e, new a(e)), 
            a.hvigorLoggerCache.get(e);
        }
        static getLoggerWithDurationId(e, t) {
            return e || (e = "undefined"), a.hvigorLoggerCache.has(e) || a.hvigorLoggerCache.set(e, new a(e, t)), 
            a.hvigorLoggerCache.get(e);
        }
        debug(e) {
            this.fileLogger.debug(e.getMessage());
        }
        info(e) {
            this.fileLogger.debug(e.getMessage());
        }
        warn(e) {
            this.fileLogger.warn(e.getMessage());
        }
        error(e) {
            this.fileLogger.error(e.getMessage());
        }
        errorAndExit(e) {
            throw new Error(e.getMessage());
        }
    }
    e.HvigorLoggerForFile = a, a.hvigorLoggerCache = new Map;
}(kp);

var Gp, Vp, Wp = {};

function zp() {
    return Vp || (Vp = 1, function(e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.CreateGroupByCause = void 0;
        const t = (Gp || (Gp = 1, function(e) {
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), e.GroupByCause = void 0;
            const t = op, r = Up(), n = Wp;
            class o extends r.GroupBase {
                constructor(e) {
                    super(e, t.MergeKeyEnum.CAUSE);
                }
                _groupByKey(e, r, o) {
                    n.MergeUtil.composeErrors(t.MergeKeyEnum.CAUSE, e, r, o);
                }
            }
            e.GroupByCause = o;
        }(jp)), jp);
        e.CreateGroupByCause = class {
            newGroupByKey(e) {
                return new t.GroupByCause(e);
            }
        };
    }(Lp)), Lp;
}

!function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.MergeUtil = void 0;
    const t = op;
    class r {
        static init() {
            this.compareFuncMap.set(t.MergeKeyEnum.CODE, "compareCode"), this.compareFuncMap.set(t.MergeKeyEnum.CAUSE, "compareCause"), 
            this.compareFuncMap.set(t.MergeKeyEnum.POSITION, "comparePosition"), this.compareFuncMap.set(t.MergeKeyEnum.SOLUTIONS, "compareSolutions"), 
            this.compareFuncMap.set(t.MergeKeyEnum.MORE_INFO, "compareMoreInfo");
        }
        static composeErrors(e, t, n, o) {
            r.compareFuncMap.size < 1 && r.init(), t.forEach(t => {
                if (0 === o.size) {
                    return void o.set(Symbol(), [ t ]);
                }
                let r = !1;
                o.forEach((o, i) => {
                    const a = this.compareFuncMap.get(e);
                    a && n[a] && n[a](o[0], t) && (r = !0, o.push(t));
                }), r || o.set(Symbol(), [ t ]);
            });
        }
    }
    e.MergeUtil = r, r.compareFuncMap = new Map;
}(Wp);

var Jp, Kp, qp = {}, Xp = {};

function Yp() {
    return Kp || (Kp = 1, function(e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.CreateGroupByCode = void 0;
        const t = (Jp || (Jp = 1, function(e) {
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), e.GroupByCode = void 0;
            const t = op, r = Up(), n = Wp;
            class o extends r.GroupBase {
                constructor(e) {
                    super(e, t.MergeKeyEnum.CODE);
                }
                _groupByKey(e, r, o) {
                    n.MergeUtil.composeErrors(t.MergeKeyEnum.CODE, e, r, o);
                }
            }
            e.GroupByCode = o;
        }(Xp)), Xp);
        e.CreateGroupByCode = class {
            newGroupByKey(e) {
                return new t.GroupByCode(e);
            }
        };
    }(qp)), qp;
}

var Zp, Qp, ev = {}, tv = {};

function rv() {
    return Qp || (Qp = 1, function(e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.CreateGroupByMoreInfo = void 0;
        const t = (Zp || (Zp = 1, function(e) {
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), e.GroupByMoreInfo = void 0;
            const t = op, r = Up(), n = Wp;
            class o extends r.GroupBase {
                constructor(e) {
                    super(e, t.MergeKeyEnum.MORE_INFO);
                }
                _groupByKey(e, r, o) {
                    n.MergeUtil.composeErrors(t.MergeKeyEnum.MORE_INFO, e, r, o);
                }
            }
            e.GroupByMoreInfo = o;
        }(tv)), tv);
        e.CreateGroupByMoreInfo = class {
            newGroupByKey(e) {
                return new t.GroupByMoreInfo(e);
            }
        };
    }(ev)), ev;
}

var nv, ov, iv = {}, av = {};

function uv() {
    return ov || (ov = 1, function(e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.CreateGroupByPosition = void 0;
        const t = (nv || (nv = 1, function(e) {
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), e.GroupByPosition = void 0;
            const t = op, r = Up(), n = Wp;
            class o extends r.GroupBase {
                constructor(e) {
                    super(e, t.MergeKeyEnum.POSITION);
                }
                _groupByKey(e, r, o) {
                    n.MergeUtil.composeErrors(t.MergeKeyEnum.POSITION, e, r, o);
                }
            }
            e.GroupByPosition = o;
        }(av)), av);
        e.CreateGroupByPosition = class {
            newGroupByKey(e) {
                return new t.GroupByPosition(e);
            }
        };
    }(iv)), iv;
}

var sv, lv, cv = {}, fv = {};

function dv() {
    return lv || (lv = 1, function(e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.CreateGroupBySolutions = void 0;
        const t = (sv || (sv = 1, function(e) {
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), e.GroupBySolutions = void 0;
            const t = op, r = Up(), n = Wp;
            class o extends r.GroupBase {
                constructor(e) {
                    super(e, t.MergeKeyEnum.SOLUTIONS);
                }
                _groupByKey(e, r, o) {
                    n.MergeUtil.composeErrors(t.MergeKeyEnum.SOLUTIONS, e, r, o);
                }
            }
            e.GroupBySolutions = o;
        }(fv)), fv);
        e.CreateGroupBySolutions = class {
            newGroupByKey(e) {
                return new t.GroupBySolutions(e);
            }
        };
    }(cv)), cv;
}

var pv, vv = {};

var hv, gv = {};

var yv, mv = {};

var Ev, _v = {};

var Dv, bv = {};

var Ov, Av, Cv = {};

function Sv() {
    return Av || (Av = 1, function(e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.MergeErrorList = void 0;
        const t = op, r = cp, n = zp(), o = Yp(), i = rv(), a = uv(), u = dv(), s = (pv || (pv = 1, 
        function(e) {
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), e.MergeCause = void 0;
            const t = op, r = Pv(), n = cp;
            e.MergeCause = class {
                constructor() {
                    this.log = new r.HvigorConsoleLogger("hvigor");
                }
                mergeTwoKey(e, r, o) {
                    let i = "";
                    return e || r ? (e || (e = new n.HvigorErrorInfo), r || (r = new n.HvigorErrorInfo), 
                    o.cause === t.MergeType.COLLECT_ALL ? i = e.getCause() + t.SPLIT_TAG + r.getCause() : o.cause === t.MergeType.COLLECT_FIRST ? i = e.getCause() : o.cause === t.MergeType.COLLECT_LAST ? i = r.getCause() : (this.log.printDebug(`Unknown MergeType: ${o.code}. Use default strategy [COLLECT_LAST].`), 
                    i = r.getCode()), i) : i;
                }
            };
        }(vv)), vv), l = (hv || (hv = 1, function(e) {
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), e.MergeCode = void 0;
            const t = op, r = Pv(), n = cp;
            e.MergeCode = class {
                constructor() {
                    this.log = new r.HvigorConsoleLogger("hvigor");
                }
                mergeTwoKey(e, r, o) {
                    let i = "";
                    return e || r ? (e || (e = new n.HvigorErrorInfo), r || (r = new n.HvigorErrorInfo), 
                    o.code === t.MergeType.COLLECT_ALL ? i = e.getCode() + " " + r.getCode() : o.code === t.MergeType.COLLECT_FIRST ? i = e.getCode() : (o.code === t.MergeType.COLLECT_LAST || this.log.printDebug(`Unknown MergeType: ${o.code}. Use default strategy [COLLECT_LAST].`), 
                    i = r.getCode()), i) : i;
                }
            };
        }(gv)), gv), c = (yv || (yv = 1, function(e) {
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), e.MergeDescription = void 0;
            const t = op, r = Pv(), n = cp;
            e.MergeDescription = class {
                constructor() {
                    this.log = new r.HvigorConsoleLogger("hvigor");
                }
                mergeTwoKey(e, r, o) {
                    let i = "";
                    return e || r ? (e || (e = new n.HvigorErrorInfo), r || (r = new n.HvigorErrorInfo), 
                    o.code === t.MergeType.COLLECT_ALL ? i = e.getDescription() + " " + r.getDescription() : o.code === t.MergeType.COLLECT_FIRST ? i = e.getDescription() : (o.code === t.MergeType.COLLECT_LAST || this.log.printDebug(`Unknown MergeType: ${o.code}. Use default strategy [COLLECT_LAST].`), 
                    i = r.getDescription()), i) : i;
                }
            };
        }(mv)), mv), f = (Ev || (Ev = 1, function(e) {
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), e.MergeMoreInfo = void 0;
            const t = op, r = Pv(), n = cp;
            e.MergeMoreInfo = class {
                constructor() {
                    this.log = new r.HvigorConsoleLogger("hvigor");
                }
                mergeTwoKey(e, r, o) {
                    var i, a, u, s, l, c, f, d, p, v;
                    let h;
                    if (t.DEFAULT_MORE_INFO_URL_CN && t.DEFAULT_MORE_INFO_URL_EN) {
                        return e || r ? (e || (e = new n.HvigorErrorInfo), r || (r = new n.HvigorErrorInfo), 
                        o.moreInfo === t.MergeType.COLLECT_ALL ? h = {
                            cn: (null === (i = e.getMoreInfo()) || void 0 === i ? void 0 : i.cn) + " " + (null === (a = r.getMoreInfo()) || void 0 === a ? void 0 : a.cn),
                            en: (null === (u = e.getMoreInfo()) || void 0 === u ? void 0 : u.en) + " " + (null === (s = r.getMoreInfo()) || void 0 === s ? void 0 : s.en)
                        } : o.moreInfo === t.MergeType.COLLECT_FIRST ? h = {
                            cn: (null === (l = e.getMoreInfo()) || void 0 === l ? void 0 : l.cn) || t.DEFAULT_MORE_INFO_URL_CN,
                            en: (null === (c = e.getMoreInfo()) || void 0 === c ? void 0 : c.en) || t.DEFAULT_MORE_INFO_URL_EN
                        } : o.moreInfo === t.MergeType.COLLECT_LAST ? h = {
                            cn: (null === (f = r.getMoreInfo()) || void 0 === f ? void 0 : f.cn) || t.DEFAULT_MORE_INFO_URL_CN,
                            en: (null === (d = r.getMoreInfo()) || void 0 === d ? void 0 : d.en) || t.DEFAULT_MORE_INFO_URL_EN
                        } : (this.log.printDebug(`Unknown MergeType: ${o.code}. Use default strategy [COLLECT_LAST].`), 
                        h = {
                            cn: (null === (p = r.getMoreInfo()) || void 0 === p ? void 0 : p.cn) || t.DEFAULT_MORE_INFO_URL_CN,
                            en: (null === (v = r.getMoreInfo()) || void 0 === v ? void 0 : v.en) || t.DEFAULT_MORE_INFO_URL_EN
                        }), h) : {
                            cn: t.DEFAULT_MORE_INFO_URL_CN,
                            en: t.DEFAULT_MORE_INFO_URL_EN
                        };
                    }
                }
            };
        }(_v)), _v), d = (Dv || (Dv = 1, function(e) {
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), e.MergePosition = void 0;
            const t = op, r = Pv(), n = cp;
            e.MergePosition = class {
                constructor() {
                    this.log = new r.HvigorConsoleLogger("hvigor");
                }
                mergeTwoKey(e, r, o) {
                    let i = "";
                    return e || r ? (e || (e = new n.HvigorErrorInfo), r || (r = new n.HvigorErrorInfo), 
                    o.position === t.MergeType.COLLECT_ALL ? i = e.getPosition() + t.SPLIT_TAG + r.getPosition() : o.position === t.MergeType.COLLECT_FIRST ? i = e.getPosition() : o.position === t.MergeType.COLLECT_LAST ? i = r.getPosition() : (this.log.printDebug(`Unknown MergeType: ${o.code}. Use default strategy [COLLECT_LAST].`), 
                    i = r.getCode()), i) : i;
                }
            };
        }(bv)), bv), p = (Ov || (Ov = 1, function(e) {
            Object.defineProperty(e, "__esModule", {
                value: !0
            }), e.MergeSolutions = void 0;
            const t = op, r = Pv(), n = cp;
            e.MergeSolutions = class {
                constructor() {
                    this.log = new r.HvigorConsoleLogger("hvigor");
                }
                mergeTwoKey(e, r, o) {
                    let i = [];
                    return e || r ? (e || (e = new n.HvigorErrorInfo), r || (r = new n.HvigorErrorInfo), 
                    o.solutions === t.MergeType.COLLECT_ALL ? i = [ ...e.getSolutions(), ...r.getSolutions() ] : o.solutions === t.MergeType.COLLECT_FIRST ? i = [ ...e.getSolutions() ] : (o.solutions === t.MergeType.COLLECT_LAST || this.log.printDebug(`Unknown MergeType: ${o.code}. Use default strategy [COLLECT_LAST].`), 
                    i = [ ...r.getSolutions() ]), i) : i;
                }
            };
        }(Cv)), Cv);
        class v {
            constructor(e, r, h) {
                this.hvigorLogList = e, this.mergeKey = r, this.option = this.handleOption(h), v.mergePropertyMap.set(t.MergeKeyEnum.CODE, new l.MergeCode), 
                v.mergePropertyMap.set("description", new c.MergeDescription), v.mergePropertyMap.set(t.MergeKeyEnum.CAUSE, new s.MergeCause), 
                v.mergePropertyMap.set(t.MergeKeyEnum.POSITION, new d.MergePosition), v.mergePropertyMap.set(t.MergeKeyEnum.SOLUTIONS, new p.MergeSolutions), 
                v.mergePropertyMap.set(t.MergeKeyEnum.MORE_INFO, new f.MergeMoreInfo), v.groupByKeyMap.set(t.MergeKeyEnum.CODE, new o.CreateGroupByCode), 
                v.groupByKeyMap.set(t.MergeKeyEnum.CAUSE, new n.CreateGroupByCause), v.groupByKeyMap.set(t.MergeKeyEnum.POSITION, new a.CreateGroupByPosition), 
                v.groupByKeyMap.set(t.MergeKeyEnum.SOLUTIONS, new u.CreateGroupBySolutions), v.groupByKeyMap.set(t.MergeKeyEnum.MORE_INFO, new i.CreateGroupByMoreInfo);
            }
            getMergedErrorList() {
                const e = this.getGroupedErrors(this.mergeKey, this.option);
                let t = [];
                return e.forEach((e, r) => {
                    t.push(this.mergeErrors(e, this.option));
                }), t;
            }
            getGroupedErrors(e, t) {
                var r;
                const n = new Map;
                return null === (r = v.groupByKeyMap.get(this.mergeKey)) || void 0 === r || r.newGroupByKey(this.hvigorLogList).groupByKey(t, n), 
                n;
            }
            mergeErrors(e, t) {
                let n = new r.HvigorErrorInfo({
                    code: e[0].getCode(),
                    cause: e[0].getCause(),
                    description: e[0].getDescription(),
                    position: e[0].getPosition(),
                    solutions: e[0].getSolutions(),
                    moreInfo: e[0].getMoreInfo()
                });
                for (let r = 1; r < e.length; r++) {
                    const o = e[r];
                    n = this.mergeTwoErrors(n, o, t);
                }
                return n;
            }
            mergeTwoErrors(e, t, n) {
                const o = this.handleOption(n), i = new r.HvigorErrorInfo;
                return v.mergePropertyMap.forEach((r, n) => {
                    const a = r.mergeTwoKey(e, t, o);
                    i[n] = a;
                }), i;
            }
            handleOption(e) {
                const r = {
                    code: t.MergeType.COLLECT_LAST,
                    cause: t.MergeType.COLLECT_LAST,
                    position: t.MergeType.COLLECT_LAST,
                    solutions: t.MergeType.COLLECT_LAST,
                    moreInfo: t.MergeType.COLLECT_LAST,
                    compareCode: (e, t) => e.getCode() === t.getCode(),
                    compareCause: (e, t) => e.getCause() === t.getCause(),
                    comparePosition: (e, t) => e.getPosition() === t.getPosition(),
                    compareMoreInfo: (e, t) => {
                        var r, n, o, i;
                        return !(!e || !t) && (null === (r = e.getMoreInfo()) || void 0 === r ? void 0 : r.cn) == (null === (n = t.getMoreInfo()) || void 0 === n ? void 0 : n.cn) && (null === (o = e.getMoreInfo()) || void 0 === o ? void 0 : o.en) == (null === (i = t.getMoreInfo()) || void 0 === i ? void 0 : i.en);
                    },
                    compareSolutions: (e, t) => {
                        if (!e || !t) {
                            return !1;
                        }
                        const r = e.getSolutions().sort(), n = t.getSolutions().sort();
                        return r.join() === n.join();
                    }
                };
                return Object.assign(r, e);
            }
        }
        e.MergeErrorList = v, v.mergePropertyMap = new Map, v.groupByKeyMap = new Map;
    }(Tp)), Tp;
}

var Mv, wv = {}, Fv = {};

function Pv() {
    return Mv || (Mv = 1, function(e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.HvigorConsoleLogger = void 0;
        const t = op, r = ap, n = Sv(), o = sp, i = wv;
        e.HvigorConsoleLogger = class {
            constructor(e) {
                this.subSystem = t.SubSystemEnum.UNKNOWN, this.hvigorErrorCommonAdapter = new o.HvigorErrorCommonAdapter, 
                this.hvigorLogList = [], this.subSystem = e;
            }
            printError(e) {
                e = r.ErrorUtil.getRealError(e);
                const t = this.hvigorErrorCommonAdapter.convertErrorToLogInfo(e);
                i.HvigorLoggerForConsole.getLogger(this.subSystem).error(t);
            }
            printErrorAndExit(e) {
                e = r.ErrorUtil.getRealError(e);
                const t = this.hvigorErrorCommonAdapter.convertErrorToLogInfo(e);
                i.HvigorLoggerForConsole.getLogger(this.subSystem).errorAndExit(t);
            }
            printWarn(e) {
                const t = this.hvigorErrorCommonAdapter.convertWarnToLogInfo(e);
                i.HvigorLoggerForConsole.getLogger(this.subSystem).warn(t);
            }
            printInfo(e) {
                const t = this.hvigorErrorCommonAdapter.convertInfoToLogInfo(e);
                i.HvigorLoggerForConsole.getLogger(this.subSystem).info(t);
            }
            printDebug(e) {
                const t = this.hvigorErrorCommonAdapter.convertDebugToLogInfo(e);
                i.HvigorLoggerForConsole.getLogger(this.subSystem).debug(t);
            }
            pushError(e) {
                this.hvigorLogList.push(r.ErrorUtil.getRealError(e));
            }
            printAllError(e) {
                let t = this.hvigorLogList;
                e && (t = e);
                for (let e = 0; e < (null == t ? void 0 : t.length); e++) {
                    this.printError(t[e]);
                }
                e || (this.hvigorLogList = []);
            }
            printMergedError(e, t) {
                let r = new n.MergeErrorList(this.hvigorLogList, e, t).getMergedErrorList();
                this.printAllError(r), this.hvigorLogList = [];
            }
        };
    }(Rp)), Rp;
}

!function(e) {
    var t = g && g.__createBinding || (Object.create ? function(e, t, r, n) {
        void 0 === n && (n = r);
        var o = Object.getOwnPropertyDescriptor(t, r);
        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
            enumerable: !0,
            get: function() {
                return t[r];
            }
        }), Object.defineProperty(e, n, o);
    } : function(e, t, r, n) {
        void 0 === n && (n = r), e[n] = t[r];
    }), r = g && g.__setModuleDefault || (Object.create ? function(e, t) {
        Object.defineProperty(e, "default", {
            enumerable: !0,
            value: t
        });
    } : function(e, t) {
        e.default = t;
    }), n = g && g.__importStar || function(e) {
        if (e && e.__esModule) {
            return e;
        }
        var n = {};
        if (null != e) {
            for (var o in e) {
                "default" !== o && Object.prototype.hasOwnProperty.call(e, o) && t(n, e, o);
            }
        }
        return r(n, e), n;
    };
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.HvigorLogger = void 0;
    const o = n(rd), i = Hp();
    e.HvigorLogger = class {
        constructor(e, t) {
            o.configure(i.HvigorLoggerConfig.updateConfiguration()), this.consoleLogger = o.getLogger(e), 
            this.setLevel(i.HvigorLoggerConfig.getLevel()), this.fileLogger = o.getLogger("debug-file");
        }
        getFileLogger() {
            return this.fileLogger;
        }
        getConsoleLogger() {
            return this.consoleLogger;
        }
        debug(e) {
            void 0 !== e.getMessage() && "" !== e.getMessage() && (this.consoleLogger.debug(e.getMessage()), 
            this.fileLogger.debug(e.getMessage()));
        }
        info(e) {
            void 0 !== e.getMessage() && "" !== e.getMessage() && (this.consoleLogger.info(e.getMessage()), 
            this.fileLogger.info(e.getMessage()));
        }
        warn(e) {
            void 0 !== e.getMessage() && "" !== e.getMessage() && (this.consoleLogger.warn(e.getMessage()), 
            this.fileLogger.warn(e.getMessage()));
        }
        error(e) {
            this.consoleLogger.error(e.getMessage()), this.fileLogger.error(e.getMessage());
        }
        errorAndExit(e) {
            throw this.consoleLogger.error(e.getMessage()), this.fileLogger.error(e.getMessage()), 
            new Error(e.getMessage());
        }
        errorWithoutStack(e) {
            this.consoleLogger.error(e.getMessage()), process.exit(-1);
        }
        setLevel(e) {
            this.consoleLogger.level = e;
        }
    };
}(Fv), function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.HvigorLoggerForConsole = void 0;
    const t = Fv;
    class r extends t.HvigorLogger {
        constructor(e, t) {
            super(e, t);
        }
        static getLogger(e) {
            return e || (e = "undefined"), r.hvigorLoggerCache.has(e) || r.hvigorLoggerCache.set(e, new r(e)), 
            r.hvigorLoggerCache.get(e);
        }
        static getLoggerWithDurationId(e, t) {
            return e || (e = "undefined"), r.hvigorLoggerCache.has(e) || r.hvigorLoggerCache.set(e, new r(e, t)), 
            r.hvigorLoggerCache.get(e);
        }
    }
    e.HvigorLoggerForConsole = r, r.hvigorLoggerCache = new Map;
}(wv);

var Iv = {};

Object.defineProperty(Iv, "__esModule", {
    value: !0
}), function(e) {
    var t = g && g.__createBinding || (Object.create ? function(e, t, r, n) {
        void 0 === n && (n = r);
        var o = Object.getOwnPropertyDescriptor(t, r);
        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
            enumerable: !0,
            get: function() {
                return t[r];
            }
        }), Object.defineProperty(e, n, o);
    } : function(e, t, r, n) {
        void 0 === n && (n = r), e[n] = t[r];
    }), r = g && g.__exportStar || function(e, r) {
        for (var n in e) {
            "default" === n || Object.prototype.hasOwnProperty.call(r, n) || t(r, e, n);
        }
    };
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.DEVELOPER_URL = e.getUrl = e.errorCode2Description = e.formatErrorAdaptorExport = e.MergeErrorList = e.HvigorErrorCommonAdapter = e.ErrorUtil = e.HvigorLoggerConfig = e.HvigorErrorInfo = e.HvigorConsoleLogger = e.AdaptorError = e.MATCH_FIELD_TYPES = e.ThirdPartyErrorAdaptor = e.PackToolAdaptor = e.MixAdaptor = e.HvigorOhosPluginAdaptor = e.HvigorGlobalErrorAdaptor = e.HvigorErrorAdaptor = e.ArkTsErrorAdaptor = void 0;
    var n = tp;
    Object.defineProperty(e, "ArkTsErrorAdaptor", {
        enumerable: !0,
        get: function() {
            return n.ArkTsErrorAdaptor;
        }
    });
    var o = mp();
    Object.defineProperty(e, "HvigorErrorAdaptor", {
        enumerable: !0,
        get: function() {
            return o.HvigorErrorAdaptor;
        }
    });
    var i = bp;
    Object.defineProperty(e, "HvigorGlobalErrorAdaptor", {
        enumerable: !0,
        get: function() {
            return i.HvigorGlobalErrorAdaptor;
        }
    });
    var a = Op;
    Object.defineProperty(e, "HvigorOhosPluginAdaptor", {
        enumerable: !0,
        get: function() {
            return a.HvigorOhosPluginAdaptor;
        }
    });
    var u = Ap;
    Object.defineProperty(e, "MixAdaptor", {
        enumerable: !0,
        get: function() {
            return u.MixAdaptor;
        }
    });
    var s = Mp;
    Object.defineProperty(e, "PackToolAdaptor", {
        enumerable: !0,
        get: function() {
            return s.PackToolAdaptor;
        }
    });
    var l = _p;
    Object.defineProperty(e, "ThirdPartyErrorAdaptor", {
        enumerable: !0,
        get: function() {
            return l.ThirdPartyErrorAdaptor;
        }
    });
    var c = pp;
    Object.defineProperty(e, "MATCH_FIELD_TYPES", {
        enumerable: !0,
        get: function() {
            return c.MATCH_FIELD_TYPES;
        }
    });
    var f = up;
    Object.defineProperty(e, "AdaptorError", {
        enumerable: !0,
        get: function() {
            return f.AdaptorError;
        }
    });
    var d = Pv();
    Object.defineProperty(e, "HvigorConsoleLogger", {
        enumerable: !0,
        get: function() {
            return d.HvigorConsoleLogger;
        }
    });
    var p = cp;
    Object.defineProperty(e, "HvigorErrorInfo", {
        enumerable: !0,
        get: function() {
            return p.HvigorErrorInfo;
        }
    });
    var v = Hp();
    Object.defineProperty(e, "HvigorLoggerConfig", {
        enumerable: !0,
        get: function() {
            return v.HvigorLoggerConfig;
        }
    });
    var h = ap;
    Object.defineProperty(e, "ErrorUtil", {
        enumerable: !0,
        get: function() {
            return h.ErrorUtil;
        }
    });
    var y = sp;
    Object.defineProperty(e, "HvigorErrorCommonAdapter", {
        enumerable: !0,
        get: function() {
            return y.HvigorErrorCommonAdapter;
        }
    });
    var m = Sv();
    Object.defineProperty(e, "MergeErrorList", {
        enumerable: !0,
        get: function() {
            return m.MergeErrorList;
        }
    });
    var E = Ep();
    Object.defineProperty(e, "formatErrorAdaptorExport", {
        enumerable: !0,
        get: function() {
            return E.formatErrorAdaptorExport;
        }
    }), Object.defineProperty(e, "errorCode2Description", {
        enumerable: !0,
        get: function() {
            return E.errorCode2Description;
        }
    }), r(Iv, e), r(op, e);
    var _ = ip;
    Object.defineProperty(e, "getUrl", {
        enumerable: !0,
        get: function() {
            return _.getUrl;
        }
    }), Object.defineProperty(e, "DEVELOPER_URL", {
        enumerable: !0,
        get: function() {
            return _.DEVELOPER_URL;
        }
    });
}(ep);

var Rv = {}, Tv = {}, Lv = {}, jv = {}, Nv = {}, xv = {};

Object.defineProperty(xv, "__esModule", {
    value: !0
});

var kv = Object.prototype.toString;

xv.default = function(e) {
    return null == e ? void 0 === e ? "[object Undefined]" : "[object Null]" : kv.call(e);
};

var Bv = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Nv, "__esModule", {
    value: !0
}), Nv.isFlattenable = Nv.isArguments = Nv.baseIsNaN = Nv.isPrototype = Nv.isIterate = Nv.isArray = Nv.isLength = Nv.isEqual = Nv.isIndex = Nv.isObject = void 0;

var $v = Bv(xv);

function Hv(e) {
    var t = typeof e;
    return null != e && ("object" === t || "function" === t);
}

Nv.isObject = Hv;

var Uv = /^(?:0|[1-9]\d*)$/;

function Gv(e, t) {
    var r = typeof e, n = t;
    return !!(n = null == n ? Number.MAX_SAFE_INTEGER : n) && ("number" === r || "symbol" !== r && Uv.test(e)) && e > -1 && e % 1 == 0 && e < n;
}

function Vv(e, t) {
    return e === t || Number.isNaN(e) && Number.isNaN(t);
}

function Wv(e) {
    return "number" == typeof e && e > -1 && e % 1 == 0 && e <= Number.MAX_SAFE_INTEGER;
}

function zv(e) {
    return null != e && "function" != typeof e && Wv(e.length);
}

Nv.isIndex = Gv, Nv.isEqual = Vv, Nv.isLength = Wv, Nv.isArray = zv, Nv.isIterate = function(e, t, r) {
    if (!Hv(r)) {
        return !1;
    }
    var n = typeof t;
    return !!("number" === n ? zv(r) && Gv(t, r.length) : "string" === n && t in r) && Vv(r[t], e);
};

var Jv = Object.prototype;

function Kv(e) {
    return Hv(e) && "[object Arguments]" === (0, $v.default)(e);
}

Nv.isPrototype = function(e) {
    var t = e && e.constructor;
    return e === ("function" == typeof t && t.prototype || Jv);
}, Nv.baseIsNaN = function(e) {
    return Number.isNaN(e);
}, Nv.isArguments = Kv;

var qv = Symbol.isConcatSpreadable;

Nv.isFlattenable = function(e) {
    return Array.isArray(e) || Kv(e) || !(!e || !e[qv]);
};

var Xv = {}, Yv = {};

Object.defineProperty(Yv, "__esModule", {
    value: !0
}), Yv.assignValue = Yv.baseAssignValue = void 0;

var Zv = Nv;

function Qv(e, t, r) {
    "__proto__" === t ? Object.defineProperty(e, t, {
        configurable: !0,
        enumerable: !0,
        value: r,
        writable: !0
    }) : e[t] = r;
}

Yv.baseAssignValue = Qv;

var eh = Object.prototype.hasOwnProperty;

Yv.assignValue = function(e, t, r) {
    var n = e[t];
    eh.call(e, t) && (0, Zv.isEqual)(n, r) && (void 0 !== r || t in e) || Qv(e, t, r);
};

var th = g && g.__values || function(e) {
    var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], n = 0;
    if (r) {
        return r.call(e);
    }
    if (e && "number" == typeof e.length) {
        return {
            next: function() {
                return e && n >= e.length && (e = void 0), {
                    value: e && e[n++],
                    done: !e
                };
            }
        };
    }
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

Object.defineProperty(Xv, "__esModule", {
    value: !0
}), Xv.copyObject = void 0;

var rh = Yv, nh = Nv;

Xv.copyObject = function(e, t, r, n) {
    var o, i, a = r, u = !a;
    (0, nh.isObject)(a) || (a = {});
    try {
        for (var s = th(t), l = s.next(); !l.done; l = s.next()) {
            var c = l.value, f = n ? n(a[c], e[c], c, a, e) : void 0;
            void 0 === f && (f = e[c]), u ? (0, rh.baseAssignValue)(a, c, f) : (0, rh.assignValue)(a, c, f);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            l && !l.done && (i = s.return) && i.call(s);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
};

var oh = {}, ih = {};

Object.defineProperty(ih, "__esModule", {
    value: !0
});

var ah = Nv;

ih.default = function(e) {
    return null != e && "function" != typeof e && (0, ah.isLength)(e.length);
};

var uh = {}, sh = {}, lh = {};

Object.defineProperty(lh, "__esModule", {
    value: !0
}), lh.default = function(e) {
    return "object" == typeof e && null !== e;
};

var ch = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(sh, "__esModule", {
    value: !0
});

var fh = ch(xv), dh = ch(lh), ph = /^\[object (?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)Array\]$/;

sh.default = function(e) {
    return (0, dh.default)(e) && ph.test((0, fh.default)(e));
};

var vh = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(uh, "__esModule", {
    value: !0
});

var hh = Nv, gh = vh(sh), yh = Object.prototype.hasOwnProperty;

uh.default = function(e, t) {
    for (var r = function(e, t) {
        var r = !e && (0, hh.isArguments)(t), n = !e && !r && !1, o = !e && !r && !n && (0, 
        gh.default)(t);
        return e || r || n || o;
    }(Array.isArray(e), e), n = e.length, o = new Array(r ? n : 0), i = r ? -1 : n; ++i < n; ) {
        o[i] = "".concat(i);
    }
    for (var a in e) {
        !t && !yh.call(e, a) || r && ("length" === a || (0, hh.isIndex)(a, n)) || o.push(a);
    }
    return o;
};

var mh = {};

Object.defineProperty(mh, "__esModule", {
    value: !0
}), mh.default = function(e) {
    return null == e;
};

var Eh = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(oh, "__esModule", {
    value: !0
});

var _h = Eh(ih), Dh = Eh(uh), bh = Eh(mh);

oh.default = function(e) {
    return (0, bh.default)(e) ? [] : (0, _h.default)(e) ? (0, Dh.default)(e, void 0) : Object.keys(Object(e));
};

var Oh = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, Ah = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
}, Ch = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(jv, "__esModule", {
    value: !0
}), jv.createAssignFunction = void 0;

var Sh = Nv, Mh = Xv, wh = Yv, Fh = Ch(oh);

function Ph(e) {
    return function(t) {
        for (var r = [], n = 1; n < arguments.length; n++) {
            r[n - 1] = arguments[n];
        }
        var o = -1, i = r.length, a = i > 1 ? r[i - 1] : void 0, u = i > 2 ? r[2] : void 0;
        a = e.length > 3 && "function" == typeof a ? (i--, a) : void 0, u && (0, Sh.isIterate)(r[0], r[1], u) && (a = i < 3 ? void 0 : a, 
        i = 1);
        for (var s = Object(t); ++o < i; ) {
            var l = r[o];
            l && e(s, l, o, a);
        }
        return s;
    };
}

jv.createAssignFunction = Ph;

var Ih = function(e, t) {
    if ((0, Sh.isPrototype)(t) || Array.isArray(t)) {
        (0, Mh.copyObject)(t, (0, Fh.default)(t), e, void 0);
    } else {
        for (var r in t) {
            Object.hasOwnProperty.call(t, r) && (0, wh.assignValue)(e, r, t[r]);
        }
    }
};

jv.default = function(e) {
    for (var t = [], r = 1; r < arguments.length; r++) {
        t[r - 1] = arguments[r];
    }
    return Ph(Ih).apply(void 0, Ah([ e ], Oh(t), !1));
};

var Rh = {};

Object.defineProperty(Rh, "__esModule", {
    value: !0
}), Rh.default = function(e) {
    for (var t, r = [], n = 1; n < arguments.length; n++) {
        r[n - 1] = arguments[n];
    }
    for (var o = Object.assign({}, e), i = function(e, t) {
        var n = r[e];
        if (Array.isArray(n)) {
            for (var i = 0, a = n.length; i < a; i++) {
                o[i] = n[i];
            }
        } else {
            Object.keys(n).forEach(function(e) {
                o[e] = n[e];
            });
        }
    }, a = 0, u = r.length; a < u; a++) {
        i(a);
    }
    var s = function(e, n) {
        ((null === (t = r[e]) || void 0 === t ? void 0 : t.constructor) ? Object.keys(r[e].constructor.prototype) : []).forEach(function(t) {
            o[t] = r[e].constructor.prototype[t];
        });
    };
    for (a = 0, u = r.length; a < u; a++) {
        s(a);
    }
    return o;
};

var Th = {};

Object.defineProperty(Th, "__esModule", {
    value: !0
}), Th.default = function(e) {
    return 0 === arguments.length ? [] : Array.isArray(e) ? e : [ e ];
};

var Lh = {}, jh = {};

Object.defineProperty(jh, "__esModule", {
    value: !0
}), jh.default = function(e) {
    void 0 === e && (e = void 0);
    var t = e;
    return e instanceof Object && (t = e.valueOf()), t != t;
};

var Nh = {}, xh = {}, kh = {}, Bh = {};

Object.defineProperty(Bh, "__esModule", {
    value: !0
}), Bh.default = function(e) {
    return e;
};

var $h = {}, Hh = {}, Uh = {};

Object.defineProperty(Uh, "__esModule", {
    value: !0
});

var Gh, Vh = Array.isArray;

function Wh() {
    if (Gh) {
        return Hh;
    }
    Gh = 1;
    var e = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty(Hh, "__esModule", {
        value: !0
    }), Hh.isKey = void 0;
    var t = e(Uh), r = e(ag()), n = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, o = /^\w*$/;
    return Hh.isKey = function(e, i) {
        if ((0, t.default)(e)) {
            return !1;
        }
        var a = typeof e;
        return !("number" !== a && "symbol" !== a && "boolean" !== a && null != e && !(0, 
        r.default)(e)) || (o.test(e) || !n.test(e) || null != i && e in Object(i));
    }, Hh;
}

Uh.default = function(e) {
    return Vh(e);
};

var zh, Jh = {};

function Kh() {
    if (zh) {
        return Jh;
    }
    zh = 1;
    var e = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty(Jh, "__esModule", {
        value: !0
    }), Jh.toKey = void 0;
    var t = e(ag());
    return Jh.toKey = function(e) {
        if ("string" == typeof e || (0, t.default)(e)) {
            return e;
        }
        var r = "".concat(e);
        return "0" === r && 1 / e == -1 / 0 ? "-0" : r;
    }, Jh;
}

var qh, Xh, Yh, Zh, Qh, eg = {}, tg = {};

function rg() {
    if (qh) {
        return tg;
    }
    qh = 1, Object.defineProperty(tg, "__esModule", {
        value: !0
    }), tg.getObjValidPathFromGeneralPath = void 0;
    var e = ig(), t = /(?:\[('|")((?:\\[\s\S]|(?!\1)[^\\])+)\1\]|\[(-?\d+(?:\.\d+)?)\]|\[((?:\\[\s\S]|[^[\]])*?)\]|([\w|!|@|#|$|%|^|&|*|(|)|\-|+|=|{|}|||;|:|<|>|?|,|'|"|！|￥|…|（|）|—|_|、|；|：|《|》|？|，|‘|’|“|”|/|\\]+))/g;
    function r(e) {
        if ("" === e.trim()) {
            return [ e ];
        }
        for (var r, n = []; null !== (r = t.exec(e)); ) {
            r[2] ? n.push("".concat(r[1]).concat(r[2]).concat(r[1])) : r[3] ? n.push(r[3]) : r[4] || "" === r[4] ? n.push("".concat(r[4])) : r[5] && n.push(r[5]);
        }
        return n;
    }
    return tg.default = r, tg.getObjValidPathFromGeneralPath = function(t, n) {
        if ("symbol" == typeof n) {
            return [ n ];
        }
        if (Array.isArray(n)) {
            return n.map(function(t) {
                return (0, e.toStringWithZeroSign)(t);
            });
        }
        var o = (0, e.toStringWithZeroSign)(n);
        return null != t && o in Object(t) ? [ o ] : r(o);
    }, tg;
}

function ng() {
    if (Xh) {
        return eg;
    }
    Xh = 1;
    var e = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty(eg, "__esModule", {
        value: !0
    });
    var t = e(rg()), r = /^\w+$/;
    return eg.default = function(e, n, o) {
        var i = null == e ? void 0 : function(e, n) {
            for (var o, i = 0, a = e, u = ((o = Array.isArray(n) ? n : r.test(n) || n in Object(e) ? [ n ] : (0, 
            t.default)(n)).length); null != a && i < o.length; ) {
                a = a[o[i++]];
            }
            return i && i === u ? a : void 0;
        }(e, n);
        return void 0 === i ? o : i;
    }, eg;
}

function og() {
    if (Yh) {
        return $h;
    }
    Yh = 1;
    var e = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty($h, "__esModule", {
        value: !0
    });
    var t = Wh(), r = Kh(), n = e(ng());
    return $h.default = function(e) {
        return (0, t.isKey)(e) ? function(t) {
            return null == t ? void 0 : t[(0, r.toKey)(e)];
        } : function(t) {
            return (0, n.default)(t, e);
        };
    }, $h;
}

function ig() {
    if (Zh) {
        return kh;
    }
    Zh = 1;
    var e = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty(kh, "__esModule", {
        value: !0
    }), kh.getRealIterateeWithIdentityDefault = kh.getObjectKeysWithProtoChain = kh.toStringWithZeroSign = kh.falsey = kh.whiteSpace = kh.tagName = void 0;
    var t = e(Bh), r = e(og());
    kh.tagName = function(e) {
        return null === e ? "[object Null]" : void 0 === e ? "[object Undefined]" : Object.prototype.toString.apply(e);
    }, kh.whiteSpace = [ " ", "\t", "\v", "\f", " ", "\ufeff", "\n", "\r", "\u2028", "\u2029", " ", "᠎", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "　" ], 
    kh.falsey = [ null, void 0, !1, 0, NaN, "" ];
    return kh.toStringWithZeroSign = function(e) {
        return "symbol" == typeof e ? e : Object.is(-0, e) || e instanceof Number && Object.is(-0, Number(e)) ? "-0" : String(e);
    }, kh.getObjectKeysWithProtoChain = function(e) {
        var t = [];
        if (null == e) {
            return t;
        }
        for (var r in e) {
            r && t.push(r);
        }
        return t;
    }, kh.getRealIterateeWithIdentityDefault = function(e) {
        var n = t.default, o = typeof e;
        return "function" === o ? n = e : "string" === o && (n = (0, r.default)(e)), n;
    }, kh;
}

function ag() {
    if (Qh) {
        return xh;
    }
    Qh = 1, Object.defineProperty(xh, "__esModule", {
        value: !0
    });
    var e = ig();
    return xh.default = function(t) {
        void 0 === t && (t = void 0);
        var r = typeof t;
        return "symbol" === r || "object" === r && null != t && "[object Symbol]" === (0, 
        e.tagName)(t);
    }, xh;
}

var ug = {};

Object.defineProperty(ug, "__esModule", {
    value: !0
}), ug.default = function(e, t) {
    if (null == e) {
        return "";
    }
    if (e && !t) {
        return e.trim();
    }
    var r = new Set(t && t.split(""));
    r.add(" ");
    for (var n = e.split(""), o = 0, i = n.length - 1, a = 0; a < n.length; a++) {
        if (!r.has(n[a])) {
            o = a;
            break;
        }
    }
    for (a = n.length - 1; a >= o; a--) {
        if (!r.has(n[a])) {
            i = a;
            break;
        }
    }
    return n.slice(o, i + 1).join("");
};

var sg = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Nh, "__esModule", {
    value: !0
});

var lg = Nv, cg = sg(ag()), fg = sg(ug);

Nh.default = function(e) {
    var t = e;
    if ("number" == typeof t) {
        return t;
    }
    if ((0, cg.default)(t)) {
        return NaN;
    }
    if ((0, lg.isObject)(t)) {
        var r = "function" == typeof t.valueOf ? t.valueOf() : t;
        t = (0, lg.isObject)(r) ? "".concat(r) : r;
    }
    return "string" != typeof t ? 0 === t ? t : +t : function(e) {
        var t = (0, fg.default)(e), r = /^0b[01]+$/i.test(t), n = /^0o[0-7]+$/i.test(t), o = /^[-+]0x[0-9a-f]+$/i.test(t);
        return r || n ? parseInt(t.slice(2), r ? 2 : 8) : o ? NaN : +t;
    }(t);
};

var dg = {}, pg = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(dg, "__esModule", {
    value: !0
}), dg.numMulti = void 0;

var vg = pg(jh), hg = pg(Nh);

function gg(e, t) {
    var r = 0;
    try {
        e.toString().indexOf(".") > -1 && (r += e.toString().split(".")[1].length);
    } catch (e) {}
    try {
        t.toString().indexOf(".") > -1 && (r += t.toString().split(".")[1].length);
    } catch (e) {}
    return Number(e.toString().replace(".", "")) * Number(t.toString().replace(".", "")) / Math.pow(10, r);
}

dg.numMulti = gg, dg.default = function(e, t) {
    if (void 0 === t && (t = 0), "number" != typeof Number(e)) {
        return Number.NaN;
    }
    if (e === Number.MAX_SAFE_INTEGER || e === Number.MIN_SAFE_INTEGER) {
        return e;
    }
    var r = (0, vg.default)(t) ? 0 : Math.floor((0, hg.default)(t)), n = Number(e);
    if (0 === r) {
        return Math.floor(n);
    }
    var o = Math.pow(10, Math.abs(r));
    if (o === Number.POSITIVE_INFINITY || o === Number.NEGATIVE_INFINITY) {
        return e;
    }
    if (n >= 0 && 1 / n > 0) {
        if (r > 0) {
            return Math.floor(gg(Math.abs(n), o)) / o;
        }
        if (r < 0) {
            return gg(Math.floor(Math.abs(n) / o), o);
        }
    } else {
        if (r > 0) {
            return -Math.ceil(gg(Math.abs(n), o)) / o;
        }
        if (r < 0) {
            return -gg(Math.ceil(Math.abs(n) / o), o);
        }
    }
    return 0;
};

var yg = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Lh, "__esModule", {
    value: !0
});

var mg = yg(jh), Eg = yg(Nh), _g = dg;

Lh.default = function(e, t) {
    if (void 0 === t && (t = 0), "number" != typeof Number(e)) {
        return Number.NaN;
    }
    if (e === Number.MAX_SAFE_INTEGER || e === Number.MIN_SAFE_INTEGER) {
        return e;
    }
    var r = (0, mg.default)(t) ? 0 : Math.floor((0, Eg.default)(t)), n = Number(e);
    if (0 === r) {
        return Math.ceil(n);
    }
    var o = Math.pow(10, Math.abs(r));
    if (o === Number.POSITIVE_INFINITY || o === Number.NEGATIVE_INFINITY) {
        return e;
    }
    if (n >= 0 && 1 / n > 0) {
        if (r > 0) {
            return Math.ceil((0, _g.numMulti)(Math.abs(n), o)) / o;
        }
        if (r < 0) {
            return (0, _g.numMulti)(Math.ceil(Math.abs(n) / o), o);
        }
    } else {
        if (r > 0) {
            return -Math.floor((0, _g.numMulti)(Math.abs(n), o)) / o;
        }
        if (r < 0) {
            return -(0, _g.numMulti)(Math.floor(Math.abs(n) / o), o);
        }
    }
    return 0;
};

var Dg = {}, bg = {};

Object.defineProperty(bg, "__esModule", {
    value: !0
}), bg.default = function(e, t, r) {
    var n = e.length, o = t;
    o < 0 && (o = -t > n ? 0 : n + t);
    var i = r > n ? n : r;
    i < 0 && (i += n), n = o > i ? 0 : i - o;
    for (var a = Array(n), u = -1; ++u < n; ) {
        a[u] = e[u + o];
    }
    return a;
};

var Og = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Dg, "__esModule", {
    value: !0
});

var Ag = Og(bg);

Dg.default = function(e, t) {
    void 0 === t && (t = 1);
    var r = null == e ? 0 : e.length, n = Math.floor, o = Math.ceil, i = n(Number(t));
    if (!i || i < 0) {
        return [];
    }
    for (var a = o(r / i), u = Array(a), s = 0; s < a; s++) {
        u[s] = (0, Ag.default)(e, s * i, (s + 1) * i);
    }
    return u;
};

var Cg = {};

Object.defineProperty(Cg, "__esModule", {
    value: !0
});

var Sg = Array.isArray;

function Mg(e, t) {
    return e < t ? e : t;
}

function wg(e) {
    return Sg(e) ? 0 === e.length ? 0 : 1 === e.length ? Number(e[0]) : NaN : Number(e);
}

Cg.default = function(e, t, r) {
    var n = wg(e), o = wg(t), i = wg(r), a = Number.isNaN, u = a(n);
    return o = a(o) ? 0 : o, i = a(i) ? 0 : i, u ? NaN : void 0 === t ? void 0 === r ? n : Mg(n, i) : void 0 === r ? Mg(n, o) : i < o || n < o ? o : n < i ? n : i;
};

var Fg = {}, Pg = {}, Ig = {};

Object.defineProperty(Ig, "__esModule", {
    value: !0
}), Ig.default = function(e, t) {
    var r = -1, n = e.length, o = t;
    for (Array.isArray(o) || (o = new Array(n)); ++r < n; ) {
        o[r] = e[r];
    }
    return o;
};

var Rg = {}, Tg = {}, Lg = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, jg = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
};

Object.defineProperty(Tg, "__esModule", {
    value: !0
}), Tg.getSymbolsIn = Tg.getSymbols = void 0;

var Ng = Object.prototype.propertyIsEnumerable, xg = Object.getOwnPropertySymbols;

function kg(e) {
    var t = e;
    return null == t ? [] : (t = Object(t), xg(t).filter(function(e) {
        return Ng.call(t, e);
    }));
}

Tg.getSymbols = kg, Tg.getSymbolsIn = function(e) {
    for (var t = e, r = []; t; ) {
        r.push.apply(r, jg([], Lg(kg(t)), !1)), t = Object.getPrototypeOf(Object(t));
    }
    return r;
}, Object.defineProperty(Rg, "__esModule", {
    value: !0
}), Rg.copySymbolsIn = void 0;

var Bg = Tg, $g = Xv;

Rg.copySymbolsIn = function(e, t) {
    return (0, $g.copyObject)(e, (0, Bg.getSymbolsIn)(e), t, !1);
}, Rg.default = function(e, t) {
    return (0, $g.copyObject)(e, (0, Bg.getSymbols)(e), t, !1);
};

var Hg = {}, Ug = {};

Object.defineProperty(Ug, "__esModule", {
    value: !0
}), Ug.default = function(e) {
    return null !== e && [ "object", "function" ].includes(typeof e);
};

var Gg = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Hg, "__esModule", {
    value: !0
});

var Vg = Gg(uh), Wg = Nv, zg = Gg(ih), Jg = Gg(Ug);

function Kg(e) {
    if (!(0, Jg.default)(e)) {
        return function(e) {
            var t = [];
            if (null == e) {
                return t;
            }
            var r = Object(e);
            for (var n in r) {
                n in r && t.push(n);
            }
            return t;
        }(e);
    }
    var t = (0, Wg.isPrototype)(e), r = [];
    for (var n in e) {
        ("constructor" !== n || !t && Object.prototype.hasOwnProperty.call(e, n)) && r.push(n);
    }
    return r;
}

Hg.default = function(e) {
    return (0, zg.default)(e) ? (0, Vg.default)(e, !0) : Kg(e);
};

var qg = {}, Xg = {}, Yg = {}, Zg = {};

Object.defineProperty(Zg, "__esModule", {
    value: !0
}), Zg.default = function(e, t) {
    return void 0 === e && (e = void 0), void 0 === t && (t = void 0), e === t || e != e && t != t;
};

var Qg = g && g.__values || function(e) {
    var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], n = 0;
    if (r) {
        return r.call(e);
    }
    if (e && "number" == typeof e.length) {
        return {
            next: function() {
                return e && n >= e.length && (e = void 0), {
                    value: e && e[n++],
                    done: !e
                };
            }
        };
    }
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, ey = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Yg, "__esModule", {
    value: !0
}), Yg.assocIndexOf = Yg.cacheHas = Yg.arrayIncludesWith = Yg.arrayIncludes = Yg.baseIndexOf = Yg.strictIndexOf = void 0;

var ty = Nv, ry = ey(Zg);

function ny(e, t, r, n) {
    for (var o = e.length, i = r + (n ? 1 : -1); n ? i-- : ++i < o; ) {
        if (t(e[i], i, e)) {
            return i;
        }
    }
    return -1;
}

function oy(e, t, r) {
    return e.indexOf(t, r);
}

Yg.strictIndexOf = oy, Yg.baseIndexOf = function(e, t, r) {
    return Number.isNaN(t) ? oy(e, t, r) : ny(e, ty.baseIsNaN, r, !1);
}, Yg.arrayIncludes = function(e, t) {
    return e.includes(t);
}, Yg.arrayIncludesWith = function(e, t, r) {
    var n, o;
    if (null == e) {
        return !1;
    }
    try {
        for (var i = Qg(e), a = i.next(); !a.done; a = i.next()) {
            if (r(t, a.value)) {
                return !0;
            }
        }
    } catch (e) {
        n = {
            error: e
        };
    } finally {
        try {
            a && !a.done && (o = i.return) && o.call(i);
        } finally {
            if (n) {
                throw n.error;
            }
        }
    }
    return !1;
}, Yg.cacheHas = function(e, t) {
    return e.has(t);
}, Yg.assocIndexOf = function(e, t) {
    for (var r = e.length; r--; ) {
        if ((0, ry.default)(e[r][0], t)) {
            return r;
        }
    }
    return -1;
}, Yg.default = ny, Object.defineProperty(Xg, "__esModule", {
    value: !0
});

var iy = Yg, ay = function() {
    function e(e) {
        this.wdkData = [], this.size = 0;
        for (var t = -1, r = null == e ? 0 : e.length; ++t < r; ) {
            var n = e[t];
            this.set(n[0], n[1]);
        }
    }
    return e.prototype.clear = function() {
        this.wdkData = [], this.size = 0;
    }, e.prototype.delete = function(e) {
        var t = this.wdkData, r = (0, iy.assocIndexOf)(t, e);
        return !(r < 0) && (r === t.length - 1 ? t.pop() : t.splice(r, 1), --this.size, 
        !0);
    }, e.prototype.get = function(e) {
        var t = this.wdkData, r = (0, iy.assocIndexOf)(t, e);
        return r < 0 ? void 0 : t[r][1];
    }, e.prototype.has = function(e) {
        return (0, iy.assocIndexOf)(this.wdkData, e) > -1;
    }, e.prototype.set = function(e, t) {
        var r = this.wdkData, n = (0, iy.assocIndexOf)(r, e);
        return n < 0 ? (++this.size, r.push([ e, t ])) : r[n][1] = t, this;
    }, e;
}();

Xg.default = ay;

var uy = {}, sy = {};

Object.defineProperty(sy, "__esModule", {
    value: !0
});

var ly = "__wdk_hash_undefined__", cy = function() {
    function e(e) {
        this.wdkData = Object.create(null), this.size = 0;
        for (var t = -1, r = null == e ? 0 : e.length; ++t < r; ) {
            var n = e[t];
            this.set(n[0], n[1]);
        }
    }
    return e.prototype.clear = function() {
        this.wdkData = Object.create(null), this.size = 0;
    }, e.prototype.delete = function(e) {
        var t = this.has(e) && delete this.wdkData[e];
        return this.size -= t ? 1 : 0, t;
    }, e.prototype.get = function(e) {
        var t = this.wdkData[e];
        return t === ly ? void 0 : t;
    }, e.prototype.has = function(e) {
        return void 0 !== this.wdkData[e];
    }, e.prototype.set = function(e, t) {
        var r = this.wdkData;
        return this.size += this.has(e) ? 0 : 1, r[e] = void 0 === t ? ly : t, this;
    }, e;
}();

sy.default = cy;

var fy = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(uy, "__esModule", {
    value: !0
});

var dy = fy(sy);

function py(e, t) {
    var r = e.wdkData;
    return function(e) {
        var t = typeof e;
        return "string" === t || "number" === t || "symbol" === t || "boolean" === t ? "__proto__" !== e : null === e;
    }(t) ? r["string" == typeof t ? "string" : "hash"] : r.map;
}

var vy = function() {
    function e(e) {
        this.size = 0, this.wdkData = {
            hash: new dy.default(void 0),
            map: new Map,
            string: new dy.default(void 0)
        };
        for (var t = -1, r = null == e ? 0 : e.length; ++t < r; ) {
            var n = e[t];
            this.set(n[0], n[1]);
        }
    }
    return e.prototype.clear = function() {
        this.size = 0, this.wdkData = {
            hash: new dy.default(void 0),
            map: new Map,
            string: new dy.default(void 0)
        };
    }, e.prototype.delete = function(e) {
        var t = py(this, e).delete(e);
        return this.size -= t ? 1 : 0, t;
    }, e.prototype.get = function(e) {
        return py(this, e).get(e);
    }, e.prototype.has = function(e) {
        return py(this, e).has(e);
    }, e.prototype.set = function(e, t) {
        var r = py(this, e), n = r.size;
        return r.set(e, t), this.size += r.size === n ? 0 : 1, this;
    }, e;
}();

uy.default = vy;

var hy = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(qg, "__esModule", {
    value: !0
}), qg.Stack = void 0;

var gy = hy(Xg), yy = hy(uy), my = function() {
    function e(e) {
        this.wdkData = new gy.default(e);
        var t = this.wdkData;
        this.size = t.size;
    }
    return e.prototype.clear = function() {
        this.wdkData = new gy.default(void 0), this.size = 0;
    }, e.prototype.delete = function(e) {
        var t = this.wdkData, r = t.delete(e);
        return this.size = t.size, r;
    }, e.prototype.get = function(e) {
        return this.wdkData.get(e);
    }, e.prototype.has = function(e) {
        return this.wdkData.has(e);
    }, e.prototype.set = function(e, t) {
        var r = this.wdkData;
        if (r instanceof gy.default) {
            var n = r.wdkData;
            if (n.length < 199) {
                return n.push([ e, t ]), this.size = ++r.size, this;
            }
            this.wdkData = new yy.default(n), r = this.wdkData;
        }
        return r.set(e, t), this.size = r.size, this;
    }, e;
}();

qg.Stack = my;

var Ey = {}, _y = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, Dy = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
}, by = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Ey, "__esModule", {
    value: !0
}), Ey.getAllKeysIn = void 0;

var Oy = by(oh), Ay = Tg;

Ey.getAllKeysIn = function(e) {
    var t = [];
    for (var r in e) {
        Object.hasOwnProperty.call(e, r) && t.push(r);
    }
    return Array.isArray(e) || t.push.apply(t, Dy([], _y((0, Ay.getSymbolsIn)(e)), !1)), 
    t;
}, Ey.default = function(e) {
    var t = (0, Oy.default)(e);
    return Array.isArray(e) || t.push.apply(t, Dy([], _y((0, Ay.getSymbols)(e)), !1)), 
    t;
};

var Cy = {};

Object.defineProperty(Cy, "__esModule", {
    value: !0
}), Cy.arrayEach = void 0, Cy.arrayEach = function(e, t) {
    return e.forEach(t), e;
};

var Sy = g && g.__createBinding || (Object.create ? function(e, t, r, n) {
    void 0 === n && (n = r);
    var o = Object.getOwnPropertyDescriptor(t, r);
    o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
        enumerable: !0,
        get: function() {
            return t[r];
        }
    }), Object.defineProperty(e, n, o);
} : function(e, t, r, n) {
    void 0 === n && (n = r), e[n] = t[r];
}), My = g && g.__setModuleDefault || (Object.create ? function(e, t) {
    Object.defineProperty(e, "default", {
        enumerable: !0,
        value: t
    });
} : function(e, t) {
    e.default = t;
}), wy = g && g.__importStar || function(e) {
    if (e && e.__esModule) {
        return e;
    }
    var t = {};
    if (null != e) {
        for (var r in e) {
            "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && Sy(t, e, r);
        }
    }
    return My(t, e), t;
}, Fy = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Pg, "__esModule", {
    value: !0
}), Pg.initCloneObject = Pg.cloneDataView = Pg.cloneRegExp = Pg.cloneSymbol = Pg.cloneTypedArray = Pg.cloneArrayBuffer = void 0;

var Py = Nv, Iy = Fy(xv), Ry = Fy(Ig), Ty = wy(Rg), Ly = Xv, jy = Fy(Hg), Ny = qg, xy = Fy(sh), ky = wy(Ey), By = Fy(oh), $y = Cy, Hy = Yv;

function Uy(e) {
    var t = new e.constructor(e.byteLength);
    return new Uint8Array(t).set(new Uint8Array(e)), t;
}

function Gy(e, t) {
    var r = t ? Uy(e.buffer) : e.buffer;
    return new e.constructor(r, e.byteOffset, e.length);
}

Pg.cloneArrayBuffer = Uy, Pg.cloneTypedArray = Gy;

var Vy = Symbol.prototype.valueOf;

function Wy(e) {
    return Object(Vy.call(e));
}

Pg.cloneSymbol = Wy;

var zy = /\w*$/;

function Jy(e) {
    var t = new e.constructor(e.source, zy.exec(e));
    return t.lastIndex = e.lastIndex, t;
}

function Ky(e, t) {
    var r = t ? Uy(e.buffer) : e.buffer;
    return new e.constructor(r, e.byteOffset, e.byteLength);
}

function qy(e) {
    return "function" != typeof e.constructor || (0, Py.isPrototype)(e) ? {} : Object.create(Object.getPrototypeOf(e));
}

Pg.cloneRegExp = Jy, Pg.cloneDataView = Ky, Pg.initCloneObject = qy;

var Xy = "[object Arguments]", Yy = "[object Boolean]", Zy = "[object Date]", Qy = "[object Map]", em = "[object Number]", tm = "[object Object]", rm = "[object RegExp]", nm = "[object Set]", om = "[object String]", im = "[object Symbol]", am = "[object ArrayBuffer]", um = "[object DataView]", sm = "[object Float32Array]", lm = "[object Float64Array]", cm = "[object Int8Array]", fm = "[object Int16Array]", dm = "[object Int32Array]", pm = "[object Uint8Array]", vm = "[object Uint8ClampedArray]", hm = "[object Uint16Array]", gm = "[object Uint32Array]", ym = {};

ym[Xy] = !0, ym["[object Array]"] = !0, ym[am] = !0, ym[um] = !0, ym[Yy] = !0, ym[Zy] = !0, 
ym[sm] = !0, ym[lm] = !0, ym[cm] = !0, ym[fm] = !0, ym[dm] = !0, ym[Qy] = !0, ym[em] = !0, 
ym[tm] = !0, ym[rm] = !0, ym[nm] = !0, ym[om] = !0, ym[im] = !0, ym[pm] = !0, ym[vm] = !0, 
ym[hm] = !0, ym[gm] = !0, ym["[object Error]"] = !1, ym["[object WeakMap]"] = !1;

var mm = Object.prototype.hasOwnProperty, Em = [ sm, lm, cm, fm, dm, pm, vm, hm, gm ], _m = [ Yy, Zy ], Dm = [ em, om ];

Pg.default = function e(t, r, n, o, i, a) {
    var u, s = 1 & r, l = 2 & r, c = 4 & r;
    if (n && (u = i ? n(t, o, i, a) : n(t)), void 0 !== u) {
        return u;
    }
    if (!(0, Py.isObject)(t)) {
        return t;
    }
    var f = Array.isArray(t), d = (0, Iy.default)(t);
    if (f) {
        if (u = function(e) {
            var t = e.length, r = new e.constructor(t);
            return t && "string" == typeof e[0] && mm.call(e, "index") && (r.index = e.index, 
            r.input = e.input), r;
        }(t), !s) {
            return (0, Ry.default)(t, u);
        }
    } else {
        var p = "function" == typeof t;
        if (d === tm || d === Xy || p && !i) {
            if (u = l || p ? {} : qy(t), !s) {
                return l ? (0, Ty.copySymbolsIn)(t, (0, Ly.copyObject)(t, (0, jy.default)(t), u, !1)) : (0, 
                Ty.default)(t, Object.assign(u, t));
            }
        } else {
            if (p || !ym[d]) {
                return i ? t : {};
            }
            u = function(e, t, r) {
                var n = e.constructor;
                if (Em.includes(t)) {
                    return Gy(e, r);
                }
                if (_m.includes(t)) {
                    return new n(+e);
                }
                if (Dm.includes(t)) {
                    return new n(e);
                }
                switch (t) {
                  case am:
                    return Uy(e);

                  case um:
                    return Ky(e, r);

                  case Qy:
                    return new n;

                  case rm:
                    return Jy(e);

                  case nm:
                    return new n;

                  case im:
                    return Wy(e);

                  default:
                    return;
                }
            }(t, d, s);
        }
    }
    var v = a;
    v || (v = new Ny.Stack(void 0));
    var h, g = v.get(t);
    if (g) {
        return g;
    }
    if (v.set(t, u), d === Qy) {
        return t.forEach(function(o, i) {
            u.set(i, e(o, r, n, i, t, v));
        }), u;
    }
    if (d === nm) {
        return t.forEach(function(o) {
            u.add(e(o, r, n, o, t, v));
        }), u;
    }
    if ((0, xy.default)(t)) {
        return u;
    }
    h = c ? l ? ky.getAllKeysIn : ky.default : l ? jy.default : By.default;
    var y = f ? void 0 : h(t);
    return (0, $y.arrayEach)(y || t, function(o, i) {
        var a = i, s = o;
        y && (s = t[a = s]), (0, Hy.assignValue)(u, a, e(s, r, n, a, t, v));
    }), u;
};

var bm = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Fg, "__esModule", {
    value: !0
});

var Om = bm(Pg);

Fg.default = function(e) {
    return (0, Om.default)(e, 4, void 0, void 0, void 0, void 0);
};

var Am = {}, Cm = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Am, "__esModule", {
    value: !0
});

var Sm = Cm(Pg);

Am.default = function(e) {
    return (0, Sm.default)(e, 5, void 0, void 0, void 0, void 0);
};

var Mm = {};

Object.defineProperty(Mm, "__esModule", {
    value: !0
}), Mm.default = function(e) {
    if (!Array.isArray(e) || null == e) {
        return [];
    }
    for (var t = [], r = 0, n = 0, o = e.length; n < o; n++) {
        e[n] && (t[r++] = e[n]);
    }
    return t;
};

var wm = {}, Fm = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, Pm = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
};

Object.defineProperty(wm, "__esModule", {
    value: !0
}), wm.default = function(e) {
    for (var t = [], r = 1; r < arguments.length; r++) {
        t[r - 1] = arguments[r];
    }
    if (0 === arguments.length) {
        return [];
    }
    var n = [];
    Array.isArray(e) ? n.push.apply(n, Pm([], Fm(e), !1)) : n.push(e);
    for (var o = 0, i = t.length; o < i; o++) {
        Array.isArray(t[o]) ? n.push.apply(n, Pm([], Fm(t[o]), !1)) : n.push(t[o]);
    }
    return n;
};

var Im = {}, Rm = {}, Tm = {};

Object.defineProperty(Tm, "__esModule", {
    value: !0
});

var Lm = "object" == typeof g && null !== g && g.Object === Object && g;

Tm.default = Lm;

var jm = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Rm, "__esModule", {
    value: !0
});

var Nm = jm(Tm), xm = "object" == typeof globalThis && null !== globalThis && globalThis.Object === Object && globalThis, km = "object" == typeof self && null !== self && self.Object === Object && self, Bm = xm || Nm.default || km || function() {
    return this;
}();

Rm.default = Bm;

var $m = g && g.__assign || function() {
    return $m = Object.assign || function(e) {
        for (var t, r = 1, n = arguments.length; r < n; r++) {
            for (var o in t = arguments[r]) {
                Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            }
        }
        return e;
    }, $m.apply(this, arguments);
}, Hm = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, Um = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
}, Gm = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Im, "__esModule", {
    value: !0
});

var Vm = Gm(Rm), Wm = function(e) {
    var t = this;
    this.isLeadingEnabled = !1, this.isTrailingEnabled = !0, this.isMaxWaitEnabled = !1, 
    this.lastInvokeTime = 0, this.debounced = function(e) {
        for (var r = [], n = 1; n < arguments.length; n++) {
            r[n - 1] = arguments[n];
        }
        var o = Date.now(), i = t.shouldInvoke(o);
        if (t.lastArgs = r, t.lastThis = e, t.lastCallTime = o, i) {
            if (void 0 === t.timerId) {
                return t.invokeLeading(t.lastCallTime);
            }
            if (t.isMaxWaitEnabled) {
                return t.cancelTimer(t.timerId), t.timerId = t.startTimer(t.scheduleTimer, t.wait), 
                t.invokeFunc(t.lastCallTime);
            }
        }
        return void 0 === t.timerId && (t.timerId = t.startTimer(t.scheduleTimer, t.wait)), 
        t.debouncedResult;
    }, this.flush = function() {
        return void 0 === t.timerId ? t.debouncedResult : t.invokeTrailing(Date.now());
    }, this.cancel = function() {
        void 0 !== t.timerId && t.cancelTimer(t.timerId), t.lastInvokeTime = 0, t.lastCallTime = void 0, 
        t.lastArgs = void 0, t.lastThis = void 0, t.timerId = void 0;
    }, this.pending = function() {
        return void 0 !== t.timerId;
    }, this.initData = function(e) {
        var r = e.func, n = e.wait, o = e.leading, i = void 0 !== o && o, a = e.trailing, u = void 0 === a || a, s = e.maxWait;
        t.isUsingRAF = void 0 === t.wait && "function" == typeof Vm.default.requestAnimationFrame, 
        t.func = r, t.wait = null != n ? n : 0, t.isMaxWaitEnabled = void 0 !== s, t.maxWait = t.isMaxWaitEnabled ? Math.max(null != s ? s : 0, n) : s, 
        t.isLeadingEnabled = i, t.isTrailingEnabled = u;
    }, this.shouldInvoke = function(e) {
        var r = e - t.lastCallTime, n = e - t.lastInvokeTime;
        return void 0 === t.lastCallTime || r >= t.wait || r < 0 || t.isMaxWaitEnabled && n >= t.maxWait;
    }, this.invokeFunc = function(e) {
        var r = t.lastArgs, n = t.lastThis;
        return t.lastArgs = void 0, t.lastThis = void 0, t.lastInvokeTime = e, t.debouncedResult = t.func.apply(n, r), 
        t.debouncedResult;
    }, this.invokeLeading = function(e) {
        return t.lastInvokeTime = e, t.timerId = t.startTimer(t.scheduleTimer, t.wait), 
        t.isLeadingEnabled ? t.invokeFunc(e) : t.debouncedResult;
    }, this.invokeTrailing = function(e) {
        return t.timerId = void 0, t.isTrailingEnabled && t.lastArgs ? t.invokeFunc(e) : (t.lastArgs = void 0, 
        t.lastThis = void 0, t.debouncedResult);
    }, this.scheduleTimer = function() {
        var e = Date.now();
        t.shouldInvoke(e) ? t.invokeTrailing(e) : t.timerId = t.startTimer(t.scheduleTimer, t.calcRemainingWait(e));
    }, this.startTimer = function(e, r) {
        return t.isUsingRAF ? (Vm.default.cancelAnimationFrame(t.timerId), requestAnimationFrame(e)) : setTimeout(e, r);
    }, this.cancelTimer = function(e) {
        t.isUsingRAF ? Vm.default.cancelAnimationFrame(e) : clearTimeout(e);
    }, this.calcRemainingWait = function(e) {
        var r = e - t.lastCallTime, n = e - t.lastInvokeTime, o = t.wait - r;
        return t.isMaxWaitEnabled ? Math.min(o, t.maxWait - n) : o;
    }, this.initData(e);
};

Im.default = function(e, t, r) {
    if (void 0 === r && (r = {}), "function" != typeof e) {
        throw new TypeError("Expected a function");
    }
    var n = new Wm($m($m({}, r), {
        func: e,
        wait: t
    }));
    function o() {
        for (var e = [], t = 0; t < arguments.length; t++) {
            e[t] = arguments[t];
        }
        return n.debounced.apply(n, Um([ this ], Hm(e), !1));
    }
    return o.flush = n.flush, o.cancel = n.cancel, o.pending = n.pending, o;
};

var zm = {};

Object.defineProperty(zm, "__esModule", {
    value: !0
}), zm.default = function(e, t) {
    return null == e || Number.isNaN(e) ? t : e;
};

var Jm = {}, Km = {}, qm = {}, Xm = {}, Ym = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Xm, "__esModule", {
    value: !0
}), Xm.dealWithObject = void 0;

var Zm = Ym(ih), Qm = Ym(oh);

var eE = function(e, t, r) {
    for (var n = -1, o = Object(e), i = r(e), a = i.length; a--; ) {
        var u = i[++n];
        if (!1 === t(o[u], u, o)) {
            break;
        }
    }
    return e;
};

var tE, rE, nE = (tE = function(e, t) {
    return e && eE(e, t, Qm.default);
}, rE = !1, function(e, t) {
    if (null == e) {
        return e;
    }
    if (!(0, Zm.default)(e)) {
        return tE(e, t);
    }
    for (var r = e.length, n = rE ? r : -1, o = Object(e); (rE ? n-- : ++n < r) && !1 !== t(o[n], n, o); ) {}
    return e;
});

Xm.dealWithObject = function(e, t) {
    var r = -1, n = (0, Zm.default)(e) ? Array(e.length) : [];
    return nE(e, function(e, o, i) {
        n[++r] = t(e, o, i);
    }), n;
};

var oE = {}, iE = {}, aE = {}, uE = {}, sE = {}, lE = {}, cE = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(lE, "__esModule", {
    value: !0
}), lE.SetCache = void 0;

var fE = cE(uy), dE = function() {
    function e(e) {
        this.wdkData = new fE.default(void 0);
        for (var t = -1, r = null == e ? 0 : e.length; ++t < r; ) {
            this.add(e[t]);
        }
    }
    return e.prototype.add = function(e) {
        return this.wdkData.set(e, "__wdk_hash_undefined__"), this;
    }, e.prototype.has = function(e) {
        return this.wdkData.has(e);
    }, e.prototype.push = function(e) {
        this.add(e);
    }, e;
}();

lE.SetCache = dE, Object.defineProperty(sE, "__esModule", {
    value: !0
}), sE.equalArrays = void 0;

var pE = lE, vE = Yg;

function hE(e, t, r, n, o, i, a, u) {
    if (e) {
        if (function(e, t, r, n, o, i, a) {
            return !function(e, t) {
                var r = -1, n = null == e ? 0 : e.length;
                for (;++r < n; ) {
                    if (t(e[r], r, e)) {
                        return !0;
                    }
                }
                return !1;
            }(t, function(t, u) {
                if (!(0, vE.cacheHas)(e, u) && (r === t || a(r, t, n, o, i))) {
                    return e.push(u);
                }
            });
        }(e, t, r, n, o, i, a)) {
            return !1;
        }
    } else if (r !== u && !a(r, u, n, o, i)) {
        return !1;
    }
}

sE.equalArrays = function(e, t, r, n, o, i) {
    var a = 1 & r, u = e.length;
    if (!1 === function(e, t, r) {
        if (e !== t && !(r && t > e)) {
            return !1;
        }
    }(u, t.length, a)) {
        return !1;
    }
    var s = function(e, t, r) {
        var n = e.get(t), o = e.get(r);
        if (n && o) {
            return n === r && o === t;
        }
    }(i, e, t);
    if (void 0 !== s) {
        return s;
    }
    var l = -1, c = !0, f = 2 & r ? new pE.SetCache(void 0) : void 0;
    for (i.set(e, t), i.set(t, e); ++l < u; ) {
        var d = void 0, p = e[l], v = t[l];
        if (n && (d = a ? n(v, p, l, t, e, i) : n(p, v, l, e, t, i)), void 0 !== d) {
            if (d) {
                continue;
            }
            c = !1;
            break;
        }
        if (!1 === hE(f, t, p, r, n, i, o, v)) {
            c = !1;
            break;
        }
    }
    return i.delete(e), i.delete(t), c;
};

var gE = {}, yE = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(gE, "__esModule", {
    value: !0
}), gE.equalByTag = void 0;

var mE = yE(Zg), EE = sE, _E = Symbol ? Symbol.prototype : void 0, DE = _E ? _E.valueOf : void 0;

function bE(e, t, r) {
    return !(e.byteLength !== t.byteLength || !r(new Uint8Array(e), new Uint8Array(t)));
}

function OE(e, t, r, n, o, i, a) {
    var u = t, s = e, l = 1 & s;
    if (u || (u = CE), r.size !== n.size && !l) {
        return !1;
    }
    var c = o.get(r);
    if (c) {
        return c === n;
    }
    s |= 2, o.set(r, n);
    var f = (0, EE.equalArrays)(u(r), u(n), s, i, a, o);
    return o.delete(r), f;
}

function AE(e) {
    var t = -1, r = Array(e.size);
    return e.forEach(function(e, n) {
        r[++t] = [ n, e ];
    }), r;
}

function CE(e) {
    var t = -1, r = Array(e.size);
    return e.forEach(function(e) {
        r[++t] = e;
    }), r;
}

gE.equalByTag = function(e, t, r, n, o, i, a) {
    var u = e, s = t, l = function(e, t, r, n, o, i, a) {
        var u = e, s = t, l = n, c = function(e) {
            return e;
        };
        return "[object Map]" === r ? OE(l, c = AE, u, s, a, o, i) : "[object Set]" === r ? OE(l, c, u, s, a, o, i) : "[object ArrayBuffer]" === r ? bE(u, s, i) : "[object DataView]" === r ? u.byteLength === s.byteLength && u.byteOffset === s.byteOffset && bE(u = u.buffer, s = s.buffer, i) : void 0;
    }(e, t, r, n, o, i, a);
    if (void 0 !== l) {
        return l;
    }
    switch (r) {
      case "[object Boolean]":
      case "[object Date]":
      case "[object Number]":
        return (0, mE.default)(+u, +s);

      case "[object Error]":
        return function(e, t) {
            return e.name === t.name && e.message === t.message;
        }(u, s);

      case "[object RegExp]":
      case "[object String]":
        return u === "".concat(s);

      case "[object Symbol]":
        if (DE) {
            return DE.call(u) === DE.call(s);
        }
    }
    return !1;
};

var SE = {}, ME = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(SE, "__esModule", {
    value: !0
}), SE.equalObjects = void 0;

var wE = ME(Ey), FE = Object.prototype.hasOwnProperty;

SE.equalObjects = function(e, t, r, n, o, i) {
    var a = 1 & r, u = (0, wE.default)(e), s = u.length;
    if (s !== (0, wE.default)(t).length && !a) {
        return !1;
    }
    for (var l, c = s; c--; ) {
        if (l = u[c], !(a ? l in t : FE.call(t, l))) {
            return !1;
        }
    }
    var f = i.get(e), d = i.get(t);
    if (f && d) {
        return f === t && d === e;
    }
    var p = !0;
    i.set(e, t), i.set(t, e);
    var v = function(e, t, r, n, o, i, a, u, s, l, c, f) {
        for (var d = t, p = n, v = f, h = e; ++d < r; ) {
            var g = i[p = o[d]], y = a[p], m = void 0;
            if (u && (m = e ? u(y, g, p, a, i, s) : u(g, y, p, i, a, s)), !(void 0 === m ? g === y || l(g, y, c, u, s) : m)) {
                v = !1;
                break;
            }
            h || (h = "constructor" === p);
        }
        return {
            skipCtor: h,
            index: d,
            key: p,
            result: v
        };
    }(a, c, s, l, u, e, t, n, i, o, r, p), h = v.skipCtor;
    return p = function(e, t, r, n) {
        var o = e;
        if (o && !t) {
            var i = r.constructor, a = n.constructor;
            i === a || !("constructor" in r) || !("constructor" in n) || "function" == typeof i && i instanceof i && "function" == typeof a && a instanceof a || (o = !1);
        }
        return o;
    }(p = v.result, h, e, t), i.delete(e), i.delete(t), p;
};

var PE = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(uE, "__esModule", {
    value: !0
}), uE.baseIsEqual = void 0;

var IE = PE(xv), RE = qg, TE = sE, LE = gE, jE = SE, NE = PE(lh), xE = PE(Uh), kE = PE(sh);

uE.baseIsEqual = function e(t, r, n, o, i) {
    return t === r || (null == t || null == r || !(0, NE.default)(t) && !(0, NE.default)(r) ? Number.isNaN(t) && Number.isNaN(r) : function(e, t, r, n, o, i) {
        var a = i, u = (0, xE.default)(e), s = (0, xE.default)(t), l = u ? HE : (0, IE.default)(e), c = s ? HE : (0, 
        IE.default)(t), f = (l = l === $E ? UE : l) === UE, d = (c = c === $E ? UE : c) === UE, p = l === c, v = function(e, t, r, n, o, i, a, u, s, l) {
            var c = r;
            if (e && !t) {
                return c || (c = new RE.Stack(void 0)), n || (0, kE.default)(o) ? (0, TE.equalArrays)(o, i, a, u, s, c) : (0, 
                LE.equalByTag)(o, i, l, a, u, s, c);
            }
            return NaN;
        }(p, f, a, u, e, t, r, n, o, l);
        if (!Number.isNaN(v)) {
            return v;
        }
        var h = function(e, t, r, n, o, i, a, u) {
            var s = i;
            if (!(e & BE)) {
                var l = t && GE.call(r, "__wrapped__"), c = o && GE.call(n, "__wrapped__");
                if (l || c) {
                    var f = l ? r.value() : r, d = c ? n.value() : n;
                    return s || (s = new RE.Stack(void 0)), a(f, d, e, u, s);
                }
            }
            return NaN;
        }(r, f, e, t, d, a, o, n);
        if (!Number.isNaN(h)) {
            return h;
        }
        if (!p) {
            return !1;
        }
        a || (a = new RE.Stack(void 0));
        return (0, jE.equalObjects)(e, t, r, n, o, a);
    }(t, r, n, o, e, i));
};

var BE = 1, $E = "[object Arguments]", HE = "[object Array]", UE = "[object Object]", GE = Object.prototype.hasOwnProperty;

Object.defineProperty(aE, "__esModule", {
    value: !0
}), aE.baseIsMatch = void 0;

var VE = qg, WE = uE;

function zE(e, t, r, n, o, i, a, u) {
    if (e && t[2]) {
        if (void 0 === r && !(n in o)) {
            return !1;
        }
    } else {
        var s = new VE.Stack(void 0), l = void 0;
        if (i && (l = i(r, a, n, o, u, s)), !(void 0 === l ? (0, WE.baseIsEqual)(a, r, 3, i, s) : l)) {
            return !1;
        }
    }
}

aE.baseIsMatch = function(e, t, r, n) {
    var o, i = e, a = r.length, u = a, s = !n;
    if (null == i) {
        return !u;
    }
    for (i = Object(i); a--; ) {
        if (o = r[a], s && o[2] ? o[1] !== i[o[0]] : !(o[0] in i)) {
            return !1;
        }
    }
    for (;++a < u; ) {
        var l = (o = r[a])[0];
        if (!1 === zE(s, o, i[l], l, i, n, o[1], t)) {
            return !1;
        }
    }
    return !0;
};

var JE = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(iE, "__esModule", {
    value: !0
}), iE.baseMatches = void 0;

var KE = aE, qE = JE(Ug), XE = JE(oh);

function YE(e) {
    return !Number.isNaN(e) && !(0, qE.default)(e);
}

iE.baseMatches = function(e) {
    var t = function(e) {
        var t = (0, XE.default)(e), r = t.length;
        for (;r--; ) {
            var n = t[r], o = e[n];
            t[r] = [ n, o, YE(o) ];
        }
        return t;
    }(e);
    return 1 === t.length && t[0][2] ? function(e, t) {
        return function(r) {
            return null != r && (r[e] === t && (void 0 !== t || e in Object(r)));
        };
    }(t[0][0], t[0][1]) : function(r) {
        return r === e || (0, KE.baseIsMatch)(r, e, t, void 0);
    };
};

var ZE = {}, QE = {}, e_ = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(QE, "__esModule", {
    value: !0
}), QE.getDeepProperties = void 0;

var t_ = Kh(), r_ = e_(Uh), n_ = e_(ag());

QE.getDeepProperties = function(e) {
    return function(t) {
        return function(e, t) {
            var r = function(e, t) {
                if ((0, r_.default)(e)) {
                    return e;
                }
                if ((0, n_.default)(e) || e in t) {
                    return [ e ];
                }
                return function(e) {
                    var t = [];
                    "." === e[0] && t.push("");
                    return e.replace(o_, function(e, r, n, o) {
                        return t.push(n ? o.replace(i_, "$1") : r || e), e;
                    }), t;
                }(function(e) {
                    if ((0, n_.default)(e)) {
                        return e;
                    }
                    return "".concat(e);
                }(e));
            }(t, e), n = e, o = 0, i = r.length;
            for (;null != n && o < i; ) {
                n = n[(0, t_.toKey)(r[o++])];
            }
            return o && o === i ? n : void 0;
        }(t, e);
    };
};

var o_ = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, i_ = /\\(\\)?/g;

Object.defineProperty(ZE, "__esModule", {
    value: !0
}), ZE.getProperties = void 0;

var a_ = Wh(), u_ = Kh(), s_ = QE;

ZE.getProperties = function(e) {
    return (0, a_.isKey)(e) ? function(e) {
        return function(t) {
            return null == t ? void 0 : t[e];
        };
    }((0, u_.toKey)(e)) : (0, s_.getDeepProperties)(e);
}, Object.defineProperty(oE, "__esModule", {
    value: !0
}), oE.baseIteratee = void 0;

var l_ = iE, c_ = ZE;

function f_(e) {
    return e;
}

oE.baseIteratee = function(e) {
    return "function" == typeof e ? e : null == e ? f_ : "object" == typeof e ? (0, 
    l_.baseMatches)(e) : (0, c_.getProperties)(e);
}, Object.defineProperty(qm, "__esModule", {
    value: !0
});

var d_ = Xm, p_ = oE;

function v_(e, t) {
    return e.map(t);
}

qm.default = function(e, t) {
    return (Array.isArray(e) ? v_ : d_.dealWithObject)(e, (0, p_.baseIteratee)(t));
};

var h_ = g && g.__values || function(e) {
    var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], n = 0;
    if (r) {
        return r.call(e);
    }
    if (e && "number" == typeof e.length) {
        return {
            next: function() {
                return e && n >= e.length && (e = void 0), {
                    value: e && e[n++],
                    done: !e
                };
            }
        };
    }
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, g_ = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Km, "__esModule", {
    value: !0
}), Km.baseDifference = void 0;

var y_ = Yg, m_ = g_(qm), E_ = lE;

Km.baseDifference = function(e, t, r, n) {
    var o, i, a = y_.arrayIncludes, u = !0, s = [], l = t, c = l.length, f = "function" == typeof r;
    if (!(null == e ? void 0 : e.length)) {
        return s;
    }
    r && (l = (0, m_.default)(l, function(e) {
        return f ? r(e) : e[r];
    })), n ? (a = y_.arrayIncludesWith, u = !1) : l.length >= 200 && (a = y_.cacheHas, 
    u = !1, l = new E_.SetCache(l));
    var d = !1;
    try {
        for (var p = h_(e), v = p.next(); !v.done; v = p.next()) {
            var h = v.value, g = h;
            if (r && (g = f ? r(h) : h[r]), h = n || 0 !== h ? h : 0, u && !Number.isNaN(g)) {
                for (var y = c; y--; ) {
                    if (l[y] === g) {
                        d = !0;
                        break;
                    }
                }
                if (d) {
                    d = !1;
                    continue;
                }
                s.push(h);
            } else {
                a(l, g, n) || s.push(h);
            }
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            v && !v.done && (i = p.return) && i.call(p);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return s;
};

var __ = {}, D_ = g && g.__values || function(e) {
    var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], n = 0;
    if (r) {
        return r.call(e);
    }
    if (e && "number" == typeof e.length) {
        return {
            next: function() {
                return e && n >= e.length && (e = void 0), {
                    value: e && e[n++],
                    done: !e
                };
            }
        };
    }
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, b_ = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, O_ = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
};

Object.defineProperty(__, "__esModule", {
    value: !0
}), __.baseFlatten = void 0;

var A_ = Nv;

__.baseFlatten = function e(t, r, n, o, i) {
    var a, u, s = n;
    s || (s = A_.isFlattenable);
    var l = i;
    if (l || (l = []), null == t) {
        return l;
    }
    try {
        for (var c = D_(t), f = c.next(); !f.done; f = c.next()) {
            var d = f.value;
            r > 0 && s(d) ? r > 1 ? e(d, r - 1, s, o, l) : l.push.apply(l, O_([], b_(d), !1)) : o || (l[l.length] = d);
        }
    } catch (e) {
        a = {
            error: e
        };
    } finally {
        try {
            f && !f.done && (u = c.return) && u.call(c);
        } finally {
            if (a) {
                throw a.error;
            }
        }
    }
    return l;
};

var C_ = {}, S_ = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(C_, "__esModule", {
    value: !0
});

var M_ = S_(ih), w_ = S_(lh);

C_.default = function(e) {
    return (0, w_.default)(e) && (0, M_.default)(e);
};

var F_ = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Jm, "__esModule", {
    value: !0
});

var P_ = Km, I_ = __, R_ = F_(C_);

Jm.default = function(e) {
    for (var t = [], r = 1; r < arguments.length; r++) {
        t[r - 1] = arguments[r];
    }
    return (0, R_.default)(e) ? (0, P_.baseDifference)(e, (0, I_.baseFlatten)(t, 1, R_.default, !0, void 0), void 0, void 0) : [];
};

var T_ = {};

Object.defineProperty(T_, "__esModule", {
    value: !0
}), T_.default = function(e, t) {
    return void 0 === e && void 0 !== t ? Number(t) : void 0 !== e && void 0 === t ? Number(e) : e === t && void 0 === t ? 1 : Number(e) / Number(t);
};

var L_ = {}, j_ = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(L_, "__esModule", {
    value: !0
});

var N_ = j_(dg);

L_.default = function(e, t) {
    if (void 0 === t && (t = 1), !Array.isArray(e) || t >= e.length) {
        return [];
    }
    if (t < 0) {
        return e;
    }
    var r = 0, n = (0, N_.default)(t);
    n >>>= 0;
    for (var o = e.length - n >>> 0, i = Array(o); r < o; ) {
        i[r] = e[r + n], r += 1;
    }
    return i;
};

var x_ = {}, k_ = {}, B_ = {}, $_ = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(B_, "__esModule", {
    value: !0
});

var H_ = $_(Nh), U_ = $_(jh), G_ = 1 / 0, V_ = Number.MAX_VALUE;

B_.default = function(e) {
    if (!e) {
        return 0 === e ? e : 0;
    }
    var t = (0, H_.default)(e);
    return t === G_ || t === -1 / 0 ? (t < 0 ? -1 : 1) * V_ : (0, U_.default)(t) ? 0 : t;
};

var W_ = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(k_, "__esModule", {
    value: !0
});

var z_ = W_(B_);

k_.default = function(e) {
    var t = (0, z_.default)(e), r = t % 1;
    return r ? t - r : t;
};

var J_ = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(x_, "__esModule", {
    value: !0
});

var K_ = Nv, q_ = J_(k_);

x_.default = function(e, t) {
    return void 0 === t && (t = 1), !(0, K_.isArray)(e) || t >= e.length ? [] : t <= 0 ? e : e.slice(0, e.length - (0, 
    q_.default)(t));
};

var X_ = {};

Object.defineProperty(X_, "__esModule", {
    value: !0
}), X_.default = function(e, t, r) {
    var n = e.length, o = r;
    (o = void 0 === o ? n : +o) < 0 || Number.isNaN(o) ? o = 0 : o > n && (o = n);
    var i = o;
    return (o -= t.length) >= 0 && e.slice(o, i) === t;
};

var Y_ = {}, Z_ = {}, Q_ = g && g.__values || function(e) {
    var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], n = 0;
    if (r) {
        return r.call(e);
    }
    if (e && "number" == typeof e.length) {
        return {
            next: function() {
                return e && n >= e.length && (e = void 0), {
                    value: e && e[n++],
                    done: !e
                };
            }
        };
    }
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, eD = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Z_, "__esModule", {
    value: !0
});

var tD = eD(ih);

Z_.default = function(e, t) {
    var r, n, o, i, a = Object(e);
    if (Array.isArray(a)) {
        for (var u = -1, s = e.length; ++u < s && !1 !== t(e[u], u); ) {}
    } else if ((0, tD.default)(a)) {
        try {
            for (var l = Q_(a), c = l.next(); !c.done; c = l.next()) {
                if (!1 === t(c.value)) {
                    break;
                }
            }
        } catch (e) {
            r = {
                error: e
            };
        } finally {
            try {
                c && !c.done && (n = l.return) && n.call(l);
            } finally {
                if (r) {
                    throw r.error;
                }
            }
        }
    } else {
        var f = Object.keys(a);
        try {
            for (var d = Q_(f), p = d.next(); !p.done; p = d.next()) {
                var v = p.value;
                if (!1 === t(a[v], v)) {
                    break;
                }
            }
        } catch (e) {
            o = {
                error: e
            };
        } finally {
            try {
                p && !p.done && (i = d.return) && i.call(d);
            } finally {
                if (o) {
                    throw o.error;
                }
            }
        }
    }
    return e;
};

var rD = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Y_, "__esModule", {
    value: !0
});

var nD = rD(Z_).default;

Y_.default = nD;

var oD = {}, iD = {}, aD = {};

!function(e) {
    var t;
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.ObjType = e.getType = void 0, e.getType = function(e) {
        return Object.prototype.toString.call(e);
    }, (t = e.ObjType || (e.ObjType = {})).Arguments = "[object Arguments]", t.Array = "[object Array]", 
    t.AsyncFunction = "[object AsyncFunction]", t.Boolean = "[object Boolean]", t.Date = "[object Date]", 
    t.DOMException = "[object DOMException]", t.Error = "[object Error]", t.Function = "[object Function]", 
    t.GeneratorFunction = "[object GeneratorFunction]", t.Map = "[object Map]", t.Number = "[object Number]", 
    t.Null = "[object Null]", t.Object = "[object Object]", t.Promise = "[object Promise]", 
    t.Proxy = "[object Proxy]", t.RegExp = "[object RegExp]", t.Set = "[object Set]", 
    t.String = "[object String]", t.Symbol = "[object Symbol]", t.Undefined = "[object Undefined]", 
    t.WeakMap = "[object WeakMap]", t.WeakSet = "[object WeakSet]", t.ArrayBuffer = "[object ArrayBuffer]", 
    t.DataView = "[object DataView]", t.Float32Array = "[object Float32Array]", t.Float64Array = "[object Float64Array]", 
    t.Int8Array = "[object Int8Array]", t.Int16Array = "[object Int16Array]", t.Int32Array = "[object Int32Array]", 
    t.Uint8Array = "[object Uint8Array]", t.Uint8ClampedArray = "[object Uint8ClampedArray]", 
    t.Uint16Array = "[object Uint16Array]", t.Uint32Array = "[object Uint32Array]";
}(aD), function(e) {
    var t = g && g.__values || function(e) {
        var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], n = 0;
        if (r) {
            return r.call(e);
        }
        if (e && "number" == typeof e.length) {
            return {
                next: function() {
                    return e && n >= e.length && (e = void 0), {
                        value: e && e[n++],
                        done: !e
                    };
                }
            };
        }
        throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.basicCompareArray = e.basicCompareMap = e.basicCompareSet = e.basicCompareObject = e.basicCompare = e.wrapIteratee = e.warpIterateeFromKey = e.wrapIterateeFromObject = e.getValidIndex = e.checkArrayLenValid = e.ArrayDirection = e.CompareModel = void 0;
    var r, n, o = aD;
    function i(e) {
        return function(t) {
            return u(t, e);
        };
    }
    function a(e) {
        return function(t) {
            if (null != t) {
                return e && e in t ? t[e] : void 0;
            }
        };
    }
    function u(e, t, n) {
        if (void 0 === n && (n = r.INCLUDE), "object" != typeof e) {
            return e === t;
        }
        var i = (0, o.getType)(e);
        return i === (0, o.getType)(t) && (i === o.ObjType.Object ? s(e, t, n) : i === o.ObjType.Array ? f(e, t, n) : i === o.ObjType.Map ? c(e, t, n) : i === o.ObjType.Set ? l(e, t, n) : i === o.ObjType.Error ? e.name === t.name && e.message === t.message : e === t);
    }
    function s(e, t, n) {
        for (var o in void 0 === n && (n = r.INCLUDE), t) {
            if (!u(e[o], t[o], n)) {
                return !1;
            }
        }
        return !0;
    }
    function l(e, n, o) {
        var i, a, s, l;
        void 0 === o && (o = r.INCLUDE);
        var c = e.size, f = n.size;
        if (0 === c && 0 === f) {
            return !0;
        }
        if (f > c) {
            return !1;
        }
        try {
            for (var d = t(n), p = d.next(); !p.done; p = d.next()) {
                var v = p.value;
                try {
                    for (var h = (s = void 0, t(e)), g = h.next(); !g.done; g = h.next()) {
                        if (!u(g.value, v, o)) {
                            return !1;
                        }
                    }
                } catch (e) {
                    s = {
                        error: e
                    };
                } finally {
                    try {
                        g && !g.done && (l = h.return) && l.call(h);
                    } finally {
                        if (s) {
                            throw s.error;
                        }
                    }
                }
            }
        } catch (e) {
            i = {
                error: e
            };
        } finally {
            try {
                p && !p.done && (a = d.return) && a.call(d);
            } finally {
                if (i) {
                    throw i.error;
                }
            }
        }
        return !0;
    }
    function c(e, n, o) {
        var i, a;
        void 0 === o && (o = r.INCLUDE);
        var s = e.size, l = n.size;
        if (0 === s && 0 === l) {
            return !0;
        }
        if (l > s) {
            return !1;
        }
        try {
            for (var c = t(n.keys()), f = c.next(); !f.done; f = c.next()) {
                var d = f.value;
                if (!e.has(d) || !u(e.get(d), n.get(d), o)) {
                    return !1;
                }
            }
        } catch (e) {
            i = {
                error: e
            };
        } finally {
            try {
                f && !f.done && (a = c.return) && a.call(c);
            } finally {
                if (i) {
                    throw i.error;
                }
            }
        }
        return !0;
    }
    function f(e, t, n) {
        void 0 === n && (n = r.INCLUDE);
        var o = e.length, i = t.length;
        if (0 === o && 0 === i) {
            return !0;
        }
        if (n !== r.INCLUDE) {
            return o === i;
        }
        if (i > o) {
            return !1;
        }
        for (var a = 0; a < o; a++) {
            if (u(e[a], t[0])) {
                for (var s = !0, l = 1; l < i; l++) {
                    if (!u(e[a + l], t[l])) {
                        return s = !1, !1;
                    }
                }
                if (s) {
                    return !0;
                }
            }
        }
        return !1;
    }
    !function(e) {
        e.EQUAL = "equal", e.INCLUDE = "include";
    }(r = e.CompareModel || (e.CompareModel = {})), (n = e.ArrayDirection || (e.ArrayDirection = {})).LEFT = "left", 
    n.RIGHT = "right", e.checkArrayLenValid = function(e) {
        return null == e || (!e.length || 0 === e.length);
    }, e.getValidIndex = function(e, t) {
        if (void 0 === e && (e = 0), void 0 === t && (t = 0), null == e) {
            return t;
        }
        if (e === 1 / 0 || e === -1 / 0) {
            return e > 0 ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
        }
        var r = Number.isInteger(e) ? e : Number.parseInt(e, 10);
        return Number.isNaN(r) ? t : r;
    }, e.wrapIterateeFromObject = i, e.warpIterateeFromKey = a, e.wrapIteratee = function(e) {
        var t;
        return "function" == typeof e ? e : "object" == typeof e ? i(Array.isArray(e) ? ((t = {})[e[0]] = e[1], 
        t) : e) : a(e);
    }, e.basicCompare = u, e.basicCompareObject = s, e.basicCompareSet = l, e.basicCompareMap = c, 
    e.basicCompareArray = f;
}(iD);

var uD = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(oD, "__esModule", {
    value: !0
});

var sD = iD, lD = uD(ih), cD = uD(Bh);

oD.default = function(e, t) {
    void 0 === t && (t = cD.default);
    var r = Object(e), n = (0, lD.default)(r), o = [], i = (0, sD.wrapIteratee)(t);
    if (n) {
        for (u = 0; u < r.length; u++) {
            i(s = r[u], u, r) && o.push(s);
        }
    } else {
        for (var a = Object.keys(r), u = 0; u < a.length; u++) {
            var s;
            i(s = r[a[u]], u, r) && o.push(s);
        }
    }
    return o;
};

var fD = {}, dD = {};

Object.defineProperty(dD, "__esModule", {
    value: !0
});

var pD = iD;

dD.default = function(e, t, r) {
    if ((0, pD.checkArrayLenValid)(e)) {
        return -1;
    }
    var n = (0, pD.getValidIndex)(r, 0);
    return function(e, t, r) {
        if (void 0 === r && (r = 0), 0 === r) {
            return e.findIndex(t);
        }
        for (var n = r, o = e.length; n < o; n++) {
            if (t(e[n], n, e)) {
                return n;
            }
        }
        return -1;
    }(e, (0, pD.wrapIteratee)(t), n >= 0 ? n : Math.max(n + e.length, 0));
};

var vD = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(fD, "__esModule", {
    value: !0
});

var hD = iD, gD = vD(ih), yD = vD(dD);

fD.default = function(e, t, r) {
    var n = Object(e), o = -1;
    if ((0, gD.default)(n)) {
        if ((o = (0, yD.default)(e, t, r)) > -1) {
            return n[o];
        }
    } else {
        var i = (0, hD.wrapIteratee)(t), a = Object.keys(n);
        if (o = (0, yD.default)(a, function(e) {
            return i(n[e], e, n);
        }, r), o > -1) {
            return n[a[o]];
        }
    }
};

var mD = {}, ED = {};

!function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.getStartIndex = void 0;
    e.getStartIndex = function(e, t) {
        var r = void 0 !== t ? Number(t) : e.length;
        return r = [ null, !1, 0, NaN, "" ].includes(t) ? 0 : r, Math.ceil(r < 0 ? Math.max(e.length + r, 0) : r);
    }, e.default = function(t, r, n) {
        if (!Array.isArray(t)) {
            return -1;
        }
        for (var o = -1, i = (0, e.getStartIndex)(t, n), a = i > t.length - 1 ? t.length - 1 : i; a >= 0; a--) {
            if (t[a] === r) {
                o = a;
                break;
            }
        }
        return o;
    };
}(ED), Object.defineProperty(mD, "__esModule", {
    value: !0
});

var _D = ED, DD = iD;

mD.default = function(e, t, r) {
    if (!Array.isArray(e)) {
        return -1;
    }
    for (var n = (0, _D.getStartIndex)(e, r), o = (0, DD.wrapIteratee)(t), i = n > e.length - 1 ? e.length - 1 : n; i >= 0; i--) {
        if (o(e[i], i, e)) {
            return i;
        }
    }
    return -1;
};

var bD = {}, OD = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(bD, "__esModule", {
    value: !0
});

var AD = OD(ih), CD = OD(Uh), SD = Nv;

function MD(e, t) {
    for (var r = e.length, n = 0, o = t.length; n < o; n++) {
        e[r + n] = t[n];
    }
    return e;
}

bD.default = function(e) {
    if (!(0, AD.default)(e)) {
        return [];
    }
    var t = [];
    if ((0, CD.default)(e)) {
        for (var r = 0, n = e.length; r < n; r++) {
            (0, SD.isFlattenable)(e[r]) ? MD(t, e[r]) : t.push(e[r]);
        }
        return t;
    }
    for (r = 0, n = e.length; r < n; r++) {
        t.push(e[r]);
    }
    return t;
};

var wD = {}, FD = {};

Object.defineProperty(FD, "__esModule", {
    value: !0
});

var PD = ig();

FD.default = function(e) {
    return "string" == typeof e || "object" == typeof e && "[object String]" === (0, 
    PD.tagName)(e);
};

var ID = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(wD, "__esModule", {
    value: !0
});

var RD = Nv, TD = ID(ih), LD = ID(FD);

function jD(e, t) {
    for (var r = 0, n = e.length; r < n; r++) {
        var o = e[r];
        (0, TD.default)(o) && !(0, LD.default)(o) ? jD(o, t) : t.push(o);
    }
}

wD.default = function(e) {
    if (!(0, TD.default)(e)) {
        return [];
    }
    for (var t = [], r = 0, n = e.length; r < n; r++) {
        (0, RD.isFlattenable)(e[r]) ? jD(e[r], t) : t.push(e[r]);
    }
    return t;
};

var ND = {};

Object.defineProperty(ND, "__esModule", {
    value: !0
}), ND.default = function(e, t) {
    if (Array.isArray(e)) {
        for (var r = -1, n = e.length; ++r < n; ) {
            t(e[r], r);
        }
    } else {
        for (var o in e) {
            t(e[o], o);
        }
    }
    return e;
};

var xD = {}, kD = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(xD, "__esModule", {
    value: !0
});

var BD = kD(Ug), $D = kD(mh), HD = function(e, t, r) {
    Object.prototype.hasOwnProperty.call(e, t) || (e[t] = []), e[t].push(r);
};

xD.default = function(e, t) {
    return (0, $D.default)(e) ? {} : "[object Array]" === Object.prototype.toString.call(e) ? function(e, t) {
        var r = {};
        return (0, $D.default)(t) ? e.forEach(function(e) {
            HD(r, "".concat(e), e);
        }) : "string" == typeof t ? e.forEach(function(e) {
            var n = e[t];
            HD(r, "".concat(n), e);
        }) : e.forEach(function(e) {
            if ((Array.isArray(e) || (0, BD.default)(e)) && "number" == typeof t) {
                HD(r, e[t], e);
            } else {
                var n = t && t(e);
                HD(r, "".concat(n), e);
            }
        }), r;
    }(e, t) : function(e, t) {
        var r = {};
        return Object.keys(e).forEach(function(n) {
            var o = t && t(e[n]);
            HD(r, "".concat(o), e[n]);
        }), r;
    }(e, t);
};

var UD = {}, GD = {}, VD = {};

function WD(e, t) {
    if ("function" != typeof e || null != t && "function" != typeof t) {
        throw new TypeError("Expected a function");
    }
    function r() {
        for (var n = [], o = 0; o < arguments.length; o++) {
            n[o] = arguments[o];
        }
        var i = t ? t.apply(this, n) : n[0], a = r.cache;
        if (a.has(i)) {
            return a.get(i);
        }
        var u = e.apply(this, n);
        return r.cache = a.set(i, u) || a, u;
    }
    return r.cache = new (WD.Cache || Map), r;
}

Object.defineProperty(VD, "__esModule", {
    value: !0
}), VD.memoizeCapped = void 0, WD.Cache = Map;

VD.memoizeCapped = function(e) {
    var t, r = WD(e, function(e) {
        return 500 === t.size && t.clear(), e;
    });
    return t = r.cache, r;
}, VD.default = WD;

var zD = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(GD, "__esModule", {
    value: !0
});

var JD = Nv, KD = Wh(), qD = zD(Uh), XD = zD(ag());

function YD(e) {
    return (0, XD.default)(e) ? e : "".concat(e);
}

var ZD = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, QD = /\\(\\)?/g, eb = (0, 
VD.memoizeCapped)(function(e) {
    var t = [];
    return "." === e[0] && t.push(""), e.replace(ZD, function(e, r, n, o) {
        return t.push(n ? o.replace(QD, "$1") : r || e), e;
    }), t;
});

function tb(e, t) {
    if (!(0, qD.default)(e) && !(0, JD.isArguments)(e)) {
        return !1;
    }
    var r = Number(t);
    return r > -1 && r < e.length;
}

GD.default = function(e, t, r) {
    for (var n = function(e, t) {
        return (0, qD.default)(e) ? e : (0, KD.isKey)(e, t) ? [ e ] : eb(YD(e));
    }(t, e), o = e, i = 0, a = n.length; i < a; i++) {
        var u = YD(n[i]);
        if (!r(o, u) && !tb(o, u)) {
            return !1;
        }
        o = o[u];
    }
    return !0;
};

var rb = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(UD, "__esModule", {
    value: !0
});

var nb = rb(GD), ob = Object.prototype.hasOwnProperty;

function ib(e, t) {
    return null != e && ob.call(e, t);
}

UD.default = function(e, t) {
    return null != e && (0, nb.default)(e, t, ib);
};

var ab = {};

Object.defineProperty(ab, "__esModule", {
    value: !0
}), ab.default = function(e) {
    if (Array.isArray(e) && 0 !== e.length) {
        return e[0];
    }
};

var ub = {}, sb = {}, lb = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(sb, "__esModule", {
    value: !0
});

var cb = lb(oh);

sb.default = function(e) {
    return null == e ? [] : (0, cb.default)(e).map(function(t) {
        return e[t];
    });
};

var fb = {};

Object.defineProperty(fb, "__esModule", {
    value: !0
}), fb.default = function(e, t, r) {
    if (null == e) {
        return -1;
    }
    for (var n = Number.isNaN(Number(r)) ? 0 : Number(r), o = n = Math.round(Number(n) < 0 ? Math.max(e.length + Number(n), 0) : n), i = e.length; o < i; o++) {
        if (e[o] === t || Number.isNaN(t) && Number.isNaN(e[o])) {
            return o;
        }
    }
    return -1;
};

var db = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(ub, "__esModule", {
    value: !0
});

var pb = db(ih), vb = db(sb), hb = db(Nh), gb = db(FD), yb = db(fb);

ub.default = function(e, t, r) {
    if (void 0 === r && (r = 0), null == t) {
        return !1;
    }
    var n = (0, pb.default)(e) ? e : (0, vb.default)(e), o = r ? (0, hb.default)(r) : 0;
    return o < 0 && (o = Math.max(n.length + o, 0)), (0, gb.default)(n) ? o <= n.length && n.indexOf(t, o) > -1 : n.length && (0, 
    yb.default)(n, t, o) > -1;
};

var mb = {}, Eb = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, _b = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
};

Object.defineProperty(mb, "__esModule", {
    value: !0
});

var Db = Nv;

mb.default = function() {
    for (var e = [], t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
    }
    var r = e.map(function(e) {
        return Array.isArray(e) ? e : (0, Db.isArguments)(e) ? _b([], Eb(e), !1) : [];
    }).reduce(function(e, t) {
        return e && e.filter ? e.filter(function(e) {
            return !(!t || !t.includes) && t.includes(e);
        }) : [];
    });
    return Array.from(new Set(r));
};

var bb = {}, Ob = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(bb, "__esModule", {
    value: !0
});

var Ab = Ob(oh);

bb.default = function(e) {
    var t = {}, r = (0, Ab.default)(e);
    return 0 === r.length || r.forEach(function(r) {
        var n = function(e) {
            var t = e;
            return null !== t && "function" != typeof t.toString && (t = toString.call(t)), 
            "".concat(t);
        }(e[r]);
        t[n] = r;
    }), t;
};

var Cb = {};

Object.defineProperty(Cb, "__esModule", {
    value: !0
});

var Sb = ig();

Cb.default = function(e) {
    return !0 === e || !1 === e || "object" == typeof e && "[object Boolean]" === (0, 
    Sb.tagName)(e);
};

var Mb = {};

Object.defineProperty(Mb, "__esModule", {
    value: !0
});

var wb = "undefined" != typeof Buffer ? Buffer : void 0, Fb = wb ? wb.isBuffer : void 0;

Mb.default = function(e) {
    return Boolean(Fb) && Fb(e);
};

var Pb = {}, Ib = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Pb, "__esModule", {
    value: !0
});

var Rb = ig(), Tb = Ib(lh);

Pb.default = function(e) {
    return (0, Tb.default)(e) && "[object Date]" === (0, Rb.tagName)(e);
};

var Lb = {}, jb = {};

!function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.getValueTag = void 0;
    var t = Symbol.toStringTag;
    e.getValueTag = function(e) {
        return t && t in Object(e) ? function(e) {
            var r = Object.prototype.hasOwnProperty.call(e, t), n = e[t], o = !1;
            try {
                e[t] = void 0, o = !0;
            } catch (e) {}
            var i = Object.prototype.toString.call(e);
            return o && (r ? e[t] = n : delete e[t]), i;
        }(e) : Object.prototype.toString.call(e);
    }, e.default = function(t) {
        if ("object" != typeof t || null == t || "[object Object]" !== (0, e.getValueTag)(t)) {
            return !1;
        }
        for (var r = Object.getPrototypeOf(t); r && null !== Object.getPrototypeOf(r); ) {
            r = Object.getPrototypeOf(r);
        }
        return Object.getPrototypeOf(t) === r;
    };
}(jb);

var Nb = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Lb, "__esModule", {
    value: !0
});

var xb = Nb(ih), kb = Nb(Mb), Bb = Nb(sh), $b = jb, Hb = Nv;

Lb.default = function(e) {
    if (null == e) {
        return !0;
    }
    if (function(e) {
        return "[object Map]" === (0, $b.getValueTag)(e) || "[object Set]" === (0, $b.getValueTag)(e);
    }(e)) {
        return 0 === e.size;
    }
    if (function(e) {
        return !!(0, xb.default)(e) && (Array.isArray(e) || "string" == typeof e || "function" == typeof e.splice || (0, 
        kb.default)(e) || (0, Bb.default)(e) || (0, Hb.isArguments)(e));
    }(e)) {
        return 0 === e.length;
    }
    if (function(e) {
        var t = e && e.constructor;
        return e === ("function" == typeof t && t.prototype);
    }(e)) {
        return 0 === function(e) {
            var t = [];
            return Object.keys(e).forEach(function(r) {
                Object.prototype.hasOwnProperty.call(e, r) && "constructor" !== r && t.push(r);
            }), t;
        }(e).length;
    }
    for (var t in e) {
        if (Object.prototype.hasOwnProperty.call(e, t)) {
            return !1;
        }
    }
    return !0;
};

var Ub = {}, Gb = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Ub, "__esModule", {
    value: !0
});

var Vb = Gb(Zg), Wb = Gb(lh), zb = Gb(Uh), Jb = Gb(xv), Kb = Gb(sh), qb = Gb(Ey), Xb = Gb(Nh), Yb = qg, Zb = Yg, Qb = lE, eO = function(e) {
    for (var t = (0, Xb.default)(e).toString(2); t.length < 64; ) {
        t = "0".concat(t);
    }
    return t;
}, tO = function(e, t) {
    if (void 0 === e) {
        return 0;
    }
    for (var r = eO(e), n = eO(t), o = 0, i = 0; i < 64; i++) {
        r[i] === n[i] && "1" === r[i] && (o = 1);
    }
    return o;
}, rO = function(e) {
    var t = 0, r = Array(e.size);
    return e.forEach(function(e, n) {
        r[t] = [ n, e ], t += 1;
    }), r.sort();
}, nO = function(e) {
    var t = 0, r = Array(e.size);
    return e.forEach(function(e) {
        r[t] = e, t += 1;
    }), r.sort();
}, oO = function(e) {
    var t, r = e.bitmask, n = e.tag, o = e.object, i = e.other, a = e.stack, u = e.customizer, s = e.equalFunc, l = r, c = tO(r, 1), f = "[object Set]" === n ? nO : rO;
    if (o.size !== i.size && !c) {
        return !1;
    }
    var d = a.get(o);
    return d ? d === i : (l = function(e, t) {
        if (void 0 === e) {
            return 1;
        }
        for (var r = eO(e), n = eO(t), o = 0, i = 0; i < 64; i++) {
            r[i] !== n[i] && (o = 1);
        }
        return o;
    }(l, 2), a.set(o, i), t = aO(f(o), f(i), l, u, s, a), a.delete(o), t);
};

function iO(e, t, r, n, o, i, a) {
    var u, s = e, l = t;
    switch (r) {
      case "[object DataView]":
        u = function(e, t) {
            return !(e.byteLength !== t.byteLength || e.byteOffset !== t.byteOffset);
        }(s, l), u && (s = s.buffer, l = l.buffer);
        break;

      case "[object ArrayBuffer]":
        u = function(e, t, r) {
            return !(e.byteLength !== t.byteLength || !r(new Uint8Array(e), new Uint8Array(t)));
        }(s, l, i);
        break;

      case "[object Map]":
      case "[object Set]":
        u = oO({
            bitmask: n,
            tag: r,
            object: s,
            other: l,
            stack: a,
            customizer: o,
            equalFunc: i
        });
        break;

      default:
        u = function(e, t, r) {
            return [ "[object Boolean]", "[object Date]", "[object Number]" ].includes(r) ? (0, 
            Vb.default)(+e, +t) : [ "[object RegExp]", "[object String]" ].includes(r) ? "".concat(e) === "".concat(t) : [ "[object Error]" ].includes(r) ? e.name === t.name && e.message === t.message : !(![ "[object Symbol]" ].includes(r) || !Symbol.prototype.valueOf) && Symbol.prototype.valueOf.call(e) === Symbol.prototype.valueOf.call(t);
        }(s, l, r);
    }
    return u;
}

function aO(e, t, r, n, o, i) {
    var a = tO(r, 1), u = e.length, s = t.length;
    if (u !== s && !(a && s > u)) {
        return !1;
    }
    var l = i.get(e), c = i.get(t);
    if (l && c) {
        return l === t && c === e;
    }
    i.set(e, t), i.set(t, e);
    for (var f = 0, d = !0, p = tO(r, 2) ? new Qb.SetCache([]) : void 0, v = function() {
        var a = e[f], u = t[f];
        if (f += 1, p) {
            if (!function(e, t) {
                for (var r = 0; r < (null === e ? 0 : e.length); r++) {
                    if (t(e[r], r, e)) {
                        return !0;
                    }
                }
                return !1;
            }(t, function(e, t) {
                if (!(0, Zb.cacheHas)(p, t) && (a === e || o(a, e, r, n, i))) {
                    return p.push(t), p;
                }
            })) {
                return d = !1, "break";
            }
        }
        if (a !== u && !o(a, u, r, n, i)) {
            return d = !1, "break";
        }
    }; f < u; ) {
        if ("break" === v()) {
            break;
        }
    }
    return i.delete(e), i.delete(t), d;
}

var uO = function(e, t) {
    var r = e ? "[object Array]" : (0, Jb.default)(t);
    return r = "[object Arguments]" === r ? "[object Object]" : r;
};

function sO(e, t, r) {
    void 0 === e && (e = void 0), void 0 === t && (t = void 0);
    var n = r.bitmask, o = r.customizer, i = r.equalFunc, a = r.stack, u = void 0 === a ? new Yb.Stack(void 0) : a, s = (0, 
    zb.default)(e), l = uO(s, e);
    return l === uO((0, zb.default)(t), t) && "[object Object]" !== l ? function(e) {
        var t = e.objIsArr, r = e.object, n = e.other, o = e.objTag, i = e.bitmask, a = e.customizer, u = e.equalFunc, s = e.stack;
        return t || (0, Kb.default)(r) ? aO(r, n, i, a, u, s) : iO(r, n, o, i, a, u, s);
    }({
        objIsArr: s,
        object: e,
        other: t,
        objTag: l,
        bitmask: n,
        customizer: o,
        equalFunc: i,
        stack: u
    }) : function(e, t, r, n, o, i) {
        var a = tO(r, 1), u = (0, qb.default)(e), s = (0, qb.default)(t);
        if (u.length !== s.length && !a) {
            return !1;
        }
        for (var l = u.length; l--; ) {
            var c = u[l];
            if (!(a ? c in t : Object.prototype.hasOwnProperty.hasOwnProperty.call(t, c))) {
                return !1;
            }
        }
        var f = i.get(e), d = i.get(t);
        if (f && d) {
            return f === t && d === e;
        }
        var p = !0;
        i.set(e, t), i.set(t, e);
        for (var v, h = a; ++l < u.length; ) {
            var g = e[v = u[l]], y = t[v];
            if (g !== y && !o(g, y, r, n, i)) {
                p = !1;
                break;
            }
            h = h || (h = "constructor" === v);
        }
        if (p && !h) {
            var m = e.constructor, E = t.constructor;
            m === E || !("constructor" in e) || !("constructor" in t) || "function" == typeof m && m instanceof m && "function" == typeof E && E instanceof E || (p = !1);
        }
        return i.delete(e), i.delete(t), p;
    }(e, t, n, o, i, u);
}

function lO(e, t, r, n, o) {
    void 0 === e && (e = void 0), void 0 === t && (t = void 0);
    var i = e, a = t;
    return i === a || (null === e || null === t || !(0, Wb.default)(e) && !(0, Wb.default)(t) ? i !== e && a !== t : sO(i, a, {
        bitmask: r,
        customizer: n,
        equalFunc: lO,
        stack: o
    }));
}

Ub.default = function(e, t) {
    void 0 === e && (e = void 0), void 0 === t && (t = void 0);
    try {
        return lO(e, t);
    } catch (e) {
        return !1;
    }
};

var cO = {};

Object.defineProperty(cO, "__esModule", {
    value: !0
}), cO.default = function(e) {
    return "number" == typeof e && Number.isFinite(e);
};

var fO = {};

Object.defineProperty(fO, "__esModule", {
    value: !0
});

var dO = ig();

fO.default = function(e) {
    var t = (0, dO.tagName)(e);
    return "[object Function]" === t || "[object AsyncGeneratorFunction]" === t;
};

var pO = {};

Object.defineProperty(pO, "__esModule", {
    value: !0
}), pO.default = function(e) {
    return null === e;
};

var vO = {};

Object.defineProperty(vO, "__esModule", {
    value: !0
}), vO.isPositiveInteger = vO.isNumberic = void 0;

var hO = ig();

vO.default = function(e) {
    return "number" == typeof e || "object" == typeof e && "[object Number]" === (0, 
    hO.tagName)(e);
}, vO.isNumberic = function(e) {
    return /^-?\d+(\.\d+)?$/.test(e);
}, vO.isPositiveInteger = function(e) {
    return "-0" !== e && !Object.is(-0, e) && ("0" === e || 0 === e || /^[1-9]\d*$/.test("".concat(e)));
};

var gO = {};

Object.defineProperty(gO, "__esModule", {
    value: !0
}), gO.default = function(e) {
    return void 0 === e;
};

var yO = {};

Object.defineProperty(yO, "__esModule", {
    value: !0
}), yO.default = function(e) {
    return void 0 === e && (e = void 0), Number.isInteger(e);
};

var mO = {};

Object.defineProperty(mO, "__esModule", {
    value: !0
}), mO.default = function(e) {
    return void 0 === e && (e = void 0), null != e && e instanceof Map;
};

var EO = {};

Object.defineProperty(EO, "__esModule", {
    value: !0
}), EO.default = function(e, t) {
    if (!Array.isArray(e)) {
        return "";
    }
    var r = null === t ? "null" : t;
    return r = void 0 === r ? "," : r, r = Array.isArray(r) && 0 === r.length ? "" : r, 
    r = Array.isArray(r) && r.length > 0 ? r.join(",") : r, e.join(r);
};

var _O = {};

Object.defineProperty(_O, "__esModule", {
    value: !0
}), _O.default = function(e) {
    if (null != e) {
        return 0 === e.length ? void 0 : e[e.length - 1];
    }
};

var DO = {};

Object.defineProperty(DO, "__esModule", {
    value: !0
}), DO.default = function(e) {
    var t = String(e);
    return 0 === t.length ? "" : t[0].toLowerCase() + t.substr(1);
};

var bO = {}, OO = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(bO, "__esModule", {
    value: !0
});

var AO = OO(mh), CO = OO(jh);

bO.default = function(e) {
    if (e && "number" != typeof e && e.length > 0) {
        var t = e[0];
        return e.forEach(function(e) {
            (e > t || (0, AO.default)(t) || (0, CO.default)(t)) && (t = e);
        }), t;
    }
};

var SO = {}, MO = {};

Object.defineProperty(MO, "__esModule", {
    value: !0
}), MO.default = function(e, t) {
    if (t) {
        return e.slice();
    }
    var r = e.length, n = Buffer.allocUnsafe(r);
    return e.copy(n), n;
};

var wO = {}, FO = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(wO, "__esModule", {
    value: !0
});

var PO = Xv, IO = FO(Hg);

wO.default = function(e) {
    return (0, PO.copyObject)(e, (0, IO.default)(e), {}, void 0);
}, function(e) {
    var t = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.baseMerge = void 0;
    var r = jv, n = Yv, o = Pg, i = t(MO), a = t(Ig), u = t(wO), s = qg, l = Nv, c = t(Zg), f = t(C_), d = t(Mb), p = t(fO), v = t(Ug), h = t(jb), y = t(sh), m = t(Hg);
    function E(e, t) {
        if (("constructor" !== t || "function" != typeof e[t]) && "__proto__" !== t) {
            return e[t];
        }
    }
    function _(e, t, r) {
        (void 0 !== r && !(0, c.default)(e[t], r) || void 0 === r && !(t in e)) && (0, n.baseAssignValue)(e, t, r);
    }
    function D(e, t, r, n, s, c, g) {
        var m = E(e, r), D = E(t, r), b = g.get(D);
        if (b) {
            _(e, r, b);
        } else {
            var O = c ? c(m, D, "".concat(r), e, t, g) : void 0, A = void 0 === O;
            if (A) {
                var C = function(e, t) {
                    var r = !0, n = e, s = Array.isArray(e), c = (0, d.default)(e), g = !s && (0, y.default)(e);
                    return s || c || g ? Array.isArray(t) ? n = t : (0, f.default)(t) ? n = (0, a.default)(t, void 0) : c ? (r = !1, 
                    n = (0, i.default)(e, !0)) : g ? (r = !1, n = (0, o.cloneTypedArray)(e, !0)) : n = [] : (0, 
                    h.default)(e) || (0, l.isArguments)(e) ? (n = t, (0, l.isArguments)(t) ? n = (0, 
                    u.default)(t) : (0, v.default)(t) && !(0, p.default)(t) || (n = (0, o.initCloneObject)(e))) : r = !1, 
                    {
                        newValue: n,
                        isCommon: r
                    };
                }(D, m);
                O = C.newValue, A = C.isCommon;
            }
            A && (g.set(D, O), s(O, D, n, c, g), g.delete(D)), _(e, r, O);
        }
    }
    e.baseMerge = function(t, r, n, o, i) {
        if (t !== r) {
            var a = i || new s.Stack(void 0);
            (0, m.default)(r).forEach(function(i) {
                var u = r[i];
                if ((0, v.default)(u)) {
                    D(t, r, i, n, e.baseMerge, o, a);
                } else {
                    var s = o ? o(E(t, i), u, "".concat(i), t, r, a) : void 0;
                    void 0 === s && (s = u), _(t, i, s);
                }
            });
        }
    };
    var b = (0, r.createAssignFunction)(function(t, r, n) {
        return (0, e.baseMerge)(t, r, n);
    });
    e.default = b;
}(SO);

var RO = {}, TO = {}, LO = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(TO, "__esModule", {
    value: !0
});

var jO = LO(Bh), NO = LO(mh), xO = LO(jh);

TO.default = function(e, t) {
    if (void 0 === t && (t = jO.default), e && "number" != typeof e && e.length > 0) {
        var r = 0, n = t(e[r]);
        return e.forEach(function(e, o) {
            var i = t(e);
            (n > i || (0, NO.default)(n) || (0, xO.default)(n)) && (n = i, r = o);
        }), e[r];
    }
};

var kO = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(RO, "__esModule", {
    value: !0
});

var BO = kO(TO);

RO.default = function(e) {
    return (0, BO.default)(e);
};

var $O = {};

Object.defineProperty($O, "__esModule", {
    value: !0
}), $O.default = function() {};

var HO = {}, UO = {}, GO = {}, VO = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, WO = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
};

Object.defineProperty(GO, "__esModule", {
    value: !0
}), GO.default = function(e) {
    for (var t = [], r = 1; r < arguments.length; r++) {
        t[r - 1] = arguments[r];
    }
    if (null == e) {
        return [];
    }
    var n = [];
    t.forEach(function(e) {
        Array.isArray(e) ? n.push.apply(n, WO([], VO(e), !1)) : n.push(e);
    });
    for (var o = e.length - 1; o >= 0; o--) {
        n.includes(e[o]) && e.splice(o, 1);
    }
    return e;
};

var zO = {}, JO = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(zO, "__esModule", {
    value: !0
});

var KO = JO(FD), qO = JO(ag());

zO.default = function e(t) {
    return null == t ? "" : (0, KO.default)(t) ? t : Array.isArray(t) ? "".concat(t.map(function(t) {
        return null == t ? t : e(t);
    })) : (0, qO.default)(t) ? t.toString() : "0" === "".concat(t) && 1 / t == -1 / 0 ? "-0" : "".concat(t);
};

var XO = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, YO = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
}, ZO = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(UO, "__esModule", {
    value: !0
}), UO.checkIsNestedObject = UO.getNestedValue = UO.getObjectKeys = UO.getFilters = void 0;

var QO = ZO(vO), eA = ZO(mh), tA = ZO(Ug), rA = ZO(GO), nA = ZO(zO);

function oA(e) {
    for (var t = [], r = 0, n = e.length; r < n; r++) {
        var o = e[r];
        Array.isArray(o) ? t = t.concat(o) : "string" == typeof o || (0, QO.default)(o) ? t.push((0, 
        nA.default)(o)) : "[object Symbol]" === Object.prototype.toString.call(o) ? t.push(o) : "[object Arguments]" === Object.prototype.toString.call(o) && t.push.apply(t, YO([], XO(o), !1));
    }
    return t;
}

function iA(e) {
    var t = Object.keys(e), r = Object.getOwnPropertySymbols(e);
    return r.length > 0 ? [].concat(t).concat(r) : t;
}

function aA(e, t, r, n, o) {
    void 0 === o && (o = !1);
    for (var i = [].concat(r), a = 0, u = t.length; a < u; a++) {
        var s = t[a];
        i.includes(s) && (n[s] = e[s], o && (0, rA.default)(i, [ s ]));
    }
    return i;
}

function uA(e, t) {
    var r = {}, n = "[object Symbol]" === Object.prototype.toString.call(t) ? [ t ] : t.split(".");
    if (n.length > 1) {
        var o = n.shift();
        if ((0, eA.default)(e[o])) {
            return r;
        }
        var i = uA(e[o], n.join("."));
        return r[o] = i, r;
    }
    return Object.prototype.hasOwnProperty.call(e, t) && (r[t] = e[t]), r;
}

function sA(e, t) {
    if (!(0, tA.default)(e) && !(0, tA.default)(t)) {
        return t;
    }
    for (var r = Object.keys(t), n = 0, o = r.length; n < o; n++) {
        var i = r[n];
        e[i] = e[i] ? sA(e[i], t[i]) : t[i];
    }
    return e;
}

function lA(e, t, r) {
    if (e.length > 0) {
        for (var n = 0, o = e.length; n < o; n++) {
            var i = uA(t, e[n]), a = Object.keys(i)[0];
            Object.prototype.hasOwnProperty.call(r, a) ? sA(r, i) : Object.assign(r, i);
        }
    }
}

function cA(e) {
    for (var t = Object.keys(e), r = 0, n = t.length; r < n; r++) {
        if ("[object Object]" === Object.prototype.toString.call(e[t[r]])) {
            return !0;
        }
    }
    return !1;
}

UO.getFilters = oA, UO.getObjectKeys = iA, UO.getNestedValue = uA, UO.checkIsNestedObject = cA, 
UO.default = function(e) {
    for (var t = [], r = 1; r < arguments.length; r++) {
        t[r - 1] = arguments[r];
    }
    if ((0, eA.default)(e)) {
        return {};
    }
    var n = oA(t);
    return cA(e) ? function(e, t) {
        var r = {}, n = aA(e, iA(e), t, r, !0);
        lA(n, e, r);
        var o = Object.getPrototypeOf(e), i = Object.keys(o);
        return cA(o) ? lA(n = aA(o, i, t, r, !0), o, r) : aA(o, i, t, r), r;
    }(e, n) : function(e, t) {
        var r = {};
        aA(e, iA(e), t, r);
        var n = Object.getPrototypeOf(e);
        return lA(aA(n, Object.keys(n), t, r, !0), n, r), r;
    }(e, n);
};

var fA = g && g.__values || function(e) {
    var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], n = 0;
    if (r) {
        return r.call(e);
    }
    if (e && "number" == typeof e.length) {
        return {
            next: function() {
                return e && n >= e.length && (e = void 0), {
                    value: e && e[n++],
                    done: !e
                };
            }
        };
    }
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, dA = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, pA = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
}, vA = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(HO, "__esModule", {
    value: !0
});

var hA = vA(Rh), gA = vA(rg()), yA = ig(), mA = vA(Lb), EA = UO, _A = vA(zO);

function DA(e, t) {
    var r, n;
    try {
        for (var o = fA(t), i = o.next(); !i.done; i = o.next()) {
            if (e === i.value) {
                return !0;
            }
        }
    } catch (e) {
        r = {
            error: e
        };
    } finally {
        try {
            i && !i.done && (n = o.return) && n.call(o);
        } finally {
            if (r) {
                throw r.error;
            }
        }
    }
    return !1;
}

function bA(e, t, r) {
    if (0 === r.length) {
        return (0, hA.default)({}, e);
    }
    var n = {}, o = (0, EA.getObjectKeys)(e);
    return r.forEach(function(i) {
        var a = 1;
        "string" == typeof i && (a = (0, gA.default)(i).length), o.forEach(function(o) {
            var i = "".concat((0, _A.default)(t), ".").concat((0, _A.default)(o));
            if (!DA(i, r) && Object.getOwnPropertyDescriptor(e, o).enumerable) {
                if ("[object Object]" === Object.prototype.toString.call(e[o])) {
                    var u = OA(e[o], i, r, a);
                    (0, mA.default)(u) || (n[o] = u);
                } else {
                    n[o] = e[o];
                }
            }
        });
    }), n;
}

function OA(e, t, r, n) {
    var o = {};
    return (0, EA.getObjectKeys)(e).forEach(function(i) {
        var a = "".concat((0, _A.default)(t), ".").concat((0, _A.default)(i));
        if (!DA(a, r) && Object.getOwnPropertyDescriptor(e, i).enumerable) {
            if ("[object Object]" === Object.prototype.toString.call(e[i]) && 1 !== n) {
                var u = OA(e[i], a, r, n - 1);
                (0, mA.default)(u) || (o[i] = u);
            } else {
                o[i] = e[i];
            }
        }
    }), o;
}

function AA(e, t, r) {
    var n, o, i = new Map, a = (0, EA.getObjectKeys)(e), u = [].concat.apply([], pA([], dA(t), !1)), s = function(n) {
        return DA(n, t) ? (u = u.filter(function(e) {
            return e !== n;
        }), "continue") : Object.getOwnPropertyDescriptor(e, n).enumerable ? void ("[object Object]" !== (0, 
        yA.tagName)(e[n]) ? r[n] = e[n] : i.set(n, e[n])) : "continue";
    };
    try {
        for (var l = fA(a), c = l.next(); !c.done; c = l.next()) {
            s(c.value);
        }
    } catch (e) {
        n = {
            error: e
        };
    } finally {
        try {
            c && !c.done && (o = l.return) && o.call(l);
        } finally {
            if (n) {
                throw n.error;
            }
        }
    }
    i.forEach(function(e, t) {
        var n = bA(e, t, u);
        (0, mA.default)(n) || (r[t] = n);
    });
}

HO.default = function(e) {
    for (var t = [], r = 1; r < arguments.length; r++) {
        t[r - 1] = arguments[r];
    }
    if (null == e) {
        return {};
    }
    var n = (0, EA.getFilters)(t);
    return (0, EA.checkIsNestedObject)(e) ? function(e, t) {
        var r = {};
        AA(e, t, r);
        var n = Object.getPrototypeOf(e);
        return null !== n && AA(n, t, r), r;
    }(e, n) : function(e, t) {
        var r = {};
        AA(e, t, r);
        var n = Object.getPrototypeOf(e);
        return Array.isArray(n) || null === n || AA(n, t, r), r;
    }(e, n);
};

var CA = {}, SA = {}, MA = {};

Object.defineProperty(MA, "__esModule", {
    value: !0
}), MA.default = function(e, t) {
    if (null == e) {
        return e;
    }
    for (var r = 1, n = t.length, o = e[t[0]]; null != o && r < n; ) {
        o = o[t[r]], r += 1;
    }
    return o;
};

var wA, FA = {}, PA = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(FA, "__esModule", {
    value: !0
});

var IA = PA(ag()), RA = ((wA = {}).boolean = 0, wA.number = 1, wA.string = 2, wA[typeof Symbol("a")] = 3, 
wA.object = 4, wA[void 0] = 5, wA);

FA.default = function(e, t) {
    var r, n, o = typeof e, i = typeof t, a = Number.isNaN(e), u = Number.isNaN(t);
    return o !== i || a || u ? (r = a ? 6 : RA[o], n = u ? 6 : RA[i]) : (r = e, n = t, 
    (0, IA.default)(e) && (r = e.description, n = t.description)), function(e, t) {
        return e > t ? 1 : e < t ? -1 : 0;
    }(r, n);
};

var TA = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(SA, "__esModule", {
    value: !0
}), SA.arraySort = void 0;

var LA = TA(MA), jA = TA(Bh), NA = TA(FA);

SA.arraySort = function(e, t, r) {
    var n;
    n = t.length > 0 ? t.map(function(e) {
        return Array.isArray(e) ? function(t) {
            return (0, LA.default)(t, e);
        } : "function" == typeof e ? e : "object" == typeof e || "string" == typeof e ? function(t) {
            return (0, LA.default)(t, [ e ]);
        } : jA.default;
    }) : [ jA.default ];
    for (var o = [], i = e.length, a = 0; a < i; a++) {
        o.push({
            value: e[a],
            index: a
        });
    }
    o.sort(function(e, t) {
        return function(e) {
            for (var t = e.length, r = 0; r < t; r++) {
                if (0 !== e[r]) {
                    return e[r];
                }
            }
            return 0;
        }(n.map(function(n, o) {
            var i, a = r[o] ? r[o] : "asc";
            if ("function" == typeof a) {
                i = a(n(e.value), n(t.value));
            } else {
                var u = n(e.value), s = n(t.value);
                i = (0, NA.default)(u, s);
            }
            return "desc" === a.toString() && (i = 0 - i), i;
        }));
    });
    var u = [];
    for (a = 0; a < i; a++) {
        u[a] = o[a].value;
    }
    return u;
};

var xA = g && g.__values || function(e) {
    var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], n = 0;
    if (r) {
        return r.call(e);
    }
    if (e && "number" == typeof e.length) {
        return {
            next: function() {
                return e && n >= e.length && (e = void 0), {
                    value: e && e[n++],
                    done: !e
                };
            }
        };
    }
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

Object.defineProperty(CA, "__esModule", {
    value: !0
});

var kA = SA;

CA.default = function(e, t, r) {
    return null == e ? [] : function(e, t, r) {
        if (Array.isArray(e)) {
            var n = [].concat(e);
            return (0, kA.arraySort)(n, t, r);
        }
        return function(e, t, r) {
            var n, o, i = [], a = Object.keys(e);
            try {
                for (var u = xA(a), s = u.next(); !s.done; s = u.next()) {
                    var l = s.value;
                    i.push(e[l]);
                }
            } catch (e) {
                n = {
                    error: e
                };
            } finally {
                try {
                    s && !s.done && (o = u.return) && o.call(u);
                } finally {
                    if (n) {
                        throw n.error;
                    }
                }
            }
            return (0, kA.arraySort)(i, t, r);
        }(e, t, r);
    }(e, Array.isArray(t) ? t : [ t ], Array.isArray(r) ? r : null == r ? [] : [ r ]);
};

var BA = {}, $A = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(BA, "__esModule", {
    value: !0
});

var HA = $A(Nh), UA = $A(zO);

BA.default = function(e, t, r) {
    var n = (0, UA.default)(e), o = (0, HA.default)(t), i = void 0 === r ? " " : (0, 
    UA.default)(r);
    if (o <= n.length || "" === i) {
        return n;
    }
    for (var a = "", u = 0; u < o - n.length && !("".concat(a += i).concat(n).length >= o); u++) {}
    if ("".concat(n).concat(a).length > o) {
        var s = "".concat(n).concat(a).length - o;
        a = a.substring(0, a.length - s);
    }
    return "".concat(n).concat(a);
};

var GA = {}, VA = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(GA, "__esModule", {
    value: !0
});

var WA = VA(Nh), zA = VA(zO);

GA.default = function(e, t, r) {
    var n = (0, zA.default)(e), o = (0, WA.default)(t), i = void 0 === r ? " " : (0, 
    zA.default)(r);
    if (o <= n.length || "" === i) {
        return n;
    }
    for (var a = "", u = 0; u < t - n.length && !("".concat(a += i).concat(n).length >= t); u++) {}
    if ("".concat(a).concat(n).length > t) {
        var s = "".concat(a).concat(n).length - t;
        a = a.substring(0, a.length - s);
    }
    return "".concat(a).concat(n);
};

var JA = {}, KA = g && g.__values || function(e) {
    var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], n = 0;
    if (r) {
        return r.call(e);
    }
    if (e && "number" == typeof e.length) {
        return {
            next: function() {
                return e && n >= e.length && (e = void 0), {
                    value: e && e[n++],
                    done: !e
                };
            }
        };
    }
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

Object.defineProperty(JA, "__esModule", {
    value: !0
});

var qA = ig();

JA.default = function(e) {
    for (var t, r, n = [], o = 1; o < arguments.length; o++) {
        n[o - 1] = arguments[o];
    }
    if (!e) {
        return [];
    }
    var i = [];
    try {
        for (var a = KA(n), u = a.next(); !u.done; u = a.next()) {
            var s = u.value;
            Array.isArray(s) ? i = i.concat(s.map(function(e) {
                return (0, qA.toStringWithZeroSign)(e);
            })) : i.push((0, qA.toStringWithZeroSign)(s));
        }
    } catch (e) {
        t = {
            error: e
        };
    } finally {
        try {
            u && !u.done && (r = a.return) && r.call(a);
        } finally {
            if (t) {
                throw t.error;
            }
        }
    }
    if (0 === i.length) {
        return [];
    }
    var l = [], c = new Map;
    if (i.forEach(function(t) {
        var r;
        if (c.has(t)) {
            r = c.get(t);
        } else {
            var n = function(e, t) {
                var r, n;
                if (Object.prototype.hasOwnProperty.call(e, t)) {
                    return {
                        penultimateValue: e,
                        lastKey: t
                    };
                }
                var o = t.split("."), i = o.pop(), a = e;
                try {
                    for (var u = KA(o), s = u.next(); !s.done; s = u.next()) {
                        var l = s.value, c = a[l];
                        if (null == c) {
                            i = l;
                            break;
                        }
                        a = c;
                    }
                } catch (e) {
                    r = {
                        error: e
                    };
                } finally {
                    try {
                        s && !s.done && (n = u.return) && n.call(u);
                    } finally {
                        if (r) {
                            throw r.error;
                        }
                    }
                }
                return {
                    penultimateValue: a,
                    lastKey: i
                };
            }(e, t), o = n.penultimateValue, i = n.lastKey;
            r = o[i], delete o[i];
        }
        l.push(r), c.has(t) || c.set(t, r);
    }), Array.isArray(e)) {
        for (var f = [], d = 0; d < e.length; d++) {
            Object.prototype.hasOwnProperty.call(e, String(d)) && f.push(e[d]);
        }
        f.forEach(function(t, r) {
            e[r] = t;
        }), e.length = f.length;
    }
    return l;
};

var XA = {}, YA = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(XA, "__esModule", {
    value: !0
});

var ZA = YA(jh);

XA.default = function() {
    for (var e = [], t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
    }
    for (var r = function(e) {
        var t = 0, r = (0, ZA.default)(Number(e[0])) ? 0 : Number(e[0]), n = r < 0 ? -1 : 1;
        return 1 === e.length ? {
            start: t,
            end: r,
            step: n
        } : {
            start: t = (0, ZA.default)(Number(e[0])) ? 0 : Number(e[0]),
            end: r = (0, ZA.default)(Number(e[1])) ? 0 : Number(e[1]),
            step: n = 2 === e.length ? r > t ? 1 : -1 : (0, ZA.default)(Number(e[2])) ? 0 : Number(e[2])
        };
    }(e), n = r.start, o = r.end, i = r.step, a = o < n && i > 0, u = Math.abs(Math.ceil((o - n) / (i || 1))), s = new Array(u), l = n, c = 0; c < u; c++) {
        s[c] = l, l = a ? l - i : l + i;
    }
    return s;
};

var QA = {}, eC = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(QA, "__esModule", {
    value: !0
});

var tC = eC(mh), rC = eC(oh), nC = function(e) {
    return e;
};

QA.default = function(e, t, r) {
    void 0 === t && (t = nC);
    var n = arguments.length < 3;
    return Array.isArray(e) ? function(e, t, r, n) {
        var o = (0, tC.default)(e) ? 0 : e.length, i = 0, a = n;
        r && o > 0 && (a = e[0], i = 1);
        for (var u = i; u < o; u++) {
            a = t(a, e[u], u, e);
        }
        return a;
    }(e, t, n, r) : function(e, t, r, n) {
        var o = (0, rC.default)(e), i = o.length, a = 0, u = n;
        r && i > 0 && (u = e[o[0]], a = 1);
        for (var s = a; s < i; s++) {
            var l = o[s];
            u = t(u, e[l], l, e);
        }
        return u;
    }(e, t, n, r);
};

var oC = {};

Object.defineProperty(oC, "__esModule", {
    value: !0
});

var iC = iD;

oC.default = function(e, t) {
    if (null == e) {
        return [];
    }
    for (var r = [], n = (0, iC.wrapIteratee)(t), o = 0, i = e.length; o < i; o++) {
        n(e[o], o, e) && r.push(e[o]);
    }
    for (o = e.length - 1; o >= 0; o--) {
        r.includes(e[o]) && e.splice(o, 1);
    }
    return r;
};

var aC = {};

Object.defineProperty(aC, "__esModule", {
    value: !0
}), aC.default = function(e) {
    for (var t = e.length, r = 0; r < t / 2; r++) {
        var n = t - r - 1, o = e[r];
        e[r] = e[n], e[n] = o;
    }
    return e;
};

var uC = {}, sC = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(uC, "__esModule", {
    value: !0
});

var lC = sC(k_), cC = sC(Nh), fC = sC(zO);

uC.default = function(e, t) {
    var r = (0, lC.default)(t), n = (0, cC.default)(e);
    if (r) {
        var o = "".concat((0, fC.default)(n), "e").split("e"), i = Math.round("".concat(o[0], "e").concat(+o[1] + r));
        return o = "".concat((0, fC.default)(i), "e").split("e"), +"".concat(o[0], "e").concat(+o[1] - r);
    }
    return Math.round(n);
};

var dC = {}, pC = g && g.__createBinding || (Object.create ? function(e, t, r, n) {
    void 0 === n && (n = r);
    var o = Object.getOwnPropertyDescriptor(t, r);
    o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
        enumerable: !0,
        get: function() {
            return t[r];
        }
    }), Object.defineProperty(e, n, o);
} : function(e, t, r, n) {
    void 0 === n && (n = r), e[n] = t[r];
}), vC = g && g.__setModuleDefault || (Object.create ? function(e, t) {
    Object.defineProperty(e, "default", {
        enumerable: !0,
        value: t
    });
} : function(e, t) {
    e.default = t;
}), hC = g && g.__importStar || function(e) {
    if (e && e.__esModule) {
        return e;
    }
    var t = {};
    if (null != e) {
        for (var r in e) {
            "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && pC(t, e, r);
        }
    }
    return vC(t, e), t;
}, gC = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(dC, "__esModule", {
    value: !0
});

var yC = gC(FD), mC = hC(vO), EC = gC(rg()), _C = gC(Nh);

function DC(e, t, r) {
    return e ? t ? [] : {} : r ? [] : {};
}

function bC(e, t, r) {
    var n;
    if (OC(e, t)) {
        MC(e[t]) && (e[t] = r ? [] : {}), n = e[t];
    } else if ((0, yC.default)(t)) {
        for (var o = e, i = (0, EC.default)(t), a = i.length, u = 0; u < a; u++) {
            var s = i[u];
            OC(o, s) && !MC(o[s]) || (o[s] = DC(SC(u, a), r, (0, mC.isPositiveInteger)(i[u + 1]))), 
            o = o[s];
        }
        n = o;
    } else {
        e[t] = r ? [] : {}, n = e[t];
    }
    return n;
}

function OC(e, t) {
    var r = Object.prototype.hasOwnProperty;
    return null != e[t] || r.apply(e, [ t ]);
}

function AC(e, t, r) {
    if (OC(e, t)) {
        (0, mC.isPositiveInteger)(t) ? e[(0, _C.default)(t)] = r : (0, mC.default)(t) ? CC(e, t.toLocaleString(), r) : CC(e, t, r);
    } else {
        for (var n = (0, EC.default)(t), o = n.length, i = e, a = 0; a < o; a++) {
            var u = n[a];
            if (SC(a, o)) {
                CC(i, (0, mC.isPositiveInteger)(u) ? (0, _C.default)(u) : u, r);
            } else {
                var s = (0, mC.isPositiveInteger)(u) ? (0, _C.default)(u) : u, l = i[s];
                if (MC(l)) {
                    l = (0, mC.isPositiveInteger)(n[a + 1]) ? [] : {}, i[s] = l;
                }
                i = i[s];
            }
        }
    }
}

function CC(e, t, r) {
    Number.isNaN(e[t]) && Number.isNaN(r) || e[t] === r || (e[t] = r);
}

function SC(e, t) {
    return e + 1 === t;
}

function MC(e) {
    var t = typeof e;
    return null == e || "string" === t || "number" === t || "boolean" === t || "symbol" === t || "bigint" === t;
}

dC.default = function(e, t, r) {
    return null == e ? e : function(e, t, r) {
        var n;
        n = Array.isArray(t) ? t : [ t ];
        var o = e, i = 0, a = n.length;
        for (;i < a; ) {
            var u = n[i];
            if (i === a - 1) {
                AC(o, u, r);
                break;
            }
            o = bC(o, u, (0, mC.isPositiveInteger)(n[i + 1])), i += 1;
        }
        return e;
    }(e, t, r);
};

var wC = {};

Object.defineProperty(wC, "__esModule", {
    value: !0
}), wC.default = function(e, t, r) {
    var n = Number.isNaN, o = null == e ? 0 : e.length;
    if (!o || n(r)) {
        return [];
    }
    var i = Math.floor, a = null == t || n(t) ? 0 : i(Number(t)), u = void 0 === r ? o : i(Number(r));
    a < 0 && (a = -a > o ? 0 : o + a), (u = u > o ? o : u) < 0 && (u += o), o = a > u ? 0 : u - a >>> 0, 
    a >>>= 0;
    for (var s = -1, l = []; ++s < o; ) {
        l[s] = e[s + a];
    }
    return l;
};

var FC = {}, PC = g && g.__values || function(e) {
    var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], n = 0;
    if (r) {
        return r.call(e);
    }
    if (e && "number" == typeof e.length) {
        return {
            next: function() {
                return e && n >= e.length && (e = void 0), {
                    value: e && e[n++],
                    done: !e
                };
            }
        };
    }
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, IC = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, RC = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
}, TC = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(FC, "__esModule", {
    value: !0
});

var LC = SA, jC = TC(Bh);

FC.default = function(e) {
    for (var t, r, n = [], o = 1; o < arguments.length; o++) {
        n[o - 1] = arguments[o];
    }
    var i = [].concat(e);
    if (!Array.isArray(e)) {
        var a = Object.keys(e);
        i = [];
        try {
            for (var u = PC(a), s = u.next(); !s.done; s = u.next()) {
                var l = s.value;
                i.push(e[l]);
            }
        } catch (e) {
            t = {
                error: e
            };
        } finally {
            try {
                s && !s.done && (r = u.return) && r.call(u);
            } finally {
                if (t) {
                    throw t.error;
                }
            }
        }
    }
    var c = [];
    if (null == n || 0 === n.length) {
        c = [ jC.default ];
    } else {
        for (var f = n.length, d = 0; d < f; d++) {
            Array.isArray(n[d]) ? c.push.apply(c, RC([], IC(n[d]), !1)) : null == n[d] ? c.push(jC.default) : c.push(n[d]);
        }
    }
    return (0, LC.arraySort)(i, c, [ "asc" ]);
};

var NC = {};

Object.defineProperty(NC, "__esModule", {
    value: !0
}), NC.default = function(e, t, r) {
    var n = null == r ? 0 : r;
    return (n < 0 || Number.isNaN(n)) && (n = 0), n > e.length && (n = e.length), n >= 0 && e.slice(n, n + t.length) === t;
};

var xC = {};

Object.defineProperty(xC, "__esModule", {
    value: !0
}), xC.default = function(e) {
    if (null == e) {
        return 0;
    }
    var t = 0;
    try {
        for (var r = 0, n = e.length; r < n; r++) {
            void 0 !== e[r] && (t += e[r]);
        }
    } catch (e) {}
    return "string" == typeof t ? "".concat(t).substring(1, "".concat(t).length) : t;
};

var kC = {}, BC = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(kC, "__esModule", {
    value: !0
});

var $C = BC(Im);

kC.default = function(e, t, r) {
    if (void 0 === r && (r = {}), "function" != typeof e) {
        throw new TypeError("Expected a function");
    }
    var n = r.leading, o = void 0 === n || n, i = r.trailing, a = void 0 === i || i;
    return (0, $C.default)(e, t, {
        leading: o,
        trailing: a,
        maxWait: t
    });
};

var HC = {}, UC = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(HC, "__esModule", {
    value: !0
});

var GC = UC(mh), VC = String ? String.prototype.toLowerCase : void 0;

HC.default = function(e) {
    return void 0 === e && (e = ""), (0, GC.default)(e) ? "" : VC.call(e);
};

var WC = {}, zC = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(WC, "__esModule", {
    value: !0
});

var JC = zC(mh), KC = String ? String.prototype.toUpperCase : void 0;

WC.default = function(e) {
    return (0, JC.default)(e) ? e : KC.call(e);
};

var qC = {};

Object.defineProperty(qC, "__esModule", {
    value: !0
});

var XC = ig();

qC.default = function(e, t) {
    if (null == e) {
        return "";
    }
    for (var r = t ? t.split("") : XC.whiteSpace, n = e.split(""), o = -1, i = n.length - 1; i >= 0; i--) {
        if (!r.includes(n[i])) {
            o = i;
            break;
        }
    }
    return e.substring(0, o + 1);
};

var YC = {};

Object.defineProperty(YC, "__esModule", {
    value: !0
});

var ZC = ig();

YC.default = function(e, t) {
    if (null == e) {
        return "";
    }
    for (var r = t ? t.split("") : ZC.whiteSpace, n = e.split(""), o = n.length, i = 0; i < o; i++) {
        if (!r.includes(n[i])) {
            o = i;
            break;
        }
    }
    return e.substring(o, e.length);
};

var QC = {};

Object.defineProperty(QC, "__esModule", {
    value: !0
}), QC.default = function(e) {
    if (!Array.isArray(e)) {
        return [];
    }
    for (var t = [], r = 0; r < e.length; r++) {
        var n = "number" == typeof e[r] ? e[r] + 0 : e[r];
        t.includes(n) || t.push(n);
    }
    return t;
};

var eS = {}, tS = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(eS, "__esModule", {
    value: !0
});

var rS = tS(mh), nS = tS(WC);

eS.default = function(e) {
    return void 0 === e && (e = ""), (0, rS.default)(e) || 0 === e.length ? e : (0, 
    nS.default)(e[0]) + e.slice(1);
};

var oS = {}, iS = {}, aS = {}, uS = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(aS, "__esModule", {
    value: !0
});

var sS = uS(jh);

aS.default = function(e, t) {
    return (0, sS.default)(e) && (0, sS.default)(t) || e === t;
};

var lS = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(iS, "__esModule", {
    value: !0
});

var cS = lS(QA), fS = lS(ih), dS = lS(Z_), pS = lS(aS), vS = lS(_O), hS = lS(fO);

iS.default = function() {
    for (var e = [], t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
    }
    var r = [ [] ].concat(e), n = r, o = (0, vS.default)(r);
    return (0, hS.default)(o) ? n.pop() : o = pS.default, (0, cS.default)(n, function(e, t) {
        return (0, fS.default)(t) ? ((0, dS.default)(t, function(t) {
            -1 === e.findIndex(function(e) {
                return o(t, e);
            }) && e.push(t);
        }), e) : e;
    });
};

var gS = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, yS = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
}, mS = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(oS, "__esModule", {
    value: !0
});

var ES = mS(iS);

oS.default = function() {
    for (var e = [], t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
    }
    return ES.default.apply(void 0, yS([], gS(e), !1));
};

var _S = {}, DS = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(_S, "__esModule", {
    value: !0
});

var bS = DS(mh), OS = {};

_S.default = function(e) {
    void 0 === e && (e = ""), (0, bS.default)(OS["".concat(e)]) && (OS["".concat(e)] = 0), 
    OS["".concat(e)] += 1;
    var t = OS["".concat(e)];
    return "$lodash$" === "".concat(e) ? "".concat(t) : "".concat(e).concat(t);
};

var AS = {}, CS = {}, SS = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, MS = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
};

Object.defineProperty(CS, "__esModule", {
    value: !0
}), CS.default = function() {
    for (var e = [], t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
    }
    var r = e, n = function(e, t) {
        return e === t;
    }, o = e.length, i = e[o - 1];
    if ("function" == typeof i && (r = e.slice(0, o - 1), n = i), !r || 0 === r.length) {
        return [];
    }
    var a = r.filter(function(e) {
        return Array.isArray(e) || "[object Arguments]" === Object.prototype.toString.call(e);
    }).map(function(e) {
        var t = MS([], SS(e), !1), r = [];
        return t.forEach(function(e) {
            r.findIndex(function(t) {
                return n(t, e);
            }) < 0 && r.push(e);
        }), r;
    }).reduce(function(e, t) {
        return MS(MS([], SS(e), !1), SS(t), !1);
    }), u = [];
    return a.forEach(function(e, t) {
        var r = MS([], SS(a), !1);
        r.splice(t, 1), r.findIndex(function(t) {
            return n(t, e);
        }) < 0 && u.push(e);
    }), u;
};

var wS = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, FS = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
}, PS = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(AS, "__esModule", {
    value: !0
});

var IS = PS(Zg), RS = PS(CS);

AS.default = function() {
    for (var e = [], t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
    }
    return RS.default.apply(void 0, FS(FS([], wS(e), !1), [ function(e, t) {
        return (0, IS.default)(e, t);
    } ], !1));
};

var TS = {};

Object.defineProperty(TS, "__esModule", {
    value: !0
}), TS.default = function(e, t) {
    var r = e;
    "[object Object]" === Object.prototype.toString.call(e) && (r = Object.keys(e).map(function(t) {
        return e[t];
    }));
    var n = {}, o = function(e) {
        return e;
    }, i = typeof t;
    return "function" === i ? o = function(e) {
        return t(e);
    } : "string" !== i && "number" !== i || (o = function(e) {
        return e[t];
    }), r.forEach(function(e) {
        n[o(e)] = e;
    }), n;
};

var LS = {}, jS = g && g.__values || function(e) {
    var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], n = 0;
    if (r) {
        return r.call(e);
    }
    if (e && "number" == typeof e.length) {
        return {
            next: function() {
                return e && n >= e.length && (e = void 0), {
                    value: e && e[n++],
                    done: !e
                };
            }
        };
    }
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, NS = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(LS, "__esModule", {
    value: !0
});

var xS = NS(mh);

LS.default = function(e, t) {
    var r, n;
    if ((0, xS.default)(e)) {
        return e;
    }
    var o = Object.keys(e);
    try {
        for (var i = jS(o), a = i.next(); !a.done; a = i.next()) {
            var u = a.value;
            if (!1 === t(e[u], u)) {
                break;
            }
        }
    } catch (e) {
        r = {
            error: e
        };
    } finally {
        try {
            a && !a.done && (n = i.return) && n.call(i);
        } finally {
            if (r) {
                throw r.error;
            }
        }
    }
    return e;
};

var kS = {}, BS = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(kS, "__esModule", {
    value: !0
});

var $S = BS(mh), HS = BS(aS);

kS.default = function(e) {
    for (var t = [], r = 1; r < arguments.length; r++) {
        t[r - 1] = arguments[r];
    }
    return (0, $S.default)(t) ? [].concat(e) : e.filter(function(e) {
        return -1 === t.findIndex(function(t) {
            return (0, HS.default)(e, t);
        });
    });
};

var US = {}, GS = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(US, "__esModule", {
    value: !0
});

var VS = GS(ab).default;

US.default = VS;

var WS = {}, zS = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(WS, "__esModule", {
    value: !0
});

var JS = zS(mh), KS = zS(yO), qS = zS(jh);

WS.default = function(e, t) {
    if (void 0 === t && (t = 0), !(0, JS.default)(e) && 0 !== e.length) {
        var r = t;
        if ((0, KS.default)(t) || (r = Number.parseInt(t.toString(), 10)), !(0, qS.default)(r)) {
            var n = e.length;
            return r < 0 && (r += n), e[r];
        }
    }
};

var XS = {}, YS = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(XS, "__esModule", {
    value: !0
});

var ZS = YS(mh), QS = YS(aS);

function eM(e) {
    return (0, ZS.default)(e) || 0 === e.length;
}

function tM(e, t, r) {
    for (var n = r - 1, o = e.length; ++n < o; ) {
        if ((0, QS.default)(e[n], t)) {
            return n;
        }
    }
    return -1;
}

XS.default = function(e, t) {
    if (eM(e) || eM(t)) {
        return e;
    }
    if (e === t) {
        return e.length = 0, e;
    }
    for (var r = t.length, n = -1; ++n < r; ) {
        for (var o = t[n], i = 0; (i = tM(e, o, i)) > -1; ) {
            e.splice(i, 1);
        }
    }
    return e;
};

var rM = {}, nM = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(rM, "__esModule", {
    value: !0
});

var oM = nM(Bh), iM = nM(jh), aM = nM(mh);

rM.default = function(e, t) {
    if (void 0 === e && (e = 0), e <= 0 || e === 1 / 0 || (0, iM.default)(e)) {
        return [];
    }
    var r = t;
    (0, aM.default)(r) && (r = oM.default);
    for (var n = Math.floor(e), o = [], i = 0; i < n; i++) {
        o.push(r(i));
    }
    return o;
};

var uM = {}, sM = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(uM, "__esModule", {
    value: !0
});

var lM = sM(yO), cM = sM(jh), fM = sM(mh), dM = sM(Nh);

uM.default = function(e, t, r) {
    var n = r, o = e, i = t;
    (0, fM.default)(r) && ("boolean" == typeof t ? (n = t, i = void 0) : "boolean" == typeof e && (n = e, 
    o = void 0)), o = (0, fM.default)(o) ? 0 : o, i = (0, fM.default)(i) ? 1 : i, "number" != typeof o && (o = (0, 
    dM.default)(o)), "number" != typeof i && (i = (0, dM.default)(i)), (0, cM.default)(i) && (i = 0), 
    (0, cM.default)(o) && (o = 0);
    var a = o;
    return o > i && (o = i, i = a), o === 1 / 0 || i === 1 / 0 ? Number.MAX_VALUE : ("boolean" != typeof n && (n = !1), 
    function(e, t, r) {
        return r || !(0, lM.default)(e) || !(0, lM.default)(t);
    }(o, i, n) ? Math.random() * (i - o) + o : function(e, t) {
        var r = Math.ceil(e), n = Math.floor(t);
        return Math.floor(Math.random() * (n - r + 1) + r);
    }(o, i));
};

var pM = {};

Object.defineProperty(pM, "__esModule", {
    value: !0
}), pM.default = function() {
    return !0;
};

var vM = {};

Object.defineProperty(vM, "__esModule", {
    value: !0
}), vM.default = function(e) {
    return function() {
        return e;
    };
};

var hM = {}, gM = g && g.__values || function(e) {
    var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], n = 0;
    if (r) {
        return r.call(e);
    }
    if (e && "number" == typeof e.length) {
        return {
            next: function() {
                return e && n >= e.length && (e = void 0), {
                    value: e && e[n++],
                    done: !e
                };
            }
        };
    }
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, yM = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(hM, "__esModule", {
    value: !0
});

var mM = yM(Bh), EM = yM(aS), _M = yM(mh), DM = yM(Uh), bM = yM(ng()), OM = yM(ih), AM = yM(oh), CM = yM(Ub);

function SM(e, t) {
    var r = [], n = [];
    if ((0, _M.default)(e) || !(0, OM.default)(e)) {
        return r;
    }
    for (var o = e.length, i = function(o) {
        var i = e[o], a = t(i);
        -1 === n.findIndex(function(e) {
            return (0, EM.default)(a, e);
        }) && (r.push(i), n.push(a));
    }, a = 0; a < o; a++) {
        i(a);
    }
    return r;
}

hM.default = function(e, t) {
    void 0 === t && (t = mM.default);
    var r = t;
    (0, _M.default)(r) && (r = mM.default);
    var n, o = typeof r;
    return "function" === o ? SM(e, r) : "number" === o ? SM(e, (n = r, function(e) {
        return e[n];
    })) : "string" === o ? SM(e, function(e) {
        return function(t) {
            return (0, bM.default)(t, e);
        };
    }(r)) : (0, DM.default)(r) ? SM(e, function(e) {
        return function(t) {
            var r = e[0];
            return e[1] === (0, bM.default)(t, r);
        };
    }(r)) : SM(e, "object" === o ? function(e) {
        var t, r, n = (0, AM.default)(e), o = [];
        try {
            for (var i = gM(n), a = i.next(); !a.done; a = i.next()) {
                var u = a.value;
                o.push([ u, e[u] ]);
            }
        } catch (e) {
            t = {
                error: e
            };
        } finally {
            try {
                a && !a.done && (r = i.return) && r.call(i);
            } finally {
                if (t) {
                    throw t.error;
                }
            }
        }
        return function(e) {
            for (var t = o.length, r = 0; r < t; r++) {
                var n = o[r], i = e[n[0]];
                if (!(0, CM.default)(i, n[1])) {
                    return !1;
                }
            }
            return !0;
        };
    }(r) : mM.default);
};

var MM = {}, wM = {}, FM = {};

Object.defineProperty(FM, "__esModule", {
    value: !0
});

var PM = "\\ud800-\\udfff", IM = "\\u2700-\\u27bf", RM = "a-z\\xdf-\\xf6\\xf8-\\xff", TM = "A-Z\\xc0-\\xd6\\xd8-\\xde", LM = "\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", jM = "['’]", NM = "[".concat(LM, "]"), xM = "[".concat("\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\u1ab0-\\u1aff\\u1dc0-\\u1dff", "]"), kM = "[".concat(IM, "]"), BM = "[".concat(RM, "]"), $M = "[^".concat(PM).concat(LM + "\\d" + IM + RM + TM, "]"), HM = "(?:".concat(xM, "|").concat("\\ud83c[\\udffb-\\udfff]", ")"), UM = "[^".concat(PM, "]"), GM = "(?:\\ud83c[\\udde6-\\uddff]){2}", VM = "[\\ud800-\\udbff][\\udc00-\\udfff]", WM = "[".concat(TM, "]"), zM = "(?:".concat(BM, "|").concat($M, ")"), JM = "(?:".concat(WM, "|").concat($M, ")"), KM = "(?:".concat(jM, "(?:d|ll|m|re|s|t|ve))?"), qM = "(?:".concat(jM, "(?:D|LL|M|RE|S|T|VE))?"), XM = "".concat(HM, "?"), YM = "[".concat("\\ufe0e\\ufe0f", "]?"), ZM = YM + XM + "(?:".concat("\\u200d", "(?:").concat([ UM, GM, VM ].join("|"), ")").concat(YM + XM, ")*"), QM = "(?:".concat([ kM, GM, VM ].join("|"), ")").concat(ZM), ew = RegExp([ "".concat(WM, "?").concat(BM, "+").concat(KM, "(?=").concat([ NM, WM, "$" ].join("|"), ")"), "".concat(JM, "+").concat(qM, "(?=").concat([ NM, WM + zM, "$" ].join("|"), ")"), "".concat(WM, "?").concat(zM, "+").concat(KM), "".concat(WM, "+").concat(qM), "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", "".concat("\\d", "+"), QM ].join("|"), "g");

FM.default = function(e) {
    return e.match(ew);
};

var tw = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(wM, "__esModule", {
    value: !0
});

var rw = tw(FM);

wM.default = function(e, t) {
    return void 0 === e && (e = ""), void 0 === t && (t = void 0), void 0 === t ? (0, 
    rw.default)(e) || [] : e.match(t) || [];
};

var nw = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(MM, "__esModule", {
    value: !0
});

var ow = nw(mh), iw = nw(zO), aw = nw(wM);

MM.default = function(e) {
    if (void 0 === e && (e = ""), (0, ow.default)(e)) {
        return e;
    }
    var t = e;
    return "string" != typeof e && (t = (0, iw.default)(e)), (0, aw.default)(t.replace(/['\u2019]/g, "")).reduce(function(e, t, r) {
        return e + (r ? "_" : "") + t.toLowerCase();
    }, "");
};

var uw = {}, sw = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(uw, "__esModule", {
    value: !0
});

var lw = sw(mh), cw = sw(zO), fw = sw(wM);

uw.default = function(e) {
    if (void 0 === e && (e = ""), (0, lw.default)(e)) {
        return e;
    }
    var t = e;
    return "string" != typeof e && (t = (0, cw.default)(e)), (0, fw.default)(t.replace(/['\u2019]/g, "")).reduce(function(e, t, r) {
        return e + (r ? "-" : "") + t.toLowerCase();
    }, "");
};

var dw = {}, pw = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(dw, "__esModule", {
    value: !0
});

var vw = pw(mh), hw = pw(zO), gw = pw(wM);

dw.default = function(e) {
    if (void 0 === e && (e = ""), (0, vw.default)(e)) {
        return e;
    }
    var t = e;
    return "string" != typeof e && (t = (0, hw.default)(e)), (0, gw.default)(t.replace(/['\u2019]/g, "")).reduce(function(e, t, r) {
        return e + (r ? " " : "") + t.toLowerCase();
    }, "");
};

var yw = {}, mw = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(yw, "__esModule", {
    value: !0
});

var Ew = mw(mh), _w = mw(zO), Dw = mw(wM), bw = mw(eS), Ow = mw(HC);

yw.default = function(e) {
    if (void 0 === e && (e = ""), (0, Ew.default)(e)) {
        return e;
    }
    var t = e;
    return "string" != typeof e && (t = (0, _w.default)(e)), (0, Dw.default)(t.replace(/['\u2019]/g, "")).reduce(function(e, t, r) {
        var n = (0, Ow.default)(t);
        return e + (0 === r ? n : (0, bw.default)(n));
    }, "");
};

var Aw = {}, Cw = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Aw, "__esModule", {
    value: !0
});

var Sw = Cw(ih), Mw = ig();

Aw.default = function(e) {
    if (null == e) {
        return 0;
    }
    if ((0, Sw.default)(e)) {
        return e.length;
    }
    var t = (0, Mw.tagName)(e);
    return "[object Map]" === t || "[object Set]" === t ? e.size : Object.keys(e).length;
};

var ww = {};

Object.defineProperty(ww, "__esModule", {
    value: !0
}), ww.default = function(e, t, r) {
    void 0 === t && (t = 1);
    var n = null == e ? 0 : e.length;
    if (!n) {
        return [];
    }
    var o = t;
    if (r || void 0 === o ? o = 1 : o || (o = 0), 0 === o) {
        return [];
    }
    var i = n - o >= 0 ? n - o : 0;
    return e.slice(i);
};

var Fw = {};

Object.defineProperty(Fw, "__esModule", {
    value: !0
}), Fw.default = function(e, t, r) {
    var n = "".concat(e);
    return null == t || null == r ? n : n.replace(t, r);
};

var Pw = {}, Iw = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, Rw = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
}, Tw = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Pw, "__esModule", {
    value: !0
});

var Lw = Tw(Bh), jw = Tw(Ey);

Pw.default = function(e, t) {
    var r = {};
    if (!e) {
        return {};
    }
    var n = (0, jw.default)(e), o = (0, jw.default)(Object.getPrototypeOf(e));
    return n.push.apply(n, Rw([], Iw(o), !1)), n.forEach(function(n) {
        (t ? t(e[n], n, e) : (0, Lw.default)(e[n])) && (r[n] = e[n]);
    }), r;
};

var Nw = {}, xw = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Nw, "__esModule", {
    value: !0
});

var kw = xw(eS), Bw = xw(zO);

Nw.default = function(e) {
    return (0, kw.default)((0, Bw.default)(e).toLowerCase());
};

var $w = {}, Hw = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty($w, "__esModule", {
    value: !0
});

var Uw = Hw(Pg);

$w.default = function(e, t) {
    var r = "function" == typeof t ? t : void 0;
    return (0, Uw.default)(e, 5, r, void 0, void 0, void 0);
};

var Gw = {}, Vw = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Gw, "__esModule", {
    value: !0
});

var Ww = Vw(zO), zw = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
}, Jw = /[&<>"']/g;

Gw.default = function(e) {
    return (0, Ww.default)(e).replace(Jw, function(e) {
        return zw[e];
    });
};

var Kw = {}, qw = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Kw, "__esModule", {
    value: !0
});

var Xw = qw(zO), Yw = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'"
}, Zw = /&(?:amp|lt|gt|quot|#(0+)?39);/g;

Kw.default = function(e) {
    return (0, Xw.default)(e).replace(Zw, function(e) {
        var t;
        return null !== (t = Yw[e]) && void 0 !== t ? t : "'";
    });
};

var Qw = {}, eF = {};

Object.defineProperty(eF, "__esModule", {
    value: !0
});

eF.default = /<%=([\s\S]+?)%>/g;

var tF = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Qw, "__esModule", {
    value: !0
});

var rF = tF(eF), nF = tF(Gw), oF = {
    escape: /<%-([\s\S]+?)%>/g,
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: rF.default,
    variable: "",
    imports: {
        _: {
            escape: nF.default
        }
    }
};

Qw.default = oF;

var iF = {}, aF = g && g.__assign || function() {
    return aF = Object.assign || function(e) {
        for (var t, r = 1, n = arguments.length; r < n; r++) {
            for (var o in t = arguments[r]) {
                Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            }
        }
        return e;
    }, aF.apply(this, arguments);
}, uF = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(iF, "__esModule", {
    value: !0
});

var sF = uF(Qw), lF = uF(zO), cF = uF(eF), fF = uF(SO), dF = "Invalid `variable` settings for template function", pF = /\b__p \+= '';/g, vF = /\b(__p \+=) '' \+/g, hF = /(__e\(.*?\)|\b__t\)) \+\n'';/g, gF = /[()=,{}[\]/\s]/, yF = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, mF = /($^)/, EF = /['\n\r\u2028\u2029\\]/g, _F = {
    "\\": "\\",
    "'": "'",
    "\n": "n",
    "\r": "r",
    "\u2028": "u2028",
    "\u2029": "u2029"
};

function DF(e) {
    return "\\".concat(_F[e]);
}

var bF = Object.prototype.hasOwnProperty;

iF.default = function(e, t, r) {
    var n = sF.default.imports._.templateSettings || sF.default, o = t;
    r && r[o] === e && (o = void 0);
    var i, a = (0, lF.default)(e), u = (0, fF.default)({}, n, o), s = u.imports, l = bF.call(u, "sourceURL") ? "//# sourceURL=".concat("".concat(u.sourceURL).replace(/\s/g, " "), "\n") : "", c = function(e) {
        var t = e.templateString, r = e.mergedOptions, n = r.variable || "obj";
        if (gF.test(n)) {
            throw new Error(dF);
        }
        var o, i, a = r.interpolate || mF, u = 0, s = "__p += '", l = RegExp("".concat((r.escape || mF).source, "|").concat(a.source, "|").concat((a === cF.default ? yF : mF).source, "|").concat((r.evaluate || mF).source, "|$"), "g");
        return t.replace(l, function(e, r, n, a, l, c) {
            var f = n || a;
            return s += t.slice(u, c).replace(EF, DF), r && (i = !0, s += "' +\n__e(".concat(r, ") +\n'")), 
            l && (o = !0, s += "';\n".concat(l, ";\n__p += '")), f && (s += "' +\n((__t = (".concat(f, ")) == null ? '' : __t) +\n'")), 
            u = c + e.length, e;
        }), s += "';\n", s = (o ? s.replace(pF, "") : s).replace(vF, "$1").replace(hF, "$1;"), 
        s = "function (".concat(n, " = {}) {\nlet __t, __p = '' , _ = ").concat(n, "['_']\n  ").concat(i ? ", __e = _.escape" : "").concat(o ? ", __join = Array.prototype.join;\nfunction print() { __p += __join.call(arguments, '') }\n" : "", ";with(").concat(n, "){\n").concat(s, "}\nreturn __p\n}"), 
        s;
    }({
        templateString: a,
        mergedOptions: u
    });
    try {
        var f = Function("".concat(l, "return ").concat(c))();
        i = function(e) {
            void 0 === e && (e = {});
            var t = aF(aF({}, s), e);
            return null == f ? void 0 : f.call(this, t);
        };
    } catch (e) {
        i = e;
    }
    if (i.source = c, i instanceof Error) {
        throw i;
    }
    return i;
};

var OF = {}, AF = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, CF = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
}, SF = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(OF, "__esModule", {
    value: !0
});

var MF = Km, wF = SF(C_);

OF.default = function(e) {
    for (var t = [], r = 1; r < arguments.length; r++) {
        t[r - 1] = arguments[r];
    }
    var n, o = t, i = t.length, a = t[i - 1];
    return Array.isArray(a) || (o = t.slice(0, i - 1), n = t[i - 1]), (o = o.filter(function(e) {
        return (0, wF.default)(e);
    })).length && (o = o.reduce(function(e, t) {
        return CF(CF([], AF(e), !1), AF(t), !1);
    })), (0, MF.baseDifference)(e, o, n, void 0);
};

var FF = {};

Object.defineProperty(FF, "__esModule", {
    value: !0
}), FF.default = function(e, t) {
    var r = {};
    if (null == e) {
        return r;
    }
    var n = t;
    for (var o in null == n ? n = function() {
        return !0;
    } : "function" != typeof n && (n = function() {
        return !1;
    }), e) {
        n(e[o], o) || (r[o] = e[o]);
    }
    for (var i = Object.getOwnPropertySymbols(e), a = Object.getPrototypeOf(e), u = function(e) {
        return a.propertyIsEnumerable.call(a, e);
    }; a; ) {
        i = i.concat(Object.getOwnPropertySymbols(a).filter(u)), a = Object.getPrototypeOf(a);
    }
    return i.forEach(function(t) {
        n(e[t], t) || (r[t] = e[t]);
    }), r;
};

var PF = {}, IF = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, RF = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
};

Object.defineProperty(PF, "__esModule", {
    value: !0
});

var TF = Symbol("placeholder");

function LF(e, t) {
    void 0 === t && (t = e.length);
    var r = parseInt(t, 10);
    r = Number.isNaN(r) ? 0 : Math.floor(r);
    var n = LF.placeholder;
    function o() {
        for (var t = [], o = 0; o < arguments.length; o++) {
            t[o] = arguments[o];
        }
        var i = RF([], IF(t), !1), a = jF(i, n), u = i.length - a.length;
        return this && Object.setPrototypeOf(this, e.prototype), u < r ? NF(e, r - u, i, a, n) : e.apply(this, i);
    }
    return o.placeholder = n, o;
}

function jF(e, t) {
    var r = [];
    return e.forEach(function(e, n) {
        e === t && r.push(n);
    }), r;
}

function NF(e, t, r, n, o) {
    function i() {
        for (var i = [], a = 0; a < arguments.length; a++) {
            i[a] = arguments[a];
        }
        var u = RF([], IF(i), !1), s = jF(u, o).length, l = function(e, t, r) {
            for (var n = -1, o = -1, i = Math.max(r.length - t.length, 0), a = new Array(e.length + i); ++n < e.length; ) {
                a[n] = e[n];
            }
            for (;++o < t.length && o < r.length; ) {
                a[t[o]] = r[o];
            }
            for (;i--; ) {
                a[n++] = r[o++];
            }
            return a;
        }(r, n, u), c = jF(l, o), f = u.length - s;
        return f < t ? NF(e, t - f, l, c, o) : e.apply(this, l);
    }
    return i.placeholder = o, i;
}

LF.placeholder = TF, PF.default = LF;

var xF = {};

Object.defineProperty(xF, "__esModule", {
    value: !0
}), xF.default = function(e, t) {
    return (null == e ? void 0 : e.length) ? e.map(function(e) {
        return "function" == typeof t ? t(e) : e[t];
    }).reduce(function(e, t) {
        return e + t;
    }) / e.length : NaN;
};

var kF = {}, BF = g && g.__values || function(e) {
    var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], n = 0;
    if (r) {
        return r.call(e);
    }
    if (e && "number" == typeof e.length) {
        return {
            next: function() {
                return e && n >= e.length && (e = void 0), {
                    value: e && e[n++],
                    done: !e
                };
            }
        };
    }
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

Object.defineProperty(kF, "__esModule", {
    value: !0
});

var $F = rg();

kF.default = function(e, t, r) {
    var n, o;
    void 0 === t && (t = []);
    var i, a = (0, $F.getObjValidPathFromGeneralPath)(e, t), u = e;
    try {
        for (var s = BF(a), l = s.next(); !l.done; l = s.next()) {
            if ("function" == typeof (i = u[l.value]) && (i = i.call(u)), null == i) {
                break;
            }
            u = i;
        }
    } catch (e) {
        n = {
            error: e
        };
    } finally {
        try {
            l && !l.done && (o = s.return) && o.call(s);
        } finally {
            if (n) {
                throw n.error;
            }
        }
    }
    return null == i ? "function" == typeof r ? r.call(u) : r : i;
};

var HF = {}, UF = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(HF, "__esModule", {
    value: !0
});

var GF = UF(ih);

HF.default = function() {
    for (var e = [], t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
    }
    if (!(0, GF.default)(e) && "string" != typeof e) {
        return [];
    }
    for (var r = [], n = function(e) {
        var t = 0;
        return e.forEach(function(e) {
            (0, GF.default)(e) && "string" != typeof e && e.length > t && (t = e.length);
        }), t;
    }(e), o = function(t) {
        var n = [];
        e.forEach(function(e) {
            (0, GF.default)(e) && "string" != typeof e && n.push(e[t]);
        }), r.push(n);
    }, i = 0; i < n; i++) {
        o(i);
    }
    return r;
};

var VF = {}, WF = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(VF, "__esModule", {
    value: !0
});

var zF = Km, JF = __, KF = WF(C_);

VF.default = function(e) {
    for (var t, r = [], n = 1; n < arguments.length; n++) {
        r[n - 1] = arguments[n];
    }
    var o = r, i = r.length, a = r[i - 1];
    return "function" == typeof a && (t = a, o = r.slice(0, i - 1)), (0, zF.baseDifference)(e, (0, 
    JF.baseFlatten)(o, 1, KF.default, !0, void 0), void 0, t);
};

var qF = {}, XF = g && g.__values || function(e) {
    var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], n = 0;
    if (r) {
        return r.call(e);
    }
    if (e && "number" == typeof e.length) {
        return {
            next: function() {
                return e && n >= e.length && (e = void 0), {
                    value: e && e[n++],
                    done: !e
                };
            }
        };
    }
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

Object.defineProperty(qF, "__esModule", {
    value: !0
});

qF.default = function(e) {
    var t, r;
    if (!Array.isArray(e)) {
        return [];
    }
    for (var n = [], o = function(e) {
        var t, r, n = 0;
        try {
            for (var o = XF(e), i = o.next(); !i.done; i = o.next()) {
                var a = i.value;
                Array.isArray(a) && a.length > n && (n = a.length);
            }
        } catch (e) {
            t = {
                error: e
            };
        } finally {
            try {
                i && !i.done && (r = o.return) && r.call(o);
            } finally {
                if (t) {
                    throw t.error;
                }
            }
        }
        return n;
    }(e), i = 0; i < o; i++) {
        var a = [];
        try {
            for (var u = (t = void 0, XF(e)), s = u.next(); !s.done; s = u.next()) {
                var l = s.value;
                Array.isArray(l) && a.push(l[i]);
            }
        } catch (e) {
            t = {
                error: e
            };
        } finally {
            try {
                s && !s.done && (r = u.return) && r.call(u);
            } finally {
                if (t) {
                    throw t.error;
                }
            }
        }
        n.push(a);
    }
    return n;
};

var YF = {};

Object.defineProperty(YF, "__esModule", {
    value: !0
}), YF.default = function(e, t) {
    try {
        return Number.parseInt(e, t);
    } catch (e) {
        return Number.NaN;
    }
};

var ZF = {}, QF = g && g.__values || function(e) {
    var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], n = 0;
    if (r) {
        return r.call(e);
    }
    if (e && "number" == typeof e.length) {
        return {
            next: function() {
                return e && n >= e.length && (e = void 0), {
                    value: e && e[n++],
                    done: !e
                };
            }
        };
    }
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

Object.defineProperty(ZF, "__esModule", {
    value: !0
});

var eP = rg();

ZF.default = function(e, t) {
    var r, n;
    if (null == e || null == t) {
        return !0;
    }
    var o = (0, eP.getObjValidPathFromGeneralPath)(e, t);
    if (!o.length) {
        return !0;
    }
    var i = e;
    try {
        for (var a = QF(o.splice(0, o.length - 1)), u = a.next(); !u.done; u = a.next()) {
            if (null == (i = i[u.value])) {
                break;
            }
        }
    } catch (e) {
        r = {
            error: e
        };
    } finally {
        try {
            u && !u.done && (n = a.return) && n.call(a);
        } finally {
            if (r) {
                throw r.error;
            }
        }
    }
    if (null == i) {
        return !0;
    }
    try {
        return delete i[o.pop()];
    } catch (e) {
        return !1;
    }
};

var tP = {};

Object.defineProperty(tP, "__esModule", {
    value: !0
});

var rP = Nv, nP = rg();

tP.default = function(e, t, r, n) {
    if (null == e) {
        return e;
    }
    var o = (0, nP.getObjValidPathFromGeneralPath)(e, t);
    if (0 === o.length) {
        return e;
    }
    for (var i = e, a = 0; a < o.length - 1; a++) {
        if ("object" != typeof i) {
            return e;
        }
        var u = o[a], s = i[u], l = "function" == typeof n ? n(s, u, i) : void 0;
        null == l && (l = null == s ? (0, rP.isIndex)(o[a + 1]) ? [] : {} : s), i[u] = l, 
        i = l;
    }
    if ("object" != typeof i) {
        return e;
    }
    var c = o[o.length - 1], f = "function" == typeof r ? r(i[c]) : void 0;
    return i[c] = f, e;
};

var oP = {}, iP = {}, aP = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, uP = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
};

Object.defineProperty(iP, "__esModule", {
    value: !0
}), iP.needDeeperCompare = void 0;

var sP = ig(), lP = Array.isArray;

function cP(e) {
    return "object" == typeof e && null !== e;
}

function fP(e, t) {
    return cP(e) && cP(t);
}

iP.needDeeperCompare = fP, iP.default = function e(t, r) {
    var n = function(e, t) {
        var r = Object.fromEntries, n = e, o = (0, sP.tagName)(e);
        lP(e) || "[object Set]" === o ? n = uP([], aP(e), !1) : "[object Map]" === o && (n = r(e.entries()));
        var i = t, a = (0, sP.tagName)(t);
        return "[object Set]" === a ? i = uP([], aP(t), !1) : "[object Map]" === a && (i = r(t.entries())), 
        {
            obj: n,
            source: i
        };
    }(t, r), o = n.obj, i = n.source, a = null == o ? [] : (0, sP.getObjectKeysWithProtoChain)(o), u = null == i ? [] : Object.keys(i);
    if (lP(o) && lP(i)) {
        for (var s = function(t, r) {
            var n = u[t], a = i[n], s = o.findIndex(function(t) {
                return cP(a) ? e(t, a) : t === a;
            });
            return -1 !== s ? (o.splice(s, 1), "continue") : {
                value: !1
            };
        }, l = 0, c = u.length; l < c; l++) {
            var f = s(l);
            if ("object" == typeof f) {
                return f.value;
            }
        }
        return !0;
    }
    for (var d = Number.isNaN, p = (l = 0, u.length); l < p; l++) {
        var v = u[l];
        if (!a.includes(v)) {
            return !1;
        }
        var h = o[v], g = i[v];
        if (fP(h, g)) {
            if (!e(h, g)) {
                return !1;
            }
        } else {
            if (d(g) && d(o)) {
                continue;
            }
            if (h !== g) {
                return !1;
            }
        }
    }
    return !0;
};

var dP = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(oP, "__esModule", {
    value: !0
});

var pP = dP(iP), vP = dP(Am);

oP.default = function(e) {
    var t = (0, vP.default)(e);
    return function(e) {
        return (0, pP.default)(e, t);
    };
};

var hP = {}, gP = g && g.__createBinding || (Object.create ? function(e, t, r, n) {
    void 0 === n && (n = r);
    var o = Object.getOwnPropertyDescriptor(t, r);
    o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
        enumerable: !0,
        get: function() {
            return t[r];
        }
    }), Object.defineProperty(e, n, o);
} : function(e, t, r, n) {
    void 0 === n && (n = r), e[n] = t[r];
}), yP = g && g.__setModuleDefault || (Object.create ? function(e, t) {
    Object.defineProperty(e, "default", {
        enumerable: !0,
        value: t
    });
} : function(e, t) {
    e.default = t;
}), mP = g && g.__importStar || function(e) {
    if (e && e.__esModule) {
        return e;
    }
    var t = {};
    if (null != e) {
        for (var r in e) {
            "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && gP(t, e, r);
        }
    }
    return yP(t, e), t;
}, EP = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(hP, "__esModule", {
    value: !0
});

var _P = EP(ng()), DP = mP(iP), bP = rg(), OP = EP(Am), AP = ig();

hP.default = function(e, t) {
    var r = (0, OP.default)(t);
    return function(t) {
        var n = (0, bP.getObjValidPathFromGeneralPath)(t, e), o = n.slice(0, n.length - 1), i = o.length ? (0, 
        _P.default)(t, o) : t, a = n[n.length - 1] || "";
        if (null == i) {
            return !1;
        }
        if ("[object Object]" === (0, AP.tagName)(i) && !(a in i)) {
            return !1;
        }
        i = i[a];
        var u = typeof r;
        return (0, DP.needDeeperCompare)(i, r) || "function" === u ? (0, DP.default)(i, r) : i === r;
    };
};

var CP = {}, SP = g && g.__values || function(e) {
    var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], n = 0;
    if (r) {
        return r.call(e);
    }
    if (e && "number" == typeof e.length) {
        return {
            next: function() {
                return e && n >= e.length && (e = void 0), {
                    value: e && e[n++],
                    done: !e
                };
            }
        };
    }
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, MP = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(CP, "__esModule", {
    value: !0
});

var wP = ig(), FP = MP(oP), PP = MP(ng()), IP = MP(hP), RP = MP(oh), TP = MP(Bh);

CP.default = function(e, t) {
    var r, n, o = Array.isArray(e) ? e : (0, RP.default)(e), i = typeof t, a = null == t ? TP.default : function() {
        return !0;
    };
    "function" === i ? a = t : "string" === i ? a = function(e) {
        return (0, PP.default)(e, t);
    } : "[object Object]" === (0, wP.tagName)(t) ? a = (0, FP.default)(t) : Array.isArray(t) && (a = (0, 
    IP.default)(t[0], t[1]));
    try {
        for (var u = SP(o), s = u.next(); !s.done; s = u.next()) {
            if (!a(s.value)) {
                return !1;
            }
        }
    } catch (e) {
        r = {
            error: e
        };
    } finally {
        try {
            s && !s.done && (n = u.return) && n.call(u);
        } finally {
            if (r) {
                throw r.error;
            }
        }
    }
    return !0;
};

var LP = {}, jP = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, NP = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
}, xP = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(LP, "__esModule", {
    value: !0
});

var kP = xP(bD);

LP.default = function() {
    for (var e = [], t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
    }
    var r = (0, kP.default)(e);
    return function() {
        for (var e = [], t = 0; t < arguments.length; t++) {
            e[t] = arguments[t];
        }
        var n = NP([], jP(e), !1);
        return r.forEach(function(e) {
            n = [ e.apply(void 0, NP([], jP(n), !1)) ];
        }), n[0];
    };
};

var BP = {}, $P = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, HP = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
}, UP = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(BP, "__esModule", {
    value: !0
});

var GP = UP(iS);

BP.default = function() {
    for (var e = [], t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
    }
    return GP.default.apply(void 0, HP([], $P(e), !1));
};

var VP = {}, WP = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(VP, "__esModule", {
    value: !0
});

var zP = WP(Lb), JP = WP(wC);

VP.default = function(e, t) {
    return void 0 === t && (t = 1), (0, zP.default)(e) ? [] : (0, JP.default)(e, 0, t < 0 ? 0 : t);
};

var KP = {}, qP = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, XP = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
}, YP = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(KP, "__esModule", {
    value: !0
});

var ZP = ig(), QP = YP(oh);

KP.default = function(e, t) {
    var r = (0, ZP.tagName)(e);
    if ("[object Map]" === r) {
        return Array.from(e.entries());
    }
    var n = [], o = [];
    return "[object Set]" === r ? n = (o = XP([], qP(e), !1)).map(function(e, t) {
        return t + 1;
    }) : (n = t ? (0, ZP.getObjectKeysWithProtoChain)(e) : (0, QP.default)(e), o = n.map(function(t) {
        return e[t];
    })), n.map(function(e, t) {
        return [ e, o[t] ];
    });
};

var eI = {};

Object.defineProperty(eI, "__esModule", {
    value: !0
}), eI.default = function(e) {
    var t = {};
    return Array.isArray(e) ? (e.forEach(function(e) {
        null != e && (t[e[0]] = e[1]);
    }), t) : t;
};

var tI = {}, rI = {}, nI = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(rI, "__esModule", {
    value: !0
});

var oI = nI(xv);

rI.default = function(e) {
    return "[object RegExp]" === (0, oI.default)(e);
};

var iI = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(tI, "__esModule", {
    value: !0
});

var aI = iI(mh), uI = iI(zO), sI = iI(rI), lI = iI(FD), cI = iI(k_), fI = iI(UD), dI = {
    length: 30,
    omission: "..."
};

function pI(e) {
    var t = {};
    return function(e, t) {
        (0, fI.default)(e, "omission") ? t.omission = e.omission : t.omission = dI.omission, 
        (0, fI.default)(e, "length") ? t.length = e.length : t.length = dI.length, (0, fI.default)(e, "separator") && (t.separator = e.separator);
    }(e, t), null === t.omission && (t.omission = "null"), void 0 === t.omission && (t.omission = "undefined"), 
    void 0 === t.length && (t.length = dI.length), t.length = (0, cI.default)(t.length), 
    t.length < 0 && (t.length = 0), t;
}

tI.default = function(e, t) {
    void 0 === e && (e = "");
    var r = (0, aI.default)(t) ? dI : t;
    r = pI(r);
    var n = (0, uI.default)(e);
    if (n.length <= r.length) {
        return e;
    }
    var o = n.substring(0, r.length), i = function(e, t) {
        var r = e.length;
        if (!(0, aI.default)(t.separator)) {
            var n = (0, lI.default)(t.separator) ? RegExp(t.separator) : t.separator;
            (0, sI.default)(n) || (n = RegExp((0, uI.default)(t.separator))), n.global || (n = RegExp(n.source, "g"));
            for (var o = e.matchAll(n), i = o.next(); !i.done; ) {
                r = i.value.index, i = o.next();
            }
        }
        return r;
    }(o, r);
    if (i + r.omission.length > o.length) {
        var a = 2 * o.length - r.omission.length - i;
        return o.substring(0, a) + r.omission;
    }
    return o.substring(0, i) + r.omission;
};

var vI = {};

Object.defineProperty(vI, "__esModule", {
    value: !0
});

var hI = SO, gI = (0, jv.createAssignFunction)(function(e, t, r, n) {
    (0, hI.baseMerge)(e, t, r, n);
});

vI.default = gI;

var yI = {}, mI = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(yI, "__esModule", {
    value: !0
});

var EI = mI(eI), _I = mI(VP), DI = mI(HF);

yI.default = function(e, t) {
    return void 0 === e && (e = []), void 0 === t && (t = []), (0, EI.default)((0, DI.default)(e, (0, 
    _I.default)(t, e.length)));
};

var bI = {}, OI = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, AI = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
}, CI = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(bI, "__esModule", {
    value: !0
});

var SI = CI(ng()), MI = rg();

bI.default = function(e, t) {
    for (var r, n = [], o = 2; o < arguments.length; o++) {
        n[o - 2] = arguments[o];
    }
    var i = (0, MI.getObjValidPathFromGeneralPath)(e, t), a = i.length, u = i[a - 1], s = a > 1 ? (0, 
    SI.default)(e, i.slice(0, a - 1)) : e;
    return null == s || null === (r = s[u]) || void 0 === r ? void 0 : r.call.apply(r, AI([ s ], OI(n), !1));
};

var wI = {}, FI = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(wI, "__esModule", {
    value: !0
});

var PI = FI(mh), II = FI(zO), RI = FI(wM), TI = FI(WC);

wI.default = function(e) {
    if (void 0 === e && (e = ""), (0, PI.default)(e)) {
        return e;
    }
    var t = e;
    return "string" != typeof e && (t = (0, II.default)(e)), (0, RI.default)(t.replace(/['\u2019]/g, "")).reduce(function(e, t, r) {
        var n = (0, TI.default)(t);
        return e + (0 === r ? n : " ".concat(n));
    }, "");
};

var LI = {}, jI = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(LI, "__esModule", {
    value: !0
});

var NI = ig(), xI = jI(oP), kI = jI(ng()), BI = jI(hP), $I = jI(oh), HI = jI(Bh);

LI.default = function(e, t) {
    var r = Array.isArray(e) ? e : (0, $I.default)(e), n = typeof t, o = null == t ? HI.default : function() {
        return !0;
    };
    "function" === n ? o = t : "string" === n ? o = function(e) {
        return (0, kI.default)(e, t);
    } : "[object Object]" === (0, NI.tagName)(t) ? o = (0, xI.default)(t) : Array.isArray(t) && (o = (0, 
    BI.default)(t[0], t[1]));
    for (var i = 0; i < r.length; i++) {
        if (o(r[i])) {
            return !0;
        }
    }
    return !1;
};

var UI = {}, GI = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(UI, "__esModule", {
    value: !0
});

var VI = jv, WI = Xv, zI = GI(oh), JI = (0, VI.createAssignFunction)(function(e, t, r, n) {
    (0, WI.copyObject)(t, (0, zI.default)(t), e, n);
});

UI.default = JI;

var KI = {}, qI = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(KI, "__esModule", {
    value: !0
});

var XI = ig(), YI = qI(hP), ZI = qI(og()), QI = qI(oh), eR = qI(oP);

KI.default = function(e, t) {
    if (null != e) {
        var r = (0, QI.default)(e), n = function() {
            return !1;
        }, o = typeof t, i = (0, XI.tagName)(t);
        "function" === o ? n = t : Array.isArray(t) ? n = (0, YI.default)(t[0], t[1]) : "[object Object]" === i ? n = (0, 
        eR.default)(t) : "string" === o && (n = (0, ZI.default)(t));
        for (var a = 0, u = r.length; a < u; a++) {
            var s = r[a];
            if (Boolean(n(e[s], s, e))) {
                return s;
            }
        }
    }
};

var tR = {}, rR = g && g.__values || function(e) {
    var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], n = 0;
    if (r) {
        return r.call(e);
    }
    if (e && "number" == typeof e.length) {
        return {
            next: function() {
                return e && n >= e.length && (e = void 0), {
                    value: e && e[n++],
                    done: !e
                };
            }
        };
    }
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, nR = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(tR, "__esModule", {
    value: !0
});

var oR = nR(Lb), iR = nR(fO), aR = nR(og());

tR.default = function(e, t) {
    var r, n;
    if ((0, oR.default)(e)) {
        return 0;
    }
    var o = 0, i = (0, iR.default)(t) ? t : (0, aR.default)(t);
    try {
        for (var a = rR(e), u = a.next(); !u.done; u = a.next()) {
            var s = i(u.value);
            void 0 !== s && (o += s);
        }
    } catch (e) {
        r = {
            error: e
        };
    } finally {
        try {
            u && !u.done && (n = a.return) && n.call(a);
        } finally {
            if (r) {
                throw r.error;
            }
        }
    }
    return o;
};

var uR = {}, sR = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(uR, "__esModule", {
    value: !0
});

var lR = sR(hM), cR = sR(C_), fR = sR(_O), dR = sR(bD), pR = sR(QC);

uR.default = function() {
    for (var e = [], t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
    }
    var r = (0, fR.default)(e);
    return (0, cR.default)(r) ? (0, pR.default)((0, dR.default)(e)) : (e.pop(), (0, 
    lR.default)((0, dR.default)(e), r));
};

var vR = {}, hR = g && g.__values || function(e) {
    var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], n = 0;
    if (r) {
        return r.call(e);
    }
    if (e && "number" == typeof e.length) {
        return {
            next: function() {
                return e && n >= e.length && (e = void 0), {
                    value: e && e[n++],
                    done: !e
                };
            }
        };
    }
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, gR = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(vR, "__esModule", {
    value: !0
});

var yR = gR(Lb);

vR.default = function(e, t) {
    var r, n;
    if ((0, yR.default)(e)) {
        return [];
    }
    var o = [], i = "function" == typeof t ? t : void 0, a = function(e) {
        if (o.some(function(t) {
            return i(t, e);
        })) {
            return "continue";
        }
        o.push(e);
    };
    try {
        for (var u = hR(e), s = u.next(); !s.done; s = u.next()) {
            a(s.value);
        }
    } catch (e) {
        r = {
            error: e
        };
    } finally {
        try {
            s && !s.done && (n = u.return) && n.call(u);
        } finally {
            if (r) {
                throw r.error;
            }
        }
    }
    return o;
};

var mR = {}, ER = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, _R = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
}, DR = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(mR, "__esModule", {
    value: !0
});

var bR = Nv, OR = DR(jh);

function AR(e, t, r) {
    return -1 !== e.findIndex(function(e) {
        return r(t, e);
    });
}

var CR = function(e, t) {
    return e === t || (0, OR.default)(e) && (0, OR.default)(t);
};

mR.default = function() {
    for (var e = [], t = 0; t < arguments.length; t++) {
        e[t] = arguments[t];
    }
    var r = e.length, n = e[r - 1], o = e, i = CR;
    "function" == typeof n && r > 1 && (i = n, o = e.slice(0, r - 1));
    var a = [], u = Array.isArray;
    if (-1 !== o.findIndex(function(e) {
        return !u(e) && !(0, bR.isArguments)(e);
    })) {
        return a;
    }
    o = o.map(function(e) {
        return _R([], ER(e), !1);
    }), i === CR && (o = o.map(function(e) {
        return e.map(function(e) {
            return 0 === e ? 0 : e;
        });
    }));
    var s = o[0] || [];
    return r = o.length, s.forEach(function(e) {
        if (!AR(a, e, i)) {
            for (var t = 1; t < r; t++) {
                if (!AR(o[t], e, i)) {
                    return;
                }
            }
            a.push(e);
        }
    }), a;
};

var SR = {}, MR = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(SR, "__esModule", {
    value: !0
});

var wR = MR(bD), FR = MR(Bh), PR = MR(og()), IR = MR(oh);

SR.default = function(e, t) {
    var r = FR.default, n = typeof t;
    "function" === n ? r = t : "string" === n && (r = (0, PR.default)(t));
    var o = (0, IR.default)(e);
    return (0, wR.default)(o.map(function(t) {
        return r(e[t], t, e);
    }));
};

var RR = {}, TR = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(RR, "__esModule", {
    value: !0
});

var LR = TR(oh), jR = ig();

RR.default = function(e, t) {
    var r = (0, jR.getRealIterateeWithIdentityDefault)(t), n = (0, LR.default)(e), o = {};
    return n.forEach(function(t) {
        var n = e[t];
        o[r(n, t, e)] = n;
    }), o;
};

var NR = {}, xR = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(NR, "__esModule", {
    value: !0
});

var kR = ig(), BR = xR(oh);

NR.default = function(e, t) {
    var r = (0, kR.getRealIterateeWithIdentityDefault)(t), n = (0, BR.default)(e), o = {};
    return n.forEach(function(t) {
        o[t] = r(e[t], t, e);
    }), o;
};

var $R = {}, HR = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty($R, "__esModule", {
    value: !0
});

var UR = HR(TO), GR = ig();

$R.default = function(e, t) {
    return (0, UR.default)(e, (0, GR.getRealIterateeWithIdentityDefault)(t));
};

var VR = {}, WR = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(VR, "__esModule", {
    value: !0
});

var zR = Nv, JR = WR(Zg), KR = WR(ih), qR = WR(Ug);

VR.default = function(e, t, r) {
    var n = t, o = r;
    if (r && "number" != typeof r && function(e, t, r) {
        if (!(0, qR.default)(r)) {
            return !1;
        }
        var n = typeof t;
        if ("number" === n ? (0, KR.default)(r) && (0, zR.isIndex)(t, r.length) : "string" === n && t in r) {
            return (0, JR.default)(r[t], e);
        }
        return !1;
    }(e, t, r) && (n = void 0, o = void 0), !(o = void 0 === o ? 4294967295 : o >>> 0)) {
        return [];
    }
    var i = e;
    return null == e && (i = ""), i.split(n, o);
};

var XR = {}, YR = g && g.__read || function(e, t) {
    var r = "function" == typeof Symbol && e[Symbol.iterator];
    if (!r) {
        return e;
    }
    var n, o, i = r.call(e), a = [];
    try {
        for (;(void 0 === t || t-- > 0) && !(n = i.next()).done; ) {
            a.push(n.value);
        }
    } catch (e) {
        o = {
            error: e
        };
    } finally {
        try {
            n && !n.done && (r = i.return) && r.call(i);
        } finally {
            if (o) {
                throw o.error;
            }
        }
    }
    return a;
}, ZR = g && g.__spreadArray || function(e, t, r) {
    if (r || 2 === arguments.length) {
        for (var n, o = 0, i = t.length; o < i; o++) {
            !n && o in t || (n || (n = Array.prototype.slice.call(t, 0, o)), n[o] = t[o]);
        }
    }
    return e.concat(n || Array.prototype.slice.call(t));
}, QR = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(XR, "__esModule", {
    value: !0
});

var eT = QR(sb), tT = ig();

XR.default = function(e) {
    return null == e ? [] : "[object Map]" === (0, tT.tagName)(e) ? ZR([], YR(e.keys()), !1).map(function(t) {
        return [ t, e.get(t) ];
    }) : e[Symbol.iterator] === Array.prototype[Symbol.iterator] ? (0, eT.default)(ZR([], YR(e), !1)) : (0, 
    eT.default)(e);
};

var rT = {}, nT = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(rT, "__esModule", {
    value: !0
});

var oT = nT(xv);

rT.default = function(e) {
    return "[object RegExp]" === (0, oT.default)(e);
};

var iT = {};

Object.defineProperty(iT, "__esModule", {
    value: !0
}), iT.default = function(e) {
    return Number.isSafeInteger(e);
};

var aT = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(Lv, "__esModule", {
    value: !0
}), Lv.isObject = Lv.isNumber = Lv.isNull = Lv.isNil = Lv.isFunction = Lv.isFinite = Lv.isEqual = Lv.isEmpty = Lv.isDate = Lv.isBuffer = Lv.isBoolean = Lv.isArrayLikeObject = Lv.isArrayLike = Lv.isArray = Lv.invert = Lv.intersection = Lv.indexOf = Lv.includes = Lv.head = Lv.has = Lv.groupBy = Lv.forIn = Lv.forEach = Lv.floor = Lv.flattenDeep = Lv.flatten = Lv.findLastIndex = Lv.findIndex = Lv.find = Lv.filter = Lv.eq = Lv.each = Lv.endsWith = Lv.dropRight = Lv.drop = Lv.divide = Lv.difference = Lv.defaultTo = Lv.debounce = Lv.concat = Lv.compact = Lv.cloneDeep = Lv.clone = Lv.clamp = Lv.chunk = Lv.ceil = Lv.castArray = Lv.extend = Lv.assignIn = Lv.assign = void 0, 
Lv.uniqueId = Lv.union = Lv.upperFirst = Lv.uniq = Lv.trimStart = Lv.trimEnd = Lv.trim = Lv.toUpper = Lv.toString = Lv.toNumber = Lv.toLower = Lv.throttle = Lv.sum = Lv.startsWith = Lv.sortBy = Lv.slice = Lv.set = Lv.round = Lv.reverse = Lv.remove = Lv.reduce = Lv.range = Lv.pullAt = Lv.pull = Lv.pick = Lv.padStart = Lv.padEnd = Lv.orderBy = Lv.omit = Lv.noop = Lv.min = Lv.merge = Lv.max = Lv.map = Lv.lowerFirst = Lv.lastIndexOf = Lv.last = Lv.keysIn = Lv.keys = Lv.join = Lv.isNaN = Lv.isMap = Lv.isInteger = Lv.isUndefined = Lv.isTypedArray = Lv.isSymbol = Lv.isString = Lv.isSafeInteger = Lv.isPlainObject = Lv.isObjectLike = void 0, 
Lv.toPairs = Lv.take = Lv.unionWith = Lv.flow = Lv.every = Lv.matchesProperty = Lv.isMatch = Lv.matches = Lv.updateWith = Lv.unset = Lv.parseInt = Lv.unzip = Lv.differenceWith = Lv.zip = Lv.result = Lv.meanBy = Lv.xorWith = Lv.curry = Lv.omitBy = Lv.differenceBy = Lv.template = Lv.templateSettings = Lv.unescape = Lv.escape = Lv.cloneDeepWith = Lv.capitalize = Lv.pickBy = Lv.replace = Lv.takeRight = Lv.size = Lv.memoize = Lv.identity = Lv.camelCase = Lv.lowerCase = Lv.kebabCase = Lv.snakeCase = Lv.uniqBy = Lv.constant = Lv.stubTrue = Lv.random = Lv.times = Lv.pullAll = Lv.nth = Lv.first = Lv.without = Lv.forOwn = Lv.get = Lv.keyBy = Lv.xor = Lv.values = void 0, 
Lv.isRegExp = Lv.toArray = Lv.split = Lv.minBy = Lv.mapValues = Lv.mapKeys = Lv.flatMap = Lv.intersectionWith = Lv.uniqWith = Lv.unionBy = Lv.sumBy = Lv.property = Lv.findKey = Lv.assignWith = Lv.some = Lv.upperCase = Lv.toFinite = Lv.toInteger = Lv.invoke = Lv.zipObject = Lv.mergeWith = Lv.truncate = Lv.fromPairs = void 0;

var uT = aT(jv);

Lv.assign = uT.default;

var sT = aT(Rh);

Lv.assignIn = sT.default;

var lT = aT(Th);

Lv.castArray = lT.default;

var cT = aT(Lh);

Lv.ceil = cT.default;

var fT = aT(Dg);

Lv.chunk = fT.default;

var dT = aT(Cg);

Lv.clamp = dT.default;

var pT = aT(Fg);

Lv.clone = pT.default;

var vT = aT(Am);

Lv.cloneDeep = vT.default;

var hT = aT(Mm);

Lv.compact = hT.default;

var gT = aT(wm);

Lv.concat = gT.default;

var yT = aT(Im);

Lv.debounce = yT.default;

var mT = aT(zm);

Lv.defaultTo = mT.default;

var ET = aT(Jm);

Lv.difference = ET.default;

var _T = aT(T_);

Lv.divide = _T.default;

var DT = aT(L_);

Lv.drop = DT.default;

var bT = aT(x_);

Lv.dropRight = bT.default;

var OT = aT(X_);

Lv.endsWith = OT.default;

var AT = aT(Y_);

Lv.each = AT.default;

var CT = aT(Zg);

Lv.eq = CT.default;

var ST = aT(oD);

Lv.filter = ST.default;

var MT = aT(fD);

Lv.find = MT.default;

var wT = aT(dD);

Lv.findIndex = wT.default;

var FT = aT(mD);

Lv.findLastIndex = FT.default;

var PT = aT(bD);

Lv.flatten = PT.default;

var IT = aT(wD);

Lv.flattenDeep = IT.default;

var RT = aT(dg);

Lv.floor = RT.default;

var TT = aT(Z_);

Lv.forEach = TT.default;

var LT = aT(ND);

Lv.forIn = LT.default;

var jT = aT(xD);

Lv.groupBy = jT.default;

var NT = aT(UD);

Lv.has = NT.default;

var xT = aT(ab);

Lv.head = xT.default;

var kT = aT(ub);

Lv.includes = kT.default;

var BT = aT(fb);

Lv.indexOf = BT.default;

var $T = aT(mb);

Lv.intersection = $T.default;

var HT = aT(bb);

Lv.invert = HT.default;

var UT = aT(Uh);

Lv.isArray = UT.default;

var GT = aT(ih);

Lv.isArrayLike = GT.default;

var VT = aT(C_);

Lv.isArrayLikeObject = VT.default;

var WT = aT(Cb);

Lv.isBoolean = WT.default;

var zT = aT(Mb);

Lv.isBuffer = zT.default;

var JT = aT(Pb);

Lv.isDate = JT.default;

var KT = aT(Lb);

Lv.isEmpty = KT.default;

var qT = aT(Ub);

Lv.isEqual = qT.default;

var XT = aT(cO);

Lv.isFinite = XT.default;

var YT = aT(fO);

Lv.isFunction = YT.default;

var ZT = aT(mh);

Lv.isNil = ZT.default;

var QT = aT(pO);

Lv.isNull = QT.default;

var eL = aT(vO);

Lv.isNumber = eL.default;

var tL = aT(Ug);

Lv.isObject = tL.default;

var rL = aT(lh);

Lv.isObjectLike = rL.default;

var nL = aT(jb);

Lv.isPlainObject = nL.default;

var oL = aT(FD);

Lv.isString = oL.default;

var iL = aT(ag());

Lv.isSymbol = iL.default;

var aL = aT(sh);

Lv.isTypedArray = aL.default;

var uL = aT(gO);

Lv.isUndefined = uL.default;

var sL = aT(yO);

Lv.isInteger = sL.default;

var lL = aT(mO);

Lv.isMap = lL.default;

var cL = aT(jh);

Lv.isNaN = cL.default;

var fL = aT(EO);

Lv.join = fL.default;

var dL = aT(oh);

Lv.keys = dL.default;

var pL = aT(Hg);

Lv.keysIn = pL.default;

var vL = aT(_O);

Lv.last = vL.default;

var hL = aT(ED);

Lv.lastIndexOf = hL.default;

var gL = aT(DO);

Lv.lowerFirst = gL.default;

var yL = aT(qm);

Lv.map = yL.default;

var mL = aT(bO);

Lv.max = mL.default;

var EL = aT(SO);

Lv.merge = EL.default;

var _L = aT(RO);

Lv.min = _L.default;

var DL = aT($O);

Lv.noop = DL.default;

var bL = aT(HO);

Lv.omit = bL.default;

var OL = aT(CA);

Lv.orderBy = OL.default;

var AL = aT(BA);

Lv.padEnd = AL.default;

var CL = aT(GA);

Lv.padStart = CL.default;

var SL = aT(UO);

Lv.pick = SL.default;

var ML = aT(GO);

Lv.pull = ML.default;

var wL = aT(JA);

Lv.pullAt = wL.default;

var FL = aT(XA);

Lv.range = FL.default;

var PL = aT(QA);

Lv.reduce = PL.default;

var IL = aT(oC);

Lv.remove = IL.default;

var RL = aT(aC);

Lv.reverse = RL.default;

var TL = aT(uC);

Lv.round = TL.default;

var LL = aT(dC);

Lv.set = LL.default;

var jL = aT(wC);

Lv.slice = jL.default;

var NL = aT(FC);

Lv.sortBy = NL.default;

var xL = aT(NC);

Lv.startsWith = xL.default;

var kL = aT(xC);

Lv.sum = kL.default;

var BL = aT(kC);

Lv.throttle = BL.default;

var $L = aT(HC);

Lv.toLower = $L.default;

var HL = aT(Nh);

Lv.toNumber = HL.default;

var UL = aT(zO);

Lv.toString = UL.default;

var GL = aT(WC);

Lv.toUpper = GL.default;

var VL = aT(ug);

Lv.trim = VL.default;

var WL = aT(qC);

Lv.trimEnd = WL.default;

var zL = aT(YC);

Lv.trimStart = zL.default;

var JL = aT(QC);

Lv.uniq = JL.default;

var KL = aT(eS);

Lv.upperFirst = KL.default;

var qL = aT(oS);

Lv.union = qL.default;

var XL = aT(_S);

Lv.uniqueId = XL.default;

var YL = aT(sb);

Lv.values = YL.default;

var ZL = aT(AS);

Lv.xor = ZL.default;

var QL = aT(TS);

Lv.keyBy = QL.default;

var ej = aT(ng());

Lv.get = ej.default;

var tj = aT(LS);

Lv.forOwn = tj.default;

var rj = aT(kS);

Lv.without = rj.default;

var nj = aT(US);

Lv.first = nj.default;

var oj = aT(WS);

Lv.nth = oj.default;

var ij = aT(XS);

Lv.pullAll = ij.default;

var aj = aT(rM);

Lv.times = aj.default;

var uj = aT(uM);

Lv.random = uj.default;

var sj = aT(pM);

Lv.stubTrue = sj.default;

var lj = aT(vM);

Lv.constant = lj.default;

var cj = aT(hM);

Lv.uniqBy = cj.default;

var fj = aT(MM);

Lv.snakeCase = fj.default;

var dj = aT(uw);

Lv.kebabCase = dj.default;

var pj = aT(dw);

Lv.lowerCase = pj.default;

var vj = aT(yw);

Lv.camelCase = vj.default;

var hj = aT(Bh);

Lv.identity = hj.default;

var gj = aT(VD);

Lv.memoize = gj.default;

var yj = aT(Aw);

Lv.size = yj.default;

var mj = aT(ww);

Lv.takeRight = mj.default;

var Ej = aT(Fw);

Lv.replace = Ej.default;

var _j = aT(Pw);

Lv.pickBy = _j.default;

var Dj = aT(Nw);

Lv.capitalize = Dj.default;

var bj = aT($w);

Lv.cloneDeepWith = bj.default;

var Oj = aT(Gw);

Lv.escape = Oj.default;

var Aj = aT(Kw);

Lv.unescape = Aj.default;

var Cj = aT(Qw);

Lv.templateSettings = Cj.default;

var Sj = aT(iF);

Lv.template = Sj.default;

var Mj = aT(OF);

Lv.differenceBy = Mj.default;

var wj = aT(FF);

Lv.omitBy = wj.default;

var Fj = aT(PF);

Lv.curry = Fj.default;

var Pj = aT(CS);

Lv.xorWith = Pj.default;

var Ij = aT(xF);

Lv.meanBy = Ij.default;

var Rj = aT(kF);

Lv.result = Rj.default;

var Tj = aT(HF);

Lv.zip = Tj.default;

var Lj = aT(VF);

Lv.differenceWith = Lj.default;

var jj = aT(qF);

Lv.unzip = jj.default;

var Nj = aT(YF);

Lv.parseInt = Nj.default;

var xj = aT(ZF);

Lv.unset = xj.default;

var kj = aT(tP);

Lv.updateWith = kj.default;

var Bj = aT(oP);

Lv.matches = Bj.default;

var $j = aT(iP);

Lv.isMatch = $j.default;

var Hj = aT(hP);

Lv.matchesProperty = Hj.default;

var Uj = aT(CP);

Lv.every = Uj.default;

var Gj = aT(LP);

Lv.flow = Gj.default;

var Vj = aT(BP);

Lv.unionWith = Vj.default;

var Wj = aT(VP);

Lv.take = Wj.default;

var zj = aT(KP);

Lv.toPairs = zj.default;

var Jj = aT(eI);

Lv.fromPairs = Jj.default;

var Kj = aT(tI);

Lv.truncate = Kj.default;

var qj = aT(vI);

Lv.mergeWith = qj.default;

var Xj = aT(yI);

Lv.zipObject = Xj.default;

var Yj = aT(bI);

Lv.invoke = Yj.default;

var Zj = aT(k_);

Lv.toInteger = Zj.default;

var Qj = aT(B_);

Lv.toFinite = Qj.default;

var eN = aT(wI);

Lv.upperCase = eN.default;

var tN = aT(LI);

Lv.some = tN.default;

var rN = aT(UI);

Lv.assignWith = rN.default;

var nN = aT(KI);

Lv.findKey = nN.default;

var oN = aT(og());

Lv.property = oN.default;

var iN = aT(tR);

Lv.sumBy = iN.default;

var aN = aT(uR);

Lv.unionBy = aN.default;

var uN = aT(vR);

Lv.uniqWith = uN.default;

var sN = aT(mR);

Lv.intersectionWith = sN.default;

var lN = aT(SR);

Lv.flatMap = lN.default;

var cN = aT(RR);

Lv.mapKeys = cN.default;

var fN = aT(NR);

Lv.mapValues = fN.default;

var dN = aT($R);

Lv.minBy = dN.default;

var pN = aT(VR);

Lv.split = pN.default;

var vN = aT(XR);

Lv.toArray = vN.default;

var hN = aT(rT);

Lv.isRegExp = hN.default;

var gN = aT(iT);

Lv.isSafeInteger = gN.default;

var yN = sT.default;

Lv.extend = yN, Lv.default = {
    assign: uT.default,
    assignIn: sT.default,
    extend: yN,
    castArray: lT.default,
    ceil: cT.default,
    chunk: fT.default,
    clamp: dT.default,
    clone: pT.default,
    cloneDeep: vT.default,
    compact: hT.default,
    concat: gT.default,
    debounce: yT.default,
    defaultTo: mT.default,
    difference: ET.default,
    divide: _T.default,
    drop: DT.default,
    dropRight: bT.default,
    endsWith: OT.default,
    each: AT.default,
    eq: CT.default,
    filter: ST.default,
    find: MT.default,
    findIndex: wT.default,
    findLastIndex: FT.default,
    flatten: PT.default,
    flattenDeep: IT.default,
    floor: RT.default,
    forEach: TT.default,
    forIn: LT.default,
    groupBy: jT.default,
    has: NT.default,
    head: xT.default,
    includes: kT.default,
    indexOf: BT.default,
    intersection: $T.default,
    invert: HT.default,
    isArray: UT.default,
    isArrayLike: GT.default,
    isArrayLikeObject: VT.default,
    isBoolean: WT.default,
    isBuffer: zT.default,
    isDate: JT.default,
    isEmpty: KT.default,
    isEqual: qT.default,
    isFinite: XT.default,
    isFunction: YT.default,
    isNil: ZT.default,
    isNull: QT.default,
    isNumber: eL.default,
    isObject: tL.default,
    isObjectLike: rL.default,
    isPlainObject: nL.default,
    isSafeInteger: gN.default,
    isString: oL.default,
    isSymbol: iL.default,
    isTypedArray: aL.default,
    isUndefined: uL.default,
    isInteger: sL.default,
    isMap: lL.default,
    isNaN: cL.default,
    join: fL.default,
    keys: dL.default,
    keysIn: pL.default,
    last: vL.default,
    lastIndexOf: hL.default,
    lowerFirst: gL.default,
    map: yL.default,
    max: mL.default,
    merge: EL.default,
    min: _L.default,
    noop: DL.default,
    omit: bL.default,
    orderBy: OL.default,
    padEnd: AL.default,
    padStart: CL.default,
    pick: SL.default,
    pull: ML.default,
    pullAt: wL.default,
    range: FL.default,
    reduce: PL.default,
    remove: IL.default,
    reverse: RL.default,
    round: TL.default,
    set: LL.default,
    slice: jL.default,
    sortBy: NL.default,
    startsWith: xL.default,
    sum: kL.default,
    throttle: BL.default,
    toLower: $L.default,
    toNumber: HL.default,
    toString: UL.default,
    toUpper: GL.default,
    trim: VL.default,
    trimEnd: WL.default,
    trimStart: zL.default,
    uniq: JL.default,
    upperFirst: KL.default,
    union: qL.default,
    uniqueId: XL.default,
    values: YL.default,
    xor: ZL.default,
    keyBy: QL.default,
    get: ej.default,
    forOwn: tj.default,
    without: rj.default,
    first: nj.default,
    nth: oj.default,
    pullAll: ij.default,
    times: aj.default,
    random: uj.default,
    stubTrue: sj.default,
    constant: lj.default,
    uniqBy: cj.default,
    snakeCase: fj.default,
    kebabCase: dj.default,
    lowerCase: pj.default,
    camelCase: vj.default,
    identity: hj.default,
    memoize: gj.default,
    size: yj.default,
    takeRight: mj.default,
    replace: Ej.default,
    pickBy: _j.default,
    capitalize: Dj.default,
    cloneDeepWith: bj.default,
    escape: Oj.default,
    unescape: Aj.default,
    templateSettings: Cj.default,
    template: Sj.default,
    differenceBy: Mj.default,
    omitBy: wj.default,
    curry: Fj.default,
    xorWith: Pj.default,
    meanBy: Ij.default,
    result: Rj.default,
    zip: Tj.default,
    differenceWith: Lj.default,
    unzip: jj.default,
    parseInt: Nj.default,
    unset: xj.default,
    updateWith: kj.default,
    matches: Bj.default,
    isMatch: $j.default,
    matchesProperty: Hj.default,
    every: Uj.default,
    flow: Gj.default,
    unionWith: Vj.default,
    take: Wj.default,
    toPairs: zj.default,
    fromPairs: Jj.default,
    truncate: Kj.default,
    mergeWith: qj.default,
    zipObject: Xj.default,
    invoke: Yj.default,
    toInteger: Zj.default,
    toFinite: Qj.default,
    upperCase: eN.default,
    some: tN.default,
    assignWith: rN.default,
    findKey: nN.default,
    property: oN.default,
    sumBy: iN.default,
    unionBy: aN.default,
    uniqWith: uN.default,
    intersectionWith: sN.default,
    flatMap: lN.default,
    mapKeys: cN.default,
    mapValues: fN.default,
    minBy: dN.default,
    split: pN.default,
    toArray: vN.default,
    isRegExp: hN.default
};

var mN = {}, EN = {};

Object.defineProperty(EN, "__esModule", {
    value: !0
}), EN.getExtraConfig = EN.setExtraConfig = void 0;

let _N = new Map;

EN.setExtraConfig = function(e) {
    _N = e;
}, EN.getExtraConfig = function(e) {
    return _N.get(e);
};

var DN = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(mN, "__esModule", {
    value: !0
}), mN.PathUtil = void 0;

const bN = DN(di), ON = DN(r), AN = DN(n), CN = EN, SN = sr, MN = cr, wN = Oi;

class FN {
    static getHvigorCacheDir(e) {
        var t;
        let r = void 0 !== AN.default.env.config ? JSON.parse(AN.default.env.config)[SN.BUILD_CACHE_DIR] : null !== (t = (0, 
        CN.getExtraConfig)(SN.BUILD_CACHE_DIR)) && void 0 !== t ? t : FN.getCommandHvigorCacheDir();
        const n = ON.default.resolve(MN.HVIGOR_PROJECT_ROOT_DIR, SN.HVIGOR_USER_HOME_DIR_NAME);
        return r || (r = wN.HvigorConfigLoader.getInstance().getPropertiesConfigValue(SN.HVIGOR_CACHE_DIR_KEY), 
        r) ? ON.default.isAbsolute(r) ? (e && !this.hvigorCacheDirHasLogged && (e.warn("Please ensure no projects of the same name have the same custom hvigor data dir."), 
        this.hvigorCacheDirHasLogged = !0), ON.default.resolve(r, ON.default.basename(AN.default.cwd()), SN.HVIGOR_USER_HOME_DIR_NAME)) : (e && !this.hvigorCacheDirHasLogged && (e.warn(`Invalid custom hvigor data dir:${r}`), 
        this.hvigorCacheDirHasLogged = !0), n) : n;
    }
    static checkCopyPathIsSame(e, t) {
        const r = FN.getStatsSync(e), n = FN.getStatsSync(t);
        return !(!n || !r) && !!FN.areIdentical(r, n);
    }
    static getStatsSync(e) {
        let t;
        try {
            t = bN.default.statSync(e);
        } catch (e) {
            return null;
        }
        return t;
    }
    static areIdentical(e, t) {
        return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
    }
    static getCommandHvigorCacheDir() {
        return AN.default.argv.forEach(e => {
            e.startsWith(SN.BUILD_CACHE_DIR) && (AN.default.env.BUILD_CACHE_DIR = e.substring(e.indexOf("=") + 1));
        }), AN.default.env.BUILD_CACHE_DIR;
    }
    static getReportDirPath() {
        return ON.default.resolve(FN.getHvigorCacheDir(), "report");
    }
}

mN.PathUtil = FN, FN.hvigorCacheDirHasLogged = !1;

var PN = {};

Object.defineProperty(PN, "__esModule", {
    value: !0
}), PN.replacer = void 0, PN.replacer = function(e, t) {
    if (t instanceof Map) {
        const e = Object.create(null);
        return t.forEach((t, r) => {
            e[r] = t;
        }), e;
    }
    if (t instanceof Set) {
        const e = [];
        return t.forEach(t => {
            e.push(t);
        }), e;
    }
    return t;
}, function(e) {
    var t = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.traceManager = e.TraceManager = void 0;
    const n = t(r), o = Lv, i = t(di), a = m, u = mN, s = PN;
    class l {
        constructor() {
            this.callBackList = {}, this.data = {}, this.callBackList = {};
        }
        trace(e, t, r) {
            this.data[e] = t, "function" == typeof r && (this.callBackList[e] = r);
        }
        flush() {
            const e = (0, o.cloneDeep)(this.data);
            for (const e in this.callBackList) {
                this.callBackList[e]();
            }
            const t = n.default.resolve(u.PathUtil.getHvigorCacheDir(), "./outputs/logs/details"), r = n.default.resolve(t, "details.json");
            i.default.ensureDirSync(t);
            try {
                i.default.writeFileSync(r, JSON.stringify(e, s.replacer, 2));
            } catch (e) {}
        }
        static transformKey(e) {
            return e.replace(/\./g, "_");
        }
        static anonymize(e) {
            return (0, a.hash)(e);
        }
        static trace(t, r, n) {
            e.traceManager.trace(t, r, n);
        }
    }
    e.TraceManager = l, e.traceManager = new l;
}(Tv), Object.defineProperty(Rv, "__esModule", {
    value: !0
}), Rv.hvigorTrace = void 0;

const IN = Tv;

class RN {
    constructor() {
        this.data = {
            IS_INCREMENTAL: !0,
            IS_DAEMON: !0,
            IS_PARALLEL: !0,
            IS_HVIGORFILE_TYPE_CHECK: !1,
            TASK_TIME: {},
            APIS: new Set
        };
    }
    transmitDataToManager() {
        IN.TraceManager.trace(RN.TRACE_KEY, this.data, () => {
            delete this.data.BUILD_ID, delete this.data.ERROR_MESSAGE, this.data.TASK_TIME = {}, 
            this.data.APIS.clear();
        });
    }
    traceTotalTime(e) {
        this.data.TOTAL_TIME = e;
    }
    traceBaseConfig(e, t, r, n) {
        this.data.IS_INCREMENTAL = e, this.data.IS_DAEMON = t, this.data.IS_PARALLEL = r, 
        this.data.IS_HVIGORFILE_TYPE_CHECK = n;
    }
    traceBuildId(e) {
        this.data.BUILD_ID = e;
    }
    traceTaskTime(e, t, r) {
        var n, o;
        let i;
        i = "" === t ? "APP" : IN.TraceManager.transformKey(IN.TraceManager.anonymize(t));
        const a = e.substring(e.indexOf("@") + 1), u = null !== (o = null === (n = this.data.TASK_TIME) || void 0 === n ? void 0 : n[i]) && void 0 !== o ? o : {};
        u[a] = r, this.data.TASK_TIME && (this.data.TASK_TIME[i] = u);
    }
    traceErrorMessage(e) {
        var t, r;
        this.data.ERROR_MESSAGE = null !== (t = this.data.ERROR_MESSAGE) && void 0 !== t ? t : [], 
        this.data.ERROR_MESSAGE.push({
            CODE: e.code,
            MESSAGE: e.originMessage,
            SOLUTIONS: e.originSolutions,
            MORE_INFO: e.moreInfo,
            TIMESTAMP: null === (r = e.timestamp) || void 0 === r ? void 0 : r.getTime().toString(),
            COMPONENTS: e.components,
            CHECK_MESSAGE: e.checkMessage
        });
    }
    insertUsedApi(e) {
        this.data.APIS.has(e) || this.data.APIS.add(e);
    }
    traceConfigProperties(e) {
        e = Object.entries(e).reduce((e, [t, r]) => (e[IN.TraceManager.transformKey(t)] = r, 
        e), {}), this.data.CONFIG_PROPERTIES = e;
    }
}

RN.TRACE_KEY = "HVIGOR", Rv.hvigorTrace = new RN;

var TN = {}, LN = {};

!function(e) {
    var t;
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.BaseEvent = e.EventBody = e.EventHead = e.MetricEventType = void 0, (t = e.MetricEventType || (e.MetricEventType = {})).DURATION = "duration", 
    t.INSTANT = "instant", t.COUNTER = "counter", t.GAUGE = "gauge", t.OBJECT = "object", 
    t.METADATA = "metadata", t.MARK = "mark", t.LOG = "log", t.CONTINUAL = "continual";
    e.EventHead = class {
        constructor(e, t, r, n) {
            this.id = e, this.name = t, this.description = r, this.type = n;
        }
    };
    e.EventBody = class {
        constructor(e, t) {
            this.pid = e, this.tid = t, this.startTime = Number(process.hrtime.bigint());
        }
    };
    e.BaseEvent = class {
        constructor(e, t) {
            this.head = e, this.body = t, this.additional = {};
        }
        setStartTime(e) {
            this.body.startTime = null != e ? e : Number(process.hrtime.bigint());
        }
        setEndTime(e) {
            this.body.endTime = null != e ? e : Number(process.hrtime.bigint());
        }
        setTotalTime(e) {
            this.body.totalTime = e;
        }
        getId() {
            return this.head.id;
        }
        getName() {
            return this.head.name;
        }
        getDescription() {
            return this.head.description;
        }
        setName(e) {
            this.head.name = e;
        }
        getType() {
            return this.head.type;
        }
        setType(e) {
            this.head.type = e;
        }
        getTid() {
            return this.body.tid;
        }
        setTid(e) {
            return this.body.tid = e, this;
        }
    };
}(LN), function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.LogEvent = e.LogEventAdditional = e.MetricLogType = void 0;
    const t = LN;
    var r;
    (r = e.MetricLogType || (e.MetricLogType = {})).DEBUG = "debug", r.INFO = "info", 
    r.WARN = "warn", r.ERROR = "error", r.DETAIL = "detail";
    class n {
        constructor(e) {
            this.logType = e, this.children = [];
        }
    }
    e.LogEventAdditional = n;
    class o extends t.BaseEvent {
        constructor(e, r, o, i, a, u) {
            super(new t.EventHead(e, r, o, t.MetricEventType.LOG), new t.EventBody(i, a)), this.additional = new n(u);
        }
        getLogType() {
            return this.additional.logType;
        }
        setLogType(e) {
            this.additional.logType = e;
        }
        getDurationId() {
            return this.additional.durationId;
        }
        setDurationId(e) {
            this.additional.durationId = e;
        }
        getContinualId() {
            return this.additional.continualId;
        }
        setContinualId(e) {
            this.additional.continualId = e;
        }
        addChild(e) {
            e && -1 === this.additional.children.indexOf(e) && this.additional.children.push(e);
        }
        setParent(e) {
            this.additional.parent || (this.additional.parent = e);
        }
    }
    e.LogEvent = o;
}(TN);

var jN = {}, NN = {}, xN = {}, kN = {};

Object.defineProperty(kN, "__esModule", {
    value: !0
}), kN.Report = void 0;

kN.Report = class {
    constructor(e, t) {
        this.name = e, this.value = t;
    }
    getName() {
        return this.name;
    }
    getValue() {
        return this.value;
    }
};

var BN = {}, $N = {}, HN = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty($N, "__esModule", {
    value: !0
}), $N.LocalFileWriter = void 0;

const UN = HN(r), GN = HN(di), VN = PN;

class WN {
    constructor() {
        this._replacer = VN.replacer, this._space = 2;
    }
    withSpace(e) {
        this._space = e;
    }
    withReplacer(e) {
        this._replacer = e;
    }
    write(e, t) {
        try {
            const r = JSON.stringify(t, this._replacer, this._space);
            this.writeStr(e, r);
        } catch (r) {
            const n = this.chunkStringify(t);
            this.writeStrArr(e, n);
        }
    }
    chunkStringify(e) {
        const t = Object.keys(e), r = [ "{\n" ], n = new Array(this._space).fill(" ").join("");
        return t.forEach(t => {
            if (Array.isArray(e[t]) && e[t].length) {
                r.push(`${n}${JSON.stringify(t)}: [\n`);
                let o = "";
                for (let i = 0; i < e[t].length; i++) {
                    const a = e[t][i], u = `${JSON.stringify(a, this._replacer, this._space).split("\n").map(e => `${n}${n}${e}`).join("\n")},\n`;
                    o.length >= 1e8 ? (r.push(o), o = u) : o += u;
                }
                r.push(`${o.replace(/,\n$/, "\n")}${n}],\n`);
            } else {
                r.push(`${n}${JSON.stringify(t)}: ${JSON.stringify(e[t], this._replacer, this._space)},\n`);
            }
        }), r[r.length - 1] = r[r.length - 1].replace(/,\n$/, "\n"), r.push("}"), r;
    }
    writeStr(e, t) {
        const r = UN.default.dirname(e);
        GN.default.existsSync(r) || GN.default.mkdirSync(r, {
            recursive: !0
        }), GN.default.writeFileSync(e, t);
    }
    writeStrArr(e, t) {
        const r = UN.default.dirname(e);
        GN.default.existsSync(r) || GN.default.mkdirSync(r, {
            recursive: !0
        }), GN.default.writeFileSync(e, ""), t.forEach(t => {
            GN.default.appendFileSync(e, t);
        });
    }
    static getInstance() {
        return WN.instance || (WN.instance = new WN), WN.instance;
    }
}

$N.LocalFileWriter = WN;

var zN, JN, KN = {}, qN = {};

function XN() {
    return zN || (zN = 1, function(e) {
        var t, r;
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.resetStartData = e.refreshDaemonProcessEnv = e.initStartData = e.startEnvironment = e.defaultStartEnvironment = e.globalData = void 0;
        const n = rd, o = sr, i = Oi, a = Rv, u = qN, s = Px(), l = Ix(), c = Ai;
        e.globalData = new class {
            init(e, t) {
                this.cliEnv = e, this.cliOpts = t, this.buildId = function() {
                    const e = new Date, t = e.getFullYear(), r = `0${e.getMonth() + 1}`.slice(-2), n = `0${e.getDate()}`.slice(-2), o = `0${e.getHours()}`.slice(-2), i = `0${e.getMinutes()}`.slice(-2), a = `0${e.getSeconds()}`.slice(-2), u = `00${e.getMilliseconds()}`.slice(-3), s = `${t}${r}${n}${o}${i}${a}${u}`;
                    s !== g ? (g = s, y = 0) : y++;
                    return `${s}${y}`;
                }(), a.hvigorTrace.traceBuildId(this.buildId);
            }
            clean() {
                this.buildId = void 0;
            }
        };
        const f = {
            pageType: "page",
            product: "default",
            buildRoot: ".test",
            unitTestMode: "true",
            isLocalTest: "true",
            "ohos-test-coverage": "true",
            "unit.test.replace.page": "../../../.test/testability/pages/Index"
        }, d = {
            product: "default",
            buildMode: "test",
            isOhosTest: "true",
            "ohos-test-coverage": "true"
        };
        function p() {
            const e = i.HvigorConfigLoader.getInstance();
            c.coreParameter.properties.hvigorPoolMaxSize = v(e.getPropertiesConfigValue(o.HVIGOR_POOL_MAX_SIZE)), 
            c.coreParameter.properties.hvigorPoolMaxCoreSize = v(e.getPropertiesConfigValue(o.HVIGOR_POOL_MAX_CORE_SIZE)), 
            c.coreParameter.properties.hvigorPoolCacheCapacity = v(e.getPropertiesConfigValue(o.HVIGOR_POOL_CACHE_CAPACITY)), 
            c.coreParameter.properties.hvigorPoolCacheTtl = v(e.getPropertiesConfigValue(o.HVIGOR_POOL_CACHE_TTL)), 
            c.coreParameter.properties.ohosArkCompileMaxSize = v(e.getPropertiesConfigValue(o.OHOS_ARK_COMPILE_MAX_SIZE)), 
            c.coreParameter.properties.hvigorMemoryThreshold = v(e.getPropertiesConfigValue(o.HVIGOR_MEMORY_THRESHOLD));
        }
        function v(e) {
            if (!("string" == typeof e || void 0 === e || e < 0)) {
                return Math.floor(e);
            }
        }
        function h(e) {
            const t = new Map;
            if (!e) {
                return t;
            }
            return ("string" == typeof e ? [ e ] : e).forEach(e => {
                const [r, n] = e.split("="), o = "coverage" === r ? "ohos-test-coverage" : r;
                t.set(o, n);
            }), t;
        }
        e.defaultStartEnvironment = {
            nodeHome: null !== (t = process.env.NODE_HOME) && void 0 !== t ? t : "",
            workspaceDir: null !== (r = process.env.WORKSPACE_DIR) && void 0 !== r ? r : ""
        }, e.startEnvironment = {
            ...e.defaultStartEnvironment
        }, e.initStartData = function(t) {
            i.HvigorConfigLoader.init(t), s.HvigorLogger.clean(), function(t) {
                if (!t) {
                    return;
                }
                const r = new Map;
                void 0 !== t.prop && [ t.prop ].flat(2).forEach(e => {
                    var t;
                    const n = e.split("=");
                    r.set(n[0], null === (t = null == n ? void 0 : n.splice(1)) || void 0 === t ? void 0 : t.join("="));
                });
                c.coreParameter.extParams = Object.fromEntries(r.entries()), c.coreParameter.workspaceDir = e.startEnvironment.workspaceDir;
            }(t), p(), function() {
                const t = l.HvigorConfigReader.getHvigorConfig();
                if (!t) {
                    return void (c.coreParameter.properties = {
                        ...c.defaultProperties,
                        ...c.coreParameter.properties
                    });
                }
                e.startEnvironment = {
                    ...e.startEnvironment,
                    ...t.environment
                }, c.coreParameter.properties = {
                    ...c.defaultProperties,
                    ...t.properties,
                    ...c.coreParameter.properties
                }, function(e) {
                    var t, r, n, o, i, a, s, l, f, d, p, v;
                    c.coreParameter.startParams.incrementalExecution = null !== (r = null === (t = e.execution) || void 0 === t ? void 0 : t.incremental) && void 0 !== r ? r : c.coreParameter.startParams.incrementalExecution, 
                    c.coreParameter.startParams.hvigorfileTypeCheck = null !== (o = null === (n = e.execution) || void 0 === n ? void 0 : n.typeCheck) && void 0 !== o ? o : c.coreParameter.startParams.hvigorfileTypeCheck, 
                    c.coreParameter.startParams.parallelExecution = null !== (a = null === (i = e.execution) || void 0 === i ? void 0 : i.parallel) && void 0 !== a ? a : c.coreParameter.startParams.parallelExecution, 
                    c.coreParameter.startParams.daemon = null !== (l = null === (s = e.execution) || void 0 === s ? void 0 : s.daemon) && void 0 !== l ? l : c.coreParameter.startParams.daemon, 
                    c.coreParameter.startParams.printStackTrace = null !== (d = null === (f = e.debugging) || void 0 === f ? void 0 : f.stacktrace) && void 0 !== d ? d : c.coreParameter.startParams.printStackTrace, 
                    c.coreParameter.startParams.optimizationStrategy = null !== (v = null === (p = e.execution) || void 0 === p ? void 0 : p.optimizationStrategy) && void 0 !== v ? v : c.coreParameter.startParams.optimizationStrategy, 
                    function(e) {
                        var t, r, n;
                        (null === (t = e.logging) || void 0 === t ? void 0 : t.level) && (c.coreParameter.startParams.logLevel = null !== (n = u.levelMap.get(null === (r = e.logging) || void 0 === r ? void 0 : r.level)) && void 0 !== n ? n : c.coreParameter.startParams.logLevel);
                    }(e);
                }(t);
            }(), function(e) {
                if (!e) {
                    return;
                }
                const t = e._.includes("test");
                if (!t) {
                    return;
                }
                e.mode || (e.mode = "module");
                const r = h(e.prop);
                Object.keys(f).forEach(e => {
                    r.has(e) || r.set(e, f[e]);
                });
                const n = [];
                r.forEach((e, t) => {
                    n.push(`${t}=${e}`);
                }), e.prop = n;
            }(t), function(e) {
                if (!e) {
                    return;
                }
                const t = e._.includes("onDeviceTest");
                if (!t) {
                    return;
                }
                e.mode || (e.mode = "module");
                const r = h(e.prop);
                Object.keys(d).forEach(e => {
                    r.has(e) || r.set(e, d[e]);
                });
                const n = [];
                r.forEach((e, t) => {
                    n.push(`${t}=${e}`);
                }), e.prop = n;
            }(t), function(t) {
                var r, o, i, u, s, l, f;
                const d = null != t ? t : e.globalData.cliOpts;
                e.startEnvironment.nodeHome = null !== (r = d.nodeHome) && void 0 !== r ? r : e.startEnvironment.nodeHome, 
                c.coreParameter.startParams.hotCompile = d.hotCompile, c.coreParameter.startParams.hotReloadBuild = d.hotReloadBuild, 
                c.coreParameter.startParams.hvigorfileTypeCheck = null !== (o = d.enableBuildScriptTypeCheck) && void 0 !== o ? o : c.coreParameter.startParams.hvigorfileTypeCheck, 
                c.coreParameter.startParams.hvigorfileTypeCheck = null !== (i = d.typeCheck) && void 0 !== i ? i : c.coreParameter.startParams.hvigorfileTypeCheck, 
                c.coreParameter.startParams.daemon = null !== (u = d.daemon) && void 0 !== u ? u : c.coreParameter.startParams.daemon, 
                c.coreParameter.startParams.printStackTrace = null !== (s = d.stacktrace) && void 0 !== s ? s : c.coreParameter.startParams.printStackTrace, 
                c.coreParameter.startParams.logLevel = d.debug ? n.levels.DEBUG : d.warn ? n.levels.WARN : d.error ? n.levels.ERROR : d.info ? n.levels.INFO : c.coreParameter.startParams.logLevel, 
                c.coreParameter.startParams.parallelExecution = null !== (l = d.parallel) && void 0 !== l ? l : c.coreParameter.startParams.parallelExecution, 
                c.coreParameter.startParams.incrementalExecution = null !== (f = d.incremental) && void 0 !== f ? f : c.coreParameter.startParams.incrementalExecution, 
                c.coreParameter.startParams.optimizationStrategy = d.optimizationStrategy && Object.values(c.OptimizationStrategy).includes(d.optimizationStrategy) ? d.optimizationStrategy : c.coreParameter.startParams.optimizationStrategy, 
                a.hvigorTrace.traceBaseConfig(c.coreParameter.startParams.incrementalExecution, c.coreParameter.startParams.daemon, c.coreParameter.startParams.parallelExecution, c.coreParameter.startParams.hvigorfileTypeCheck);
            }(t), p(), function() {
                const e = Object.fromEntries(Object.entries(c.coreParameter.properties).filter(([e, t]) => void 0 !== t));
                a.hvigorTrace.traceConfigProperties(e);
            }();
        }, e.refreshDaemonProcessEnv = function(e) {
            var t, r;
            e.env && (process.env.DEVECO_SDK_HOME = null !== (t = e.env.DEVECO_SDK_HOME) && void 0 !== t ? t : "", 
            process.env.OHOS_BASE_SDK_HOME = null !== (r = e.env.OHOS_BASE_SDK_HOME) && void 0 !== r ? r : "");
        }, e.resetStartData = function() {
            e.startEnvironment = {
                ...e.defaultStartEnvironment
            }, c.coreParameter.clean();
        };
        let g = "", y = 0;
    }(KN)), KN;
}

!function(e) {
    var t = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.levelMap = e.getLevel = e.setCategoriesLevel = e.updateConfiguration = e.getConfiguration = e.setConfiguration = e.logFilePath = void 0;
    const n = rd, o = t(r), i = mN, a = cr, u = sr;
    e.logFilePath = () => {
        let e;
        try {
            e = i.PathUtil.getHvigorCacheDir();
        } catch {
            e = o.default.resolve(a.HVIGOR_PROJECT_ROOT_DIR, u.HVIGOR_USER_HOME_DIR_NAME);
        }
        return o.default.resolve(e, "./outputs/build-logs");
    };
    let s = {
        appenders: {
            debug: {
                type: "stdout",
                layout: {
                    type: "pattern",
                    pattern: "[%d] > hvigor %p %c %[%m%]"
                }
            },
            "debug-log-file": {
                type: "file",
                filename: o.default.resolve((0, e.logFilePath)(), "build.log"),
                maxLogSize: 2097152,
                backups: 9,
                encoding: "utf-8",
                level: "debug"
            },
            info: {
                type: "stdout",
                layout: {
                    type: "pattern",
                    pattern: "[%d] > hvigor %[%m%]"
                }
            },
            "no-pattern-info": {
                type: "stdout",
                layout: {
                    type: "pattern",
                    pattern: "%m"
                }
            },
            wrong: {
                type: "stderr",
                layout: {
                    type: "pattern",
                    pattern: "[%d] > hvigor %[%p: %m%]"
                }
            },
            "just-debug": {
                type: "logLevelFilter",
                appender: "debug",
                level: "debug",
                maxLevel: "debug"
            },
            "just-info": {
                type: "logLevelFilter",
                appender: "info",
                level: "info",
                maxLevel: "info"
            },
            "just-wrong": {
                type: "logLevelFilter",
                appender: "wrong",
                level: "warn",
                maxLevel: "error"
            }
        },
        categories: {
            default: {
                appenders: [ "just-debug", "just-info", "just-wrong" ],
                level: "debug"
            },
            "no-pattern-info": {
                appenders: [ "no-pattern-info" ],
                level: "info"
            },
            "debug-file": {
                appenders: [ "debug-log-file" ],
                level: "debug"
            }
        }
    };
    e.setConfiguration = e => {
        s = e;
    };
    e.getConfiguration = () => s;
    e.updateConfiguration = () => {
        const t = s.appenders["debug-log-file"];
        return t && "filename" in t && (t.filename = o.default.resolve((0, e.logFilePath)(), "build.log")), 
        s;
    };
    let l = n.levels.DEBUG;
    e.setCategoriesLevel = (e, t) => {
        l = e;
        const r = s.categories;
        for (const n in r) {
            (null == t ? void 0 : t.includes(n)) || n.includes("file") || Object.prototype.hasOwnProperty.call(r, n) && (r[n].level = e.levelStr);
        }
    };
    e.getLevel = () => l, e.levelMap = new Map([ [ "ALL", n.levels.ALL ], [ "MARK", n.levels.MARK ], [ "TRACE", n.levels.TRACE ], [ "DEBUG", n.levels.DEBUG ], [ "INFO", n.levels.INFO ], [ "WARN", n.levels.WARN ], [ "ERROR", n.levels.ERROR ], [ "FATAL", n.levels.FATAL ], [ "OFF", n.levels.OFF ], [ "all", n.levels.ALL ], [ "mark", n.levels.MARK ], [ "trace", n.levels.TRACE ], [ "debug", n.levels.DEBUG ], [ "info", n.levels.INFO ], [ "warn", n.levels.WARN ], [ "error", n.levels.ERROR ], [ "fatal", n.levels.FATAL ], [ "off", n.levels.OFF ] ]);
}(qN);

var YN = {}, ZN = {};

Object.defineProperty(ZN, "__esModule", {
    value: !0
}), ZN.MapCacheService = void 0;

ZN.MapCacheService = class {
    constructor() {
        this.cacheEntryMap = new Map;
    }
    initialize() {}
    close() {
        this.cacheEntryMap.clear();
    }
    get(e) {
        return this.cacheEntryMap.get(e);
    }
    remove(e) {
        this.cacheEntryMap.delete(e);
    }
    size() {
        return this.cacheEntryMap.size;
    }
}, Object.defineProperty(YN, "__esModule", {
    value: !0
}), YN.MetricCacheService = void 0;

const QN = ZN;

class ex extends QN.MapCacheService {
    constructor() {
        super();
    }
    add(e) {
        this.cacheEntryMap.set(e.getId(), e);
    }
    getEvents() {
        const e = [];
        return this.cacheEntryMap.forEach(t => {
            e.push(t);
        }), e;
    }
    static getInstance() {
        return ex.instance || (ex.instance = new ex), ex.instance;
    }
}

YN.MetricCacheService = ex;

var tx, rx, nx, ox = {};

function ix() {
    return tx || (tx = 1, function(e) {
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.DurationEvent = e.DurationEventState = void 0;
        const t = Px(), r = Dx(), n = ax(), o = LN, i = ux(), a = TN;
        var u;
        !function(e) {
            e.CREATED = "created", e.BEGINNING = "beginning", e.RUNNING = "running", e.FAILED = "failed", 
            e.SUCCESS = "success", e.WARN = "warn";
        }(u = e.DurationEventState || (e.DurationEventState = {}));
        class s {
            constructor(e, t) {
                this.children = [], this.state = u.CREATED, this.targetName = "", this.moduleName = "";
                const r = e.indexOf(":");
                if (r > 0) {
                    this.moduleName = e.substring(0, r);
                    const t = e.indexOf("@");
                    t > 0 && (this.targetName = e.substring(r + 1, t));
                }
                this.category = t, this.taskRunReasons = [];
            }
        }
        class l extends o.BaseEvent {
            constructor(e, r, n, i, a, u) {
                super(new o.EventHead(e, r, n, o.MetricEventType.DURATION), new o.EventBody(i, u)), 
                this.log = t.HvigorLogger.getLogger("DurationEvent"), this.additional = new s(r, a);
            }
            start(e = u.RUNNING, t) {
                return this.setState(e), super.setStartTime(t), this;
            }
            stop(e = u.SUCCESS, t) {
                if (this.additional.state === u.FAILED || this.additional.state === u.SUCCESS || this.additional.state === u.WARN) {
                    return this;
                }
                this.body.endTime = null != t ? t : Number(process.hrtime.bigint());
                const r = n.MetricService.getInstance();
                this.setState(e);
                for (const t of this.additional.children) {
                    const n = r.getEventById(t);
                    n ? n instanceof l ? n.stop(e) : this.log.warn(`Child:'${t}' is not of type DurationEvent.`) : this.log.warn(`Can not getEventById:'${t}' from MetricCacheService.`);
                }
                return this;
            }
            setState(e) {
                this.additional.state = e;
            }
            createSubEvent(e, t) {
                const n = r.MetricFactory.createDurationEvent(e, t, "");
                return n.setParent(this.getId()), this.addChild(n.getId()), n;
            }
            addChild(e) {
                this.additional.children.push(e);
            }
            setParent(e) {
                this.additional.parent = e;
            }
            getParent() {
                return this.additional.parent;
            }
            getChildren() {
                return this.additional.children;
            }
            setLog(e, t = a.MetricLogType.INFO, n, o) {
                const i = r.MetricFactory.createLogEvent(null != e ? e : this.head.name, t, this.getTid(), n);
                i.setDurationId(this.getId()), this.additional.logId = i.getId(), i.setStartTime(this.body.startTime), 
                i.setEndTime(this.body.endTime), o && i.setTotalTime(o), this.setParentLog(i), this.setChildrenLog(i);
            }
            setParentLog(e) {
                const t = n.MetricService.getInstance().getEventById(this.additional.parent);
                if (t instanceof l) {
                    const r = n.MetricService.getInstance().getEventById(t.additional.logId);
                    r instanceof a.LogEvent && (r.addChild(e.getId()), e.setParent(r.getId()));
                }
            }
            setChildrenLog(e) {
                this.additional.children.forEach(t => {
                    const r = n.MetricService.getInstance().getEventById(t);
                    if (r instanceof l || r instanceof i.ContinualEvent) {
                        e.addChild(r.additional.logId);
                        const t = n.MetricService.getInstance().getEventById(r.additional.logId);
                        t instanceof a.LogEvent && r.setParentLog(t);
                    }
                });
            }
            setDetail(e) {
                const t = r.MetricFactory.createLogEvent(e, a.MetricLogType.DETAIL, this.getTid());
                t.setDurationId(this.getId()), this.additional.detailId = t.getId();
            }
            setCategory(e) {
                this.additional.category = e;
            }
            addTaskRunReason(e) {
                this.additional.taskRunReasons.push(e);
            }
        }
        e.DurationEvent = l;
    }(ox)), ox;
}

function ax() {
    if (rx) {
        return xN;
    }
    rx = 1, Object.defineProperty(xN, "__esModule", {
        value: !0
    }), xN.MetricService = void 0;
    const e = kN, o = function() {
        if (JN) {
            return BN;
        }
        JN = 1;
        var e = g && g.__importDefault || function(e) {
            return e && e.__esModule ? e : {
                default: e
            };
        };
        Object.defineProperty(BN, "__esModule", {
            value: !0
        }), BN.ReportServiceImpl = void 0;
        const o = e(t), i = e(r), a = e(n), u = e(di), s = $N, l = mN, c = Ai;
        class f {
            constructor() {
                this.reportListeners = [];
            }
            report() {
                const e = this.getReport(), t = l.PathUtil.getReportDirPath();
                o.default.existsSync(t) || o.default.mkdirSync(t, {
                    recursive: !0
                }), this.deleteUnusableFiles(t), this.storage(e, t);
            }
            getReport() {
                const e = {
                    version: "2.0",
                    ppid: a.default.ppid
                };
                for (const t of this.reportListeners) {
                    const r = t.queryReport();
                    e[r.getName()] = r.getValue();
                }
                return e;
            }
            storage(e, t) {
                const r = o.default.readdirSync(t).filter(e => e.startsWith("report-") && e.endsWith("json")).sort((e, r) => {
                    const n = i.default.resolve(t, e), a = i.default.resolve(t, r), u = o.default.statSync(n);
                    return o.default.statSync(a).birthtimeMs - u.birthtimeMs;
                });
                for (let e = 0; e < r.length; e++) {
                    if (e >= 9) {
                        const n = i.default.resolve(t, r[e]);
                        o.default.existsSync(n) && o.default.unlinkSync(n);
                    }
                }
                const n = XN();
                if (void 0 === n.globalData.buildId) {
                    return;
                }
                const a = n.globalData.buildId;
                f.buildId = a;
                const u = i.default.resolve(t, `report-${a}.json`);
                s.LocalFileWriter.getInstance().write(u, e), d() && this.generateHtmlResource(t, `report-${a}`, e);
            }
            deleteUnusableFiles(e) {
                o.default.readdirSync(e).forEach(t => {
                    if (!f.REPORT_REG.test(t) && (!f.HTML_REG.test(t) || d()) && t !== f.HTML_RESOURCE_NAME && t !== f.UPLOAD_NAME) {
                        const r = i.default.resolve(e, t);
                        o.default.existsSync(r) && o.default.unlinkSync(r);
                    }
                });
            }
            addListener(e) {
                this.reportListeners.push(e);
            }
            removeListener(e) {
                const t = this.reportListeners.indexOf(e);
                -1 !== t && this.reportListeners.splice(t, 1);
            }
            generateHtmlResource(e, t, r) {
                const n = i.default.resolve(e, "htmlResource"), a = i.default.resolve(__filename, "../../../../../res/staticHtmlResource/htmlResource");
                if (o.default.existsSync(n)) {
                    const e = o.default.readdirSync(a), t = o.default.readdirSync(n);
                    e.every(e => !!t.includes(e) && o.default.statSync(i.default.resolve(a, e)).size === o.default.statSync(i.default.resolve(n, e)).size) || u.default.copySync(a, n);
                } else {
                    u.default.copySync(a, n);
                }
                const s = i.default.resolve(__filename, "../../../../../res/staticHtmlResource/index.html"), l = o.default.readFileSync(s, "utf8"), c = `<script>window.__HVIGOR_REPORT__ = ${JSON.stringify(JSON.stringify(r))};<\/script>`, f = l.indexOf("</body>"), d = l.slice(0, f) + c + l.slice(f), p = i.default.resolve(e, `${t}.html`);
                o.default.writeFileSync(p, d);
            }
            static getInstance() {
                return f.instance || (f.instance = new f), f.instance;
            }
            startProcessMonitor() {
                this.monitorTimeId && clearInterval(this.monitorTimeId), f.data = [], this.monitorTimeId = setInterval(() => {
                    const e = a.default.memoryUsage(), t = {
                        time: Date.now(),
                        rss: this.convertToMb(e.rss),
                        heapTotal: this.convertToMb(e.heapTotal),
                        heapUsed: this.convertToMb(e.heapUsed),
                        external: this.convertToMb(e.external),
                        arrayBuffers: this.convertToMb(e.arrayBuffers)
                    };
                    f.data.push(t);
                }, f.REPORT_INTERVAL_MS);
            }
            stopProcessMonitor() {
                if (this.monitorTimeId) {
                    clearInterval(this.monitorTimeId), this.monitorTimeId = void 0;
                    const e = {
                        version: f.VERSION,
                        pid: a.default.pid,
                        data: f.data
                    };
                    if (void 0 === f.buildId) {
                        return;
                    }
                    const t = l.PathUtil.getReportDirPath(), r = i.default.join(t, `report-monitor-${f.buildId}.json`);
                    o.default.writeFileSync(r, JSON.stringify(e, null, 2), "utf-8");
                }
            }
            convertToMb(e) {
                return e / f.MB_CONVERTER / f.MB_CONVERTER;
            }
        }
        function d() {
            return "boolean" == typeof c.coreParameter.properties["hvigor.analyzeHtml"] && c.coreParameter.properties["hvigor.analyzeHtml"];
        }
        return BN.ReportServiceImpl = f, f.MAX_REPEAT_TIMES = 10, f.REPORT_REG = /^report(-monitor)?-[0-9]+\.json$/, 
        f.HTML_REG = /^report-?[0-9]*.html$/, f.HTML_RESOURCE_NAME = "htmlResource", f.UPLOAD_NAME = "upload", 
        f.VERSION = "1.0", f.MB_CONVERTER = 1024, f.REPORT_INTERVAL_MS = 1e3, f.data = [], 
        BN;
    }(), i = YN, a = LN, u = ix(), s = TN;
    class l {
        constructor() {
            this.metricCacheService = i.MetricCacheService.getInstance();
        }
        submit(e) {
            this.metricCacheService.add(e);
        }
        getEventById(e) {
            if (e) {
                return this.metricCacheService.get(e);
            }
        }
        queryReport() {
            let t = this.filterDurationEvent(this.metricCacheService.getEvents());
            return t = this.filterLogEvent(t), new e.Report("events", t);
        }
        filterDurationEvent(e) {
            return e.filter(e => {
                if (e.getType() === a.MetricEventType.DURATION) {
                    if (e.additional.state === u.DurationEventState.CREATED) {
                        return !1;
                    }
                }
                return !0;
            });
        }
        filterLogEvent(e) {
            return e.filter(e => {
                if (e.getType() === a.MetricEventType.LOG) {
                    const t = e, r = this.getEventById(t.additional.durationId);
                    if (r && r.additional.state === u.DurationEventState.CREATED) {
                        return !1;
                    }
                    if (t.additional.logType === s.MetricLogType.DETAIL && !r) {
                        return !1;
                    }
                }
                return !0;
            });
        }
        clear() {
            this.metricCacheService.close();
        }
        static getInstance() {
            return l.instance || (l.instance = new l, o.ReportServiceImpl.getInstance().addListener(l.instance)), 
            l.instance;
        }
    }
    return xN.MetricService = l, xN;
}

function ux() {
    if (nx) {
        return NN;
    }
    nx = 1, Object.defineProperty(NN, "__esModule", {
        value: !0
    }), NN.ContinualEvent = NN.ContinualEventAdditional = void 0;
    const e = Dx(), t = ax(), r = LN, n = ix(), o = TN;
    class i {
        constructor(e, t) {
            this.totalTime = null != e ? e : 0, this.frequency = null != t ? t : 0, this.children = [];
        }
    }
    NN.ContinualEventAdditional = i;
    class a extends r.BaseEvent {
        constructor(e, t, n, o, a, u, s) {
            super(new r.EventHead(e, t, n, r.MetricEventType.CONTINUAL), new r.EventBody(o, a)), 
            this.additional = new i(u, s);
        }
        setParent(e) {
            this.additional.parent = e;
        }
        getParent() {
            return this.additional.parent;
        }
        addChild(e) {
            this.additional.children.push(e);
        }
        getChildren() {
            return this.additional.children;
        }
        createSubEvent(t, r) {
            const n = e.MetricFactory.createContinualEvent(t, r);
            return n.setParent(this.getId()), this.addChild(n.getId()), n;
        }
        setLog(t, r, n) {
            const o = e.MetricFactory.createLogEvent(t, r, this.getTid(), n);
            o.setContinualId(this.getId()), this.additional.logId = o.getId(), o.setStartTime(this.body.startTime), 
            o.setEndTime(this.body.endTime), this.setParentLog(o), this.setChildrenLog(o);
        }
        setParentLog(e) {
            const r = t.MetricService.getInstance().getEventById(this.additional.parent);
            if (r instanceof a || r instanceof n.DurationEvent) {
                const n = t.MetricService.getInstance().getEventById(r.additional.logId);
                n instanceof o.LogEvent && (n.addChild(e.getId()), e.setParent(n.getId()));
            }
        }
        setDetail(t) {
            const r = e.MetricFactory.createLogEvent(t, o.MetricLogType.DETAIL, this.getTid());
            r.setContinualId(this.getId()), this.additional.detailId = r.getId();
        }
        setChildrenLog(e) {
            this.additional.children.forEach(r => {
                const n = t.MetricService.getInstance().getEventById(r);
                if (n instanceof a) {
                    e.addChild(n.additional.logId);
                    const r = t.MetricService.getInstance().getEventById(n.additional.logId);
                    r instanceof o.LogEvent && n.setParentLog(r);
                }
            });
        }
    }
    return NN.ContinualEvent = a, NN;
}

var sx = {};

Object.defineProperty(sx, "__esModule", {
    value: !0
}), sx.CounterEvent = sx.CounterEventAdditional = void 0;

const lx = LN;

class cx {
    constructor(e, t) {
        this.success = null != e ? e : 0, this.failed = null != t ? t : 0;
    }
}

sx.CounterEventAdditional = cx;

class fx extends lx.BaseEvent {
    constructor(e, t, r, n, o, i, a) {
        super(new lx.EventHead(e, t, r, lx.MetricEventType.COUNTER), new lx.EventBody(n, o)), 
        this.additional = new cx(i, a), this.body.startTime = Number(process.hrtime.bigint());
    }
}

sx.CounterEvent = fx;

var dx = {};

Object.defineProperty(dx, "__esModule", {
    value: !0
}), dx.GaugeEvent = dx.GaugeEventAdditional = void 0;

const px = LN;

class vx {
    constructor(e) {
        this.utilization = e;
    }
}

dx.GaugeEventAdditional = vx;

class hx extends px.BaseEvent {
    constructor(e, t, r, n, o, i) {
        super(new px.EventHead(e, t, r, px.MetricEventType.GAUGE), new px.EventBody(n, o)), 
        this.additional = new vx(i), this.body.startTime = Number(process.hrtime.bigint());
    }
}

dx.GaugeEvent = hx;

var gx = {};

!function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.InstantEvent = e.InstantEventAdditional = e.InstantEventScope = void 0;
    const t = LN;
    var r;
    (r = e.InstantEventScope || (e.InstantEventScope = {})).THREAD = "thread", r.PROCESS = "process", 
    r.GLOBAL = "global";
    class n {}
    e.InstantEventAdditional = n;
    class o extends t.BaseEvent {
        constructor(e, r, o, i, a) {
            super(new t.EventHead(e, r, o, t.MetricEventType.INSTANT), new t.EventBody(i, a)), 
            this.additional = new n, this.body.startTime = Number(process.hrtime.bigint());
        }
        setScope(e) {
            this.additional.scope = e;
        }
    }
    e.InstantEvent = o;
}(gx);

var yx = {};

!function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.MarkEvent = e.MarkEventAdditional = e.MarkEventTime = e.MarkEventState = e.MarkEventCategory = e.MarkEventType = void 0;
    const t = LN;
    var r, n, o;
    (r = e.MarkEventType || (e.MarkEventType = {})).HISTORY = "history", r.OTHER = "other", 
    (n = e.MarkEventCategory || (e.MarkEventCategory = {})).BUILD = "build", n.CLEAN = "clean", 
    function(e) {
        e.SUCCESS = "success", e.FAILED = "failed", e.RUNNING = "running";
    }(o = e.MarkEventState || (e.MarkEventState = {}));
    class i {
        constructor(e) {
            this.year = e.getFullYear(), this.month = e.getMonth() + 1, this.day = e.getDate(), 
            this.hour = e.getHours(), this.minute = e.getMinutes(), this.second = e.getSeconds();
        }
    }
    e.MarkEventTime = i;
    class a {
        constructor() {
            this.time = new i(new Date);
        }
    }
    e.MarkEventAdditional = a;
    class u extends t.BaseEvent {
        constructor(e, r, n, o, i) {
            super(new t.EventHead(e, r, n, t.MetricEventType.MARK), new t.EventBody(o, i)), 
            this.additional = new a;
        }
        start(e = o.RUNNING, t) {
            this.setState(e), super.setStartTime(t);
        }
        stop(e = o.SUCCESS, t) {
            this.additional.state !== o.FAILED && this.additional.state !== o.SUCCESS && (this.body.endTime = null != t ? t : Number(process.hrtime.bigint()), 
            this.setState(e));
        }
        setMarkType(e) {
            this.additional.markType = e;
        }
        setCategory(e) {
            this.additional.category = e;
        }
        setState(e) {
            this.additional.state = e;
        }
        setHvigorVersion(e) {
            this.additional.hvigorVersion = e;
        }
        setCompleteCommand(e) {
            this.additional.completeCommand = e;
        }
        setNodeVersion(e) {
            this.additional.nodeVersion = e;
        }
    }
    e.MarkEvent = u;
}(yx);

var mx = {};

!function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.MetadataEvent = e.MetadataEventState = void 0;
    const t = LN;
    var r;
    (r = e.MetadataEventState || (e.MetadataEventState = {})).NEW = "new", r.IDLE = "idle", 
    r.BUSY = "busy", r.CLOSE = "close", r.BROKEN = "broken";
    class n {
        constructor(e) {
            this.state = e;
        }
    }
    class o extends t.BaseEvent {
        constructor(e, r, o, i, a, u) {
            super(new t.EventHead(e, r, o, t.MetricEventType.METADATA), new t.EventBody(i, a)), 
            this.additional = new n(u), this.body.startTime = Number(process.hrtime.bigint());
        }
        setCategory(e) {
            this.additional.category = e;
        }
        setSortIndex(e) {
            this.additional.sortIndex = e;
        }
        setLabel(e) {
            this.additional.label = e;
        }
        setContent(e) {
            this.additional.content = e;
        }
    }
    e.MetadataEvent = o;
}(mx);

var Ex, _x = {};

function Dx() {
    return Ex || (Ex = 1, function(e) {
        var t = g && g.__importDefault || function(e) {
            return e && e.__esModule ? e : {
                default: e
            };
        };
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.MetricFactory = e.MAIN_THREAD = void 0;
        const r = t(o), n = ux(), i = sx, a = ix(), u = dx, s = gx, l = TN, c = yx, f = mx, d = _x, p = ax();
        e.MAIN_THREAD = "Main Thread";
        class v {
            static getUuid() {
                return r.default.randomUUID();
            }
            static createDurationEvent(t, r, n, o) {
                const i = new a.DurationEvent(v.getUuid(), t, r, process.pid, n, null != o ? o : e.MAIN_THREAD);
                return p.MetricService.getInstance().submit(i), i;
            }
            static createInstantEvent(t, r, n) {
                const o = new s.InstantEvent(v.getUuid(), t, r, process.pid, null != n ? n : e.MAIN_THREAD);
                return p.MetricService.getInstance().submit(o), o;
            }
            static createCounterEvent(t, r, n, o, a) {
                const u = new i.CounterEvent(v.getUuid(), t, r, process.pid, null != a ? a : e.MAIN_THREAD, n, o);
                return p.MetricService.getInstance().submit(u), u;
            }
            static createGaugeEvent(t, r, n, o) {
                const i = new u.GaugeEvent(v.getUuid(), t, n, process.pid, null != o ? o : e.MAIN_THREAD, r);
                return p.MetricService.getInstance().submit(i), i;
            }
            static createObjectEvent(t, r, n, o, i, a) {
                const u = new d.ObjectEvent(v.getUuid(), t, o, process.pid, null != a ? a : e.MAIN_THREAD, r, n, i);
                return p.MetricService.getInstance().submit(u), u;
            }
            static createMetadataEvent(t, r, n, o) {
                const i = new f.MetadataEvent(v.getUuid(), t, n, process.pid, null != o ? o : e.MAIN_THREAD, r);
                return p.MetricService.getInstance().submit(i), i;
            }
            static createMarkEvent(t, r, n) {
                const o = new c.MarkEvent(v.getUuid(), t, r, process.pid, null != n ? n : e.MAIN_THREAD);
                return p.MetricService.getInstance().submit(o), o;
            }
            static createLogEvent(t, r, n, o) {
                const i = new l.LogEvent(v.getUuid(), t, null != o ? o : "", process.pid, null != n ? n : e.MAIN_THREAD, r);
                return p.MetricService.getInstance().submit(i), i;
            }
            static createContinualEvent(t, r, o, i, a) {
                const u = new n.ContinualEvent(v.getUuid(), t, r, process.pid, null != a ? a : e.MAIN_THREAD, o, i);
                return p.MetricService.getInstance().submit(u), u;
            }
        }
        e.MetricFactory = v;
    }(jN)), jN;
}

!function(e) {
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.ObjectEvent = e.ObjectEventAdditional = e.ObjectEventState = void 0;
    const t = LN;
    var r;
    (r = e.ObjectEventState || (e.ObjectEventState = {})).NEW = "new", r.SNAPSHOT = "snapshot", 
    r.DESTROY = "destroy";
    class n {
        constructor(e, t, r) {
            this.objectId = e, this.state = t, this.snapshot = r;
        }
    }
    e.ObjectEventAdditional = n;
    class o extends t.BaseEvent {
        constructor(e, r, o, i, a, u, s, l) {
            super(new t.EventHead(e, r, o, t.MetricEventType.OBJECT), new t.EventBody(i, a)), 
            this.additional = new n(u, s, l), this.body.startTime = Number(process.hrtime.bigint());
        }
    }
    e.ObjectEvent = o;
}(_x);

var bx, Ox, Ax, Cx = {}, Sx = g && g.__decorate || function(e, t, r, n) {
    var o, i = arguments.length, a = i < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) {
        a = Reflect.decorate(e, t, r, n);
    } else {
        for (var u = e.length - 1; u >= 0; u--) {
            (o = e[u]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, r, a) : o(t, r)) || a);
        }
    }
    return i > 3 && a && Object.defineProperty(t, r, a), a;
};

function Mx(e, t, r) {
    const n = r.value;
    return r.value = function(...e) {
        const t = wx(e);
        return n.apply(this, t);
    }, r;
}

function wx(e) {
    if ("object" != typeof e) {
        return e;
    }
    if (Array.isArray(e)) {
        return e.map((t, r) => "object" == typeof t ? wx(t) : e[r]);
    }
    if ("object" == typeof e) {
        const t = {};
        return Object.keys(e).forEach(r => {
            if ("bundleName" === r && "string" == typeof e[r]) {
                const n = e[r];
                t[r] = n ? `${n[0]}***${n[n.length - 1]}` : "*****";
            } else {
                "object" == typeof e[r] ? t[r] = wx(e[r]) : t[r] = e[r];
            }
        }), t;
    }
    return e;
}

Object.defineProperty(Cx, "__esModule", {
    value: !0
}), Cx.FileLogger = Cx.replaceBundleName = void 0, Cx.replaceBundleName = function e(t, r, n) {
    if (!(null == r ? void 0 : r.length)) {
        return t;
    }
    if (n || (n = new RegExp(r, "ig")), "string" == typeof t && n.test(t)) {
        return t.replace(n, e => `${e[0]}***${e[e.length - 1]}`);
    }
    if (Array.isArray(t)) {
        return t.map(t => e(t, r, n));
    }
    if ("object" == typeof t) {
        return Object.keys(t).reduce((o, i) => ({
            ...o,
            [i]: e(t[i], r, n)
        }), {});
    }
    return t;
};

class Fx {
    constructor(e) {
        this.fileLogger = e;
    }
    debug(e, ...t) {
        return this.fileLogger.debug(e, ...t), [ e, ...t ];
    }
    log(e, ...t) {
        this.fileLogger.log(e, ...t);
    }
    warn(e, ...t) {
        this.fileLogger.warn(e, ...t);
    }
    info(e, ...t) {
        this.fileLogger.info(e, ...t);
    }
    error(e, ...t) {
        this.fileLogger.error(e, ...t);
    }
}

function Px() {
    if (bx) {
        return Qd;
    }
    bx = 1;
    var e = g && g.__createBinding || (Object.create ? function(e, t, r, n) {
        void 0 === n && (n = r);
        var o = Object.getOwnPropertyDescriptor(t, r);
        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
            enumerable: !0,
            get: function() {
                return t[r];
            }
        }), Object.defineProperty(e, n, o);
    } : function(e, t, r, n) {
        void 0 === n && (n = r), e[n] = t[r];
    }), t = g && g.__setModuleDefault || (Object.create ? function(e, t) {
        Object.defineProperty(e, "default", {
            enumerable: !0,
            value: t
        });
    } : function(e, t) {
        e.default = t;
    }), r = g && g.__importStar || function(r) {
        if (r && r.__esModule) {
            return r;
        }
        var n = {};
        if (null != r) {
            for (var o in r) {
                "default" !== o && Object.prototype.hasOwnProperty.call(r, o) && e(n, r, o);
            }
        }
        return t(n, r), n;
    };
    Object.defineProperty(Qd, "__esModule", {
        value: !0
    }), Qd.configure = Qd.evaluateLogLevel = Qd.HvigorLogger = void 0;
    const n = r(l), o = ep, i = r(rd), a = Rv, u = TN, s = Dx(), c = Cx, f = qN;
    class d {
        constructor(e) {
            i.configure((0, f.updateConfiguration)()), this._logger = i.getLogger(e), this._logger.level = (0, 
            f.getLevel)(), this._filelogger = i.getLogger("debug-file"), this.anonymizeFileLogger = new c.FileLogger(i.getLogger("debug-file"));
        }
        static getInstance(e, t) {
            const r = `${e.name}:${t}`;
            return this.instanceMap.has(r) || this.instanceMap.set(r, new e(t)), this.instanceMap.get(r);
        }
        static getLogger(e) {
            return this.getInstance(d, e);
        }
        static getLoggerWithDurationId(e, t) {
            const r = {
                ...this.getInstance(d, e)
            }, n = Object.setPrototypeOf(r, d.prototype);
            return n.durationId = t, n;
        }
        static clean() {
            d.instanceMap.clear();
        }
        log(e, ...t) {
            this.createLogEventByDurationId(e, u.MetricLogType.INFO, ...t), this._logger.log(e, ...t), 
            this._filelogger.log(e, ...t);
        }
        debug(e, ...t) {
            this.createLogEventByDurationId(e, u.MetricLogType.DEBUG, ...t), this._logger.debug(e, ...t), 
            this._filelogger.debug(e, ...t);
        }
        info(e, ...t) {
            this.createLogEventByDurationId(e, u.MetricLogType.INFO, ...t), this._logger.info(e, ...t), 
            this._filelogger.debug(e, ...t);
        }
        warn(e, ...t) {
            void 0 !== e && "" !== e && (this.createLogEventByDurationId(e, u.MetricLogType.WARN, ...t), 
            this._logger.warn(e, ...t), this._filelogger.warn(e, ...t));
        }
        error(e, ...t) {
            this.createLogEventByDurationId(e, u.MetricLogType.ERROR, ...t), this._logger.error(e, ...t), 
            this._filelogger.warn(e, ...t);
        }
        anonymizeDebug(e, ...t) {
            this._logger.debug(e, ...t);
            const [r, ...n] = this.anonymizeFileLogger.debug(e, ...t);
            this.createLogEventByDurationId(r, u.MetricLogType.DEBUG, ...n);
        }
        _printTaskExecuteInfo(e, t) {
            this._logger.info(`Finished :${e}... after ${t}`), this._filelogger.info(`Finished :${e}... after ${t}`);
        }
        _printFailedTaskInfo(e) {
            this._logger.error(`Failed :${e}... `), this._filelogger.error(`Failed :${e}... `);
        }
        _printDisabledTaskInfo(e) {
            this._logger.info(`Disabled :${e}... `), this._filelogger.info(`Disabled :${e}... `);
        }
        _printUpToDateTaskInfo(e) {
            this._logger.info(`UP-TO-DATE :${e}...  `), this._filelogger.info(`UP-TO-DATE :${e}...  `);
        }
        _printStackErrorToFile(e, ...t) {
            this._filelogger.error(e, ...t);
        }
        errorMessageExit(e, ...t) {
            throw new Error(n.format(e, ...t));
        }
        errorExit(e, t, ...r) {
            if (t && (s.MetricFactory.createLogEvent(this.getMessage(t, ...r), u.MetricLogType.ERROR), 
            this._logger.error(t, r), this._filelogger.error(t, r)), this._logger.error(e.stack), 
            this._filelogger.error(e.stack), e.stack) {
                throw s.MetricFactory.createLogEvent(e.stack, u.MetricLogType.ERROR), e;
            }
        }
        getLevel() {
            return this._logger.level;
        }
        setLevel(e) {
            this._logger.level = e;
        }
        createLogEventByDurationId(e, t, ...r) {
            if ("string" == typeof e) {
                const n = s.MetricFactory.createLogEvent(this.getMessage(e, ...r), t);
                this.durationId && n.setDurationId(this.durationId);
            }
            return e;
        }
        getMessage(e, ...t) {
            return t.length > 0 ? n.format(e, ...t) : e;
        }
        getAdaptor(e) {
            return new o.HvigorErrorAdaptor(e);
        }
        combinePhase(e) {
            return a.hvigorTrace.traceErrorMessage(e), e.solutions ? o.ErrorUtil.combinePhase({
                code: e.code,
                cause: e.message,
                position: "",
                solutions: e.solutions,
                moreInfo: e.moreInfo
            }) : e.message;
        }
        formatErrorAdaptor(e, t, r) {
            let n = this.getAdaptor(e);
            return t && (n = n.formatMessage(...t)), r && r.forEach((e, t) => {
                n = n.formatSolutions(t, ...e);
            }), n;
        }
        printErrorWithAdaptorErrorMessage(e) {
            const t = this.combinePhase(e[0]);
            this._logger.error(t);
            for (let t = 1; t < e.length; ++t) {
                this.combinePhase(e[t]);
            }
        }
        printError(e, t, r) {
            const n = this.formatErrorAdaptor(e, t, r);
            this.printErrorWithAdaptorErrorMessage(n.getErrorMessage());
        }
        printErrorExit(e, t, r, n) {
            const i = this.formatErrorAdaptor(e, t, r), a = this.combinePhase(o.ErrorUtil.getFirstErrorAdaptorMessage(i.getErrorMessage()));
            throw new o.AdaptorError(a, n);
        }
        printErrorExitWithoutStack(e, t, r) {
            this.printError(e, t, r), process.exit(-1);
        }
    }
    return Qd.HvigorLogger = d, d.instanceMap = new Map, Qd.evaluateLogLevel = function(e, t) {
        (0, f.setCategoriesLevel)(e, t), i.shutdown(), i.configure((0, f.updateConfiguration)());
    }, Qd.configure = function(e) {
        const t = (0, f.getConfiguration)(), r = {
            appenders: {
                ...t.appenders,
                ...e.appenders
            },
            categories: {
                ...t.categories,
                ...e.categories
            }
        };
        (0, f.setConfiguration)(r), i.shutdown(), i.configure(r);
    }, Qd;
}

function Ix() {
    return Ax || (Ax = 1, function(e) {
        var o = g && g.__importDefault || function(e) {
            return e && e.__esModule ? e : {
                default: e
            };
        };
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.HvigorConfigReader = e.defaultOptions = void 0;
        const i = o(t), a = o(r), u = o(n), s = sr, l = cr, c = Oi, f = function() {
            if (Ox) {
                return Zd;
            }
            Ox = 1;
            var e = g && g.__createBinding || (Object.create ? function(e, t, r, n) {
                void 0 === n && (n = r);
                var o = Object.getOwnPropertyDescriptor(t, r);
                o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                    enumerable: !0,
                    get: function() {
                        return t[r];
                    }
                }), Object.defineProperty(e, n, o);
            } : function(e, t, r, n) {
                void 0 === n && (n = r), e[n] = t[r];
            }), n = g && g.__setModuleDefault || (Object.create ? function(e, t) {
                Object.defineProperty(e, "default", {
                    enumerable: !0,
                    value: t
                });
            } : function(e, t) {
                e.default = t;
            }), o = g && g.__importStar || function(t) {
                if (t && t.__esModule) {
                    return t;
                }
                var r = {};
                if (null != t) {
                    for (var o in t) {
                        "default" !== o && Object.prototype.hasOwnProperty.call(t, o) && e(r, t, o);
                    }
                }
                return n(r, t), r;
            };
            Object.defineProperty(Zd, "__esModule", {
                value: !0
            }), Zd.Json5Reader = void 0;
            const i = o(t), a = h, u = o(r), s = nd, l = Px();
            class c {
                static getJson5Obj(e, t = "utf-8") {
                    i.existsSync(e) || c.logger.printErrorExit("FILE_NOT_EXIST", [ e ]);
                    const r = i.readFileSync(u.resolve(e), {
                        encoding: t
                    });
                    try {
                        return (0, s.parseJsonText)(r);
                    } catch (t) {
                        c.handleException(e, t);
                    }
                }
                static async readJson5File(e, t = "utf-8") {
                    try {
                        return (0, a.readFile)(e, {
                            encoding: t
                        }).then(s.parseJsonText);
                    } catch (t) {
                        c.handleException(e, t);
                    }
                }
                static handleException(e, t) {
                    if (t instanceof SyntaxError) {
                        const r = t.message.split("at ");
                        2 === r.length && c.logger.printErrorExit("JSON_READER_SYNTAX_ERROR", [ r[0].trim(), e, r[1].trim() ]);
                    }
                    c.logger.printErrorExit("NOT_CORRECT_JSON_FORMAT", [ e ]);
                }
                static getJson5ObjProp(e, t) {
                    const r = t.split(".");
                    let n = e;
                    for (const e of r) {
                        if (void 0 === n[e]) {
                            return;
                        }
                        n = n[e];
                    }
                    return n;
                }
            }
            return Zd.Json5Reader = c, c.logger = l.HvigorLogger.getLogger(c.name), Zd;
        }();
        e.defaultOptions = {
            maxOldSpaceSize: 8192,
            maxSemiSpaceSize: 16,
            exposeGC: !0
        };
        class d extends f.Json5Reader {
            static getHvigorConfig() {
                const e = a.default.resolve(l.HVIGOR_PROJECT_WRAPPER_HOME, s.DEFAULT_HVIGOR_CONFIG_JSON_FILE_NAME);
                if (!i.default.existsSync(e)) {
                    return;
                }
                const t = this.getJson5Obj(e), r = a.default.resolve(l.HVIGOR_USER_HOME, s.DEFAULT_HVIGOR_CONFIG_JSON_FILE_NAME);
                let n;
                return i.default.existsSync(r) && (n = this.getJson5Obj(r), t.properties = {
                    ...n.properties,
                    ...t.properties
                }), t;
            }
            static getPropertiesConfigValue(e) {
                return c.HvigorConfigLoader.getInstance().getPropertiesConfigValue(e);
            }
            static getMaxOldSpaceSize(t = !1) {
                var r, n, o, i;
                const a = u.default.argv.find(e => e.startsWith(this.maxOldSpaceSizeParamPrefiex)), s = Number(null !== (r = null == a ? void 0 : a.slice((null == a ? void 0 : a.indexOf("=")) + 1)) && void 0 !== r ? r : ""), l = null === (o = null === (n = d.getHvigorConfig()) || void 0 === n ? void 0 : n.nodeOptions) || void 0 === o ? void 0 : o.maxOldSpaceSize, c = u.default.execArgv.find(e => e.startsWith(this.maxOldSpaceSizeParamPrefiex)), f = {
                    argv: s,
                    config: l,
                    execArgv: Number(null !== (i = null == c ? void 0 : c.slice((null == c ? void 0 : c.indexOf("=")) + 1)) && void 0 !== i ? i : ""),
                    default: e.defaultOptions.maxOldSpaceSize
                };
                return this.getPriorVal(f, t);
            }
            static getMaxSemiSpaceSize(t = !1) {
                var r, n, o, i;
                const a = u.default.argv.find(e => e.startsWith(this.maxSemiSpaceSizeParamPrefiex)), s = Number(null !== (r = null == a ? void 0 : a.slice((null == a ? void 0 : a.indexOf("=")) + 1)) && void 0 !== r ? r : ""), l = null === (o = null === (n = d.getHvigorConfig()) || void 0 === n ? void 0 : n.nodeOptions) || void 0 === o ? void 0 : o.maxSemiSpaceSize, c = u.default.execArgv.find(e => e.startsWith(this.maxSemiSpaceSizeParamPrefiex)), f = {
                    argv: s,
                    config: l,
                    execArgv: Number(null !== (i = null == c ? void 0 : c.slice((null == c ? void 0 : c.indexOf("=")) + 1)) && void 0 !== i ? i : ""),
                    default: e.defaultOptions.maxSemiSpaceSize
                };
                return this.getPriorVal(f, t);
            }
            static getNodeParamFromProcessArgv() {
                const e = [];
                for (const t of [ this.maxOldSpaceSizeParamPrefiex, this.maxSemiSpaceSizeParamPrefiex ]) {
                    const r = u.default.argv.find(e => e.startsWith(t));
                    r && e.push(r);
                }
                return e;
            }
            static getPriorVal(e, t) {
                return t ? e.config || e.default : e.argv || e.config || e.execArgv || e.default;
            }
        }
        e.HvigorConfigReader = d, d.maxOldSpaceSizeParamPrefiex = "--max-old-space-size=", 
        d.maxSemiSpaceSizeParamPrefiex = "--max-semi-space-size=";
    }(ur)), ur;
}

Sx([ Mx ], Fx.prototype, "debug", null), Sx([ Mx ], Fx.prototype, "log", null), 
Sx([ Mx ], Fx.prototype, "warn", null), Sx([ Mx ], Fx.prototype, "info", null), 
Sx([ Mx ], Fx.prototype, "error", null), Cx.FileLogger = Fx;

var Rx = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(ar, "__esModule", {
    value: !0
}), ar.calcChildExecArgv = void 0;

const Tx = Rx(n), Lx = Ix();

ar.calcChildExecArgv = function(e = !1) {
    var t, r;
    const n = [ ...Tx.default.execArgv ], o = `--max-old-space-size=${Lx.HvigorConfigReader.getMaxOldSpaceSize(e)}`, i = n.findIndex(e => e.startsWith("--max-old-space-size="));
    -1 !== i && n[i] ? n[i] = o : n.push(o);
    const a = `--max-semi-space-size=${Lx.HvigorConfigReader.getMaxSemiSpaceSize(e)}`, u = n.findIndex(e => e.startsWith("--max-semi-space-size="));
    -1 !== u && n[u] ? n[u] = a : n.push(a);
    const s = null === (r = null === (t = Lx.HvigorConfigReader.getHvigorConfig()) || void 0 === t ? void 0 : t.nodeOptions) || void 0 === r ? void 0 : r.exposeGC, l = n.indexOf("--expose-gc");
    return !1 === s || -1 !== l && n[l] ? !1 !== s || -1 === l && !n[l] || n.splice(l, 1) : n.push("--expose-gc"), 
    n;
};

var jx = g && g.__createBinding || (Object.create ? function(e, t, r, n) {
    void 0 === n && (n = r);
    var o = Object.getOwnPropertyDescriptor(t, r);
    o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
        enumerable: !0,
        get: function() {
            return t[r];
        }
    }), Object.defineProperty(e, n, o);
} : function(e, t, r, n) {
    void 0 === n && (n = r), e[n] = t[r];
}), Nx = g && g.__setModuleDefault || (Object.create ? function(e, t) {
    Object.defineProperty(e, "default", {
        enumerable: !0,
        value: t
    });
} : function(e, t) {
    e.default = t;
}), xx = g && g.__importStar || function(e) {
    if (e && e.__esModule) {
        return e;
    }
    var t = {};
    if (null != e) {
        for (var r in e) {
            "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && jx(t, e, r);
        }
    }
    return Nx(t, e), t;
};

Object.defineProperty(Qt, "__esModule", {
    value: !0
}), Qt.executeBuild = void 0;

const kx = i, Bx = xx(t), $x = xx(r), Hx = er, Ux = ar;

Qt.executeBuild = function(e) {
    var t, r;
    const n = $x.resolve(e, "node_modules", "@ohos", "hvigor", "bin", "hvigor.js");
    try {
        const e = Bx.realpathSync(n), o = process.argv.slice(2), i = (0, kx.fork)(e, o, {
            env: process.env,
            execArgv: (0, Ux.calcChildExecArgv)()
        });
        null === (t = i.stdout) || void 0 === t || t.on("data", e => {
            (0, Hx.logInfo)(`${e.toString().trim()}`);
        }), null === (r = i.stderr) || void 0 === r || r.on("data", e => {
            (0, Hx.logError)(`${e.toString().trim()}`);
        }), i.on("exit", (e, t) => {
            process.exit(null != e ? e : -1);
        });
    } catch (t) {
        (0, Hx.logFormatedErrorAndExit)("00308003", `ENOENT: no such file ${n}`, [ `delete ${e} and retry.` ]);
    }
};

var Gx = {}, Vx = {};

Object.defineProperty(Vx, "__esModule", {
    value: !0
}), Vx.exit = void 0, Vx.exit = function(e) {
    "win32" === process.platform && process.stdout.writableLength ? process.stdout.once("drain", function() {
        process.exit(e);
    }) : process.exit(e);
};

var Wx = {}, zx = "5.19.7", Jx = {
    options: {
        version: {
            name: "version",
            flag: "-v, --version",
            description: "Shows the version of Hvigor."
        },
        usage: {
            name: "hvigor",
            flag: "hvigor",
            description: "[taskNames...] <options...>"
        },
        basicOptions: [ {
            name: "error",
            flag: "-e, --error",
            description: "Sets the log level to error."
        }, {
            name: "warn",
            flag: "-w, --warn",
            description: "Sets the log level to warn."
        }, {
            name: "info",
            flag: "-i, --info",
            description: "Sets the log level to info."
        }, {
            name: "debug",
            flag: "-d, --debug",
            description: "Sets the log level to debug."
        }, {
            name: "config",
            flag: "-c, --config <config>",
            description: "Sets properties in the hvigor-config.json5 file. The settings will overwrite those in the file.",
            back: "array"
        }, {
            name: "prop",
            flag: "-p, --prop <value>",
            description: "Defines extra properties. (default: [])",
            back: "array"
        }, {
            name: "mode",
            flag: "-m, --mode <string>",
            description: "Sets the mode in which the command is executed."
        }, {
            name: "sync",
            flag: "-s, --sync",
            description: "Syncs the information in plugin for other platforms."
        }, {
            name: "nodeHome",
            flag: "--node-home, <string>",
            description: "Sets the Node.js location."
        }, {
            name: "stopDaemon",
            flag: "--stop-daemon",
            description: "Stops the current project's daemon process."
        }, {
            name: "stopDaemonAll",
            flag: "--stop-daemon-all",
            description: "Stops all projects' daemon process."
        }, {
            name: "statusDaemon",
            flag: "--status-daemon",
            description: "Shows the daemon process status of the current project."
        }, {
            name: "verboseAnalyze",
            flag: "--verbose-analyze",
            description: "Enables detailed mode for build analysis."
        }, {
            name: "watch",
            flag: "--watch",
            description: "Enables watch mode."
        }, {
            name: "hotCompile",
            flag: "--hot-compile",
            description: "HotReload watch mode to compile."
        }, {
            name: "hotBuild",
            flag: "--hot-reload-build",
            description: "HotReload build"
        }, {
            name: "maxOldSpaceSize",
            flag: "--max-old-space-size <integer>",
            description: "Sets the maximum memory size of V8's old memory section.",
            back: "number"
        }, {
            name: "maxSemiSpaceSize",
            flag: "--max-semi-space-size <integer>",
            description: "Sets the maximum memory size of V8's new space memory section."
        } ],
        otherOptions: [ {
            name: "xmx",
            flag: "--Xmx <integer>",
            description: "Sets the maximum JVM heap size, in MB.",
            back: "number"
        }, {
            name: "optimizationStrategy",
            flag: "--optimization-strategy <string>",
            description: "Sets the optimization strategy: memory, performance."
        }, {
            name: "enableTypeCheck",
            flag: "--enable-build-script-type-check",
            deprecated: !0,
            recommendedFlags: "type-check",
            description: "['--enable-build-script-type-check' deprecated: use 'type-check' instead] Enables the build script hvigorfile.ts type check. This option is deprecated. Use 'type-check' instead."
        }, {
            name: "stacktrace",
            flag: "stacktrace",
            description: "the printing of stack traces for all exceptions.",
            flagPair: !0
        }, {
            name: "typeCheck",
            flag: "type-check",
            description: "the build script hvigorfile.ts type check.",
            flagPair: !0
        }, {
            name: "parallel",
            flag: "parallel",
            description: "parallel building mode.",
            flagPair: !0
        }, {
            name: "incremental",
            flag: "incremental",
            description: "incremental building mode.",
            flagPair: !0
        }, {
            name: "daemon",
            flag: "daemon",
            description: "building with daemon process.",
            flagPair: !0
        }, {
            name: "generateBuildProfile",
            flag: "generate-build-profile",
            description: "the generation of BuildProfile.ets files.",
            flagPair: !0
        }, {
            name: "analyze",
            flag: "analyze",
            description: "build analysis.",
            flagPair: !0
        }, {
            name: "analysisMode",
            flag: "--analyze=<analysisMode>",
            description: "Sets the build analysis mode: normal (default), advanced, false."
        } ]
    },
    command: [ {
        name: "version",
        description: "Shows the version of Hvigor."
    }, {
        name: "tasks",
        description: "Shows all available tasks of specific modules."
    }, {
        name: "taskTree",
        description: "Shows all available task trees of specific modules."
    }, {
        name: "prune",
        description: "Cleans up Hvigor cache files and removes unreferenced packages from store."
    }, {
        name: "collectCoverage",
        description: "Generates coverage statistics reports based on instrumentation test data."
    } ],
    help: {
        name: "",
        flag: "-h, --help",
        description: "Displays help information."
    },
    after: [ {
        position: "after",
        text: "\nExamples:\n  hvigor assembleApp  Do assembleApp task\n"
    }, {
        position: "after",
        text: "copyright 2023"
    } ]
};

!function(e) {
    var t = g && g.__createBinding || (Object.create ? function(e, t, r, n) {
        void 0 === n && (n = r);
        var o = Object.getOwnPropertyDescriptor(t, r);
        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
            enumerable: !0,
            get: function() {
                return t[r];
            }
        }), Object.defineProperty(e, n, o);
    } : function(e, t, r, n) {
        void 0 === n && (n = r), e[n] = t[r];
    }), n = g && g.__setModuleDefault || (Object.create ? function(e, t) {
        Object.defineProperty(e, "default", {
            enumerable: !0,
            value: t
        });
    } : function(e, t) {
        e.default = t;
    }), o = g && g.__importStar || function(e) {
        if (e && e.__esModule) {
            return e;
        }
        var r = {};
        if (null != e) {
            for (var o in e) {
                "default" !== o && Object.prototype.hasOwnProperty.call(e, o) && t(r, e, o);
            }
        }
        return n(r, e), r;
    };
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.WORK_SPACE = e.HVIGOR_PROJECT_WRAPPER_HOME = e.HVIGOR_PNPM_STORE_PATH = e.HVIGOR_WRAPPER_PNPM_SCRIPT_PATH = e.HVIGOR_WRAPPER_TOOLS_HOME = e.HVIGOR_USER_HOME = e.META_DATA_JSON = e.DEFAULT_PACKAGE_JSON = e.DEFAULT_HVIGOR_CONFIG_JSON_FILE_NAME = e.PNPM_TOOL = e.DEFAULT_PROJECT_NODE_PATH = e.HVIGOR_PROJECT_ROOT_DIR = e.COMMAND_DESCRIPTION = e.CUR_HVIGOR_VERSION = e.HVIGOR_PACKAGE_NAME = void 0;
    const i = o(r), a = m, u = fr;
    e.HVIGOR_PACKAGE_NAME = zx, e.CUR_HVIGOR_VERSION = zx, e.COMMAND_DESCRIPTION = Jx, 
    e.HVIGOR_PROJECT_ROOT_DIR = process.cwd(), e.DEFAULT_PROJECT_NODE_PATH = process.env.NODE_PATH, 
    e.PNPM_TOOL = (0, a.isWindows)() ? "pnpm.cmd" : "pnpm", e.DEFAULT_HVIGOR_CONFIG_JSON_FILE_NAME = "hvigor-config.json5", 
    e.DEFAULT_PACKAGE_JSON = "package.json", e.META_DATA_JSON = "metadata.json", e.HVIGOR_USER_HOME = (0, 
    u.getHvigorUserHomeCacheDir)(), e.HVIGOR_WRAPPER_TOOLS_HOME = i.resolve(e.HVIGOR_USER_HOME, "wrapper", "tools"), 
    e.HVIGOR_WRAPPER_PNPM_SCRIPT_PATH = i.resolve(e.HVIGOR_WRAPPER_TOOLS_HOME, "node_modules", ".bin", e.PNPM_TOOL), 
    e.HVIGOR_PNPM_STORE_PATH = i.resolve(e.HVIGOR_USER_HOME, "caches"), e.HVIGOR_PROJECT_WRAPPER_HOME = i.resolve(e.HVIGOR_PROJECT_ROOT_DIR, "hvigor"), 
    e.WORK_SPACE = "workspace";
}(Wx), Object.defineProperty(Gx, "__esModule", {
    value: !0
}), Gx.globalHelpCommands = Gx.globalVersionCommands = Gx.GlobalExecute = void 0;

const Kx = Vx, qx = Wx, Xx = Jx;

function Yx(e, t = 34, r = " ") {
    return e.padEnd(t, r);
}

Gx.GlobalExecute = {
    version: e => {
        e.includes("--version") || e.includes("-v") ? (console.log(qx.CUR_HVIGOR_VERSION), 
        (0, Kx.exit)(0)) : (console.log("hvigor", "[32mCLI version:", qx.CUR_HVIGOR_VERSION, "[0m"), 
        console.log("hvigor", "[32mLocal version:", qx.CUR_HVIGOR_VERSION || "Unknown", "[0m"), 
        (0, Kx.exit)(0));
    },
    help: () => {
        console.log("Usage: ", Xx.options.usage.flag, Xx.options.usage.description, "\n"), 
        console.group("Options: ");
        const e = Xx.options.version, t = Xx.options.basicOptions;
        console.log(Yx(e.flag), e.description), t.forEach(e => {
            console.log(Yx(e.flag), e.description);
        });
        Xx.options.otherOptions.forEach(e => {
            e.flagPair ? (console.log(Yx("--".concat(e.flag)), "Enables ".concat(e.description)), 
            console.log(Yx("--no-".concat(e.flag)), "Disables ".concat(e.description))) : console.log(Yx(e.flag), e.description);
        });
        const r = Xx.help;
        console.log(Yx(r.flag), r.description, "\n"), console.groupEnd(), console.group("Commands: ");
        Xx.command.forEach(e => {
            console.log(Yx(e.name), e.description);
        }), console.groupEnd();
        const n = Xx.after;
        null == n || n.forEach(e => {
            console.log(e.text);
        }), (0, Kx.exit)(0);
    }
}, Gx.globalVersionCommands = [ "-v", "--version", "version" ], Gx.globalHelpCommands = [ "-h", "--help" ];

var Zx = {}, Qx = {}, ek = g && g.__createBinding || (Object.create ? function(e, t, r, n) {
    void 0 === n && (n = r);
    var o = Object.getOwnPropertyDescriptor(t, r);
    o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
        enumerable: !0,
        get: function() {
            return t[r];
        }
    }), Object.defineProperty(e, n, o);
} : function(e, t, r, n) {
    void 0 === n && (n = r), e[n] = t[r];
}), tk = g && g.__setModuleDefault || (Object.create ? function(e, t) {
    Object.defineProperty(e, "default", {
        enumerable: !0,
        value: t
    });
} : function(e, t) {
    e.default = t;
}), rk = g && g.__importStar || function(e) {
    if (e && e.__esModule) {
        return e;
    }
    var t = {};
    if (null != e) {
        for (var r in e) {
            "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && ek(t, e, r);
        }
    }
    return tk(t, e), t;
};

Object.defineProperty(Qx, "__esModule", {
    value: !0
}), Qx.checkSync = Qx.unlockSync = Qx.lockSync = void 0;

const nk = rk(di), ok = new Map;

function ik(e, t) {
    const r = sk(t);
    let n = 0;
    for (;n <= r.retries; ) {
        if (!uk(e)) {
            try {
                ak(e, r);
                break;
            } catch (e) {}
            n++;
        }
    }
    if (n >= r.retries) {
        throw new Error(`The registration information of the daemon cannot be obtained. Delete ${e}.lock and try again`);
    }
    !function(e, t) {
        var r;
        const n = `${e}.lock`, o = ok.get(e), i = () => {
            clearInterval(null == o ? void 0 : o.updateTimer), ok.delete(e), nk.removeSync(n);
        };
        if (void 0 === o) {
            return;
        }
        o.updateTimer = setInterval(() => {
            if (o.release) {
                clearInterval(o.updateTimer), nk.removeSync(n);
            } else {
                let e = o.lastUpdate + t.stale < Date.now();
                const r = new Date(Date.now());
                try {
                    if (o.mtime !== nk.statSync(n).mtime.getTime() || void 0 === o.mtime) {
                        return void i();
                    }
                } catch (t) {
                    ("ENOENT" === t.code || e) && i();
                }
                try {
                    nk.utimesSync(n, r, r);
                } catch (r) {
                    e = o.lastUpdate + t.stale < Date.now(), ("ENOENT" === r.code || e) && i();
                }
                o.mtime = r.getTime(), o.lastUpdate = Date.now();
            }
        }, t.update), null === (r = o.updateTimer) || void 0 === r || r.unref();
    }(e, r);
}

function ak(e, t) {
    const r = `${e}.lock`;
    try {
        nk.mkdirSync(r);
    } catch (n) {
        if ("EEXIST" !== n.code) {
            throw n;
        }
        try {
            if (!lk(nk.statSync(r), t)) {
                throw new Error(`Lock file ${r} has been held by other process.`);
            }
            nk.removeSync(r), ik(e, t);
        } catch (r) {
            if ("EONENT" !== r.code) {
                throw r;
            }
            ik(e, t);
        }
    }
    const n = new Date(Date.now() + 5);
    try {
        nk.utimesSync(r, n, n);
    } catch (e) {
        throw nk.removeSync(r), e;
    }
    ok.set(e, {
        mtime: n.getTime(),
        lastUpdate: Date.now(),
        option: t,
        lockPath: r,
        release: !1
    });
}

function uk(e, t) {
    const r = `${e}.lock`, n = sk(t);
    if (nk.existsSync(r)) {
        try {
            return !lk(nk.statSync(r), n);
        } catch (e) {
            if ("ENOENT" === e.code) {
                return !1;
            }
            throw e;
        }
    }
    return !1;
}

function sk(e) {
    const t = {
        stale: 1e4,
        retries: 0,
        update: 5e3,
        ...e
    };
    return t.stale = Math.max(t.stale || 2e3), t.update = Math.max(t.update, t.stale / 2), 
    t;
}

function lk(e, t) {
    return e.mtime.getTime() + t.stale < Date.now();
}

Qx.lockSync = ik, Qx.unlockSync = function(e) {
    const t = `${e}.lock`, r = ok.get(e);
    r && (ok.delete(e), r.release = !0, clearInterval(r.updateTimer), nk.removeSync(t));
}, Qx.checkSync = uk;

var ck = {}, fk = {}, dk = {}, pk = {}, vk = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(pk, "__esModule", {
    value: !0
}), pk.getHvigorUserHomeDir = void 0;

const hk = vk(di), gk = vk(a), yk = vk(r), mk = er;

let Ek = !1;

var _k, Dk, bk;

function Ok() {
    if (_k) {
        return fk;
    }
    _k = 1;
    var e = g && g.__createBinding || (Object.create ? function(e, t, r, n) {
        void 0 === n && (n = r);
        var o = Object.getOwnPropertyDescriptor(t, r);
        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
            enumerable: !0,
            get: function() {
                return t[r];
            }
        }), Object.defineProperty(e, n, o);
    } : function(e, t, r, n) {
        void 0 === n && (n = r), e[n] = t[r];
    }), n = g && g.__setModuleDefault || (Object.create ? function(e, t) {
        Object.defineProperty(e, "default", {
            enumerable: !0,
            value: t
        });
    } : function(e, t) {
        e.default = t;
    }), o = g && g.__importStar || function(t) {
        if (t && t.__esModule) {
            return t;
        }
        var r = {};
        if (null != t) {
            for (var o in t) {
                "default" !== o && Object.prototype.hasOwnProperty.call(t, o) && e(r, t, o);
            }
        }
        return n(r, t), r;
    }, a = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty(fk, "__esModule", {
        value: !0
    }), fk.isHvigorDependencyUseNpm = fk.isFileExists = fk.offlinePluginConversion = fk.executeCommand = fk.getNpmPath = fk.hasNpmPackInPaths = fk.BASE_NODE_VERSION = void 0;
    const u = i, s = a(t), l = a(di), c = o(r), f = sr, d = nd, p = Ck(), v = er, h = dk;
    fk.BASE_NODE_VERSION = "16.0.0";
    const y = "hvigor.dependency.useNpm";
    return fk.hasNpmPackInPaths = function(e, t) {
        try {
            return require.resolve(e, {
                paths: [ ...t ]
            }), !0;
        } catch (e) {
            return !1;
        }
    }, fk.getNpmPath = function() {
        const e = process.execPath;
        return c.join(c.dirname(e), f.NPM_TOOL);
    }, fk.executeCommand = function(e, t, r) {
        if (0 !== (0, u.spawnSync)(e, t, r).status) {
            let r = "See above for details.";
            e.includes(" ") && (r = "Space is not supported in HVIGOR_USER_HOME. Remove the space in HVIGOR_USER_HOME to fix the issue."), 
            (0, v.logFormatedErrorAndExit)("00308002", `${e} ${t} execute failed.`, [ r ]);
        }
    }, fk.offlinePluginConversion = function(e, t) {
        return t.startsWith("file:") || t.endsWith(".tgz") ? c.resolve(e, f.HVIGOR, t.replace("file:", "")) : t;
    }, fk.isFileExists = function(e) {
        return s.default.existsSync(e) && s.default.statSync(e).isFile();
    }, fk.isHvigorDependencyUseNpm = function() {
        var e, t, r;
        const n = c.resolve(h.HVIGOR_USER_HOME, f.DEFAULT_HVIGOR_CONFIG_JSON_FILE_NAME);
        let o;
        l.default.existsSync(n) && (o = (0, d.parseJsonFile)(n));
        const i = null !== (r = null !== (t = null === (e = (0, p.readProjectHvigorConfig)()) || void 0 === e ? void 0 : e.properties) && void 0 !== t ? t : null == o ? void 0 : o.properties) && void 0 !== r ? r : void 0;
        return !(!i || !i[y]) && i[y];
    }, fk;
}

function Ak() {
    return Dk || (Dk = 1, function(e) {
        var n = g && g.__createBinding || (Object.create ? function(e, t, r, n) {
            void 0 === n && (n = r);
            var o = Object.getOwnPropertyDescriptor(t, r);
            o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
                enumerable: !0,
                get: function() {
                    return t[r];
                }
            }), Object.defineProperty(e, n, o);
        } : function(e, t, r, n) {
            void 0 === n && (n = r), e[n] = t[r];
        }), o = g && g.__setModuleDefault || (Object.create ? function(e, t) {
            Object.defineProperty(e, "default", {
                enumerable: !0,
                value: t
            });
        } : function(e, t) {
            e.default = t;
        }), u = g && g.__importStar || function(e) {
            if (e && e.__esModule) {
                return e;
            }
            var t = {};
            if (null != e) {
                for (var r in e) {
                    "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && n(t, e, r);
                }
            }
            return o(t, e), t;
        }, s = g && g.__importDefault || function(e) {
            return e && e.__esModule ? e : {
                default: e
            };
        };
        Object.defineProperty(e, "__esModule", {
            value: !0
        }), e.executeInstallPnpm = e.isPnpmInstalled = e.environmentHandler = e.checkNpmConifg = e.PNPM_VERSION = void 0;
        const l = i, c = u(t), f = s(a), d = u(r), p = sr, v = fr, h = Ck(), y = er, m = Ok();
        function E() {
            (0, y.logFormatedError)("00303137", "The hvigor depends on the npmrc file. No npmrc file is matched in the current user folder. Configure the npmrc file first.", [ "Configure the .npmrc file in the user directory." ]);
        }
        e.PNPM_VERSION = "8.13.1", e.checkNpmConifg = function() {
            const e = d.resolve(process.cwd(), ".npmrc"), t = d.resolve(f.default.homedir(), ".npmrc");
            if (process.env.npm_config_registry && process.env["npm_config_@ohos:registry"]) {
                return;
            }
            const r = (0, h.readProjectHvigorConfig)();
            if (!(null == r ? void 0 : r.dependencies) || 0 === Object.entries(null == r ? void 0 : r.dependencies).length) {
                return;
            }
            if ((0, m.isFileExists)(e) || (0, m.isFileExists)(t)) {
                return;
            }
            const n = (0, m.getNpmPath)(), o = (0, l.spawnSync)(n, [ "config", "get", "prefix" ], {
                cwd: process.cwd()
            });
            if (0 !== o.status || !o.stdout) {
                return void E();
            }
            const i = d.resolve(`${o.stdout}`.replace(/[\r\n]/gi, ""), ".npmrc");
            (0, m.isFileExists)(i) || E();
        }, e.environmentHandler = function() {
            process.env["npm_config_update-notifier"] = "false", process.env["npm_config_auto-install-peers"] = "false";
        };
        const _ = (0, v.getHvigorUserHomeCacheDir)(), D = d.resolve(_, "wrapper", "tools"), b = d.resolve(D, "node_modules", ".bin", p.PNPM_TOOL);
        e.isPnpmInstalled = function() {
            return !!c.existsSync(b) && (0, m.hasNpmPackInPaths)("pnpm", [ D ]);
        }, e.executeInstallPnpm = function() {
            (0, y.logInfo)(`Installing pnpm@${e.PNPM_VERSION}...`);
            const t = (0, m.getNpmPath)();
            !function() {
                const t = d.resolve(D, p.DEFAULT_PACKAGE_JSON);
                try {
                    c.existsSync(D) || c.mkdirSync(D, {
                        recursive: !0
                    });
                    const r = {
                        dependencies: {}
                    };
                    r.dependencies[p.PNPM] = e.PNPM_VERSION, c.writeFileSync(t, JSON.stringify(r));
                } catch (e) {
                    (0, y.logFormatedErrorAndExit)("00307001", `EPERM: operation not permitted,create ${t} failed.`, [ "Check whether you have the permission to write files." ]);
                }
            }(), (0, m.executeCommand)(t, [ "install", "pnpm" ], {
                cwd: D,
                stdio: [ "inherit", "inherit", "inherit" ],
                env: process.env
            }), (0, y.logInfo)("Pnpm install success.");
        };
    }(ck)), ck;
}

function Ck() {
    if (bk) {
        return Zx;
    }
    bk = 1;
    var e = g && g.__createBinding || (Object.create ? function(e, t, r, n) {
        void 0 === n && (n = r);
        var o = Object.getOwnPropertyDescriptor(t, r);
        o && !("get" in o ? !t.__esModule : o.writable || o.configurable) || (o = {
            enumerable: !0,
            get: function() {
                return t[r];
            }
        }), Object.defineProperty(e, n, o);
    } : function(e, t, r, n) {
        void 0 === n && (n = r), e[n] = t[r];
    }), o = g && g.__setModuleDefault || (Object.create ? function(e, t) {
        Object.defineProperty(e, "default", {
            enumerable: !0,
            value: t
        });
    } : function(e, t) {
        e.default = t;
    }), i = g && g.__importStar || function(t) {
        if (t && t.__esModule) {
            return t;
        }
        var r = {};
        if (null != t) {
            for (var n in t) {
                "default" !== n && Object.prototype.hasOwnProperty.call(t, n) && e(r, t, n);
            }
        }
        return o(r, t), r;
    }, u = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty(Zx, "__esModule", {
        value: !0
    }), Zx.readProjectHvigorConfig = Zx.linkHvigorToWorkspace = Zx.initProjectWorkSpace = void 0;
    const s = i(t), l = u(di), c = u(a), f = i(r), d = u(n), p = Zt, v = Qx, h = sr, y = cr, E = m, _ = nd, D = er, b = Ak(), O = Ok(), A = dk, C = Vx, S = zx;
    let M, w, F;
    const P = d.default.version.slice(1);
    Zx.initProjectWorkSpace = function() {
        if (M = N(), F = f.resolve(A.HVIGOR_USER_HOME, h.PROJECT_CACHES, (0, E.hash)(f.resolve(d.default.cwd())), h.WORK_SPACE), 
        w = function() {
            const e = f.resolve(F, h.DEFAULT_PACKAGE_JSON);
            return s.existsSync(e) ? (0, _.parseJsonFile)(e) : {
                dependencies: {}
            };
        }(), !function() {
            function e(e) {
                const t = null == e ? void 0 : e.dependencies;
                return void 0 === t ? 0 : Object.getOwnPropertyNames(t).length;
            }
            const t = e(M), r = e(w);
            if (t !== r) {
                return !1;
            }
            for (const e in null == M ? void 0 : M.dependencies) {
                if (!(0, O.hasNpmPackInPaths)(e, [ F ]) || !L(e, M, w)) {
                    return !1;
                }
            }
            return !0;
        }()) {
            try {
                (0, b.checkNpmConifg)(), function() {
                    var e;
                    (0, D.logInfo)("Installing dependencies...");
                    const t = f.resolve(F, ".pnpmfile.js");
                    l.default.existsSync(t) && l.default.rmSync(t, {
                        force: !0
                    });
                    for (const [t, r] of Object.entries(null !== (e = null == M ? void 0 : M.dependencies) && void 0 !== e ? e : {})) {
                        r && (M.dependencies[t] = (0, O.offlinePluginConversion)(d.default.cwd(), r));
                    }
                    const r = {
                        dependencies: {
                            ...M.dependencies
                        }
                    };
                    try {
                        s.mkdirSync(F, {
                            recursive: !0
                        });
                        const e = f.resolve(F, h.DEFAULT_PACKAGE_JSON);
                        s.writeFileSync(e, JSON.stringify(r));
                    } catch (e) {
                        (0, D.logErrorAndExit)(e);
                    }
                    (function() {
                        const e = [ "install" ];
                        (0, E.isCI)() && e.push("--no-frozen-lockfile");
                        l.default.existsSync(f.resolve(y.HVIGOR_PROJECT_ROOT_DIR, ".npmrc")) && (d.default.env.npm_config_userconfig = function(e) {
                            const t = j();
                            try {
                                let r = "";
                                const n = f.resolve(c.default.homedir(), ".npmrc");
                                l.default.existsSync(n) && (r = l.default.readFileSync(n, "utf-8"));
                                const o = l.default.readFileSync(e, "utf-8"), i = `${r}${c.default.EOL}${o}`;
                                l.default.ensureFileSync(t), l.default.writeFileSync(t, i);
                            } catch (e) {
                                (0, D.logErrorAndExit)(e);
                            }
                            return t;
                        }(f.resolve(y.HVIGOR_PROJECT_ROOT_DIR, ".npmrc")));
                        const t = {
                            cwd: F,
                            stdio: [ "inherit", "inherit", "inherit" ],
                            env: d.default.env
                        };
                        if ((0, O.isHvigorDependencyUseNpm)() || (0, p.lt)(P, O.BASE_NODE_VERSION)) {
                            const t = f.resolve(F, "node_modules/@ohos/hvigor"), r = f.resolve(F, "node_modules/@ohos/hvigor-ohos-plugin");
                            s.existsSync(t) && s.unlinkSync(t), s.existsSync(r) && s.unlinkSync(r), (0, O.executeCommand)(h.NPM_TOOL, e, {
                                cwd: F
                            }), R(F);
                        } else {
                            !function() {
                                try {
                                    const e = j();
                                    let t = [];
                                    if (l.default.existsSync(e)) {
                                        t = l.default.readFileSync(e, "utf-8").split(c.default.EOL), t.every(e => !e.startsWith("store-dir")) && t.push(`store-dir=${A.HVIGOR_PNPM_STORE_PATH}`);
                                    } else {
                                        t.push(`store-dir=${A.HVIGOR_PNPM_STORE_PATH}`);
                                    }
                                    (0, v.lockSync)(e, {
                                        retries: 100,
                                        update: 1e3
                                    }), l.default.ensureFileSync(e), l.default.writeFileSync(e, t.join(c.default.EOL)), 
                                    (0, v.unlockSync)(e);
                                } catch (e) {
                                    (0, D.logErrorAndExit)(e);
                                }
                            }(), (0, O.executeCommand)(A.HVIGOR_WRAPPER_PNPM_SCRIPT_PATH, e, t);
                        }
                    })(), (0, D.logInfo)("Hvigor install success.");
                }();
            } catch (e) {
                !function() {
                    if ((0, D.logInfo)("Hvigor cleaning..."), !s.existsSync(F)) {
                        return;
                    }
                    const e = s.readdirSync(F);
                    if (!e || 0 === e.length) {
                        return;
                    }
                    const t = f.resolve(F, "node_modules", "@ohos", "hvigor", "bin", "hvigor.js");
                    s.existsSync(t) && (0, O.executeCommand)(d.default.argv[0], [ t, "--stop-daemon" ], {});
                    try {
                        e.forEach(e => {
                            s.rmSync(f.resolve(F, e), {
                                recursive: !0
                            });
                        });
                    } catch (e) {
                        (0, D.logErrorAndExit)(`The hvigor build tool cannot be installed. Please manually clear the workspace directory and synchronize the project again.\n\n      Workspace Path: ${F}.`);
                    }
                }();
            }
        }
        return R(F), F;
    };
    const I = "win32" === d.default.platform || "Windows_NT" === c.default.type();
    function R(e) {
        const t = f.resolve(__dirname, ".."), r = f.resolve(e, "node_modules", "@ohos"), n = I ? "junction" : "dir";
        try {
            l.default.ensureDirSync(r), (null == M ? void 0 : M.dependencies["@ohos/hvigor"]) || T(f.resolve(r, "hvigor"), f.resolve(t, "hvigor"), n), 
            (null == M ? void 0 : M.dependencies["@ohos/hvigor-ohos-plugin"]) || T(f.resolve(r, "hvigor-ohos-plugin"), f.resolve(t, "hvigor-ohos-plugin"), n), 
            (null == M ? void 0 : M.dependencies["@ohos/cangjie-build-support"]) || function(e, t, r) {
                const n = d.default.env.DEVECO_CANGJIE_PATH;
                if (void 0 !== n && s.existsSync(n)) {
                    const e = f.resolve(n, "compiler", "tools", "hvigor", "cangjie-build-support");
                    if (s.existsSync(e)) {
                        return void T(f.resolve(t, "cangjie-build-support"), e, r);
                    }
                }
                const o = f.resolve(e, "../../plugins/cangjie/hvigor/cangjie-build-support");
                s.existsSync(o) && T(f.resolve(t, "cangjie-build-support"), o, r);
            }(t, r, n);
        } catch (e) {
            (0, D.logErrorAndExit)(e);
        }
    }
    function T(e, t, r) {
        try {
            if (!s.existsSync(e)) {
                return void s.symlinkSync(t, e, r);
            }
            const n = f.resolve(s.readlinkSync(e));
            if (!s.lstatSync(e).isSymbolicLink() || n !== t) {
                return s.rmSync(e, {
                    recursive: !0,
                    force: !0
                }), void s.symlinkSync(t, e, r);
            }
            (0, _.parseJsonFile)(f.resolve(n, "package.json")).version !== S && (s.rmSync(e, {
                recursive: !0,
                force: !0
            }), s.symlinkSync(t, e, r));
        } catch (n) {
            s.rmSync(e, {
                recursive: !0,
                force: !0
            }), s.symlinkSync(t, e, r);
        }
    }
    function L(e, t, r) {
        return void 0 !== r.dependencies && (0, O.offlinePluginConversion)(d.default.cwd(), t.dependencies[e]) === f.normalize(r.dependencies[e]);
    }
    function j() {
        return f.resolve(f.dirname(F), ".npmrc");
    }
    function N() {
        var e;
        const t = f.resolve(y.HVIGOR_PROJECT_WRAPPER_HOME, h.DEFAULT_HVIGOR_CONFIG_JSON_FILE_NAME);
        let r;
        s.existsSync(t) || (0, D.logFormatedErrorAndExit)("00304004", `Hvigor config file ${t} does not exist.`, [ "Check whether the hvigor-config.json5 file exists." ]);
        try {
            r = (0, _.parseJsonFile)(t), r.dependencies = null !== (e = r.dependencies) && void 0 !== e ? e : {};
        } catch (e) {
            if (e instanceof Error) {
                let t = `${e.message}`;
                d.default.argv.includes("--stacktrace") && e.stack && (t += `${e.stack}`);
                let r = [ "Correct the syntax error as indicated above in the hvigor-config.json5 file." ];
                (0, D.logFormatedError)("00303232", t, r), (0, C.exit)(-1);
            }
        }
        return r;
    }
    return Zx.linkHvigorToWorkspace = R, Zx.readProjectHvigorConfig = N, Zx;
}

pk.getHvigorUserHomeDir = function() {
    const e = yk.default.resolve(gk.default.homedir(), ".hvigor"), t = process.env.HVIGOR_USER_HOME;
    return void 0 === t ? e : yk.default.isAbsolute(t) ? hk.default.existsSync(t) && hk.default.statSync(t).isFile() ? ((0, 
    mk.logInfo)(`File already exists: ${t}`), e) : (hk.default.ensureDirSync(t), t) : (Ek || ((0, 
    mk.logInfo)(`Invalid custom userhome hvigor data dir:${t}`), Ek = !0), e);
}, function(e) {
    var t = g && g.__importDefault || function(e) {
        return e && e.__esModule ? e : {
            default: e
        };
    };
    Object.defineProperty(e, "__esModule", {
        value: !0
    }), e.HVIGOR_PROJECT_WRAPPER_HOME = e.HVIGOR_PROJECT_ROOT_DIR = e.HVIGOR_PNPM_STORE_PATH = e.HVIGOR_WRAPPER_PNPM_SCRIPT_PATH = e.HVIGOR_WRAPPER_TOOLS_HOME = e.HVIGOR_USER_HOME = void 0;
    const n = t(r), o = sr, i = pk;
    e.HVIGOR_USER_HOME = (0, i.getHvigorUserHomeDir)(), e.HVIGOR_WRAPPER_TOOLS_HOME = n.default.resolve(e.HVIGOR_USER_HOME, "wrapper", "tools"), 
    e.HVIGOR_WRAPPER_PNPM_SCRIPT_PATH = n.default.resolve(e.HVIGOR_WRAPPER_TOOLS_HOME, "node_modules", ".bin", o.PNPM_TOOL), 
    e.HVIGOR_PNPM_STORE_PATH = n.default.resolve(e.HVIGOR_USER_HOME, "caches"), e.HVIGOR_PROJECT_ROOT_DIR = process.cwd(), 
    e.HVIGOR_PROJECT_WRAPPER_HOME = n.default.resolve(e.HVIGOR_PROJECT_ROOT_DIR, o.HVIGOR);
}(dk);

var Sk = g && g.__importDefault || function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
};

Object.defineProperty(y, "__esModule", {
    value: !0
});

const Mk = Sk(t), wk = Sk(r), Fk = Sk(n), Pk = m, Ik = Zt, Rk = Qt, Tk = Gx, Lk = Ck(), jk = Ak(), Nk = Ok();

!function() {
    (0, jk.environmentHandler)(), function() {
        const e = Fk.default.argv.slice(2);
        e.filter(e => Tk.globalVersionCommands.includes(e)).length > 0 && Tk.GlobalExecute.version(e.toString()), 
        e.filter(e => Tk.globalHelpCommands.includes(e)).length > 0 && Tk.GlobalExecute.help();
    }(), (0, Ik.gte)(Fk.default.version.slice(1), Nk.BASE_NODE_VERSION) && !(0, Nk.isHvigorDependencyUseNpm)() && ((0, 
    jk.isPnpmInstalled)() || ((0, jk.checkNpmConifg)(), (0, jk.executeInstallPnpm)()));
    const e = wk.default.resolve(__dirname, "../../ohpm/bin/", (0, Pk.isWindows)() ? "ohpm.bat" : "ohpm");
    Mk.default.existsSync(e) && (Fk.default.env.ohpmBin = e);
    const t = (0, Lk.initProjectWorkSpace)();
    (0, Rk.executeBuild)(t);
}(), module.exports = y;