USE saas_crm;

CREATE TABLE IF NOT EXISTS landing_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section VARCHAR(50) NOT NULL,
    data JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_section (section)
);

-- Testimonials
INSERT INTO landing_content (section, data, sort_order) VALUES
('testimonials', '{"id":"t1","quote":"FlowCRM transformed how we handle client requests. Our response time dropped from hours to minutes, and clients love the real-time status updates.","author":"Sarah Chen","role":"Operations Director","company":"TechServ Co","avatar":"👩‍💼","avatarBg":"from-violet-400 to-violet-600","stars":4.5}', 1),
('testimonials', '{"id":"t2","quote":"We manage over 500 service requests daily across three departments. FlowCRM\'s role-based queues mean nothing falls through the cracks anymore.","author":"Marcus Rivera","role":"Service Manager","company":"GlobalOps Inc","avatar":"👨‍💻","avatarBg":"from-blue-400 to-blue-600","stars":5}', 2),
('testimonials', '{"id":"t3","quote":"The dashboard alone saved us 15 hours a week of manual reporting. We can finally see bottlenecks in real-time and resolve them proactively.","author":"Priya Mehta","role":"Head of Client Success","company":"ServicePro","avatar":"👩‍🔬","avatarBg":"from-emerald-400 to-emerald-600","stars":5}', 3);

-- Hero stats
INSERT INTO landing_content (section, data, sort_order) VALUES
('hero_stats', '{"label":"Requests handled","value":"120K+","sub":"↑ 42% this quarter","color":"text-emerald-400"}', 1),
('hero_stats', '{"label":"Active companies","value":"3,200+","sub":"across 45 countries","color":"text-indigo-400"}', 2),
('hero_stats', '{"label":"Client satisfaction","value":"98.7%","sub":"avg rating","color":"text-violet-400"}', 3);

-- Testimonials bottom stats
INSERT INTO landing_content (section, data, sort_order) VALUES
('testimonial_stats', '{"value":"3,200+","label":"companies"}', 1),
('testimonial_stats', '{"value":"120K+","label":"requests handled"}', 2),
('testimonial_stats', '{"value":"96%","label":"resolution rate"}', 3),
('testimonial_stats', '{"value":"99.9%","label":"uptime"}', 4);

-- Pricing plans
INSERT INTO landing_content (section, data, sort_order) VALUES
('pricing', '{"id":"starter","name":"Starter","price":"$29","period":"/mo","desc":"Perfect for small teams getting started with service request management.","featured":false,"features":["Up to 5 team members","500 requests/month","Client portal","Email notifications","Basic analytics","Standard templates"]}', 1),
('pricing', '{"id":"growth","name":"Growth","price":"$99","period":"/mo","desc":"The go-to plan for growing companies with multiple departments.","featured":true,"features":["Up to 25 team members","Unlimited requests","Role-based access (Admin, Manager, Sales)","Real-time dashboard & analytics","Custom request categories","Priority email & chat support","Client status updates","Team performance reports"]}', 2),
('pricing', '{"id":"enterprise","name":"Enterprise","price":"Custom","period":"","desc":"Enterprise-grade platform for large organisations with complex needs.","featured":false,"features":["Unlimited team members","Unlimited requests","Multi-tenant isolation","Dedicated account manager","Custom reporting & dashboards","SLA guarantee (99.99%)","SSO & SCIM provisioning","On-premise deployment option"]}', 3);
