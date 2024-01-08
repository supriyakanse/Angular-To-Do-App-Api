const express=require('express')
const app = express();
const cors=require('cors')
const mongoose=require('mongoose')
const bodyParser = require("body-parser");
const bcrypt=require('bcrypt')
const registerUser=require('./models/register')
const employeeSchema=require('./models/employee')
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors())

const task=[];

const dbConnection=async()=>{
    try{
        await mongoose.connect("mongodb+srv://user:user@cluster0.vy7a42u.mongodb.net/?retryWrites=true&w=majority");
        console.log("connected")
    }catch(error){
        console.log('error while connecting to db',error)
    }
}
dbConnection();

app.post('/',(req,res)=>{
    console.log("post clled")
    task.push(req.body.task)
    res.status(200).json(task)
    console.log(task)
})
app.get('/', (req, res) => {   
      res.status(200).json(task);
  });
  
app.delete('/:index',(req,res)=>{
    let index=parseInt(req.params.index)
    console.log(index)
    task.splice(index,1)
    res.json(task)
})

app.put('/', (req, res) => {
    console.log("put clld")
    const { index, newTask } = req.body;
    task[index]=newTask
    res.json(task[index]);
  });
  


app.post('/register',(req,res)=>{
    try{
         bcrypt.hash(req.body.password,10,async (err,hash)=>{
            if(err){
                res.status(500).send(err);
            }else{
                const user=new registerUser({
                    firstname:req.body.firstname,
                lastname:req.body.lastname,
                mobileno:req.body.mobileno,
                email:req.body.email,
                dob:req.body.dob,
                gender:req.body.gender,
                password:hash
                })
                let result=await user.save();
                console.log('data posted', result)
                res.status(200).json({
                    message:"data posted",
                })
            }
            })
    }catch(error){
        console.log('error while posting data',error)
    }
})

app.post('/login',async (req,res)=>{
    try{
        let result=await registerUser.find({email:req.body.email});
        if(result.length<=0){
        res.status(404).json({
            status:'no such user',
            flag:false
        })   
        }else{
            bcrypt.compare(req.body.password,result[0].password,(err,results)=>{
                if(results){
                    res.status(200).json({
                        status:'user logged in successfully',
                        flag:true
                    })
                }else{
                    console.log(err);
                    res.status(404).json({
                        error:"password dint match",
                        flag:false
                    })
                }
            })
        }
    }catch(error){
        console.log('error inn login',error)
    }
})

app.post("/adduser",async(req,res)=>{
    try{
        const employee=new employeeSchema({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            designatiton:req.body.designation,
            salary:req.body.salary
        })
        let results=await employee.save();
        res.status(200).json({
            message:"employee added",
            data:results
        })
        console.log(results)
    }catch(errors){
        console.log('error in dashboard',errors);
    }
})


app.get('/seeuser',async (req,res)=>{
    try{
        let results=await employeeSchema.find();
        if(results.length>0){
            res.status(200).send(results)
        }
        else{
            res.status(404).json({message:'No user found'});
            }
    }catch(errors){
        console.log(errors)
    }
})
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})

