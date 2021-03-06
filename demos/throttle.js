/**
 * 使用时间戳简单版本节流函数
 * @param {*} func 执行函数
 * @param {*} wait 延迟时间
 */
function throttle1(func, wait) {
    let context, args
    let previous = 0

    return function () {
        let now = +new Date()
        context = this
        args = arguments
        if (now - previous > wait) {
            func.apply(context, args)
            previous = now
        }
    }
}

/**
 * 使用定时器简单版本节流函数
 * @param {*} func 执行函数
 * @param {*} wait 延迟时间
 */
function throttle2(func, wait) {
    let timeout

    return function () {
        context = this
        args = arguments
        if (!timeout) {
            timeout = setTimeout(function () {
                timeout = null
                func.apply(context, args)
            }, wait)
        }
    }
}

/**
 * 节流函数
 * @param {*} func 执行函数
 * @param {*} wait 延迟时间
 * @param {*} options 配置选项 leading: false 表示禁用第一次执行 trailing: false 表示禁用停止触发的回调
 */
function throttle(func, wait, options) {
    let context, timeout, args, result
    let previous = 0

    let later = function () {
        previous = options.leading === false ? 0 : +new Date()
        timeout = null
        func.apply(context, args)
        if (!timeout) context = args = null
    }

    let throttled = function () {
        let now = +new Date()
        if (!previous && options.leading === false) previous = now
        let remaining = wait - (now - previous)
        context = this
        args = arguments
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout)
                timeout = null
            }
            previous = now
            func.apply(context, args)
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining)
        }
    }

    throttled.cancel = function () {
        clearTimeout(timeout)
        previous = 0
        timeout = null
    }

    return throttled
}
