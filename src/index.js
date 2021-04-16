import {
    h,
    render,
    patch
} from './vdom'


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

let oldvnode = h('div', {id: 'container'},
    h('li', {key: 'a',style: {background:'red'}}, 'a'),
    h('li', {key: 'b',style: {background:'yellow'}}, 'b'),
    h('li', {key: 'c',style: {background:'blue'}}, 'c'),
    h('li', {key: 'd',style: {background:'pink'}}, 'd'),
)

let newVnode = h('div', {id: 'aa'},
    h('li', {key: 'd',style: {background:'pink'}}, 'd'),
    h('li', {key: 'a',style: {background:'red'}}, 'a'),
    h('li', {key: 'b',style: {background:'yellow'}}, 'b'),
    h('li', {key: 'c',style: {background:'blue'}}, 'c'),
)
let container = document.getElementById('app');

render(oldvnode, container)

setTimeout(() => {
    patch(oldvnode,newVnode)
}, 1000);