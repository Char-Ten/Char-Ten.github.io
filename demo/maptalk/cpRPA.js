! function(t, n) { "function" == typeof define && define.amd ? define([], n) : "object" == typeof exports ? module.exports = n() : t.cpRPA = n() }(this, function() {
    function t() {}

    function n(t, n, a, e, r, o, l) { var r = r * Math.PI / 180; return l || (l = 1), o || (o = 1), [o * ((t - a) * Math.cos(r) - (n - e) * Math.sin(r)) + a, l * ((t - a) * Math.sin(r) + (n - e) * Math.cos(r)) + e] }

    function a(t, n) { return t > n - 1 ? t - n : t < 0 ? n + t : t }

    function e(t, n, a) { var e, r = t[1] - n[1]; return !!r && (!((e = (a - t[1]) * (t[0] - n[0]) / r + t[0]) > t[0] && e > n[0]) && !(e < t[0] && e < n[0]) && [e, a]) }

    function r(t) { for (var n = [], a = [], e = 0; e < t.length; e++) n.push(t[e].lat), a.push(t[e].lng); var r = Math.max.apply(Math, n),
            o = Math.max.apply(Math, a),
            l = Math.min.apply(Math, n),
            u = Math.min.apply(Math, a); return { center: { lat: (r + l) / 2, lng: (o + u) / 2 }, latlngs: [{ lat: r, lng: u }, { lat: r, lng: o }, { lat: l, lng: o }, { lat: l, lng: u }], northLat: r } }

    function o(t, a, e) { if ("function" != typeof f.latlng2Px && "function" != typeof f.px2Latlng) return !1; for (var r, o, l = [], u = f.latlng2Px(a.center), i = 0; i < t.length; i++) o = n((r = f.latlng2Px(t[i])).x, r.y, u.x, u.y, e), l.push(f.px2Latlng(o)); return l }

    function l(t, n) { var a = t.latlngs[0],
            e = t.latlngs[3]; if ("function" != typeof f.distance) throw new Error('You must call the ".setDistanceFn" method and set a function to calculate the distance!'); var r = f.distance({ lat: a.lat, lng: a.lng }, { lat: e.lat, lng: e.lng }),
            o = parseInt(r / n / 2); return { len: o, lat: (a.lat - e.lat) / o } }

    function u(t) { return f.distance(t, { lat: t.lat + 1, lng: t.lng }) }

    function i(t) { return f.distance(t, { lat: t.lat, lng: t.lng + 1 }) } var f = new t; return { setOptions: function(t) { if (!(t.polygon instanceof Array)) throw new Error('cpRPA: the "polygon" of options must be a Array like [{lat:Number,lng:Number}]'); if (t.rotate && "number" != typeof t.rotate) throw new Error('cpRPA: the "rotate" of options must be a number!'); if (t.space && "number" != typeof t.space) throw new Error('cpRPA: the "space" of options must be a number!'); var n = r(t.polygon),
                u = o(t.polygon, n, -t.rotate || 0); if (!u) throw new Error('cpRPA: You must call ".setLatlng2PxFn" and ".setPx2LatlngFn" methods before setOptions '); for (var i = r(u), f = l(i, t.space || 5), s = [], c = [], g = null, p = 0; p < f.len; p++) { s = []; for (var h = 0; h < u.length; h++) { var m = a(h + 1, u.length);
                    (g = e([u[h].lng, u[h].lat], [u[m].lng, u[m].lat], i.northLat - p * f.lat)) && s.push(g) }
                s.length < 2 || s[0][0] !== s[1][0] && (p % 2 ? c.push({ lat: s[0][1], lng: Math.max(s[0][0], s[1][0]) }, { lat: s[0][1], lng: Math.min(s[0][0], s[1][0]) }) : c.push({ lat: s[0][1], lng: Math.min(s[0][0], s[1][0]) }, { lat: s[0][1], lng: Math.max(s[0][0], s[1][0]) })) } return o(c, n, t.rotate || 0) }, setDistanceFn: function(n) { if ("function" != typeof n) throw new Error("setDistanceFn's argument must be a function");
            t.prototype.distance = n }, setLatlng2PxFn: function(n) { if ("function" != typeof n) throw new Error("setLatlng2PxFn's argument must be a function");
            t.prototype.latlng2Px = n }, setPx2LatlngFn: function(n) { if ("function" != typeof n) throw new Error("setPx2LatlngFn's argument must be a function");
            t.prototype.px2Latlng = n }, getPolygonArea: function(t) {
            function n(t) { return t.lng * i(t) }

            function e(t) { return t.lat * u(t) } for (var r = 0, o = 0; o < t.length; o++) r += n(t[o]) * e(t[a(o + 1, t.length)]) - e(t[o]) * n(t[a(o + 1, t.length)]); return Math.abs(r) / 2 }, getPolylineArea: function(t, n) { var e = 0;
            n = n || 5; for (var r = 0; r < t.length; r += 2) { var o = a(r + 1, t.length);
                e += f.distance(t[r], t[o]) } return e * n * 2 } } });