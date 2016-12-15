new Vue({
    el: '#content',
    data: {
        aPath: [''],
        aFileList: [],
        icon: {
            html: '#icon-html',
            js: '#icon-js',
            css: '#icon-css',
            dir: '#icon-documents',
            jpg: '#icon-jpg',
            png: '#icon-png'
        },
        sQueryText: '',
    },
    computed: {
        aFilterList: function() {
            var dis = this;
            return this.aFileList.filter(function(item) {
                return item.name.indexOf(dis.sQueryText) !== -1;
            });
        },
        sDirHerf: function() {
            return 'https://api.github.com/repos/Char-Ten/Char-Ten.github.io/contents/' + this.sFileHref
        },
        sFileHref: function() {
            return this.aPath.join('/');
        },
        isAllow: function() {
            if (this.aPath.length > 1) {
                return 1;
            }
            return 0;
        }
    },
    methods: {
        sType: function(item) {
            var type = item.split('.');
            if (type.length > 1) {
                return type[type.length - 1]
            }
            return 'dir'
        },
        eHref: function(e, item) {
            e.preventDefault();
            if (item.type == 'dir') {
                this.aPath.push(item.name);
                this.$http.get(this.sDirHerf).then(function(res) {
                    this.aFileList = res.body;
                });
            } else {
                location.href = e.currentTarget.href;
            }
            this.sQueryText = ''

        },
        eGoBack: function() {
            if (this.aPath.length > 1) {
                this.aPath.pop();
                this.$http.get(this.sDirHerf).then(function(res) {
                    this.aFileList = res.body;
                })
            }

            this.sQueryText = ''
        }
    },
    mounted: function() {
        this.$nextTick(function() {
            this.$http.get(this.sDirHerf).then(function(res) {
                this.aFileList = res.body;
            });
            this.$http.get('https://api.github.com/users/Char-Ten/repos').then(function(res) {
                res.body.forEach(function(item) {
                    if (item.has_pages) {
                        console.log(item.name)
                    }
                })
            })
        });
    }
})