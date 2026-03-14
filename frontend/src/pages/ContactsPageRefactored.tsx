import React, { useState } from 'react';
import { Contact, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../api/customers';
import { usePagination, useModal, useToast, usePermissions } from '../hooks';
import { Button, Modal, Input, EmptyState, Pagination, Table } from '../components/common';
import { Customer, CreateCustomerDto } from '../types';

export default function ContactsPage() {
  const { canManageCustomers, canDeleteCustomers } = usePermissions();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  
  const { data: customers, loading, page, setPage, total, totalPages, hasNextPage, hasPrevPage, reload } = 
    usePagination<Customer>({ fetchFn: getCustomers });
  
  const createModal = useModal<Customer>();
  const editModal = useModal<Customer>();
  const [formData, setFormData] = useState<CreateCustomerDto>({ name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);

  const handleOpenCreate = () => {
    setFormData({ name: '', email: '', phone: '' });
    createModal.open();
  };

  const handleOpenEdit = (customer: Customer) => {
    setFormData({ name: customer.name, email: customer.email, phone: customer.phone });
    editModal.open(customer);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editModal.isOpen && editModal.data) {
        await updateCustomer(editModal.data.customer_id, formData);
        showToast('Contact updated successfully');
        editModal.close();
      } else {
        await createCustomer(formData);
        showToast('Contact created successfully');
        createModal.close();
      }
      reload();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Error saving contact', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (customer: Customer) => {
    if (!confirm(`Delete contact "${customer.name}"?`)) return;
    try {
      await deleteCustomer(customer.customer_id);
      showToast('Contact deleted successfully');
      reload();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Error deleting contact', 'error');
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (c: Customer) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar" style={{ width: 30, height: 30, fontSize: 11, flexShrink: 0 }}>
            {c.name.charAt(0)}
          </div>
          <span style={{ fontWeight: 600 }}>{c.name}</span>
        </div>
      ),
    },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    {
      key: 'created_at',
      header: 'Added',
      render: (c: Customer) => new Date(c.created_at).toLocaleDateString(),
    },
    ...(canManageCustomers ? [{
      key: 'actions',
      header: 'Actions',
      render: (c: Customer) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn-icon" onClick={() => handleOpenEdit(c)} aria-label="Edit contact">
            <Pencil size={14} />
          </button>
          {canDeleteCustomers && (
            <button
              className="btn-icon"
              style={{ color: 'var(--red)' }}
              onClick={() => handleDelete(c)}
              aria-label="Delete contact"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ),
    }] : []),
  ];

  return (
    <div>
      {/* Header */}
      <div className="section-header">
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Contacts</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            {total} total contacts
          </p>
        </div>
        {canManageCustomers && (
          <Button variant="primary" icon={<Plus size={15} />} onClick={handleOpenCreate}>
            Add Contact
          </Button>
        )}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 340 }}>
        <Search
          size={15}
          style={{
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
          }}
        />
        <input
          className="input"
          style={{ paddingLeft: 32 }}
          placeholder="Search contacts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <Table
          columns={columns}
          data={filteredCustomers}
          loading={loading}
          emptyIcon={<Contact size={40} />}
          emptyTitle="No contacts found"
          emptyDescription="Get started by adding your first contact"
          keyExtractor={(c) => c.customer_id.toString()}
        />
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={createModal.isOpen || editModal.isOpen}
        onClose={() => {
          createModal.close();
          editModal.close();
        }}
        title={editModal.isOpen ? 'Edit Contact' : 'New Contact'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { createModal.close(); editModal.close(); }}>
              Cancel
            </Button>
            <Button variant="primary" loading={saving} onClick={handleSave}>
              {editModal.isOpen ? 'Save Changes' : 'Create Contact'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input
            label="Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Smith"
          />
          <Input
            label="Email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@company.com"
          />
          <Input
            label="Phone"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 555 000 0000"
          />
        </form>
      </Modal>
    </div>
  );
}
