import "./css/index.css";

console.log("hello main");

console.log(111);

console.log("222")

const sum = (...args) => {
    return args.reduce((p, c) => p + c, 0)
}

console.log(sum(0, 1, 2, 3, 4, 5));