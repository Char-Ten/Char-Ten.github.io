(function() {
    var TYPEINDEX = {
        '公共支出': 'publicCash',
        '比例支出': 'ratioCash',
        '参与比例': 'ratio'
    }

    Vue.component('x-alert', {
        template: '#x-alert',
        props: ['title']
    });

    Vue.component('model-add-person', {
        template: '#model-addPerson',
        props: ['focus'],
        data: function() {
            return {
                textValue: ''
            }
        },
        computed: {
            isArrowSubmit: function() {
                return this.textValue;
            },
        },
        watch: {
            focus: function() {
                if (this.focus) this.$refs['input'].focus();
            }
        },
        methods: {
            atv_Submit: function() {
                if (this.isArrowSubmit) {
                    this.$emit('submit', this.textValue);
                    this.textValue = '';
                }
            },
            atv_cancel: function() {
                this.textValue = '';
                this.$emit('cancel')
            }
        },
        mounted: function() {
            this.isFocus;
        }
    });

    Vue.component('table-view', {
        template: '#table-view',
        data: function() {
            return {
                typeIndex: TYPEINDEX,
                typesCounts: {},
                isArrowSubmit: true
            }
        },
        computed: {
            tableData: function() {
                return this.$store.state.person;
            },
            tableContentMaxLength: function() {
                var a = [0];
                for (var i = 0; i < this.tableData.length; i++) {
                    a.push(this.tableData[i].publicCash.length);
                    a.push(this.tableData[i].ratioCash.length);
                    a.push(this.tableData[i].ratio.length);
                }
                return Math.max.apply(Math, a);
            }
        },
        methods: {
            atv_submitTable: function() {
                if (!this.isArrowSubmit) {
                    return
                }
                //如果是在github上
                if (location.hostname === 'char-ten.github.io') {
                    try {
                        var wb = XLSX.utils.table_to_book(this.$refs['table']);
                        var wbout = XLSX.write(wb, {
                            type: 'binary',
                            bookType: 'xlsx',
                            bookSST: false,
                        });

                        function s2ab(s) {
                            var buf = new ArrayBuffer(s.length);
                            var view = new Uint8Array(buf);
                            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                            return buf;
                        }
                        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), new Date().getTime() + '.xlsx');
                        this.isArrowSubmit = true;
                    } catch (error) {
                        console.log(error)
                        alert('您的浏览器不支持本地生成excel的功能')
                    }
                } else {
                    this.isArrowSubmit = false;
                    var xhr = new XMLHttpRequest();
                    var self = this;
                    xhr.open('post', '/api/translate/htmltable2excel', true);
                    xhr.onload = function() {
                        self.isArrowSubmit = true;
                        try {
                            var result = JSON.parse(xhr.responseText);
                            if (result.state === 'ok') {
                                var opened = window.open(result.data.url, '_blank');
                                if (!opened) window.location.href = result.data.url;
                            }
                        } catch (error) {}
                    }
                    xhr.send(this.$refs['table'].innerHTML)
                }
            },

            /**计算个人类型总支出 */
            calc_PersonTypesCount: function(arr, type, i) {
                var counts = this.util_total(arr);
                if (Array.isArray(this.typesCounts[type])) {
                    this.typesCounts[type][i] = counts
                } else {
                    this.typesCounts[type] = [counts];
                }
                return counts.toFixed(2);
            },

            /**计算类型总支出 */
            calc_TypesCount: function(type) {
                var value = this.util_total(this.typesCounts[type]);
                this.typesCounts[type + '_value'] = value;
                return value.toFixed(2);
            },

            /**结算 */
            calc_TypesCountAverage: function(type, i) {
                var value = this.typesCounts[type + '_value'] || 0;

                /**若为参与比例，返回百分比 */
                if (type === 'ratio') {
                    if (value === 0) return 0;
                    return (this.typesCounts[type][i] * 100 / value).toFixed(2) + '%';
                }

                /**若为比例支出，返回参与比例支出金额-比例支出金额，得到最终应该支付或者收入的金额 */
                if (type === 'ratioCash') {
                    var ratioCounts = this.typesCounts['ratio_value'] || 0;
                    var ratioPerson = this.typesCounts['ratio'][i] || 0;
                    var ratio = 0;
                    if (ratioCounts !== 0) {
                        ratio = ratioPerson / ratioCounts;
                    }
                    return (this.typesCounts[type][i] - value * ratio).toFixed(2);
                }

                /**公共金额AA制，全部平分 */
                return (this.typesCounts[type][i] - value / 4).toFixed(2);
            },
            util_total: function(arr) {
                if (!Array.isArray(arr)) return 0;
                if (arr.length === 0) return 0;
                return arr.reduce(function(a, b) {
                    if (!isNaN(b)) {
                        return a + b;
                    }
                    return a;
                });
            },
        },
        mounted: function() {

        }
    })



    var STORE = new Vuex.Store({
        state: {
            hasPerson: {},
            person: [],
            history: [],
        },
        mutations: {
            addPerson: function(state, payload) {
                var a = [];
                if (Array.isArray(payload)) {
                    payload.forEach(function(item, index) {
                        if (state.hasPerson[item.name]) {
                            return
                        }
                        state.hasPerson[item.name] = 1;
                        a.push(item)
                    });
                } else if (!state.hasPerson[payload.name]) {
                    state.hasPerson[item.name] = 1;
                    a.push(item);
                }
                state.person = state.person.concat(a);
            },
            addPersonCashType: function(state, payload) {
                if (!state.hasPerson[payload.name]) {
                    return
                }
                var type = TYPEINDEX[payload.type]
                if (Array.isArray(state.person[payload.index][type])) {
                    state.person[payload.index][type].push(payload.value);
                }
            },
            removePersonItem: function(state, name) {
                for (var i = 0; i < state.person.length; i++) {
                    if (name === state.person[i].name) {
                        state.person.splice(i, 1);
                        return
                    }
                }
            },
            clearPerson: function(state) {
                state.person = [];
            },
            addHistory: function(state, newHistory) {
                if (Array.isArray(newHistory)) {
                    state.history.concat(newHistory);
                    return
                }
                state.history.push(newHistory);
            },
            removeHistoryItem: function(state, payload) {
                if (!state.history[payload.index]) return;
                state.history.splice(payload.index, payload.number);
                STORE.commit('rebuildPersonByHistory');
            },
            replaceHistoryItem: function(state, payload) {
                state.history[payload.index] = payload.item;
                STORE.commit('rebuildPersonByHistory');
            },
            rebuildPersonByHistory: function(state) {
                var indexMap = {};
                var newPerson = [];
                state.person.forEach(function(item, i) {
                    newPerson[i] = {
                        name: item.name,
                        publicCash: [],
                        ratioCash: [],
                        ratio: [],
                    }
                    indexMap[item.name] = i;
                })
                state.history.forEach(function(item) {
                    var a = item.split(' ');
                    var name = a[0];
                    var index = indexMap[name];
                    var type = TYPEINDEX[a[1].replace(/[【】]/g, '')];
                    var value = a[2] * 1;
                    if (state.hasPerson[name]) {
                        newPerson[index][type].push(value);
                    } else {
                        newPerson[index] = {
                            name: name,
                            publicCash: [],
                            ratioCash: [],
                            ratio: [],
                        }
                        newPerson[index][type].push(value);
                    }
                });
                state.person = newPerson;
            }

        }
    });

    var APP = new Vue({
        el: '#app',
        store: STORE,
        data: {
            isAddModelShow: false,
            typesState: ['公共支出', '比例支出', '参与比例'],
            typesIndex: 0,
            personIndex: 0,
            inputValue: '',
        },
        computed: {
            result: function() {
                var person = this.selectedPerson.name;
                var type = '【' + this.selectedType + '】';
                var value = this.inputValue;
                return [person, type, value].join(' ')
            },
            selectedPerson: function() {
                return this.$store.state.person[this.personIndex] || {};
            },
            selectedType: function() {
                return this.typesState[this.typesIndex];
            },
            personState: function() {
                return this.$store.state.person
            },
            historyList: function() {
                return this.$store.state.history
            }
        },
        watch: {
            isAddModelShow: function() {
                if (!this.isAddModelShow) this.$refs['input'].focus();
            }
        },
        methods: {
            atv_ShowAddPersonModel: function() {
                this.isAddModelShow = true;
            },
            atv_AddPerson: function(value) {
                this.isAddModelShow = false;
                this.$refs['input'].focus();
                var a = value.split(/[,，]/).map(function(item) {
                    return {
                        name: item,
                        publicCash: [],
                        ratioCash: [],
                        ratio: [],
                    }
                });
                STORE.commit('addPerson', a);
            },
            atv_KeydownInput: function(e) {
                var a = [38, 40, 37, 39];
                for (var i = 0; i < a.length; i++) {
                    if (e.keyCode === a[i]) {
                        e.preventDefault();
                        return
                    }
                }
            },
            atv_SubmitInput: function() {
                var name = this.selectedPerson.name;
                var type = this.selectedType;
                if (!name || !type || !this.inputValue) return;
                STORE.commit('addHistory', this.result);
                STORE.commit('addPersonCashType', {
                    name: name,
                    type: type,
                    value: parseFloat(this.inputValue),
                    index: this.personIndex
                });
                this.inputValue = '';

            },
            atv_TypesIndexAdd: function(e) {
                e.preventDefault();
                this.typesIndex = this.util_AddValue(this.typesIndex, this.typesState.length)
            },
            atv_TypesIndexSub: function(e) {
                e.preventDefault();
                this.typesIndex = this.util_SubValue(this.typesIndex, this.typesState.length)
            },
            atv_PersonIndexAdd: function(e) {
                e.preventDefault();
                this.personIndex = this.util_AddValue(this.personIndex, Object.keys(this.personState).length);
            },
            atv_PersonIndexSub: function(e) {
                e.preventDefault();
                this.personIndex = this.util_SubValue(this.personIndex, Object.keys(this.personState).length);
            },
            util_AddValue: function(value, length) {
                value++;
                if (value >= length) value -= length;
                return value;
            },
            util_SubValue: function(value, length) {
                value--;
                if (value < 0) value += length;
                return value
            }
        },
        mounted: function() {
            this.$refs['input'].focus();
            window.addEventListener('keyup', function(e) {
                if (e.keyCode === 83 || e.keyCode === 40) {
                    APP.atv_TypesIndexAdd(e);
                }
                if (e.keyCode === 87 || e.keyCode === 38) {
                    APP.atv_TypesIndexSub(e);
                }
                if (e.keyCode === 65 || e.keyCode === 37) {
                    APP.atv_PersonIndexSub(e);
                }
                if (e.keyCode === 68 || e.keyCode === 39) {
                    APP.atv_PersonIndexAdd(e);
                }
                if (e.ctrlKey && e.keyCode === 90) {
                    STORE.commit('removeHistoryItem', { index: APP.historyList.length - 1, number: 1 });
                }
            })
        }
    })
})()