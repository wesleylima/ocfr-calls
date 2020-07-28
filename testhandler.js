const { handler } = require('./index');

handler().then((resp) => {
    console.log(resp.body.incidents);
})
