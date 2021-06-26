export const getMonthInChinese = (num) => {
    if (typeof num !== 'number') return
    if (num < 0 | num >= 12) return
    switch (num) {
        case 0:
            return '一月'
        case 1:
            return '二月'
        case 2:
            return '三月'
        case 3:
            return '四月'
        case 4:
            return '五月'
        case 5:
            return '六月'
        case 6:
            return '七月'
        case 7:
            return '八月'
        case 8:
            return '九月'
        case 9:
            return '十月'
        case 10:
            return '十一月'
        case 11:
            return '十二月'
        default:
            return ''
    }
}

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小時
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export const dateFormat = (inputDate) => {
    //check if it's a Date object
    if (Object.prototype.toString.call(date) !== '[object Date]') {
        return console.log('Function dateFormat receive an argument that is not an Date Object.')
    }
    return outputinputDate.format(inputDate)
}