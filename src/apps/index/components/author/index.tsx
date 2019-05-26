import * as React from 'react';
import './index.less';
function Author():React.ReactElement{
    return (
        <div id="HomePageAuthor">
            <div className="c-center">
                <div className="pic">
                    <img src=""/>
                </div>
                <div className="name">
                    <p><code>{`<Char Ten/>`}</code></p>
                    <h1>挺问原</h1>
                </div>
                <nav className="outside-link">
                    <a>简书</a>
                    <a>GitHub</a>
                    <a>掘金</a>
                </nav>
                <nav className="inside-link">
                    <a>我的项目</a>
                    <a>我的文章</a>
                    <a>我的朋友</a>
                    <a>我的收藏</a>
                </nav>
            </div>
        </div>
    )
}

export default Author;