const db = require('../config/db')

exports.createCustomer = async (tenant_id, created_by, data)=>{
    const conn = await db.getConnection();
    try{
        await conn.beginTransaction();
        const [result] = await conn.execute(
            'INSERT INTO customers (tenant_id, name, email, phone, created_by) VALUES (?,?,?,?,?)',
            [tenant_id, data.name, data.email, data.phone, created_by]
        );
        await conn.commit();
        return {customer_id: result.insertId, ...data};
    }
    catch(err){
        await conn.rollback();
        throw err;
    }
    finally{
        conn.release();
    }
}

exports.getCustomers = async (tenant_id, limit, offset)=>{
    const conn = await db.getConnection();
    try{
        const [result] = await conn.query(
            `SELECT * FROM customers WHERE tenant_id = ? ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`,
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

exports.getCustomersById = async (tenant_id, customer_id)=>{
    const conn = await db.getConnection();
    try{
        const [result] = await conn.execute(
            'SELECT * FROM customers WHERE tenant_id = ? AND customer_id = ?',
            [tenant_id, customer_id]
        );
        return result.length > 0 ? result[0] : null;
    }
    catch(err){
        throw err;
    }
    finally{
        conn.release();
    }
}

exports.updateCustomer = async (tenant_id, customer_id, data)=>{
    const conn = await db.getConnection();
    try{
        await conn.beginTransaction();
        
        const updates = [];
        const values = [];
        
        if(data.name) {
            updates.push('name = ?');
            values.push(data.name);
        }
        if(data.email) {
            updates.push('email = ?');
            values.push(data.email);
        }
        if(data.phone) {
            updates.push('phone = ?');
            values.push(data.phone);
        }
        
        if(updates.length === 0) {
            return null;
        }
        
        values.push(tenant_id, customer_id);
        
        const [result] = await conn.execute(
            `UPDATE customers SET ${updates.join(', ')} WHERE tenant_id = ? AND customer_id = ?`,
            values
        );
        
        await conn.commit();
        
        if(result.affectedRows === 0){
            return null;
        }
        
        return {customer_id, ...data};
    }
    catch(err){
        await conn.rollback();
        throw err;
    }
    finally{
        conn.release();
    }
}

exports.deleteCustomer = async (tenant_id, customer_id)=>{
    const conn = await db.getConnection();
    try{
        await conn.beginTransaction();
        const [result] = await conn.execute(
            'DELETE FROM customers WHERE tenant_id = ? AND customer_id = ?',
            [tenant_id, customer_id]
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