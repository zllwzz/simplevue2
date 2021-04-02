import {h,render} from './vdom'


// 节约性能  先把真实节点 用一个对象表示出来  再通过对象渲染到页面上
// 前端操作dom的时候 排序 删除

// diff 新的节点  再生成一个对象

// vue代码基本不用手动操作dom

// 虚拟dom  只是一个对象
// new Vue({
//     render(h) {
//         return h('div',{},'hello')
//     },
// })

// <div id="container"><span style="color:red">hello</span>zf</div>

let oldvnode = h('div', {
        id: 'container'
    },
    h('span', {
        style: {
            color: 'red'
        }
    }, 'hello'),
    'zf'
)
let container = document.getElementById('app');

render(oldvnode,container)