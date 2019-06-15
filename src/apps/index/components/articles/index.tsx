import * as React from 'react';
import "./index.less"
function Articles():React.ReactElement{
    return (
        <div id="HomePageArticle">
           <h2>文章</h2>
           <ul>
               {new Array(16).fill(1).map((item,i)=>{
                   return <li key={i} className="article-item">
                       <div>
                           <h3>文章标题</h3>
                           <p>文章简介</p>
                       </div>
                   </li>
               })}
           </ul>
        </div>
    )
}

export default Articles