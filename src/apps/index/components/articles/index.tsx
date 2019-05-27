import * as React from 'react';
import "./index.less"
function Articles():React.ReactElement{
    return (
        <div id="HomePageArticle">
            <div className="c-center">
                <ul>
                    <li>
                        <a>
                            <h2>文章标题</h2>
                            <p>文章简介</p>
                        </a>
                    </li>
                    <li>
                        <a>
                            <h2>文章标题</h2>
                            <p>文章简介</p>
                        </a>
                    </li>
                    <li>
                        <a>
                            <h2>文章标题</h2>
                            <p>文章简介</p>
                        </a>
                    </li>
                    <li>
                        <a>
                            <h2>文章标题</h2>
                            <p>文章简介</p>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Articles