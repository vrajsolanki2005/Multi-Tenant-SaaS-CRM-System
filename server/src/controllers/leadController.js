const leadService = require('../services/leadService');

const STATUS_FLOW = {
    'new': ['contacted', 'closed'],
    'contacted': ['qualified', 'closed'],
    'qualified': ['converted', 'closed'],
    'converted': [],
    'closed': ['new']
};

exports.createLead = async (req, res) => {
    try {
        const { title, status, value, customer_id } = req.body;
        
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        
        const tenant_id = req.user.tenant_id;
        const created_by = req.user.user_id;

        const result = await leadService.createLead(tenant_id, created_by, { title, status, value, customer_id });
        return res.status(201).json({ message: "Lead created", leadId: result.lead_id, lead: result });
    } catch (err) {
        console.error("Error in creating lead", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getLeads = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { page, limit, status } = req.query;
        
        const result = await leadService.getLeads(tenant_id, { page, limit, status });
        return res.status(200).json(result);
    } catch (err) {
        console.error("Error in fetching leads", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getLeadById = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const lead_id = req.params.id;
        
        const result = await leadService.getLeadById(tenant_id, lead_id);
        
        if (!result) {
            return res.status(404).json({ message: "Lead not found" });
        }
        
        return res.status(200).json(result);
    } catch (err) {
        console.error("Error in fetching lead", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};



exports.updateLead = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const lead_id = req.params.id;
        const { title, status, newStatus, value, customer_id } = req.body;
        
        const targetStatus = newStatus || status;
        
        if (targetStatus) {
            const currentLead = await leadService.getLeadById(tenant_id, lead_id);
            if (!currentLead) {
                return res.status(404).json({ message: "Lead not found" });
            }
            
            const allowedStatuses = STATUS_FLOW[currentLead.status];
            if (!allowedStatuses.includes(targetStatus)) {
                return res.status(400).json({ 
                    message: `Invalid transition: Cannot move from ${currentLead.status} to ${targetStatus}`
                });
            }
        }
        
        const result = await leadService.updateLead(tenant_id, lead_id, { title, status: targetStatus, value, customer_id });
        
        if (!result) {
            return res.status(404).json({ message: "Lead not found" });
        }
        
        return res.status(200).json({ message: "Lead updated", lead: result });
    } catch (err) {
        console.error("Error in updating lead", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteLead = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const lead_id = req.params.id;
        
        const result = await leadService.deleteLead(tenant_id, lead_id);
        
        if (!result) {
            return res.status(404).json({ message: "Lead not found" });
        }
        
        return res.status(200).json({ message: "Lead deleted" });
    } catch (err) {
        console.error("Error in deleting lead", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
