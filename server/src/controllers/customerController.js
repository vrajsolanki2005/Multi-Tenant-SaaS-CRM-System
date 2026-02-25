const customerService = require('../services/customerService')

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^[0-9+\-\s()]{7,20}$/.test(phone);

exports.createCustomer = async(req, res) =>{
    try{
        const {name, email, phone} = req.body;
        
        if(!name || !email || !phone) {
            return res.status(400).json({message: "Missing required fields"});
        }
        
        if(!validateEmail(email)) {
            return res.status(400).json({message: "Invalid email format"});
        }
        
        if(!validatePhone(phone)) {
            return res.status(400).json({message: "Invalid phone format"});
        }
        
        const tenant_id = req.user.tenant_id;
        const created_by = req.user.user_id;

        const result = await customerService.createCustomer(tenant_id, created_by, {name, email, phone});
        return res.status(201).json({message: "Customer created", customerId: result.customer_id, customer: result});
    }
    catch(err){
        console.error("Error in creating customer", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({message: "Email already exists"});
        }
        return res.status(500).json({message: "Internal server error"});
    }
}

exports.getCustomers = async(req, res) =>{
    try{
        const tenant_id = req.user.tenant_id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        
        const result = await customerService.getCustomers(tenant_id, limit, offset);
        return res.status(200).json(result);
    }
    catch(err){
        console.error("Error in fetching customers", err);
        return res.status(500).json({message: "Internal server error"});
    }
}

exports.getCustomersById = async(req, res) =>{
    try{
        const tenant_id = req.user.tenant_id;
        const customer_id = req.params.id;
        
        const result = await customerService.getCustomersById(tenant_id, customer_id);
        
        if(!result) {
            return res.status(404).json({message: "Customer not found"});
        }
        
        return res.status(200).json(result);
    }
    catch(err){
        console.error("Error in fetching customer", err);
        return res.status(500).json({message: "Internal server error"});
    }
}

exports.updateCustomer = async(req, res) =>{
    try{
        const tenant_id = req.user.tenant_id;
        const customer_id = req.params.id;
        const {name, email, phone} = req.body;
        
        if(email && !validateEmail(email)) {
            return res.status(400).json({message: "Invalid email format"});
        }
        
        if(phone && !validatePhone(phone)) {
            return res.status(400).json({message: "Invalid phone format"});
        }
        
        const result = await customerService.updateCustomer(tenant_id, customer_id, {name, email, phone});
        
        if(!result) {
            return res.status(404).json({message: "Customer not found"});
        }
        
        return res.status(200).json({message: "Customer updated", customer: result});
    }
    catch(err){
        console.error("Error in updating customer", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({message: "Email already exists"});
        }
        return res.status(500).json({message: "Internal server error"});
    }
}

exports.deleteCustomer = async(req, res) =>{
    try{
        const tenant_id = req.user.tenant_id;
        const customer_id = req.params.id;
        
        const result = await customerService.deleteCustomer(tenant_id, customer_id);
        
        if(!result) {
            return res.status(404).json({message: "Customer not found"});
        }
        
        return res.status(200).json({message: "Customer deleted"});
    }
    catch(err){
        console.error("Error in deleting customer", err);
        return res.status(500).json({message: "Internal server error"});
    }
}