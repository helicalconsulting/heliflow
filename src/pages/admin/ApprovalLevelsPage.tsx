import { useState, useMemo, useCallback } from 'react';
import {
  Layers,
  Plus,
  X,
  Check,
  Search,
  Edit3,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Shield,
  FileText,
  ShoppingCart,
  ClipboardList,
  CheckSquare,
  Info,
  ChevronDown,
} from 'lucide-react';
import './ApprovalLevelsPage.css';

// ─── Types ──────────────────────────────────────────────────

interface ApprovalLevelData {
  id: number;
  module: string;
  levelNumber: number;
  requiredRole: string;
}

// ─── Constants ──────────────────────────────────────────────

const MODULES = ['RFQ', 'Quotations', 'Purchase Orders', 'Approvals'];
const ROLES = ['Manager', 'Finance Approver', 'Administrator', 'Super Admin'];

const MODULE_ICONS: Record<string, React.ReactNode> = {
  RFQ: <FileText size={16} />,
  Quotations: <ClipboardList size={16} />,
  'Purchase Orders': <ShoppingCart size={16} />,
  Approvals: <CheckSquare size={16} />,
};

const MODULE_COLORS: Record<string, string> = {
  RFQ: 'rfq',
  Quotations: 'quotations',
  'Purchase Orders': 'po',
  Approvals: 'approvals',
};

// ─── Mock Data ──────────────────────────────────────────────

const MOCK_LEVELS: ApprovalLevelData[] = [
  { id: 1, module: 'RFQ', levelNumber: 1, requiredRole: 'Manager' },
  { id: 2, module: 'RFQ', levelNumber: 2, requiredRole: 'Finance Approver' },
  { id: 3, module: 'Quotations', levelNumber: 1, requiredRole: 'Manager' },
  { id: 4, module: 'Quotations', levelNumber: 2, requiredRole: 'Finance Approver' },
  { id: 5, module: 'Purchase Orders', levelNumber: 1, requiredRole: 'Manager' },
  { id: 6, module: 'Purchase Orders', levelNumber: 2, requiredRole: 'Finance Approver' },
  { id: 7, module: 'Purchase Orders', levelNumber: 3, requiredRole: 'Administrator' },
  { id: 8, module: 'Approvals', levelNumber: 1, requiredRole: 'Manager' },
  { id: 9, module: 'Approvals', levelNumber: 2, requiredRole: 'Administrator' },
];

// ─── Component ──────────────────────────────────────────────

