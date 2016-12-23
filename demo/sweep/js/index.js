/*生成地图*/
/*点击布雷 */
/*雷区检测 */

/*事件 */
/**探雷 */
/**插旗 */
/**测雷 */
;
(function() {
    var map = createMap(9);
    if (!map) {
        return false
    }
    var first = true;
    var box = document.getElementById('tbl');
    var item = box.getElementsByTagName('td');
    box.appendChild(renderMap(map));

    box.addEventListener('click', function(e) {
        if (first) {
            eSetLandmind(map, item, e);
            first = false;
        }
        var target = e.target;
        eCheckLandmind(map, item, e);
        updateMap(map, item);
    });

    box.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        eSetFlag(map, e);
        updateMap(map, item);
    });
})()


;
/**生成地图数据
 * @param num {Number} 
 * @输入一个数字n，返回n*n的地图矩阵
 * */
function createMap(num) {
    if (typeof num !== 'number') {
        console.error('创建地图失败，原因是crateMap的参数必须为一个数字');
        return false
    }
    var $map = [];
    var index = 0;
    for (var i = 0; i < num; i++) {
        var y = [];
        for (var j = 0; j < num; j++, index++) {
            var x = {
                number: -1,
                isLandmind: false,
                isFlag: false,
                isOpen: false,
                x: j,
                y: i,
                index: index
            };
            y.push(x);
        }
        $map.push(y);
    }
    return $map
};


/**渲染地图
 * @param map {JSON}
 * @输入地图数据，初始化渲染地图  
 * @参数信息： `map` 输入地图;  
 * @返回: `frg` 存储td数据的`documentFragment` 
 */
function renderMap(map) {
    var frg = document.createDocumentFragment();
    map.forEach(function(items) {
        var tr = document.createElement('tr');
        items.forEach(function(item) {
            var td = document.createElement('td');
            td.setAttribute('data-i', item.index);
            td.setAttribute('data-x', item.x);
            td.setAttribute('data-y', item.y);
            td.setAttribute('data-isFlag', item.isFlag);
            td.setAttribute('data-isLandmind', item.isLandmind);
            td.innerText = '(' + item.x + ',' + item.y + ')';
            tr.appendChild(td);
        });
        frg.appendChild(tr);
    });
    return frg;
};


/**创建地雷
 * @param map {JSON}  
 * @param num {Number}  
 * @param nox {Number}  
 * @param noy {Number}  
 * @根据参数创建地雷位置   
 * @参数信息：  
 * * `map` 输入地图;  
 * * `num` 输入地雷数量;  
 * * `nox` 输入无雷位置;  
 * * `noy` 输入无雷位置;  
 */
function createLandmind(map, num, nox, noy) {
    var x, y, isLandmind, a = [];
    nox = parseInt(nox);
    noy = parseInt(noy);
    while (num >= 0) {
        x = parseInt(Math.random() * 9);
        y = parseInt(Math.random() * 9);
        if (x !== nox && y !== noy && !isLandmind) {
            map[y][x].isLandmind = 1;
            a.push([x, y]);
            num--;
        }
    }

    return a;
}

/*更新ui */
function updateMap(map, item) {
    var isWin = [];
    map.forEach(function(line) {
        line.forEach(function(cell) {
            var index = cell.y * 9 + cell.x;
            if (cell.isFlag) {
                addClass(item[index], 'z-flag')
            } else {
                removeClass(item[index], 'z-flag')
            }
            if (cell.isOpen) {
                removeClass(item[index], 'z-flag');
                addClass(item[index], 'z-open');
                item[index].innerText = cell.number == 0 ? '' : cell.number;
            }
            if (cell.isFlag && cell.isLandmind) {
                isWin.push(0)
            }
        });
    });
    if (isWin.length == 10) {
        alert('win');
        location.reload();
    }
}


/**事件：布雷 
 * 
 */
function eSetLandmind(map, item, e) {
    var target = e.target;
    var options = target.dataset;
    var landmind = createLandmind(map, 10, options.x, options.y);
}

/**事件：测雷
 * 
 */
function eCheckLandmind(map, item, e) {
    var x = parseInt(e.target.dataset.x);
    var y = parseInt(e.target.dataset.y);
    testLandmind(map, x, y);
}

/**开图  
 * 开启地图区块
 * @param map {JSON} ：地图数据
 * @param x {Number} : 区块位置x
 * @param y {Number} : 区块位置y
 */
function testLandmind(map, x, y) {
    var num = 0;
    var index = 0;
    var isFlag = 0;
    var dx = [-1, 0, 1, 1, 1, 0, -1, -1];
    var dy = [-1, -1, -1, 0, 1, 1, 1, 0];

    //下一次遍历节点集
    var nextNode = [];
    var nx, ny;

    if (isNext(x, y) || isFlag == index) {
        //探测周围八个格子
        index = 0;
        for (var i = 0; i < 8; i++) {
            nx = x + dx[i];
            ny = y + dy[i];
            if (isNext(nx, ny)) {
                //符合要求：在图内，不是雷，或者是被标记的雷，没有被访问过，可以作为下次遍历的root
                nextNode.push([nx, ny]);
            }
        }
        map[y][x].number = num;
        map[y][x].isOpen = true;
        if (index == 0) {
            //周围无雷
            while (nextNode.length > 0) {
                var a = nextNode.pop();
                testLandmind(map, a[0], a[1]);
            }
        }
    } else if (index) {
        /*game over */
        alert('gg');
        location.reload();
    }

    function isNext(j, i) {
        if (i < 0 || i > 8 || j < 0 || j > 8) {
            return false; //在图外
        }
        if (map[i][j].isLandmind == 1) {
            num++;
        }
        if (map[i][j].isLandmind == 1 && map[i][j].isFlag == 0) {
            index++;
            return false; //是未被探测的雷
        }
        if (map[i][j].isLandmind == 1 && map[i][j].isFlag == 1) {
            isFlag++;
            return false
        }
        if (map[i][j].number != -1) {
            return false; //已经被访问过
        }
        return true; //可以遍历
    }
}

/**插旗事件
 * 
 */
function eSetFlag(map, e) {
    var x = parseInt(e.target.dataset.x);
    var y = parseInt(e.target.dataset.y);
    var bool = map[y][x].isFlag;
    map[y][x].isFlag = bool ? false : true;
}


/**辅助函数
 * 
 */
function addClass(obj, className) {
    var rxp = new RegExp(className, 'g');
    if (!rxp.test(obj.className)) {
        obj.className += ' ' + className;
    }
}

function removeClass(obj, className) {
    obj.className = obj.className.replace(' ' + className, '');
}