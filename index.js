const server = require('http');
require('dotenv').config();
const StringDecoder = require('string_decoder').StringDecoder


const {Configuration, OpenAIApi} = require('openai');

const port = process.env.PORT || 8080;

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

const openAi = new OpenAIApi(configuration);

server.createServer((req, res)=>{
    if(req.url==='/'){
        
        if(req.method.toLowerCase() === 'post'){

            let decoder = new StringDecoder("utf-8")
            let buffer = '';
            
            req.on('data', (chunk)=>{
                buffer = buffer + decoder.write(chunk)
            })

            req.on('end', async ()=>{
                buffer = buffer + decoder.end()
                if(req.headers['content-type'] ==='text/plain'){
                    try{
                        const messages = JSON.parse(buffer);
                        const completion = await openAi.createChatCompletion({
                            model:'gpt-3.5-turbo',
                            max_tokens: 3000,
                            messages
                        });
                        // res.writeHead(200, 'Ok', {"Content-Type":"application/json", "Access-Control-Allow-Origin":'https://chatchuck.vercel.app'})
                        res.writeHead(200, 'Ok', {"Content-Type":"application/json", "Access-Control-Allow-Origin":'https://chatchuck.vercel.app'})
                        res.write(JSON.stringify(completion.data.choices[0].message.content));
                        res.end();
                    } catch(err){
                        // res.writeHead(400, 'Error', {"Content-Type":"application/json","Access-Control-Allow-Origin":'http://chatchuck.vercel.app'})
                        res.writeHead(400, 'Error', {"Content-Type":"application/json","Access-Control-Allow-Origin":'https://chatchuck.vercel.app'})
                        res.write(JSON.stringify('An error occur'))
                    }
                }
                 else{
                    res.writeHead(404, "Some Error occured", {
                      "Content-Type": "application/json",
                      "Access-Control-Allow-Origin":
                        "https://chatchuck.vercel.app",
                    });
                    // res.writeHead(404, "Some Error occured", {"Content-Type":"application/json","Access-Control-Allow-Origin":'https://chatchuck.vercel.app'})
                    res.write('error getting text')
                    res.end()
                 }
            })
            
        }
    }
}).listen(port, ()=>{
    console.log(`Server listening on port ${port}`)
})