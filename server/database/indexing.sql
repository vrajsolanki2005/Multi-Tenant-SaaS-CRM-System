-- Speed up customer lookups by tenant
CREATE INDEX idx_tenant_customers ON customers(tenant_id);

-- Speed up lead lookups and pipeline filtering
CREATE INDEX idx_tenant_leads ON leads(tenant_id);

-- Pro Tip: Indexing the status too because we filter by it often
CREATE INDEX idx_leads_status_tenant ON leads(tenant_id, status);