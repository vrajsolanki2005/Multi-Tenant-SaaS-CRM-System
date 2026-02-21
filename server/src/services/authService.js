const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.createOrg = async(name, adminName, email, password) =>{
    const conn = await db.getConnection();
    try{
        await conn.beginTransaction();

        //generate hash pass
        const salt = await bcrypt.genSalt(10);
        const hp = await bcrypt.hash(password, salt);

        //create org
        const [orgresult] = await conn.execute('INSERT INTO org (name) VALUES ?' , [nmae]);
        const newOrgId = orgresult.insertId;

        //create/update user(admin) 
        const[userResult] = await conn.execute('INSERT INTO users (tenant_id, user_name, user_email, user_password, user_role) VALUES ?' ,
             [newOrgId, adminName,email,hp,'admin'])

        await conn.commit();

        return {id: newOrgId, user_id: userResult.insertId};
    }
    catch(error){
        await conn.rollback();
        throw error;
    }
    finally{
        conn.release();
    }
}