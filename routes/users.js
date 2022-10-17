const express= require("express");
const bcrypt= require("bcrypt");
const router = express.Router();
const{auth} = require("../middleware/auth");
const {UserModel,validUser,validLogin,createToken} = require("../models/userModel")



router.get("/",auth , async(req,res)=> {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;


  
  try{
    if(req.tokenData.role == "admin"){
      let data = await UserModel.find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({_id:-1})
      res.json(data);
    }
    else{
      res.json({msg:"you do not have an access. you are not an admin."})
    }

  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

router.post("/login", async(req,res) => {
  let validBody = validLogin(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = await UserModel.findOne({email:req.body.email})
    if(!user){
      return res.status(401).json({msg:"Password or email is worng ,code:1"})
    }
    let authPassword = await bcrypt.compare(req.body.password,user.password);
    if(!authPassword){
      return res.status(401).json({msg:"Password or email is worng ,code:2"});
    }
    let token = createToken(user._id,user.role);
    res.json({token});
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})


router.post("/", async(req,res) => {
  let validBody = validUser(req.body);

  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);

    await user.save();
    user.password = "***";
    res.status(201).json(user);
  }
  catch(err){
    if(err.code == 11000){
      return res.status(500).json({msg:"Email already in system, try log in",code:11000})
       
    }
    console.log(err);
    res.status(500).json({msg:"err",err})
  }
})



module.exports = router;