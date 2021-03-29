import {
    observe
} from "./index";
import {
    arrayMethods,
    observeArray,
    dependArray
} from "./array";
import Dep from "./dep";

export function defineReactive(data, key, value) {
    // 如果value依旧是一个对象的话 需要深度观察
    let childOb = observe(value) //递归观察
    let dep = new Dep()
    // console.log(dep.id, value)
    Object.defineProperty(data, key, {
        get() {
            if (Dep.target) {
                dep.depend()

                // 数组的依赖收集
                if (childOb) {
                    childOb.dep.depend();
                    dependArray(value)
                }
            }
            return value;
        },
        set(newValue) {
            // console.log('设置数据')
            if (newValue === value) return;
            observe(newValue) //对新赋值的数据进行观察
            value = newValue
            dep.notify() //通知视图更新
        }
    })
}

class Observer {
    constructor(data) {
        // 将用户的数据使用defineProperty重新定义
        this.dep = new Dep();
        // 每个对象 包括数组都有一个__ob__属性，返回的是当前observer实例
        Object.defineProperty(data, '__ob__', {
            get: () => this
        })
        if (Array.isArray(data)) {
            // 重写方法
            data.__proto__ = arrayMethods;
            observeArray(data) //观测数组中的每一项
        } else {
            this.walk(data)
        }
    }

    walk(data) {
        let keys = Object.keys(data)
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = data[keys[i]]

            defineReactive(data, key, value)
        }
    }
}
export default Observer