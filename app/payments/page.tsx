// PATH: C:\websmith\app\payments\page.tsx
// Payments Page - Track and manage all payments and transactions
// Features: View, Record, Edit, Delete payments, download PDF receipts

"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Download, 
  Eye,
  Plus,
  Edit2,
  Trash2,
  Check,
  X
} from "lucide-react";
import API from "@/core/services/apiService";
import Modal from "@/components/ui/Modal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { ViewModeToggle } from "@/components/ui/ViewModeToggle";
import { getStoredUser, AuthUser } from "@/lib/auth";

interface Payment {
  _id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  currency?: string;
  method: "card" | "bank" | "cash" | "crypto";
  status: "completed" | "pending" | "failed" | "refunded";
  transactionId: string;
  date: string;
  notes?: string;
}

interface InvoiceOption {
  _id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  dueAmount?: number;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<InvoiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDownloadingReceipt, setIsDownloadingReceipt] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const isAdmin = user?.role === "admin";

  // CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    invoiceId: "",
    invoiceNumber: "",
    clientName: "",
    clientEmail: "",
    amount: "",
    currency: "USD",
    method: "bank" as "card" | "bank" | "cash" | "crypto",
    status: "completed" as "completed" | "pending" | "failed" | "refunded",
    transactionId: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get("/payments");
      if (response.data.success || response.data.data) {
        setPayments(response.data.data || []);
      }
    } catch (error) {
      console.error("Fetch payments error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInvoices = useCallback(async () => {
    try {
      const res = await API.get("/invoices");
      if (res.data?.data) {
        setInvoices(res.data.data);
      }
    } catch (e) {
      console.error("Fetch invoices for payments error:", e);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
    fetchInvoices();
  }, [fetchPayments, fetchInvoices]);

  const handleOpenCreate = () => {
    setEditingPayment(null);
    setFormError(null);
    setFormData({
      invoiceId: invoices[0]?._id || "",
      invoiceNumber: invoices[0]?.invoiceNumber || "",
      clientName: invoices[0]?.clientName || "",
      clientEmail: invoices[0]?.clientEmail || "",
      amount: invoices[0] ? String(invoices[0].dueAmount ?? invoices[0].amount ?? "") : "",
      currency: "USD",
      method: "bank",
      status: "completed",
      transactionId: `TXN-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setFormError(null);
    setFormData({
      invoiceId: payment.invoiceId || "",
      invoiceNumber: payment.invoiceNumber || "",
      clientName: payment.clientName || "",
      clientEmail: payment.clientEmail || "",
      amount: String(payment.amount),
      currency: payment.currency || "USD",
      method: payment.method,
      status: payment.status,
      transactionId: payment.transactionId || "",
      date: payment.date ? payment.date.split("T")[0] : new Date().toISOString().split("T")[0],
      notes: payment.notes || "",
    });
    setIsModalOpen(true);
  };

  const handleInvoiceSelect = (invId: string) => {
    const selected = invoices.find((inv) => inv._id === invId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        invoiceId: selected._id,
        invoiceNumber: selected.invoiceNumber,
        clientName: selected.clientName,
        clientEmail: selected.clientEmail,
        amount: String(selected.dueAmount ?? selected.amount),
      }));
    } else {
      setFormData((prev) => ({ ...prev, invoiceId: invId }));
    }
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || isNaN(Number(formData.amount))) {
      setFormError("Valid payment amount is required");
      return;
    }

    setIsSaving(true);
    setFormError(null);

    const payload = {
      invoiceId: formData.invoiceId || undefined,
      invoiceNumber: formData.invoiceNumber.trim(),
      clientName: formData.clientName.trim(),
      clientEmail: formData.clientEmail.trim(),
      amount: Number(formData.amount),
      currency: formData.currency,
      method: formData.method,
      status: formData.status,
      transactionId: formData.transactionId.trim() || `TXN-${Date.now()}`,
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      notes: formData.notes.trim(),
    };

    try {
      if (editingPayment) {
        await API.put(`/payments/${editingPayment._id}`, payload);
        setActionMessage({ type: "success", text: `Payment #${payload.transactionId} updated successfully.` });
      } else {
        await API.post("/payments", payload);
        setActionMessage({ type: "success", text: `Payment #${payload.transactionId} recorded successfully.` });
      }
      setIsModalOpen(false);
      setEditingPayment(null);
      await fetchPayments();
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err: any) {
      console.error("Save payment error:", err);
      setFormError(err.response?.data?.message || err.message || "Failed to save payment");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePayment = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/payments/${deleteTarget._id}`);
      setActionMessage({ type: "success", text: `Payment #${deleteTarget.transactionId} deleted.` });
      setDeleteTarget(null);
      await fetchPayments();
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete payment");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "#34C759";
      case "pending": return "#FF9500";
      case "failed": return "#FF3B30";
      case "refunded": return "#8E8E93";
      default: return "#8E8E93";
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "card": return "💳";
      case "bank": return "🏦";
      case "cash": return "💰";
      case "crypto": return "₿";
      default: return "💳";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = (payment.invoiceNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (payment.clientName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (payment.transactionId || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
  };

  const handleCloseDetails = () => {
    setSelectedPayment(null);
  };

  const handleDownloadReceipt = async (payment: Payment) => {
    try {
      setIsDownloadingReceipt(true);
      setDownloadError("");

      const response = await API.get(`/payments/${payment._id}/receipt`, { responseType: "blob" });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${payment.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Receipt download error:", error);
      setDownloadError(error?.response?.data?.message || "Failed to download receipt");
    } finally {
      setIsDownloadingReceipt(false);
    }
  };

  const stats = {
    total: payments.length,
    completed: payments.filter(p => p.status === "completed").length,
    pending: payments.filter(p => p.status === "pending").length,
    totalAmount: payments.reduce((sum, p) => sum + (p.status === "completed" ? p.amount : 0), 0)
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading payments...</p>
      </div>
    );
  }

  return (
    <div style={styles.container} className="wsd-page admin-panel-scope payments-page">
      {/* Header */}
      <div style={styles.header} className="wsd-page-header payments-page-header">

        {/* Row 1: Title + Record Payment button (Admin only) */}
        <div className="payments-title-row">
          <div className="payments-title-block">
            <h1 style={styles.title} className="payments-title">Payments</h1>
            <p style={styles.subtitle} className="payments-subtitle">
              {isAdmin ? "Track, record, and manage all client transactions" : "View your payment history and download receipts"}
            </p>
          </div>
          {isAdmin && (
            <button onClick={handleOpenCreate} style={styles.primaryBtn} className="admin-primary-btn payments-record-btn">
              <Plus size={16} />
              <span>Record Payment</span>
            </button>
          )}
        </div>

        {/* Row 2: Search + View Toggle + Filter */}
        <div className="payments-search-controls-row">
          <div style={styles.middleSearchWrap} className="payments-middle-search">
            <div style={styles.searchBox} className="admin-search-box wsd-search-box payments-search-box">
              <Search size={18} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search by invoice #, client, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
                className="admin-search-input"
              />
            </div>
          </div>
          <ViewModeToggle value={viewMode} onChange={setViewMode} className="payments-view-toggle" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={styles.filterSelect}
            className="payments-filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

      </div>

      {actionMessage && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '12px',
          marginBottom: '20px',
          backgroundColor: actionMessage.type === 'success' ? 'rgba(52, 199, 89, 0.12)' : 'rgba(255, 59, 48, 0.12)',
          color: actionMessage.type === 'success' ? '#34C759' : '#FF3B30',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Check size={18} />
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div style={styles.statsGrid} className="wsd-grid-tiles payments-stats-grid">
        <div style={styles.statCard} className="wsd-unified-card payment-stat-card">
          <div style={{ ...styles.statIcon, backgroundColor: "rgba(0, 122, 255, 0.1)" }} className="stat-icon-wrap">
            <CreditCard size={20} color="#007AFF" />
          </div>
          <div className="stat-text-wrap">
            <div style={styles.statValue} className="payment-stat-val">{stats.total}</div>
            <div style={styles.statLabel} className="payment-stat-lbl">Total Transactions</div>
          </div>
        </div>
        <div style={styles.statCard} className="wsd-unified-card payment-stat-card">
          <div style={{ ...styles.statIcon, backgroundColor: "rgba(52, 199, 89, 0.1)" }} className="stat-icon-wrap">
            <DollarSign size={20} color="#34C759" />
          </div>
          <div className="stat-text-wrap">
            <div style={styles.statValue} className="payment-stat-val">{formatCurrency(stats.totalAmount)}</div>
            <div style={styles.statLabel} className="payment-stat-lbl">Total Received</div>
          </div>
        </div>
        <div style={styles.statCard} className="wsd-unified-card payment-stat-card">
          <div style={{ ...styles.statIcon, backgroundColor: "rgba(255, 149, 0, 0.1)" }} className="stat-icon-wrap">
            <Clock size={20} color="#FF9500" />
          </div>
          <div className="stat-text-wrap">
            <div style={styles.statValue} className="payment-stat-val">{stats.pending}</div>
            <div style={styles.statLabel} className="payment-stat-lbl">Pending</div>
          </div>
        </div>
        <div style={styles.statCard} className="wsd-unified-card payment-stat-card">
          <div style={{ ...styles.statIcon, backgroundColor: "rgba(52, 199, 89, 0.1)" }} className="stat-icon-wrap">
            <CheckCircle size={20} color="#34C759" />
          </div>
          <div className="stat-text-wrap">
            <div style={styles.statValue} className="payment-stat-val">{stats.completed}</div>
            <div style={styles.statLabel} className="payment-stat-lbl">Completed</div>
          </div>
        </div>
      </div>

      {downloadError && (
        <div style={styles.errorBanner} role="alert">
          {downloadError}
        </div>
      )}

      {/* Payments List */}
      {filteredPayments.length === 0 ? (
        <div style={styles.emptyState} className="payments-empty-state">
          <CreditCard size={64} color="var(--text-secondary)" />
          <h3 style={{color: 'var(--text-primary)'}}>No payments found</h3>
          <p style={{color: 'var(--text-secondary)'}}>Record a new payment to begin tracking transactions.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={styles.paymentsGrid}>
          {filteredPayments.map((payment) => (
            <div key={payment._id} style={styles.paymentCard} className="payment-card">
              <div style={styles.paymentHeader}>
                <div style={styles.paymentLeft}>
                  <div style={styles.methodIcon}>{getMethodIcon(payment.method)}</div>
                  <div>
                    <div style={styles.invoiceNumber}>Invoice #{payment.invoiceNumber}</div>
                    <div style={styles.clientName}>{payment.clientName}</div>
                  </div>
                </div>
                <div style={styles.paymentRight}>
                  <div style={styles.amount}>{formatCurrency(payment.amount)}</div>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: `${getStatusColor(payment.status)}15`,
                    color: getStatusColor(payment.status)
                  }}>
                    {payment.status}
                  </span>
                </div>
              </div>
              <div style={styles.paymentDetails}>
                <div style={styles.detailItem}>
                  <Calendar size={14} color="var(--text-secondary)" />
                  <span>{formatDate(payment.date)}</span>
                </div>
                <div style={styles.detailItem}>
                  <CreditCard size={14} color="var(--text-secondary)" />
                  <span>Transaction: {payment.transactionId}</span>
                </div>
              </div>
              <div style={styles.paymentActions} className="payment-actions-stack">
                <button style={styles.viewButton} className="action-btn" onClick={() => handleViewDetails(payment)}>
                  <Eye size={14} /> View
                </button>
                <button
                  style={styles.downloadButton}
                  className="action-btn"
                  onClick={() => handleDownloadReceipt(payment)}
                  disabled={isDownloadingReceipt}
                >
                  <Download size={14} /> Receipt
                </button>
                {isAdmin && (
                  <>
                    <button
                      style={styles.editButton}
                      className="action-btn"
                      onClick={() => handleOpenEdit(payment)}
                      title="Edit Payment"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      style={styles.deleteButton}
                      className="action-btn"
                      onClick={() => setDeleteTarget(payment)}
                      title="Delete Payment"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.paymentsTable}>
            <thead>
              <tr>
                <th style={styles.th}>Invoice #</th>
                <th style={styles.th}>Client</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Transaction</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment._id} style={styles.tableRow} className="table-row">
                  <td style={styles.td}>{payment.invoiceNumber}</td>
                  <td style={styles.td}>{payment.clientName}</td>
                  <td style={styles.td}>{formatCurrency(payment.amount)}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: `${getStatusColor(payment.status)}15`,
                      color: getStatusColor(payment.status)
                    }}>
                      {payment.status}
                    </span>
                  </td>
                  <td style={styles.td}>{formatDate(payment.date)}</td>
                  <td style={styles.td}>{payment.transactionId}</td>
                  <td style={styles.td}>
                    <div style={styles.tableActions}>
                      <button style={styles.viewButton} className="action-btn" onClick={() => handleViewDetails(payment)}>
                        <Eye size={14} />
                      </button>
                      <button
                        style={styles.downloadButton}
                        className="action-btn"
                        onClick={() => handleDownloadReceipt(payment)}
                        disabled={isDownloadingReceipt}
                      >
                        <Download size={14} />
                      </button>
                      {isAdmin && (
                        <>
                          <button style={styles.editButton} className="action-btn" onClick={() => handleOpenEdit(payment)} title="Edit Payment">
                            <Edit2 size={14} />
                          </button>
                          <button style={styles.deleteButton} className="action-btn" onClick={() => setDeleteTarget(payment)} title="Delete Payment">
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Record / Edit Payment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPayment(null);
        }}
        title={editingPayment ? "Edit Payment" : "Record New Payment"}
        maxWidth="600px"
      >
        <form onSubmit={handleSavePayment} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {!editingPayment && invoices.length > 0 && (
            <div>
              <label style={styles.formLabel}>Select Invoice (Optional)</label>
              <select
                style={styles.formInput}
                value={formData.invoiceId}
                onChange={(e) => handleInvoiceSelect(e.target.value)}
              >
                <option value="">-- Manual Payment (No Invoice) --</option>
                {invoices.map((inv) => (
                  <option key={inv._id} value={inv._id}>
                    #{inv.invoiceNumber} - {inv.clientName} (Due: ${inv.dueAmount ?? inv.amount})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={styles.formLabel}>Invoice Number *</label>
              <input
                style={styles.formInput}
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                placeholder="INV-001"
                required
              />
            </div>
            <div>
              <label style={styles.formLabel}>Amount (USD) *</label>
              <input
                style={styles.formInput}
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={styles.formLabel}>Client Name *</label>
              <input
                style={styles.formInput}
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Client Name"
                required
              />
            </div>
            <div>
              <label style={styles.formLabel}>Client Email *</label>
              <input
                style={styles.formInput}
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                placeholder="client@example.com"
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={styles.formLabel}>Payment Method</label>
              <select
                style={styles.formInput}
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
              >
                <option value="bank">Bank Transfer</option>
                <option value="card">Credit Card</option>
                <option value="cash">Cash</option>
                <option value="crypto">Cryptocurrency</option>
              </select>
            </div>
            <div>
              <label style={styles.formLabel}>Status</label>
              <select
                style={styles.formInput}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={styles.formLabel}>Transaction ID</label>
              <input
                style={styles.formInput}
                value={formData.transactionId}
                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                placeholder="TXN-123456"
              />
            </div>
            <div>
              <label style={styles.formLabel}>Payment Date</label>
              <input
                style={styles.formInput}
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label style={styles.formLabel}>Notes (Optional)</label>
            <textarea
              style={{ ...styles.formInput, minHeight: "80px" }}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional payment details or receipt references..."
            />
          </div>

          {formError && (
            <div style={{ color: "#FF3B30", fontSize: "14px", fontWeight: 600 }}>{formError}</div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => {
                setIsModalOpen(false);
                setEditingPayment(null);
              }}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button type="submit" style={styles.saveBtn} disabled={isSaving}>
              {isSaving ? "Saving..." : editingPayment ? "Update Payment" : "Record Payment"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={Boolean(selectedPayment)}
        onClose={handleCloseDetails}
        title="Payment Details"
        maxWidth="560px"
      >
        {selectedPayment ? (
          <div style={styles.modalContent}>
            <div style={styles.modalGrid}>
              <div>
                <div style={styles.modalLabel}>Invoice</div>
                <div style={styles.modalValue}>#{selectedPayment.invoiceNumber}</div>
              </div>
              <div>
                <div style={styles.modalLabel}>Status</div>
                <div style={styles.modalValue}>{selectedPayment.status}</div>
              </div>
              <div>
                <div style={styles.modalLabel}>Amount</div>
                <div style={styles.modalValue}>{formatCurrency(selectedPayment.amount)}</div>
              </div>
              <div>
                <div style={styles.modalLabel}>Payment Date</div>
                <div style={styles.modalValue}>{formatDate(selectedPayment.date)}</div>
              </div>
              <div>
                <div style={styles.modalLabel}>Payment Method</div>
                <div style={styles.modalValue}>{selectedPayment.method}</div>
              </div>
              <div>
                <div style={styles.modalLabel}>Transaction ID</div>
                <div style={styles.modalValue}>{selectedPayment.transactionId}</div>
              </div>
            </div>
            <div style={styles.modalSection}>
              <div style={styles.modalLabel}>Client</div>
              <div style={styles.modalValue}>{selectedPayment.clientName}</div>
              <div style={styles.modalValue}>{selectedPayment.clientEmail}</div>
            </div>
            {selectedPayment.notes && (
              <div style={styles.modalSection}>
                <div style={styles.modalLabel}>Notes</div>
                <div style={styles.modalValue}>{selectedPayment.notes}</div>
              </div>
            )}
          </div>
        ) : null}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Payment"
        message={`Are you sure you want to delete payment #${deleteTarget?.transactionId} of ${formatCurrency(deleteTarget?.amount || 0)}? This will adjust related invoice balances.`}
        confirmLabel="Delete"
        isDanger
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeletePayment}
      />

      <style>{`
        .input-focus:focus {
          border-color: #007AFF !important;
          box-shadow: 0 0 0 4px rgba(0,122,255,0.1) !important;
        }
        .payment-card {
          transition: all 0.2s ease;
        }
        .payment-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
          border-color: #007AFF !important;
        }
        .action-btn {
          transition: all 0.2s ease;
        }
        .action-btn:hover {
          transform: translateY(-1px);
          opacity: 0.8;
        }
        /* Desktop layout (>900px): Single clean row with Title, Search, and Action Controls */
        @media (min-width: 901px) {
          .payments-page-header {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 12px !important;
            flex-wrap: nowrap !important;
          }
          .payments-title-row {
            display: contents !important;
          }
          .payments-title-block {
            order: 1 !important;
            flex-shrink: 0 !important;
          }
          .payments-search-controls-row {
            display: contents !important;
          }
          .payments-middle-search {
            order: 2 !important;
            flex: 1 !important;
            max-width: 650px !important;
            min-width: 280px !important;
            margin: 0 20px !important;
          }
          .payments-search-box {
            height: 44px !important;
            padding: 0 16px !important;
            border-radius: 12px !important;
          }
          .payments-search-box input {
            font-size: 14px !important;
          }
          .payments-view-toggle {
            order: 3 !important;
            flex-shrink: 0 !important;
          }
          .payments-filter-select {
            order: 4 !important;
            flex-shrink: 0 !important;
            height: 44px !important;
            padding: 0 14px !important;
            border-radius: 12px !important;
          }
          .payments-record-btn {
            order: 5 !important;
            flex-shrink: 0 !important;
            height: 44px !important;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .payments-page {
            padding: 16px 12px 24px !important;
          }
          .payments-page-header {
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
            width: 100% !important;
            margin-bottom: 14px !important;
          }
          /* Title + button: same row, space-between */
          .payments-title-row {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 8px !important;
            width: 100% !important;
          }
          .payments-title {
            font-size: 18px !important;
            margin-bottom: 1px !important;
            line-height: 1.2 !important;
          }
          .payments-subtitle {
            font-size: 11px !important;
            line-height: 1.25 !important;
            color: var(--text-secondary) !important;
          }
          .payments-record-btn {
            height: 32px !important;
            padding: 0 10px !important;
            font-size: 11px !important;
            font-weight: 600 !important;
            border-radius: 8px !important;
            gap: 4px !important;
            white-space: nowrap !important;
            flex-shrink: 0 !important;
          }
          .payments-record-btn span {
            display: inline !important;
          }
          .payments-record-btn svg {
            width: 14px !important;
            height: 14px !important;
          }

          /* Search + toggle + filter = one row, uniform compact 32px height */
          .payments-search-controls-row {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            gap: 6px !important;
            width: 100% !important;
          }
          .payments-middle-search {
            flex: 1 !important;
            min-width: 0 !important;
            max-width: none !important;
          }
          .payments-search-box {
            width: 100% !important;
            height: 32px !important;
            padding: 0 8px !important;
            border-radius: 8px !important;
            gap: 6px !important;
          }
          .payments-search-box svg {
            width: 14px !important;
            height: 14px !important;
          }
          .payments-search-box input {
            font-size: 12px !important;
          }
          .payments-view-toggle {
            height: 32px !important;
            padding: 2px !important;
            border-radius: 8px !important;
            gap: 2px !important;
            flex-shrink: 0 !important;
            display: flex !important;
            align-items: center !important;
          }
          .payments-view-toggle button {
            padding: 4px 6px !important;
            height: 26px !important;
            border-radius: 6px !important;
          }
          .payments-view-toggle svg {
            width: 13px !important;
            height: 13px !important;
          }
          .payments-filter-select {
            height: 32px !important;
            padding: 0 6px !important;
            font-size: 11px !important;
            border-radius: 8px !important;
            max-width: 105px !important;
            flex-shrink: 0 !important;
          }

          /* 4 stat cards in one row - compact and cleanly scaled */
          .payments-stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 6px !important;
            margin-bottom: 12px !important;
          }
          .payment-stat-card {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            padding: 8px 3px !important;
            gap: 4px !important;
            border-radius: 10px !important;
          }
          .stat-icon-wrap {
            width: 24px !important;
            height: 24px !important;
            border-radius: 6px !important;
          }
          .stat-icon-wrap svg {
            width: 13px !important;
            height: 13px !important;
          }
          .payment-stat-val {
            font-size: 12px !important;
            font-weight: 700 !important;
            letter-spacing: -0.3px !important;
            line-height: 1.15 !important;
          }
          .payment-stat-lbl {
            font-size: 8px !important;
            font-weight: 600 !important;
            letter-spacing: 0px !important;
            line-height: 1.1 !important;
            margin-top: 1px !important;
            opacity: 0.8 !important;
          }

          /* Compact empty state on mobile */
          .payments-empty-state {
            padding: 36px 16px !important;
            border-radius: 16px !important;
          }
          .payments-empty-state svg {
            width: 40px !important;
            height: 40px !important;
          }
          .payments-empty-state h3 {
            font-size: 15px !important;
            margin: 10px 0 4px !important;
          }
          .payments-empty-state p {
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles: any = {
  container: {
    padding: "32px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    gap: "16px",
    flexWrap: "wrap",
  },
  headerTitleBlock: {
    flexShrink: 0,
  },
  title: {
    fontSize: "32px",
    fontWeight: 800,
    color: "var(--text-primary)",
    margin: 0,
    marginBottom: "8px",
    letterSpacing: "-1px",
  },
  subtitle: {
    fontSize: "15px",
    color: "var(--text-secondary)",
    margin: 0,
  },
  middleSearchWrap: {
    flex: 1,
    maxWidth: "650px",
    minWidth: "280px",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 16px",
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
  },
  searchInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    color: "var(--text-primary)",
    fontSize: "14px",
    width: "100%",
  },
  headerButtons: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  filterSelect: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-primary)",
    fontSize: "13px",
    fontWeight: 600,
    outline: "none",
    cursor: "pointer",
  },
  primaryBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 18px",
    backgroundColor: "#007AFF",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,122,255,0.25)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
  },
  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  statValue: {
    fontSize: "24px",
    fontWeight: 800,
    color: "var(--text-primary)",
    letterSpacing: "-0.5px",
  },
  statLabel: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginTop: "2px",
  },
  errorBanner: {
    padding: "12px 16px",
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    border: "1px solid rgba(255, 59, 48, 0.2)",
    color: "#FF3B30",
    borderRadius: "12px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    backgroundColor: "var(--bg-secondary)",
    borderRadius: "24px",
    border: "1.5px dashed var(--border-color)",
  },
  paymentsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px",
  },
  paymentCard: {
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "18px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  paymentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  paymentLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  methodIcon: {
    fontSize: "24px",
  },
  invoiceNumber: {
    fontSize: "15px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  clientName: {
    fontSize: "13px",
    color: "var(--text-secondary)",
  },
  paymentRight: {
    textAlign: "right",
  },
  amount: {
    fontSize: "18px",
    fontWeight: 800,
    color: "var(--text-primary)",
    letterSpacing: "-0.5px",
    marginBottom: "4px",
  },
  statusBadge: {
    padding: "3px 8px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
  },
  paymentDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "12px",
    color: "var(--text-secondary)",
    paddingTop: "12px",
    borderTop: "1px solid var(--border-color)",
  },
  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  paymentActions: {
    display: "flex",
    gap: "8px",
    marginTop: "auto",
  },
  viewButton: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: "10px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
  },
  downloadButton: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: "10px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
  },
  editButton: {
    padding: "8px 10px",
    borderRadius: "10px",
    border: "1px solid rgba(0, 122, 255, 0.25)",
    backgroundColor: "rgba(0, 122, 255, 0.08)",
    color: "#007AFF",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    padding: "8px 10px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 59, 48, 0.25)",
    backgroundColor: "rgba(255, 59, 48, 0.08)",
    color: "#FF3B30",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tableContainer: {
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "18px",
    overflow: "hidden",
  },
  paymentsTable: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    padding: "16px 20px",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "var(--text-secondary)",
    borderBottom: "1px solid var(--border-color)",
  },
  tableRow: {
    borderBottom: "1px solid var(--border-color)",
    transition: "background 0.2s",
  },
  td: {
    padding: "16px 20px",
    fontSize: "14px",
    color: "var(--text-primary)",
  },
  tableActions: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  },
  formLabel: {
    display: "block",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "var(--text-primary)",
    marginBottom: "6px",
  },
  formInput: {
    width: "100%",
    padding: "12px 14px",
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
  },
  cancelBtn: {
    padding: "10px 20px",
    backgroundColor: "transparent",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    color: "var(--text-secondary)",
    fontWeight: 600,
    cursor: "pointer",
  },
  saveBtn: {
    padding: "10px 24px",
    backgroundColor: "#007AFF",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,122,255,0.25)",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "100px",
    gap: "16px",
    color: "var(--text-secondary)",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid var(--border-color)",
    borderTopColor: "#007AFF",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  modalGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "16px",
  },
  modalLabel: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "6px",
  },
  modalValue: {
    fontSize: "14px",
    color: "var(--text-primary)",
    fontWeight: 600,
    lineHeight: 1.6,
  },
  modalSection: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
};
