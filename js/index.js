var Ent = new Vue();

; //配置
(function() {
    // Vue.http.options.root = Blog.proxyHost;
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

; //tp_dir
(function() {
    Vue.component('app-dir', {
        template: '#tp_dir',
        data: function() {
            return {
                list: [],
                page: 1,
                limit: 5,
                type: 'u',
                order_by: 'shared_at',
                top: 0
            }
        },
        computed: {
            setTransform: function() {
                return { 'transform': 'translate(0,y%)'.replace('y', this.top) }
            }
        },
        methods: {
            eMouseover: function(item) {
                Ent.$emit('eHoverDirItem', item)
            },
            _GetList: function() {
                this.$http.get(Blog.getList, {
                    params: {
                        id: Blog.jianshuId,
                        page: this.page,
                        order_by: this.order_by,
                        type: this.type,
                        limit: this.limit
                    }
                }).then(function(res) {
                    this.list = this.list.concat(res.body);
                }, function(err) {

                })
            },
            _HandleWheel: function(e) {
                var d = 10;
                if (e.deltaY < 0) {
                    d = -d;
                }
                this.top -= d;
                if (this.top > 0) {
                    this.top = 0;
                }
                if (this.top < -100) {
                    this.top = -100;
                }
            },

        },
        mounted: function() {
            var vm = this;
            this._GetList();
            Ent.$on('eWheelDirStage', this._HandleWheel);
        }
    })
})();

; //tp_dir-info
(function() {
    Vue.component('app-dir-info', {
        template: '#tp_dir-info',
        data: function() {
            return {
                'title': '',
                'content': ''
            }
        },
        mounted: function() {
            var vm = this;
            Ent.$on('eHoverDirItem', function(item) {
                vm.title = item.title;
                vm.content = item.summary
            })
        }
    })
})();

; //tp_github
(function() {
    Vue.component('app-git', {
        template: '#tp_github',
        data: function() {
            return {
                index: 0,
                githubList: [],
            }
        },
        computed: {
            filtedList: function() {
                var i = this.index,
                    vm = this;
                var source = this.githubList,
                    len = this.githubList.length,
                    add = [-2, -1, 0, 1, 2];

                var a = [];
                add.forEach(function(item) {
                    var j = i + item;
                    if (j < 0) {
                        j = len + item
                    }
                    if (j > len - 1) {
                        j = item
                    }
                    if (j >= 0 && j < len) {
                        source[j].index = j;
                        a.push(source[j]);
                    }
                });
                return a;
            }
        },
        methods: {
            eItemClick: function(e, index, i) {
                if (index !== this.index) {
                    e.preventDefault();
                }
                this.index = index;

            },
            _HandleWheel: function(e) {
                if (e.deltaY > 0) {
                    this.index++;
                } else {
                    this.index--;
                }
                if (this.index > this.githubList.length - 1) {
                    this.index = 0;
                }
                if (this.index < 0) {
                    this.index = this.githubList.length - 1;
                }
            }
        },
        mounted: function() {
            this.$http
                .get('https://api.github.com/users/:username/repos'.replace(':username', Blog.githubUname))
                .then(function(res) {
                    this.githubList = res.body;
                }, function(err) {

                });
            Ent.$on('eWheelGitHubStage', this._HandleWheel)
        }
    })
})();

; //main
(function() {
    window.app = new Vue({
        el: '#app',
        data: {
            isShowMask: false,
            addStageClass: [
                [],
                {
                    'mask-blur': false
                }
            ],
        },
        methods: {
            eMaskClick: function() {
                this.$set(this.addStageClass, 1, {
                    'mask-blur': false
                });
                this.isShowMask = false;
                Ent.$emit('eHideAside');
            },
            eWheelDirStage: function(e) {
                Ent.$emit('eWheelDirStage', e);
            },
            eWheelGitHubStage: function(e) {
                Ent.$emit('eWheelGitHubStage', e);
            }
        },
        mounted: function() {
            var vm = this;
            Ent.$on('openDir', function() {
                this.$set(vm.addStageClass, 0, ['stage-1'])
            });
            Ent.$on('openFd', function() {
                this.$set(vm.addStageClass, 0, ['stage-2'])
            });
            Ent.$on('openGithub', function() {
                this.$set(vm.addStageClass, 0, ['stage-3'])
            });
            Ent.$on('openHomePage', function() {
                this.$set(vm.addStageClass, 0, [])
            });
            Ent.$on('eCallAsideOut', function() {
                this.$set(vm.addStageClass, 1, {
                    'mask-blur': true
                });
                vm.isShowMask = true;
            })
        }
    })
})();