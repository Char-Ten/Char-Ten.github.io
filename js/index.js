var Ent = new Vue();

; //原型链拓展
(function() {
    Array.prototype.removeItem = function(value) {
        return this.join(';')
            .replace(value, '')
            .replace(/(^;*|;*$)/g, '')
            .split(';');
    }
})();


; //前端路由
(function() {
    window.addEventListener('load', handle);
    window.addEventListener('hashchange', handle);

    function handle() {
        var hash = location.hash;
        Ent.$emit('hashchange');
        if (hash === '#/list') {
            return Ent.$emit('openDir');
        }
        if (hash === '#/link') {
            return Ent.$emit('openFd');
        }
        if (hash === '#/github') {
            return Ent.$emit('openGithub');
        }
        if (/#\/article\/\d+/g.test(hash)) {
            return Ent.$emit('openAtricle', hash.split('#/article/')[1])
        }
        Ent.$emit('openHomePage');
    }
})();

; //tp_aside
(function() {
    Vue.component('app-aside', {
        template: '#tp_aside',
        data: function() {
            return {
                addAsideClass: [],
                navItem: [
                    ['#', '&#xe62b;', '首页'],
                    ['#/list', '&#xe9d0;', '文章目录'],
                    ['#/link', '&#xe647;', '友情链接'],
                    ['#/github', '&#xe6cf;', 'Github'],
                ],
                isNavItemAtv: 0
            }
        },
        methods: {
            eCallAsideOut: function() {
                this.addAsideClass = ['aside-out'];
                Ent.$emit('eCallAsideOut');
            },
            eHideAside: function() {
                this.addAsideClass = [];
            },
            _SetNavItemActive: function() {
                var json = {
                    '#/list': 1,
                    '#/link': 2,
                    '#/github': 3,
                };
                var hash = location.hash;
                if (json[hash]) {
                    this.isNavItemAtv = json[hash]
                } else {
                    this.isNavItemAtv = 0;
                }
            }
        },
        mounted: function() {
            var vm = this;
            Ent.$on('eHideAside', function() {
                vm.eHideAside();
            });
            Ent.$on('hashchange', function() {
                vm._SetNavItemActive();
            })
        }
    })
})();

; //main
(function() {
    window.app = new Vue({
        el: '#app',
        data: {
            isShowMask: false,
            addStageClass: [],
        },
        methods: {
            eMaskClick: function() {
                this.addStageClass = this.addStageClass.removeItem(/mask-blur/g);
                this.isShowMask = false;
                Ent.$emit('eHideAside');

            }
        },
        mounted: function() {
            var vm = this;
            Ent.$on('openDir', function() {
                vm.addStageClass = ['stage-1']
            });
            Ent.$on('openFd', function() {
                vm.addStageClass = ['stage-2']
            });
            Ent.$on('openGithub', function() {
                vm.addStageClass = ['stage-3']
            });
            Ent.$on('openHomePage', function() {
                vm.addStageClass = [];
            });
            Ent.$on('eCallAsideOut', function() {
                vm.addStageClass.push('mask-blur');
                vm.isShowMask = true;
            })
        }
    })
})();