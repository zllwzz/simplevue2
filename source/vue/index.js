import {
    initState
} from './observe'
import Watcher from './observe/watch';
import {
    compiler
} from './util'

function Vue(options) {
    this._init(options) //初始化vue
}

Vue.prototype._init = function (options) {
    let vm = this;
    vm.$options = options

    // MVVM原理
    initState(vm)

    if (vm.$options.el) {
        vm.$mount();
    }
}

function query(el) {
    if (typeof el === 'string') {
        return document.querySelector(el)
    }
    return el;
}

Vue.prototype._update = function () {
    // 用户传入的数据 去更新视图
    let vm = this;
    let el = vm.$el;
    let node = document.createDocumentFragment();
    let firstChild;
    while (firstChild = el.firstChild) {
        node.appendChild(firstChild)
    }
    compiler(node, vm)
    el.appendChild(node)
}

Vue.prototype.$mount = function () {
    let vm = this;
    let el = vm.$options.el;
    el = vm.$el = query(el)

    // 渲染是通过 watch来渲染的
    let updateComponent = () => {
        vm._update()
    }
    new Watcher(vm, updateComponent)
}

Vue.prototype.$watch = function (expr, handler,opts) {
    let vm = this;
    new Watcher(vm, expr, handler, {
        user: true,
        ...opts
    }); //用户自己定义的watch
}

export default Vue