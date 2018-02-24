//将豆瓣得到的电影星级评分向下取整 : 4.5->4, 3.5->3，并根据向下取整的结果创建01数组，1代表一颗星
function convertToStarsArray (stars) {
    var num = stars.toString().substring(0, 1);
    var array = [];
    for (var i = 1; i<=5; i++) {
        if (i <= num) {
            array.push(1);
        }else {
            array.push(0);
        }
    }   
    return array;
}

//从指定的豆瓣api获取数据
function http (url, callBack) {
    wx.request({
        url: url,
        method: 'GET',
        header: {
            'Content-type': 'application/json'
        },
        success: function (result) {
            callBack(result.data);
        },
        fail: function (error) {
            console.log(error);
        },
    });
}

function convertToCastString (casts) {
    var castsjoin = "";
    for (var idx in casts) {
        castsjoin = castsjoin + casts[idx].name + " / ";
    }
    return castsjoin.substring(0, castsjoin.length - 2);
}

function convertToCastInfos (casts) {
    var castsArray = [];
    for (var idx in casts) {
        var cast = {
            img: casts[idx].avatars ? casts[idx].avatars.large : "",
            name: casts[idx].name,
        };
        castsArray.push(cast);
    }
    return castsArray;
}

module.exports = {
    convertToStarsArray: convertToStarsArray,
    http: http,
    convertToCastString: convertToCastString,
    convertToCastInfos: convertToCastInfos,
}