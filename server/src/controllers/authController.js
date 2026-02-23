const authService = require('../services/authService');

//create org
exports.createOrg = async(req, res) =>{
    try{
        // /get data from req.body
        const {name,adminName,email,password} = req.body;

        //check missing fields
        if(!name || !password || !email){
            return res.status(400).json({message:"Missing Fields"})
        }

        //call the services
        const result = await authService.createOrg(name, adminName, email, password);
        return res.status(201).json({message:"Organization created successfully", 
            orgId : result.id, 
            userId : result.user_id
        });
    }
    catch(err){
        console.error("Error in  creating organization", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: "Organization or Email already exists" });
        }
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
//login
exports.login = async(req, res) =>{
    try{
        //get data from req.body
        const {email, password} = req.body;
        //check missingig field
        if(!email || !password){
            return res.status(400).json({message:"Missing Fields"})
        }

        // call the service
        const result = await authService.login(email, password);

        return res.status(200).json(    
        {
            success:true,
            message:"Login successful",
            orgId : result.org_id,
            userId : result.user_id,
            token: result.token
        })
    }
    catch(err){
        console.error("Error in login", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}