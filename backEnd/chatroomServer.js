const koa = require('koa');
const router = require('koa-router');
const websockify = require('koa-websocket');
const app = new koa();
websockify(app);
api = router();

let conversationList = [];
function send(opt) {
    conversationList.forEach((conversation, index, conversationList) => {
        conversation.ctx.websocket.send(opt);
    })
}

//create Conversation obj 
function Conversation(ctx) {
    let Conversation = new Object();
    Conversation.ctx = ctx;
    Conversation.name = '';
    return Conversation;
}

api.get('/api',(ctx, next) => {
    conversationList.push(Conversation(ctx));
    /*将连接信息存入到数据库中，包括用户名，连接id，时间，消息类型,消息内容*/

    let message = null;
    /*转发所有消息，客户端根据消息类型进行选择性渲染*/
    ctx.websocket.on("message", (opt) => {
        console.log(opt)
        message = JSON.parse(opt);
        if (message.type === "goOnline"){
            //刚刚上线
            let time = new Date().getTime()
            let ident = ''+ time%15836718 + ctx.req.headers.cookie ;
            console.log(ident)
            function hashFnv32a(str, asString, seed) {
                /*jshint bitwise:false */
                var i, l,
                    hval = (seed === undefined) ? 0x811c9dc5 : seed;
            
                for (i = 0, l = str.length; i < l; i++) {
                    hval ^= str.charCodeAt(i);
                    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
                }
                if( asString ){
                    // Convert to 8 digit hex string
                    return ("0000000" + (hval >>> 0).toString(16)).substr(-12);
                }
                return hval >>> 0;
            }
            let idName = hashFnv32a(ident,true,12)
            let _opt = JSON.stringify({
                name: idName,
                type: 'setName',
                time: new Date().toLocaleString()
            });
            ctx.websocket.send(_opt);
        }else{
            //普通聊天
            send(opt);
        }
        
    });
    // 下线
    ctx.websocket.on("close", (opt) => {
        for (let i = 0; i < conversationList.length; i++) {
            if (conversationList[i].ctx.websocket.readyState == 2 || conversationList[i].ctx.websocket.readyState == 3) {
                // outName = conversationList[i].name;
                conversationList.splice(i, 1);
                i--;
            }
        }
        let _opt = JSON.stringify({
            // name: outName,
            type: 'goOutline',
            time: new Date().toLocaleString()
        });
        send(_opt);
    });

});

app.ws.use(api.routes()).use(api.allowedMethods());
app.listen(3030);


console.log('app started at port 3030...');