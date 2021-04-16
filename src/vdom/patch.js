// 这个文件除了第一次的初始化渲染之外
// 还要做比对操作



// 让虚拟节点 渲染成真实节点
export function render(vnode, container) {
    let el = createElm(vnode)
    container.appendChild(el)
}

function createElm(vnode) {

    let {
        tag,
        children,
        key,
        props,
        text
    } = vnode;

    if (typeof tag === 'string') {
        // 标签
        vnode.el = document.createElement(tag);
        updateProperties(vnode)
        children.forEach(child => {
            render(child, vnode.el)
        });
    } else {
        // 文本
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

function updateProperties(vnode, oldProps = {}) {
    let newProps = vnode.props || {};
    let el = vnode.el;
    let newStyle = newProps.style || {};
    let oldStyle = oldProps.style || {};

    for (let key in oldStyle) {
        if (!newStyle[key]) {
            el.style[key] = ''
        }
    }
    // 如果下次更新时 应该用新的属性来更新老的节点
    // 如果老的中有属性 新的中没有
    for (let key in oldProps) {
        if (!newProps[key]) {
            delete el[key];
        }
    }

    for (let key in newProps) {
        // 特殊属性特殊处理  这里不过多判断。。
        if (key === 'style') {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
        } else {
            el[key] = newProps[key]
        }

    }
}

export function patch(oldVnode, newVnode) {
    // 先比对标签
    if (oldVnode.tag !== newVnode.tag) {
        // 直接创建新节点替换老节点
        oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el)
    }

    // 比较文本
    if (!oldVnode.tag) {
        if (oldVnode.text !== newVnode.text) {
            oldVnode.el.textContent = newVnode.text;
        }
    }

    // 标签一样 可能属性不一样
    let el = newVnode.el = oldVnode.el;
    updateProperties(newVnode, oldVnode.props)

    // 比较孩子
    let oldChildren = oldVnode.children || [];
    let newChildren = newVnode.children || [];

    if (oldChildren.length > 0 && newChildren.length > 0) {
        updateChildren(el, oldChildren, newChildren)
    } else if (oldChildren.length > 0) {
        el.innerHTML = ''
    } else if (newChildren.length > 0) {
        for (let i = 0; i < newChildren.length; i++) {
            let child = createElm(newChildren[i])
            el.appendChild(child)
        }
    }
}

// 两个节点标签名和key一样 认为是同一个节点
function isSameVnode(oldVnode, newVnode) {
    return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key)
}

function updateChildren(parent, oldChildren, newChildren) {
    let oldStartIndex = 0;
    let oldStartVnode = oldChildren[0];
    let oldEndIndex = oldChildren.length - 1;
    let oldEndVnode = oldChildren[oldEndIndex];

    let newStartIndex = 0;
    let newStartVnode = newChildren[0];
    let newEndIndex = newChildren.length - 1;
    let newEndVnode = newChildren[newEndIndex];

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (isSameVnode(oldStartVnode, newStartVnode)) {
            console.log(oldStartVnode.key)
            patch(oldStartVnode, newStartVnode);
            oldStartVnode = oldChildren[++oldStartIndex];
            newStartVnode = newChildren[++newStartIndex];
        } else if (isSameVnode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode);
            oldEndVnode = oldChildren[--oldEndIndex];
            newEndVnode = newChildren[--newEndIndex];
        } else if (isSameVnode(oldStartVnode, newEndVnode)) {
            patch(oldStartVnode, newEndVnode);
            parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
            oldStartVnode = oldChildren[++oldStartIndex];
            newEndVnode = newChildren[--newEndIndex];
        } else if (isSameVnode(oldEndVnode, newStartVnode)) {
            patch(oldEndVnode, newStartVnode);
            parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
            oldEndVnode = oldChildren[--oldEndIndex];
            newStartVnode = newChildren[++newStartIndex];
        } else {
            // 两个列表乱序 不复用
        }
    }

    // 把剩余的插入
    if (newStartIndex <= newEndIndex) {
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            let ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
            parent.insertBefore(createElm(newChildren[i]), ele)
            // insertBefore(插入的元素,null) => appendChild
            // parent.appendChild(createElm(newChildren[i]));
        }
    }
}