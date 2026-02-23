const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//create-org
exports.createOrg = async(name, adminName, email, password) =>{
    const conn = await db.getConnection();
    try{
        await conn.beginTransaction();

        //generate hash pass
        const salt = await bcrypt.genSalt(10);
        const hp = await bcrypt.hash(password, salt);

        //create org
        const [orgresult] = await conn.execute('INSERT INTO org (name) VALUES (?)', [name]);
        const newOrgId = orgresult.insertId;

        //create/update user(admin) 
        const[userResult] = await conn.execute('INSERT INTO users (tenant_id, user_name, user_email, user_password, user_role) VALUES (?, ?, ?, ?, ?)',
             [newOrgId, adminName, email, hp, 'admin'])

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

//login
exports.login = async(email,password) =>{
    const conn = await db.getConnection();
    try{
        await conn.beginTransaction();

        //find user by email
        const [user] = await conn.execute('SELECT * FROM users WHERE user_email = ?', [email]);

        //if no user data found
        if(user.length ==0){
            throw new Error('Invalid credentials')
        }

        //compare password
        const isMatch = await bcrypt.compare(password, user[0].user_password);
        if(!isMatch){
            throw new Error('Invalid credentials')
        }
        //jwt
        const token = jwt.sign(
            {userId: user[0].user_id, tenantId: user[0].tenant_id},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        );

        //return user data
        return {
            user_id: user[0].user_id,
            org_id: user[0].tenant_id,
            token: token
        };
    }
    catch(error){
        throw error;
    }
    finally{
        conn.release();
    }
}
