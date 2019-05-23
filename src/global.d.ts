/**
 * --------------------------------------------
 *  @todo
 * 全局扩展NodeModule模块，使得typescript能识别
 * 	module.hot
 * 	module.__webpack_public_path__
 * 如果使用了webpack.definePlugin给module注入了
 * 其他属性，也需要将属性在下面声明一次。
 * 使得entry为ts文件能够识别这个变量
 */
declare interface NodeModule{
	hot:boolean
	IS_DEV:boolean
	IS_PROD:boolean
	IS_RENDER:boolean
	__webpack_public_path__:string

}

/**
 * --------------------------------------------
 * @todo 
 * webpack使用typescript，在引入非ts/js文件的时候
 * 需要声明为全局模块
 * 
 * @reference 
 * https://webpack.docschina.org/guides/typescript/
 */

/**允许ts引入样式 */
declare module '*.less'
declare module '*.css'

/**允许ts引入图片 */
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'

/**允许ts引入文本 */
declare module '*.glsl'{
	const content:string
	export default content
}
declare module '*.txt'{
	const content:string
	export default content
}