USE saas_crm;
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id INT,
    user_id INT NOT NULL,
    tenant_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tenant_entity (tenant_id, entity),
    INDEX idx_user (user_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES org(id) ON DELETE CASCADE
);
