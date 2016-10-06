(function(w) {
	var vContent = new Vue({
		el: '#content',
		data: {
			cpmt: 'TPsummary',
			propsMsg: '',
			aTabAtv:[1,0,0,0],
			nTabLstIndex:0,
			isShowComt:1,
			pageInfo: {
				uInfoImg: '../img/news/titleIcon.png',
				uInfoName: '医疗机构',
				uFollows: 100,
				uMsg: 100,
				aAttests: [{
					attest: '身份认证',
					color: 's-orange'
				}, {
					attest: '资历认证',
					color: 's-green'
				}],
				aServices: [{
					serviceItem: '服务项目a',
					serviceHref: '#'
				}, {
					serviceItem: '挺爷的github.io',
					serviceHref: 'https://char-ten.github.io/'
				}],
				summary: {
					info: '集合医疗、教学、科研于一体的大型三级甲等综合医院',
					achievement: '国家卫生计生委指定的全国疑难重症诊治指导中心',
					idea: '全心全意为病人服务',
				},
				aImageShows: ['../img/info/hdImg.png', '../img/info/hdImg.png', '../img/info/hdImg.png'],
				aDocters: [{
					img: '../img/info/hdImg.png',
					name: '李玲',
					job: '妇产科医生',
					summary: '从事医疗临床工作30余年，积累了丰富的专业知识和业务经验'
				}, {
					img: '../img/info/hdImg.png',
					name: '小b',
					job: '妇产科医生',
					summary: '从事医疗临床工作30余年，积累了丰富的专业知识和业务经验'
				}, {
					img: '../img/info/hdImg.png',
					name: '大b',
					job: '妇产科医生',
					summary: '从事医疗临床工作30余年，积累了丰富的专业知识和业务经验'
				}],
				aAppraises: [{
					img: '../img/news/titleIcon.png',
					name: '15018452316',
					time: '2016-10-6 16:06',
					word: '15018452316'
				}, {
					img: '../img/news/titleIcon.png',
					name: '15018452316',
					time: '2016-10-6 16:06',
					word: '15018452316'
				}, {
					img: '../img/news/titleIcon.png',
					name: '15018452316',
					time: '2016-10-6 16:06',
					word: '15018452316'
				}]
			}
		},
		methods: {
			tab:function(e){
				var target=e.target;
				var flag=target.getAttribute('data-flag');
				
				switch (flag){
					case 'summary':
						this._setTabAtv(0)
						this.cpmt='TPsummary';
						this.propsMsg=this.pageInfo.summary
						break;
					case 'show':
						this._setTabAtv(1)
						this.cpmt='TPshow';
						this.propsMsg=this.pageInfo.aImageShows;
						break;
					case 'docter':
						this._setTabAtv(2)
						this.cpmt='TPdocter';
						this.propsMsg=this.pageInfo.aDocters;
						break;
					case 'appraise':
						this._setTabAtv(3)
						this.cpmt='TPappraise';
						this.propsMsg=this.pageInfo.aAppraises;
						break;
					default:
						break;
				}
			},
			_setTabAtv:function(index){
				this.aTabAtv[this.nTabLstIndex]=0;
				this.aTabAtv[index]=1;
				this.nTabLstIndex=index;
			}
		},
		components: {
			TPsummary: {
				template: '#TPsummary',
				props: ['fdata'],
			},
			TPshow:{
				template:'#TPshow',
				props:['fdata']
			},
			TPdocter:{
				template:'#TPdocter',
				props:['fdata']
			},
			TPappraise:{
				template:'#TPappraise',
				props:['fdata']
			}
		},
		mounted:function(){
			this.$nextTick(function(){
				this.propsMsg=this.pageInfo.summary
			})
		}
	})
	w.vm=vContent;
})(window)