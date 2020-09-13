(function(){
"use strict";
function ՐՏ_extends(child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.__base__ = parent;
    child.prototype.constructor = child;
}
function ՐՏ_eq(a, b) {
    var ՐՏitr1, ՐՏidx1;
    var i;
    if (a === b) {
        return true;
    }
    if (a === void 0 || b === void 0 || a === null || b === null) {
        return false;
    }
    if (a.constructor !== b.constructor) {
        return false;
    }
    if (Array.isArray(a)) {
        if (a.length !== b.length) {
            return false;
        }
        for (i = 0; i < a.length; i++) {
            if (!ՐՏ_eq(a[i], b[i])) {
                return false;
            }
        }
        return true;
    } else if (a.constructor === Object) {
        if (Object.keys(a).length !== Object.keys(b).length) {
            return false;
        }
        ՐՏitr1 = ՐՏ_Iterable(a);
        for (ՐՏidx1 = 0; ՐՏidx1 < ՐՏitr1.length; ՐՏidx1++) {
            i = ՐՏitr1[ՐՏidx1];
            if (!ՐՏ_eq(a[i], b[i])) {
                return false;
            }
        }
        return true;
    } else if (Set && a.constructor === Set || Map && a.constructor === Map) {
        if (a.size !== b.size) {
            return false;
        }
        for (i of a) {
            if (!b.has(i)) {
                return false;
            }
        }
        return true;
    } else if (a.constructor === Date) {
        return a.getTime() === b.getTime();
    } else if (typeof a.__eq__ === "function") {
        return a.__eq__(b);
    }
    return false;
}

(function(){

    var __name__ = "__main__";

    var RS_REQ, merge_call;
    RS_REQ = "amd";
    function parse_imports(args) {
        var path, _path;
        path = [];
        _path = [];
        function push_path(p) {
            path.push(p);
            if (typeof p === "string") {
                _path.push(p);
            } else {
                _path.push.apply(_path, Object.keys(p));
            }
        }
        args.forEach(function(it) {
            var from_, imports, pack, p, alias, tmp;
            if (typeof it === "string") {
                push_path(it);
            } else {
                it = Object.assign({}, it);
                from_ = /(.*?)\/?$/.exec(it["from"] || "")[1];
                from_ = from_ && from_ + "/";
                delete it["from"];
                if (it["import"] && Array.isArray(it["import"])) {
                    it["import"].forEach(function(p) {
                        p = p.startsWith("/") ? p : from_ + p;
                        push_path(p);
                    });
                } else {
                    imports = it["import"] || it;
                    pack = {};
                    p = "";
                    for (p in imports) {
                        alias = imports[p];
                        if (alias === "") {
                            tmp = p.split("/");
                            alias = tmp[tmp.length-1];
                        } else if (alias === "*") {
                            alias = p;
                        }
                        p = p.startsWith("/") ? p : from_ + p;
                        pack[p] = alias;
                    }
                    push_path(pack);
                }
            }
        });
        return [ path, _path ];
    }
    class Module {
        static __init_class__ (import_amd) {
            this.prototype.import_amd = import_amd;
        }
        constructor (def_args, path) {
            var self = this;
            var raw_deps;
            self.loaded = false;
            self.ok_err = null;
            self.path = path || "";
            self.id = typeof def_args[0] === "string" ? def_args.shift() : "";
            raw_deps = Array.isArray(def_args[0]) ? def_args.shift() : [];
            self.init = def_args[0];
            self.import_amd(raw_deps, self.path).then(self.run.bind(self)).catch((err)=>self.ok_err.err(err));
        }
        on_load_script (ok_err) {
            var self = this;
            self.ok_err = ok_err;
            if (self.loaded) {
                ok_err.ok(self.exports);
            }
        }
        run (deps) {
            var self = this;
            var exports, _exports;
            exports = null;
            deps = deps.map(function(dep) {
                if (dep === "exports") {
                    exports = {};
                    return exports;
                }
                return dep;
            });
            _exports = self.init.apply(null, deps);
            self.exports = exports || _exports;
            self.loaded = true;
            if (self.ok_err) {
                self.ok_err.ok(self.exports);
            }
        }
    }
    function doc_ready(arg_to_pass) {
        var p;
        p = function(ok, err) {
            document.addEventListener("readystatechange", function() {
                if (document.readyState === "complete") {
                    ok(arg_to_pass);
                }
            });
        };
        if (document.readyState === "complete") {
            return Promise.resolve(arg_to_pass);
        }
        return new Promise(p);
    }
    class RS_require {
        constructor () {
            var self = this;
            var CS, src_, define, rs_req, base_url;
            CS = document.currentScript;
            src_ = CS.src.split("/");
            self.config = {
                base_url: src_.slice(0, -1).join("/"),
                map: {},
                path: {}
            };
            self.modules = {};
            self._modules = [];
            define = window.define = self.define.bind(self);
            define.amd = {};
            Module.__init_class__(self.import_amd.bind(self));
            rs_req = function(requester) {
                return {
                    "self": self,
                    "import": function(args) {
                        return self.import_amd(args, requester);
                    },
                    "asyncer": asyncer,
                    "config": function(cfg) {
                        Object.assign(self.config, cfg);
                    }
                };
            };
            self.mount_module(RS_REQ, rs_req);
            if (window.Q) {
                self.mount_module("Q", Q);
                delete window.Q;
            }
            if (CS.dataset.main) {
                base_url = CS.dataset.main.split("/");
                self.config.base_url = base_url.slice(0, -1).join("/");
                self.import_amd(CS.dataset.main, RS_REQ);
            }
        }
        resolve_path (requester, path) {
            var self = this;
            var map_, is_url, url, base, _path;
            map_ = self.config.map.call ? self.config.map : function(k) {
                return self.config.map[k];
            };
            is_url = /^https?:\/{2}/;
            if (is_url.test(path)) {
                path = map_(path, requester) || path;
                return [ path, path ];
            }
            if (path.startsWith("/")) {
                path = map_(path, requester) || path;
                url = window.location.origin + path;
                return [ path, url ];
            }
            base = requester.split("/");
            base = base.slice(0, -1);
            if (path.startsWith("./")) {
                path = base.join("/") + path.slice(1);
            } else if (path.startsWith("../")) {
                while (true) {
                    base = base.slice(0, -1);
                    path = path.slice(3);
                    if (!path.startsWith("../")) {
                        break;
                    }
                }
                base = base.join("/");
                path = (base && base + "/") + path;
            }
            path = map_(path, requester) || path;
            if (is_url.test(path)) {
                return [ path, path ];
            }
            _path = path.split("/");
            if (_path.length >= 2 && (base = self.config.path[_path[0]]) !== (void 0)) {
                return [ path, (base && base + "/") + _path.slice(1).join("/") ];
            }
            base = self.config.base_url;
            return [ path, (base && base + "/") + path ];
        }
        mount_module (as_name, mod) {
            var self = this;
            self.modules[as_name] = {
                exports: mod,
                loaded: true,
                req_chain: []
            };
        }
        define (mod_id, req_list, cb) {
            var self = this;
            var cs;
            function make_mod(path) {
                var mod;
                mod = new Module([ mod_id, req_list, cb ], path);
                self._modules.push(mod);
                return mod;
            }
            if ((cs = document.currentScript) && cs.dataset.rs_req) {
                self.make_mod = make_mod;
            } else {
                make_mod();
            }
        }
        on_load_script (path, ok_err) {
            var self = this;
            var mod;
            if (self.make_mod) {
                mod = self.make_mod(path);
                self.make_mod = null;
                mod.on_load_script(ok_err);
            }
        }
        on_error (name, requester, e) {
            var self = this;
            console.log("error on load: ", name, requester);
        }
        import_amd (import_args, requester) {
            var self = this;
            var imps, p;
            if (typeof import_args === "string") {
                return self._import_amd(import_args, requester);
            } else {
                imps = parse_imports(import_args)[0];
            }
            p = [];
            imps.forEach(function(it) {
                var _pack, path;
                if (typeof it === "string") {
                    if (it === "exports") {
                        p.push(Promise.resolve({}));
                    } else {
                        p.push(self._import_amd(it, requester));
                    }
                } else {
                    function pack_maker(it) {
                        return function(_pack) {
                            var pack, i, path;
                            pack = {};
                            i = 0;
                            path = "";
                            for (path in it) {
                                pack[it[path]] = _pack[i];
                                ++i;
                            }
                            return pack;
                        };
                    }
                    _pack = [];
                    path = "";
                    for (path in it) {
                        _pack.push(self._import_amd(path, requester));
                    }
                    p.push(Promise.all(_pack).then(pack_maker(it)));
                }
            });
            return Promise.all(p);
        }
        _import_amd (name, requester) {
            var self = this;
            var src, mod, exp, ok_err, s, p, req_chain;
            if (name === RS_REQ) {
                return Promise.resolve(self.modules[name].exports(requester));
            }
            [name, src] = self.resolve_path(requester, name);
            if (mod = self.modules[name]) {
                if (!mod.loaded) {
                    if (mod.req_chain.find(function(it) {
                        return it === name;
                    })) {
                        throw new Error("Circular dependency: " + name + " and " + requester);
                    }
                    mod.req_chain.push(requester);
                }
                exp = mod.exports;
                return exp instanceof Promise ? exp : Promise.resolve(exp);
            }
            ok_err = {};
            s = document.createElement("script");
            s.src = src + ".js";
            s.async = true;
            s.onerror = function(e) {
                self.on_error(name, requester, e);
                ok_err.err("loading error: " + s.src);
            };
            s.dataset.rs_req = true;
            p = new Promise(function(ok, err) {
                ok_err = {
                    ok: ok,
                    err: err
                };
            });
            s.onload = function() {
                self.on_load_script(name, ok_err);
            };
            document.head.appendChild(s);
            p.then(function(exports) {
                var mod;
                if (mod = self.modules[name]) {
                    mod.loaded = true;
                    mod.exports = exports;
                } else {
                    throw new Error("load_stack seems corrupted");
                }
            }).catch((err)=> ok_err.err(err));
            req_chain = requester ? [ requester ] : [];
            self.modules[name] = {
                req_chain: req_chain,
                exports: p,
                loaded: false
            };
            return p;
        }
    }
    class Merge_call {
        merge (a) {
            var self = this;
            self.cmd = "merge";
            self.args = a;
            return self;
        }
    }
    function asyncer(fun) {
        var merge_call, ret;
        merge_call = {};
        function wrap(ctx) {
            function pret(ok, err) {
                function inner(f, opt) {
                    var ret_v, ret_throw, merge_key, v, p;
                    if (opt) {
                        ret_v = opt.ret_v;
                        ret_throw = opt.ret_throw;
                        merge_key = opt.merge_key;
                    }
                    function _err(e, merge_key) {
                        err(e);
                        if (merge_key) {
                            merge_call[merge_key].map(function(cb) {
                                cb.err(e);
                            });
                            delete merge_call[merge_key];
                        }
                    }
                    if (ret_throw) {
                        v = ret_throw;
                    } else {
                        try {
                            f = f || fun.apply(ctx.self, ctx.args);
                            v = f.next(ret_v);
                        } catch (ՐՏ_Exception) {
                            var e = ՐՏ_Exception;
                            _err(e, merge_key);
                            return;
                        }
                    }
                    if (v.value instanceof Merge_call) {
                        if (v.value.cmd === "get_keys") {
                            Promise.resolve(Object.keys(merge_call)).then(function(ret_v) {
                                inner(f, {
                                    ret_v: ret_v,
                                    merge_key: merge_key
                                });
                            });
                        } else if (v.value.cmd === "merge") {
                            if (p = merge_call[v.value.args]) {
                                p.push({
                                    ok: function(v) {
                                        ok(v);
                                    },
                                    err: function(v) {
                                        err(v);
                                    }
                                });
                                return;
                            } else {
                                merge_key = v.value.args;
                                merge_call[merge_key] = [];
                                Promise.resolve(null).then(function(ret_v) {
                                    inner(f, {
                                        ret_v: ret_v,
                                        merge_key: merge_key
                                    });
                                });
                            }
                        } else {
                            Promise.resolve(null).then(function(ret_v) {
                                inner(f, {
                                    ret_v: ret_v,
                                    merge_key: merge_key
                                });
                            });
                        }
                    } else if (!v.done) {
                        if (v.value instanceof Promise) {
                            v.value.then(function(ret_v) {
                                inner(f, {
                                    ret_v: ret_v,
                                    merge_key: merge_key
                                });
                            }, function(e) {
                                var v;
                                try {
                                    v = f.throw(e);
                                } catch (ՐՏ_Exception) {
                                    var e = ՐՏ_Exception;
                                    _err(e, merge_key);
                                    return;
                                }
                                inner(f, {
                                    ret_throw: v,
                                    merge_key: merge_key
                                });
                            });
                        } else {
                            Promise.resolve(v.value).then(function(ret_v) {
                                inner(f, {
                                    ret_v: ret_v,
                                    merge_key: merge_key
                                });
                            });
                        }
                    } else {
                        ok(v.value);
                        if (merge_key) {
                            merge_call[merge_key].map(function(cb) {
                                cb.ok(v.value);
                            });
                            delete merge_call[merge_key];
                        }
                    }
                }
                inner();
            }
            return pret;
        }
        ret = function() {
            var ctx, p;
            ctx = {
                self: this,
                args: arguments
            };
            p = new Promise(wrap(ctx));
            return p;
        };
        ret.__name__ = fun.__name__ || fun.name;
        return ret;
    }
    merge_call = new Merge_call();
    asyncer.merge = merge_call.merge.bind(merge_call);
    new RS_require();
})();
})();
