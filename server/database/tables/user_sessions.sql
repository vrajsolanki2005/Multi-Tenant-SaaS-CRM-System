USE saas_crm;

CREATE TABLE user_sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    tenant_id INT NOT NULL,
    user_role ENUM('superAdmin', 'admin', 'manager', 'sales') NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    user_agent TEXT,
    ip_address VARCHAR(45),
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES org(id) ON DELETE CASCADE,
    
    INDEX idx_user_sessions_user (user_id),
    INDEX idx_user_sessions_tenant (tenant_id),
    INDEX idx_user_sessions_expires (expires_at),
    INDEX idx_user_sessions_active (is_active, expires_at)
);