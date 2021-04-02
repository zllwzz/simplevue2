export function vnode(tag, props, key, children, text) {
    return {
        tag, //标签名
        props, //当前标签上的属性
        key, //唯一标识
        children
    }
}