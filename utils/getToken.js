const token = (ctx) => {
    const cookie = ctx.headers.cookie.split(';');
    const token = cookie.filter(item => item.indexOf('token') !== -1);
    return token && token.length > 0 ? token[0].split('=')[1] : '';
};

module.exports = token;