const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const app=express();
const axios=require("axios");

app.use(bodyParser.json());
app.use(cors());

const handleEvent=(type,data)=>{
    if(type==='PostCreated'){
        const {id,title}=data;
        posts[id]={id,title,comments:[]};
    }

    if(type==='CommentCreated'){
        const {id,content,postId,status}=data;
        const post=posts[postId];
        post.comments.push({id,content,status})
    }

    if (type==='CommentUpdated') {
        const {id,content,postId,status}=data;
        const post=posts[postId];

        const comment=post.comments.find(comment=>{
            return comment.id===id;
        })

        comment.status=status;
        comment.content=content;
    }
}

const posts={};

app.get('/posts',(req,res)=>{
    res.send(posts)
})

app.post('/events',(req,res)=>{
    const { type, data }= req.body;
    
    handleEvent(type,data)

    res.send({});
})

app.listen(4002,async(req,res)=>{
    console.log("Listening on 4002");

    const getEventsResponse = await axios.get('http://localhost:4005/events')
    for (let event of getEventsResponse.data) {
        console.log("Processing Event: ",event.type);
        const {type,data}=event;
        handleEvent(type,data);
    }
})