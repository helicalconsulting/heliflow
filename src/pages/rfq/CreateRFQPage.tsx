import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Package,
  Users,
  Plus,
  Trash2,
  Save,
  Send,
  Check,
  CalendarDays,
} from 'lucide-react';
import './CreateRFQPage.css';

// ─── Types ──────────────────────────────────────────────────

interface LineItem {
  id: number;
  itemName: string;
  description: string;
  quantity: string;
  unit: string;
  expectedDate: string;
}

interface VendorOption {
  id: number;
  name: string;
  email: string;
  initials: string;
  avatarMod: string;
  score: number;
}

// ─── Mock Vendors ───────────────────────────────────────────

const AVAILABLE_VENDORS: VendorOption[] = [
  { id: 1, name: 'TechSupply Co.', email: 'sales@techsupply.in', initials: 'TS', avatarMod: '1', score: 92 },
  { id: 2, name: 'IndoSteel Ltd.', email: 'orders@indosteel.com', initials: 'IS', avatarMod: '2', score: 87 },
  { id: 3, name: 'ElectroPower India', email: 'bids@electropower.in', initials: 'EP', avatarMod: '3', score: 88 },
  { id: 4, name: 'GreenParts Inc.', email: 'info@greenparts.co.in', initials: 'GP', avatarMod: '4', score: 81 },
  { id: 5, name: 'SafeGuard Corp.', email: 'orders@safeguard.in', initials: 'SC', avatarMod: '5', score: 95 },
  { id: 6, name: 'PackRight India', email: 'bid@packright.in', initials: 'PR', avatarMod: '1', score: 90 },
  { id: 7, name: 'DigiParts Ltd.', email: 'info@digiparts.co.in', initials: 'DP', avatarMod: '2', score: 78 },
  { id: 8, name: 'Precision Eng.', email: 'quotes@precisioneng.in', initials: 'PE', avatarMod: '3', score: 76 },
];

const UNIT_OPTIONS = ['Pcs', 'Kg', 'Ltr', 'Mtr', 'Box', 'Set', 'Nos', 'Pair'];

// ─── Component ──────────────────────────────────────────────

