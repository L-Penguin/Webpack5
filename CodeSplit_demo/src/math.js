export const sum = function(...args) {
    return args.reduce((p, c)=> p + c, 0);
}