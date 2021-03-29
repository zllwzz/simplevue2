import {
    observe
} from "./index";

// push unshift shift pop reverse sort splice

// 先获取老的数据方法 只改写这7个方法
let oldArrayProtoMethods = Array.prototype;

// 拷贝的一个新的额对象，可以查找到老的方法
export let arrayMethods = Object.create(oldArrayProtoMethods)

let methods = [
    'push',
    'shift',
    'pop',
    'unshift',
    'reverse',
    'sort',
    'splice'
]

// 循环数组依次对数组中每一项进行观测
export function observeArray(inserted) {
    for (let i = 0; i < inserted.length; i++) {
        observe(inserted[i])
    }
}


// 对收集数组中的依赖
export function dependArray(value) {
    for(let i = 0; i<value.length;i++) {
        let currentItem = value[i];
        currentItem.__ob__ && currentItem.__ob__.dep.depend()
        if (Array.isArray(currentItem)) {
            dependArray(currentItem)
        }
    }
}

methods.forEach(method => {
    arrayMethods[method] = function (...args) { //函数劫持
        let r = oldArrayProtoMethods[method].apply(this, args);
        // todo
        let inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break;

            case 'splice':
                inserted = args.slice(2)
            default:
                break;
        }
        if (inserted) observeArray(inserted)
        this.__ob__.dep.notify(); //通知视图更新
        return r
    }
})