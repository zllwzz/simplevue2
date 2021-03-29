import {
    pushTarget,
    popTarget
} from './dep'
import {
    util
} from '../util';


let id = 0;
// 每次产生一个watcher 都要有一个唯一的标识
class Watcher {
    /**
     * 
     * @param {*} vm 当前组件的实例
     * @param {*} exprOrFn 用户可能传入的是一个表达式，也可能传入的是一个函数
     * @param {*} cb 用户传入的回调函数 vm.$watch('msg',cb)
     * @param {*} opts 一些其他的参数
     */
    constructor(vm, exprOrFn, cb = () => {}, opts = {}) {
        this.vm = vm;
        this.exprOrFn = exprOrFn;
        if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn
        } else {
            this.getter = function () {
                return util.getValue(vm, exprOrFn)
            }
        }
        if (opts.user) {
            this.user = true;
        }
        this.cb = cb;
        this.opts = opts
        this.id = id++
        this.deps = [];
        this.depsId = new Set()
        this.immediate = opts.immediate
        this.lazy = opts.lazy;
        this.dirty = this.lazy;

        // 创建watcher的时候，先将表达式对应的值取出来  老值
        // 如果当前我们是计算属性的话 不会默认调用get方法
        this.value = this.lazy ? undefined : this.get()
        if (this.immediate) {
            this.cb(this.value)
        }
    }

    get() {
        pushTarget(this)
        let value = this.getter.call(this.vm)
        popTarget()
        return value;
    }

    evaluate() {
        this.value = this.get();
        this.dirty = false;
    }

    update() {
        if (this.lazy) {
            this.dirty = true;
        } else {
            queueWatcher(this)
        }
    }

    addDep(dep) {
        let id = dep.id;
        if (!this.depsId.has(id)) {
            this.depsId.add(id)
            this.deps.push(dep)
            dep.addSub(this)
        }
    }

    depend() {
        let i = this.deps.length;
        while(i--) {
            this.deps[i].depend()
        }

    }
    run() {
        let value = this.get(); //新值
        if (this.value !== value) {
            this.cb(value, this.value)
        }
    }
}

let has = {}
let queue = []

function flushQueue() {
    queue.forEach(watcher => watcher.run())
    has = {};
    queue = []
}

function queueWatcher(watcher) {
    let id = watcher.id;
    if (!has[id]) {
        has[id] = true;
        queue.push(watcher)


        // 延迟清空队列
        nextTick(flushQueue)
    }
}


let callbacks = []

function flushCallbacks() {
    callbacks.forEach(cb => cb())
}

function nextTick(cb) {
    callbacks.push(cb)

    // 异步是分执行顺序的 会先执行微任务（promise mutationObserver） 宏任务（setImmediate setTimeout）
    let timerFunc = () => {
        flushCallbacks()
    }
    if (Promise) {
        return Promise.resolve().then(timerFunc)
    }
    if (MutationObserver) {
        let observe = new MutationObserver(timerFunc)
        let textNode = document.createTextNode(1);
        observe.observe(textNode, {
            characterData: true
        })
        textNode.textContent = 2
        return
    }
    if (setImmediate) {
        return setImmediate(timerFunc)
    }
    setTimeout(timerFunc, 0)
}

export default Watcher