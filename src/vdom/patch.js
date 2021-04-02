// 这个文件除了第一次的初始化渲染之外
// 还要做比对操作



// 让虚拟节点 渲染成真实节点
export function render(vnode, container) {
    let el = createElm(vnode)
    container.appendChild(el)
}

function createElm(vnode) {

    let {tag,children,key,props,text} = vnode;

    if (typeof tag === 'string') {
        // 标签
        vnode.el = document.createElement(tag);
        children.forEach(child => {
            render(child, vnode.el)
        });
    } else {
        // 文本
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}