export default function ApprovalLevelsPage() {
  const [levels, setLevels] = useState(MOCK_LEVELS);
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLevel, setEditingLevel] = useState<ApprovalLevelData | null>(null);

  // Add/Edit form
  const [formModule, setFormModule] = useState('');
  const [formRole, setFormRole] = useState('');

  // Summary
  const summary = useMemo(() => ({
    totalLevels: levels.length,
    totalModules: new Set(levels.map((l) => l.module)).size,
    avgLevels: levels.length > 0 ? (levels.length / new Set(levels.map((l) => l.module)).size).toFixed(1) : '0',
    maxChain: Math.max(...MODULES.map((m) => levels.filter((l) => l.module === m).length), 0),
  }), [levels]);

  // Grouped by module
  const grouped = useMemo(() => {
    const map: Record<string, ApprovalLevelData[]> = {};
    for (const m of MODULES) {
      map[m] = levels.filter((l) => l.module === m).sort((a, b) => a.levelNumber - b.levelNumber);
    }
    return map;
  }, [levels]);

  // Filtered modules
  const displayModules = selectedModule === 'ALL' ? MODULES : [selectedModule];

  // Open add modal
  const openAddModal = useCallback((preselectedModule?: string) => {
    setFormModule(preselectedModule || '');
    setFormRole('');
    setEditingLevel(null);
    setShowAddModal(true);
  }, []);

  // Open edit modal
  const openEditModal = useCallback((level: ApprovalLevelData) => {
    setEditingLevel(level);
    setFormModule(level.module);
    setFormRole(level.requiredRole);
    setShowAddModal(true);
  }, []);

  // Save (add or edit)
  const handleSave = useCallback(() => {
    if (!formModule || !formRole) return;

    if (editingLevel) {
      setLevels((prev) => prev.map((l) => l.id === editingLevel.id ? { ...l, requiredRole: formRole } : l));
    } else {
      const moduleLevels = levels.filter((l) => l.module === formModule);
      const nextLevelNum = moduleLevels.length > 0 ? Math.max(...moduleLevels.map((l) => l.levelNumber)) + 1 : 1;
      setLevels((prev) => [...prev, { id: Date.now(), module: formModule, levelNumber: nextLevelNum, requiredRole: formRole }]);
    }
    setShowAddModal(false);
  }, [formModule, formRole, editingLevel, levels]);

  // Delete level
  const handleDelete = useCallback((levelId: number) => {
    setLevels((prev) => {
      const updated = prev.filter((l) => l.id !== levelId);
      // Re-number levels per module
      const moduleMap: Record<string, ApprovalLevelData[]> = {};
      for (const l of updated) {
        if (!moduleMap[l.module]) moduleMap[l.module] = [];
        moduleMap[l.module].push(l);
      }
      const result: ApprovalLevelData[] = [];
      for (const mod of Object.keys(moduleMap)) {
        moduleMap[mod].sort((a, b) => a.levelNumber - b.levelNumber);
        moduleMap[mod].forEach((l, i) => result.push({ ...l, levelNumber: i + 1 }));
      }
      return result;
    });
  }, []);

  // Move level up/down
  const moveLevel = useCallback((levelId: number, direction: 'up' | 'down') => {
    setLevels((prev) => {
      const level = prev.find((l) => l.id === levelId);
      if (!level) return prev;
      const moduleLevels = prev.filter((l) => l.module === level.module).sort((a, b) => a.levelNumber - b.levelNumber);
      const idx = moduleLevels.findIndex((l) => l.id === levelId);
      if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === moduleLevels.length - 1)) return prev;
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      const swapLevel = moduleLevels[swapIdx];

      return prev.map((l) => {
        if (l.id === levelId) return { ...l, levelNumber: swapLevel.levelNumber };
        if (l.id === swapLevel.id) return { ...l, levelNumber: level.levelNumber };
        return l;
      });
    });
  }, []);

  return (
    <div className="alvl-page">
      {/* Header */}
      <div className="alvl-page__header">
        <div className="alvl-page__header-left">
          <h1>Approval Levels</h1>
          <p>Configure multi-level approval chains for each module</p>
        </div>
        <button className="alvl-page__add-btn" onClick={() => openAddModal()}>
          <Plus size={18} />
          Add Level
        </button>
      </div>

      {/* Summary */}
      <div className="alvl-summary">
        {[
          { icon: <Layers size={22} />, value: summary.totalLevels, label: 'Total Levels', cls: 'total' },
          { icon: <CheckSquare size={22} />, value: summary.totalModules, label: 'Modules', cls: 'modules' },
          { icon: <ArrowDown size={22} />, value: summary.avgLevels, label: 'Avg. Depth', cls: 'avg' },
          { icon: <Shield size={22} />, value: summary.maxChain, label: 'Max Chain', cls: 'max' },
        ].map((c) => (
          <div key={c.cls} className="alvl-summary-card">
            <div className={`alvl-summary-card__icon alvl-summary-card__icon--${c.cls}`}>{c.icon}</div>
            <div className="alvl-summary-card__info">
              <span className="alvl-summary-card__value">{c.value}</span>
              <span className="alvl-summary-card__label">{c.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Module Filter */}
      <div className="alvl-module-filter">
        <button
          className={`alvl-module-pill ${selectedModule === 'ALL' ? 'alvl-module-pill--active' : ''}`}
          onClick={() => setSelectedModule('ALL')}
        >
          All Modules
          <span className="alvl-module-pill__count">{levels.length}</span>
        </button>
        {MODULES.map((m) => (
          <button
            key={m}
            className={`alvl-module-pill ${selectedModule === m ? 'alvl-module-pill--active' : ''}`}
            onClick={() => setSelectedModule(m)}
          >
            {MODULE_ICONS[m]}
            {m}
            <span className="alvl-module-pill__count">{grouped[m]?.length || 0}</span>
          </button>
        ))}
      </div>

      {/* Approval Chains */}
      <div className="alvl-chains">
        {displayModules.map((mod) => {
          const chain = grouped[mod] || [];
          return (
            <div key={mod} className="alvl-chain-card">
              <div className="alvl-chain-card__header">
                <div className="alvl-chain-card__header-left">
                  <div className={`alvl-chain-card__module-icon alvl-chain-card__module-icon--${MODULE_COLORS[mod]}`}>
                    {MODULE_ICONS[mod]}
                  </div>
                  <div>
                    <span className="alvl-chain-card__module-name">{mod}</span>
                    <span className="alvl-chain-card__level-count">{chain.length} level{chain.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <button className="alvl-chain-card__add-btn" onClick={() => openAddModal(mod)}>
                  <Plus size={14} />
                  Add
                </button>
              </div>

              {chain.length > 0 ? (
                <div className="alvl-chain-card__body">
                  <div className="alvl-pipeline">
                    {chain.map((level, idx) => (
                      <div key={level.id} className="alvl-pipeline__step">
                        <div className="alvl-pipeline__connector">
                          <div className={`alvl-pipeline__dot alvl-pipeline__dot--${MODULE_COLORS[mod]}`}>
                            {level.levelNumber}
                          </div>
                          {idx < chain.length - 1 && <div className={`alvl-pipeline__line alvl-pipeline__line--${MODULE_COLORS[mod]}`} />}
                        </div>
                        <div className="alvl-pipeline__content">
                          <div className="alvl-pipeline__role-card">
                            <div className="alvl-pipeline__role-info">
                              <span className="alvl-pipeline__level-label">Level {level.levelNumber}</span>
                              <span className="alvl-pipeline__role-name">{level.requiredRole}</span>
                            </div>
                            <div className="alvl-pipeline__actions">
                              <button
                                className="alvl-pipeline__action-btn"
                                title="Move Up"
                                disabled={idx === 0}
                                onClick={() => moveLevel(level.id, 'up')}
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                className="alvl-pipeline__action-btn"
                                title="Move Down"
                                disabled={idx === chain.length - 1}
                                onClick={() => moveLevel(level.id, 'down')}
                              >
                                <ArrowDown size={14} />
                              </button>
                              <button
                                className="alvl-pipeline__action-btn"
                                title="Edit"
                                onClick={() => openEditModal(level)}
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                className="alvl-pipeline__action-btn alvl-pipeline__action-btn--danger"
                                title="Remove"
                                onClick={() => handleDelete(level.id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="alvl-chain-card__empty">
                  <Info size={16} />
                  <span>No approval levels configured. Add a level to start.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="alvl-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="alvl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="alvl-modal__header">
              <div className="alvl-modal__title">
                <Layers size={20} />
                <span>{editingLevel ? 'Edit Approval Level' : 'Add Approval Level'}</span>
              </div>
              <button className="alvl-modal__close" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="alvl-modal__body">
              <div className="alvl-modal__field">
                <label className="alvl-modal__label">
                  Module <span>*</span>
                </label>
                <div className="alvl-modal__select-wrap">
                  <select
                    className="alvl-modal__select"
                    value={formModule}
                    onChange={(e) => setFormModule(e.target.value)}
                    disabled={!!editingLevel}
                  >
                    <option value="">Select module</option>
                    {MODULES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="alvl-modal__select-icon" />
                </div>
              </div>
              <div className="alvl-modal__field">
                <label className="alvl-modal__label">
                  Required Role <span>*</span>
                </label>
                <div className="alvl-modal__select-wrap">
                  <select
                    className="alvl-modal__select"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                  >
                    <option value="">Select role</option>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="alvl-modal__select-icon" />
                </div>
              </div>
              {!editingLevel && formModule && (
                <div className="alvl-modal__preview">
                  <Info size={14} />
                  <span>
                    This will be added as <strong>Level {(grouped[formModule]?.length || 0) + 1}</strong> in the {formModule} approval chain.
                  </span>
                </div>
              )}
            </div>
            <div className="alvl-modal__footer">
              <button className="alvl-modal__btn alvl-modal__btn--secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button
                className="alvl-modal__btn alvl-modal__btn--primary"
                disabled={!formModule || !formRole}
                onClick={handleSave}
              >
                <Check size={16} />
                {editingLevel ? 'Update Level' : 'Add Level'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
