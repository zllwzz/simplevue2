
const defaultRE = /\{\{((?:.|\r?\n)+?)\}\}/g
export const util = {
    getValue(vm,expr) {
        console.log('getValue')
        let keys = expr.split('.')
        return keys.reduce((memo,current) => {
            memo = memo[current]
            return memo;
        },vm)
    },
    compilerText(node,vm) {
        // 替换{{}}
        if (!node.expr) {
            node.expr = node.textContent;
        }
       node.textContent= node.expr.replace(defaultRE,function(...args) {
            return util.getValue(vm,args[1])
        })
    }
}



export function compiler(node,vm) {
    console.log('compiler')
    let childNodes = node.childNodes;
    [...childNodes].forEach(child => {
        if (child.nodeType == 1) {
            compiler(child,vm)
        } else if (child.nodeType == 3) {
            util.compilerText(child,vm)
        }
    })
}