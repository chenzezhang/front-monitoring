const getBrowerType = (type) => {

    if (!type) {
        return;
    }

    var explorer = type;

    let browType = ['MSIE', 'Firefox', 'Chrome', 'Opera', 'Safari', 'Netscape', 'otherBrowser'];
    let brower;

    //ie 
    if (explorer.includes(browType[0])) {
        brower = browType[0];
    }
    //firefox 
    else if (explorer.includes(browType[1])) {
        brower = browType[1];
    }
    //Chrome
    else if (explorer.includes(browType[2])) {
        brower = browType[2];
    }
    //Opera
    else if (explorer.includes(browType[3])) {
        brower = browType[3];
    }
    //Safari
    else if (explorer.includes(browType[4])) {
        brower = browType[4];
    }
    //Netscape
    else if (explorer.includes(browType[5])) {
        brower = browType[5];
    } else {
        brower = browType[6];
    }
    return brower;
};

module.exports = getBrowerType;