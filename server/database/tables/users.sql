USE saas_crm;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    
    tenant_id INT NOT NULL,
    
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    
    user_role ENUM('admin', 'manager') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_users_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES org(id)
        ON DELETE CASCADE,

    UNIQUE KEY unique_email_per_tenant (tenant_id, user_email),
    
    INDEX idx_users_tenant (tenant_id)
);
