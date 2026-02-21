const authService = require('./services/authService');

exports.createOrg = async(req, res) =>{
    try{
        // /get data from req.body
        const {name,adminName, email, password} = req.body;

        //check missing fields
        if(!name || !password || !email){
            return res.status(400).json({err, message:"Missing Fields"})
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
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: "Organization or Email already exists" });
        }
    }
}