export default function CreateRFQPage() {
  const navigate = useNavigate();

  // Step management
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['RFQ Details', 'Line Items', 'Select Vendors'];

  // Form state — Step 1
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [department, setDepartment] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [currency, setCurrency] = useState('INR');

  // Form state — Step 2 (Line Items)
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, itemName: '', description: '', quantity: '', unit: 'Pcs', expectedDate: '' },
  ]);

  const addItem = useCallback(() => {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), itemName: '', description: '', quantity: '', unit: 'Pcs', expectedDate: '' },
    ]);
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev));
  }, []);

  const updateItem = useCallback((id: number, field: keyof LineItem, value: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  }, []);

  // Form state — Step 3 (Vendors)
  const [selectedVendors, setSelectedVendors] = useState<number[]>([]);

  const toggleVendor = useCallback((vendorId: number) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  }, []);

  // Navigation
  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const handleSaveDraft = () => {
    // Mock save — just navigate back
    navigate('/rfq');
  };

  const handleSubmit = () => {
    // Mock submit — navigate back
    navigate('/rfq');
  };

  return (
    <div className="create-rfq">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="create-rfq__header">
        <button className="create-rfq__back" onClick={() => navigate('/rfq')}>
          <ArrowLeft size={18} />
        </button>
        <div className="create-rfq__header-text">
          <h1>Create New RFQ</h1>
          <p>Fill in the details to create a new Request for Quotation</p>
        </div>
      </div>

      {/* ── Progress Steps ─────────────────────────────────── */}
      <div className="create-rfq__steps">
        {steps.map((label, idx) => {
          let stepClass = 'create-rfq__step';
          if (idx < currentStep) stepClass += ' create-rfq__step--done';
          else if (idx === currentStep) stepClass += ' create-rfq__step--active';
          return (
            <div key={label} className={stepClass}>
              <span className="create-rfq__step-num">
                {idx < currentStep ? <Check size={14} /> : idx + 1}
              </span>
              <span className="create-rfq__step-label">{label}</span>
            </div>
          );
        })}
      </div>

      {/* ── Step 1: RFQ Details ────────────────────────────── */}
      {currentStep === 0 && (
        <div className="create-rfq__card">
          <div className="create-rfq__card-header">
            <FileText size={18} />
            RFQ Information
          </div>
          <div className="create-rfq__card-body">
            <div className="create-rfq__form-grid">
              <div className="create-rfq__field create-rfq__field--full">
                <label className="create-rfq__label">
                  Title <span className="create-rfq__label-required">*</span>
                </label>
                <input
                  className="create-rfq__input"
                  type="text"
                  placeholder="e.g. Office Furniture Procurement — Q2 2024"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="create-rfq__field create-rfq__field--full">
                <label className="create-rfq__label">Description</label>
                <textarea
                  className="create-rfq__textarea"
                  placeholder="Provide a detailed description of the procurement requirement..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="create-rfq__field">
                <label className="create-rfq__label">
                  Priority <span className="create-rfq__label-required">*</span>
                </label>
                <select
                  className="create-rfq__select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="create-rfq__field">
                <label className="create-rfq__label">Department</label>
                <select
                  className="create-rfq__select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="">Select department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Operations">Operations</option>
                  <option value="IT">IT</option>
                  <option value="Admin">Admin</option>
                  <option value="Finance">Finance</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>
              </div>

              <div className="create-rfq__field">
                <label className="create-rfq__label">
                  Closing Date <span className="create-rfq__label-required">*</span>
                </label>
                <input
                  className="create-rfq__input"
                  type="date"
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                />
                <span className="create-rfq__hint">Last date for vendors to submit quotations</span>
              </div>

              <div className="create-rfq__field">
                <label className="create-rfq__label">Currency</label>
                <select
                  className="create-rfq__select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="INR">₹ INR — Indian Rupee</option>
                  <option value="USD">$ USD — US Dollar</option>
                  <option value="EUR">€ EUR — Euro</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Line Items ─────────────────────────────── */}
      {currentStep === 1 && (
        <div className="create-rfq__card">
          <div className="create-rfq__card-header">
            <Package size={18} />
            Line Items
            <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
              {items.length} item{items.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="create-rfq__card-body">
            <div style={{ overflowX: 'auto' }}>
              <table className="create-rfq__items-table">
                <thead>
                  <tr>
                    <th style={{ width: 44 }}>#</th>
                    <th>Item Name *</th>
                    <th>Description</th>
                    <th style={{ width: 90 }}>Qty *</th>
                    <th style={{ width: 100 }}>Unit</th>
                    <th style={{ width: 150 }}>
                      <CalendarDays size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                      Expected Date
                    </th>
                    <th style={{ width: 44 }} />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={item.id}>
                      <td>
                        <span className="create-rfq__row-num">{idx + 1}</span>
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Item name"
                          value={item.itemName}
                          onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Brief description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="0"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          value={item.unit}
                          onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                        >
                          {UNIT_OPTIONS.map((u) => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="date"
                          value={item.expectedDate}
                          onChange={(e) => updateItem(item.id, 'expectedDate', e.target.value)}
                        />
                      </td>
                      <td>
                        <button
                          className="create-rfq__remove-row"
                          onClick={() => removeItem(item.id)}
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button className="create-rfq__add-row" onClick={addItem}>
              <Plus size={15} />
              Add Line Item
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Select Vendors ─────────────────────────── */}
      {currentStep === 2 && (
        <div className="create-rfq__card">
          <div className="create-rfq__card-header">
            <Users size={18} />
            Select Vendors
            <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
              {selectedVendors.length} selected
            </span>
          </div>
          <div className="create-rfq__card-body">
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
              Select the vendors you want to invite for this RFQ. They will receive a notification to submit their quotation.
            </p>
            <div className="create-rfq__vendors-grid">
              {AVAILABLE_VENDORS.map((v) => {
                const selected = selectedVendors.includes(v.id);
                return (
                  <div
                    key={v.id}
                    className={`create-rfq__vendor-card ${selected ? 'create-rfq__vendor-card--selected' : ''}`}
                    onClick={() => toggleVendor(v.id)}
                  >
                    <span className="create-rfq__vendor-check">
                      {selected && <Check size={13} />}
                    </span>
                    <span className={`create-rfq__vendor-avatar create-rfq__vendor-avatar--${v.avatarMod}`}>
                      {v.initials}
                    </span>
                    <div className="create-rfq__vendor-info">
                      <div className="create-rfq__vendor-name">{v.name}</div>
                      <div className="create-rfq__vendor-email">{v.email}</div>
                    </div>
                    <span className={`create-rfq__vendor-score create-rfq__vendor-score--${v.score >= 85 ? 'high' : 'mid'}`}>
                      {v.score}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Footer Actions ─────────────────────────────────── */}
      <div className="create-rfq__footer">
        <div className="create-rfq__footer-left">
          {currentStep > 0 && (
            <button className="create-rfq__btn create-rfq__btn--secondary" onClick={prevStep}>
              <ArrowLeft size={16} />
              Previous
            </button>
          )}
          <button className="create-rfq__btn create-rfq__btn--ghost" onClick={() => navigate('/rfq')}>
            Cancel
          </button>
        </div>
        <div className="create-rfq__footer-right">
          <button className="create-rfq__btn create-rfq__btn--secondary" onClick={handleSaveDraft}>
            <Save size={16} />
            Save as Draft
          </button>
          {currentStep < steps.length - 1 ? (
            <button className="create-rfq__btn create-rfq__btn--primary" onClick={nextStep}>
              Next Step
            </button>
          ) : (
            <button className="create-rfq__btn create-rfq__btn--primary" onClick={handleSubmit}>
              <Send size={16} />
              Submit RFQ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
