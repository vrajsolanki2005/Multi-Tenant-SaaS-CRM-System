const leadService = require('../services/leadService')

const STATUS_FLOW = {
    'new': ['contacted', 'closed'],
    'contacted': ['qualified', 'closed'],
    'qualified': ['converted', 'closed'],
    'converted': [], 
    'closed': ['new'] 
};
exports.createLead = async (req, res) =>{
    try{
        const {title, value, customer_id} = req.body;
        
        if(!title) {
            return res.status(400).json({message: "Title is required"});
        }
        
        const leadData = {
            title,
            value,
            customer_id,
            tenant_id: req.user.tenant_id,
            assigned_to: req.user.user_id
        };
        
        const id = await leadService.createLead(leadData);
        return res.status(201).json({message: "Lead created successfully", lead_id: id});
    }
    catch(err){
        console.error("Error in creating lead", err);
        return res.status(500).json({message: "Internal server error"});
    }
}

exports.getLead = async (req, res) =>{
    try{
        const tenant_id = req.user.tenant_id;
        const leads = await leadService.getLeads(tenant_id);
        return res.status(200).json(leads);
    }
    catch(err){
        console.error("Error in fetching leads", err);
        return res.status(500).json({message: "Internal server error"});
    }
}
exports.updateLeadStatus = async (req, res) =>{
    try{
        const lead_id = req.params.id;
        const {new_status} = req.body;
        const tenant_id = req.user.tenant_id;
        
        if(!new_status) {
            return res.status(400).json({message: "New status is required"});
        }

        const currentLead = await leadService.getLeadById(lead_id);
        if(!currentLead || currentLead.tenant_id != tenant_id){
            return res.status(404).json({message: "Lead not found"});
        }
        
        const current_status = currentLead.status;

        if(!STATUS_FLOW[current_status]?.includes(new_status)){
            return res.status(400).json({
                message: `Cannot move from ${current_status} to ${new_status}`
            });
        }
        
        await leadService.updateLeadStatus(lead_id, tenant_id, new_status);
        return res.status(200).json({message: "Lead status updated"});
    }
    catch(err){
        console.error("Error in updating lead status", err);
        return res.status(500).json({message: "Internal server error"});
    }
}

exports.deleteLead = async (req, res) =>{
    try{
        const lead_id = req.params.id;
        const tenant_id = req.user.tenant_id;
        
        const result = await leadService.deleteLead(lead_id, tenant_id);
        
        if(!result) {
            return res.status(404).json({message: "Lead not found"});
        }
        
        return res.status(200).json({message: "Lead deleted"});
    }
    catch(err){
        console.error("Error in deleting lead", err);
        return res.status(500).json({message: "Internal server error"});
    }
}