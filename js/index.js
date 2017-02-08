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
        if (/#\/article\/\w+/g.test(hash)) {
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
                top: 0,
                isLoadMore: true,
                addLoadMoreClass: []
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
                    if (res.body.length) {
                        this.list = this.list.concat(res.body);
                    } else {
                        this.addLoadMoreClass = ['dir-load-more_btn-null ']
                        this.isLoadMore = false;
                    }
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
            _ReplaceHref: function(url) {
                var id = url.split('?id=')[1];
                return '#/article/' + id
            },
            eClick: function(item) {
                Ent.$emit('sendAtcItem', item);
                Ent.$emit('setAtcId', item.contentUrl)
            },
            eLoadMore: function() {
                if (this.isLoadMore) {
                    this.page++;
                    this._GetList();
                }
            }

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

; //tp_fd-link
(function() {
    Vue.component('app-link', {
        template: '#tp_fd-link',
        data: function() {
            return {
                list: [{}],
                res: []
            }
        },
        methods: {
            _Init: function() {
                this.list = [];
                var vm = this;
                var timer, index = 0,
                    len = this.res.length;
                loop();

                function loop() {
                    clearTimeout(timer);
                    if (index < len) {
                        vm.list.push(vm.res[index]);
                        index++;
                        timer = setTimeout(loop, 500);
                    }
                }
            }
        },
        mounted: function() {
            this.$http.get('./link.json').then(function(res) {
                this.res = res.body;
                this._Init();

            }, function(err) {
                //err handle
            });
            var vm = this;
            Ent.$on('openFd', function() {
                vm._Init();
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
                touchStartY: 0
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
                        j = item - 1;
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
            _GetGithubList: function() {
                this.$http
                    .get('https://api.github.com/users/:username/repos'.replace(':username', Blog.githubUname))
                    .then(function(res) {
                        this.githubList = res.body;
                    }, function(err) {

                    });
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
            },
            _HandleTouchStart: function(e) {
                this.touchStartY = e.touches[0].clientY
            },
            _HandleTouchEnd: function(e) {
                var d = this.touchStartY - e.changedTouches[0].clientY;
                var level = parseInt(Math.abs(d) / 100);
                var len = this.githubList.length;
                if (level === 0) {
                    level = 1;
                }
                if (level > 2) {
                    level = 2;
                }
                if (d > 0) {
                    this.index += level;
                }
                if (d < 0) {
                    this.index -= level;
                }
                if (this.index > len - 1) {
                    this.index = this.index - len;
                }
                if (this.index < 0) {
                    this.index = len + this.index;
                }
            }
        },
        mounted: function() {
            this._GetGithubList();
            Ent.$on('eWheelGitHubStage', this._HandleWheel);
            Ent.$on('eTouchStartGithubStage', this._HandleTouchStart);
            Ent.$on('eTouchEndGithubStage', this._HandleTouchEnd);
        }
    })
})();

; //tp_atc
(function() {
    Vue.component('app-atc', {
        template: '#tp_atc',
        data: function() {
            return {
                addAtcClass: [],
                info: {},
                views: 0,
                list: [],
                atcId: location.hash.replace('#', '')
            }
        },
        computed: {
            imgSrc: function() {
                var str = this.info.content || '';
                var url = str.match(/<img src="(.+)" .*>/);
                if (url) {
                    return url[1];
                }
                return ''
            },
            backgroundImage: function() {
                return { 'background-image': 'url(*)'.replace('*', this.imgSrc) }
            },
            content: function() {
                return this.info.content
            }
        },
        methods: {
            eClickMoreAtc: function(url) {
                this.atcId = this._ReplaceHref(url).replace('#', '')
            },
            _ReplaceHref: function(url) {
                var id = url.split('?id=')[1];
                return '#/article/' + id
            },
            _HandleOpened: function(id) {
                this.addAtcClass = ['atc-show']
                this.$http.get(Blog.getContent, {
                    params: {
                        id: id
                    }
                }).then(function(res) {
                    this.info = res.body;
                    document.title = this.info.title;
                    return res.body.tag
                }).then(function(tag) {
                    return this.$http.get(Blog.getTag, {
                        params: {
                            id: Blog.jianshuId
                        }
                    })
                }).then(function(res) {

                    var vm = this,
                        list = [],
                        tagId;
                    res.body.notebooks.forEach(function(item) {
                        if (item.name === vm.info.tag) {
                            tagId = item.id
                        }
                    });
                    return tagId;
                }).then(function(tagId) {
                    return this.$http.get(Blog.getList, {
                        params: {
                            id: tagId,
                            page: 1,
                            order_by: 'added_at',
                            type: 'nb',
                            limit: 5
                        }
                    })
                }).then(function(res) {
                    this.list = res.body
                })
            },
            _CloseAtc: function() {
                this.addAtcClass = []
            },

        },
        mounted: function() {
            Ent.$on('openAtricle', this._HandleOpened);
            Ent.$on('hashchange', this._CloseAtc);
            Ent.$on('setAtcId', this.eClickMoreAtc);
        },
        updated: function() {
            var code = document.getElementsByTagName('code');
            for (var i = 0; i < code.length; i++) {
                if (code[i].className) {
                    hljs.highlightBlock(code[i]);
                }
            }
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
            },
            eTouchStartGithubStage: function(e) {
                Ent.$emit('eTouchStartGithubStage', e)
            },
            eTouchMoveGithubStage: function(e) {
                e.preventDefault();
            },
            eTouchEndtGithubStage: function(e) {
                Ent.$emit('eTouchEndGithubStage', e)
            }
        },
        mounted: function() {
            var vm = this;
            Ent.$on('openDir', function() {
                document.title = '文章目录';
                this.$set(vm.addStageClass, 0, ['stage-1'])
            });
            Ent.$on('openFd', function() {
                document.title = '友情链接';
                this.$set(vm.addStageClass, 0, ['stage-2'])
            });
            Ent.$on('openGithub', function() {
                document.title = 'GitHub项目';
                this.$set(vm.addStageClass, 0, ['stage-3'])
            });
            Ent.$on('openHomePage', function() {
                document.title = '挺问原 charTen\'s blog ';
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