USE saas_crm;
CREATE TABLE IF NOT EXISTS org(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    plan ENUM('free', 'pro') DEFAULT 'free',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_org_name (name)
);

ALTER TABLE leads CHANGE leads_id lead_id INT AUTO_INCREMENT;