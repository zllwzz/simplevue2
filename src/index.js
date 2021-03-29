import Vue from 'vue' //默认先查找source目录下的vue文件夹

let vm = new Vue({
    el: '#app',
    data() {
        return {
            msg: 'hello',
            // school: {
            //     name: 'zf',
            //     age: 10
            // },
            arr: [[1,2], 2, 3],
            firstName: 'zhu',
            lastName: 'feng'
        }
    },
    computed: {
        // fullName() {
        //     return this.firstName + this.lastName
        // }
    },
    watch: {
        // msg(newValue,value) {
        //     console.log(newValue,value)
        // }
        msg:{
            handler(newValue,value) {
                console.log(newValue,value)
            },
            // immediate: true
        }
    }
})


setTimeout(() => {
    // vm.msg = 0
},1000)