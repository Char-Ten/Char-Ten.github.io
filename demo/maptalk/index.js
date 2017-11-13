var map = new maptalks.Map('map', {
    center: new maptalks.Coordinate([113.26445102691652, 23.129704666325214]),
    zoom: 18,
    baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'https://mt2.google.cn/vt/lyrs=s@110&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s={s}',
        subdomains: ['a', 'b', 'c']
    })
});

var el = {
    compass: document.getElementById('compass')
}
var context = {
    compass: el.compass.getContext('2d')
}

el.compass.width = el.compass.offsetWidth;
el.compass.height = el.compass.offsetHeight;
context.compass.strokeStyle = '#0f0'
window.addEventListener('deviceorientation', function(e) {
    map.setPitch(e.beta);
    map.setBearing(e.alpha)
});