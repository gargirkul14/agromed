import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import { PPE_LIST } from '../../utils/constants';
import {
  FlaskConical,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Info
} from 'lucide-react';

export default function ChemicalSafetyManagement() {
  const [chemicals, setChemicals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingChemical, setEditingChemical] = useState(null);

  const [formData, setFormData] = useState({
    chemicalName: '',
    precautions: '',
    recommendedPPE: ['Chemical Gloves', 'Respirator Mask', 'Safety Goggles']
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchChemicals = async () => {
    setLoading(true);
    try {
      const res = await api.get('/chemicals');
      if (res.data.success) {
        setChemicals(res.data.chemicals || []);
      }
    } catch (err) {
      console.error('Failed to load chemicals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChemicals();
  }, []);

  const openCreateModal = () => {
    setEditingChemical(null);
    setFormData({
      chemicalName: '',
      precautions: '',
      recommendedPPE: ['Chemical Gloves', 'Respirator Mask', 'Safety Goggles']
    });
    setModalOpen(true);
  };

  const openEditModal = (chem) => {
    setEditingChemical(chem);
    setFormData({
      chemicalName: chem.chemicalName,
      precautions: chem.precautions,
      recommendedPPE: Array.isArray(chem.recommendedPPE) ? chem.recommendedPPE : []
    });
    setModalOpen(true);
  };

  const handlePPEToggle = (gear) => {
    let current = [...formData.recommendedPPE];
    if (current.includes(gear)) {
      current = current.filter(g => g !== gear);
    } else {
      current.push(gear);
    }
    setFormData({ ...formData, recommendedPPE: current });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      if (editingChemical) {
        const res = await api.put(`/admin/chemicals/${editingChemical.id}`, formData);
        if (res.data.success) {
          setMsg({ type: 'success', text: 'Chemical safety data updated.' });
          setModalOpen(false);
          await fetchChemicals();
        }
      } else {
        const res = await api.post('/admin/chemicals', formData);
        if (res.data.success) {
          setMsg({ type: 'success', text: 'New chemical record added.' });
          setModalOpen(false);
          await fetchChemicals();
        }
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Error saving chemical.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete chemical record "${name}"?`)) return;
    try {
      const res = await api.delete(`/admin/chemicals/${id}`);
      if (res.data.success) {
        setChemicals(prev => prev.filter(c => c.id !== id));
        setMsg({ type: 'success', text: 'Chemical record deleted.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to delete chemical.' });
    }
  };

  const commonPPEChoices = [
    'Chemical Gloves',
    'Respirator Mask',
    'Particulate Mask',
    'Safety Goggles',
    'Face Shield',
    'Protective Overalls',
    'Rubber Boots'
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-health-700 bg-health-100 px-3 py-1 rounded-full">
            Toxicology & Safety Database
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Chemical Safety Information
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Maintain the agricultural chemical index with recommended PPE and specific toxicity precautions.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-health-600 hover:bg-health-700 text-white font-bold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Chemical</span>
        </button>
      </div>

      {msg.text && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center space-x-2 ${
          msg.type === 'success' ? 'bg-agri-50 border border-agri-200 text-agri-800' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Chemicals Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-health-600 animate-spin mb-2" />
            <p className="text-xs font-medium text-slate-500">Querying chemical index...</p>
          </div>
        ) : chemicals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Chemical Name</th>
                  <th className="py-4 px-6">General Precautions</th>
                  <th className="py-4 px-6">Mandatory PPE</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {chemicals.map((chem) => (
                  <tr key={chem.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6 font-bold text-slate-900 text-sm whitespace-nowrap">
                      {chem.chemicalName}
                    </td>
                    <td className="py-4 px-6 max-w-md">
                      <p className="text-slate-600 leading-relaxed text-xs">
                        {chem.precautions}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {chem.recommendedPPE?.map((p, i) => (
                          <span key={i} className="text-[10px] font-bold text-agri-800 bg-agri-50 px-2 py-0.5 rounded border border-agri-200">
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(chem)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        title="Edit Record"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(chem.id, chem.chemicalName)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">
            No chemicals indexed yet. Click "Add New Chemical" above.
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingChemical ? 'Edit Chemical Record' : 'Add Chemical Safety Record'}
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Chemical Brand / Formulation Name *</label>
              <input
                type="text"
                required
                value={formData.chemicalName}
                onChange={(e) => setFormData({ ...formData, chemicalName: e.target.value })}
                placeholder="e.g. Chlorpyrifos 20% EC"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-health-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">General Safety Precautions & Symptoms *</label>
              <textarea
                rows="4"
                required
                value={formData.precautions}
                onChange={(e) => setFormData({ ...formData, precautions: e.target.value })}
                placeholder="Describe hazard class, skin/inhalation absorption risks, antidote advice..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-health-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-2">Recommended PPE (Select All That Apply):</label>
              <div className="grid grid-cols-2 gap-2">
                {commonPPEChoices.map((gear) => {
                  const isChecked = formData.recommendedPPE.includes(gear);
                  return (
                    <button
                      type="button"
                      key={gear}
                      onClick={() => handlePPEToggle(gear)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                        isChecked ? 'bg-agri-50 border-agri-500 text-agri-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span>{gear}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-agri-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-xl bg-health-600 hover:bg-health-700 text-white font-bold text-xs shadow disabled:opacity-60"
              >
                {saving ? 'Saving...' : editingChemical ? 'Update Chemical' : 'Save Chemical'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
