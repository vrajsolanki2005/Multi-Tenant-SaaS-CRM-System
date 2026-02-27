const db = require('../config/db')

exports.createLead = async (data) => {
    const conn = await db.getConnection();
    try{
        await conn.beginTransaction();
        const [result] = await conn.execute(
            `INSERT INTO leads (title, status, value, customer_id, tenant_id, assigned_to) VALUES (?, ?, ?, ?, ?, ?)`,
            [data.title, 'new', data.value, data.customer_id, data.tenant_id, data.assigned_to]
        );
        await conn.commit();
        return result.insertId;
    }
    catch(err){
        await conn.rollback();
        throw err;
    }
    finally{
        conn.release();
    }
}
exports.getLeads = async (tenant_id)=>{
    const conn = await db.getConnection();
    try{
        const [result] = await conn.execute(
            'SELECT * FROM leads WHERE tenant_id = ? ORDER BY created_at DESC',
            [tenant_id]
        );
        return result;
    }
    catch(err){
        throw err;
    }
    finally{
        conn.release();
    }
}

exports.getLeadById = async (lead_id) =>{
    const conn = await db.getConnection();
    try{
        const [result] = await conn.execute(
            'SELECT * FROM leads WHERE lead_id = ?',
            [lead_id]
        );
        return result[0];
    }
    catch(err){
        throw err;
    }
    finally{
        conn.release();
    }
}

exports.updateLeadStatus = async (lead_id, tenant_id, status)=>{
    const conn = await db.getConnection();
    try{
        await conn.beginTransaction();
        const [result] = await conn.execute(
            'UPDATE leads SET status = ? WHERE lead_id = ? AND tenant_id = ?',
            [status, lead_id, tenant_id]
        );
        await conn.commit();
        return result.affectedRows > 0;
    }
    catch(err){
        await conn.rollback();
        throw err;
    }
    finally{
        conn.release();
    }
}

exports.deleteLead = async (lead_id, tenant_id)=>{
    const conn = await db.getConnection();
    try{
        await conn.beginTransaction();
        const [result] = await conn.execute(
            'DELETE FROM leads WHERE lead_id = ? AND tenant_id = ?',
            [lead_id, tenant_id]
        );
        await conn.commit();
        
        if(result.affectedRows === 0){
            return null;
        }
        
        return true;
    }
    catch(err){
        await conn.rollback();
        throw err;
    }
    finally{
        conn.release();
    }
}
