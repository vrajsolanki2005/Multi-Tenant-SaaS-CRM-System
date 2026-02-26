USE saas_crm

CREATE TABLE leads (
    leads_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status ENUM('new', 'contacted', 'qualified', 'converted','closed') DEFAULT 'new',
    value DECIMAL(10, 2),
    customer_id INT,
    tenant_id INT NOT NULL,
    assigned_to INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE SET NULL
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE
    FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL
)