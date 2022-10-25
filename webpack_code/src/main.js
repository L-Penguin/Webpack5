// 完整引入
// import 'core-js';
// 按需引入
// import 'core-js/es/promise'

import count from './js/count';
import sum from './js/sum';
// 想要webpack打包资源，必须引入该资源
import './css/index.css';
import './less/index.less';
import './sass/test1.sass';
import './sass/test2.scss';
import './stylus/index.styl';
import './css/iconfont.css';

console.log(count(2, 1));
console.log(sum(1, 2, 3, 4));

document.querySelector("#btn").onclick = function() {
    // eslint不能识别动态导入需要，需要额外追加配置
    // /* webpackChunkName: "math" */ webpack魔法命名
    import(/* webpackChunkName: "math" */"./js/math").then(({ mul })=> {
        console.log(mul(10, 3));
    })
}

if (module.hot) {
    // 判断是否支持热模块替换功能
    module.hot.accept("./js/count");
    module.hot.accept("./js/sum");
}

new Promise((resolve)=> {
    setTimeout(()=> {
        resolve(100);
    }, 1000)
})

if ("serviceWorker" in navigator) {
    window.addEventListener("load", ()=> {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then((registration)=> {
                console.log("SW registered: ", registration);
            })
            .catch((registrationError)=> {
                console.log("SW registraion failed: ", registrationError);
            });
    })
}
