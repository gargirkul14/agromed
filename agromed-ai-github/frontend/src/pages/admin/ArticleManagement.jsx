import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import { ARTICLE_CATEGORIES } from '../../utils/constants';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ArticleManagement() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Chemical Safety',
    content: ''
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/articles');
      if (res.data.success) {
        setArticles(res.data.articles || []);
      }
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      category: 'Chemical Safety',
      content: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      category: article.category,
      content: article.content
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      if (editingArticle) {
        // Update
        const res = await api.put(`/admin/articles/${editingArticle.id}`, formData);
        if (res.data.success) {
          setMsg({ type: 'success', text: 'Article updated successfully.' });
          setModalOpen(false);
          await fetchArticles();
        }
      } else {
        // Create
        const res = await api.post('/admin/articles', formData);
        if (res.data.success) {
          setMsg({ type: 'success', text: 'New article published successfully.' });
          setModalOpen(false);
          await fetchArticles();
        }
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Error saving article.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the article: "${title}"?`)) return;
    try {
      const res = await api.delete(`/admin/articles/${id}`);
      if (res.data.success) {
        setArticles(prev => prev.filter(a => a.id !== id));
        setMsg({ type: 'success', text: 'Article deleted.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to delete article.' });
    }
  };

  const categories = ARTICLE_CATEGORIES.filter(c => c !== 'All');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-health-700 bg-health-100 px-3 py-1 rounded-full">
            Content Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Safety Knowledge Base Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Author, edit, and curate educational guides available to farmers in the knowledge center.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-health-600 hover:bg-health-700 text-white font-bold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Article</span>
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

      {/* Articles Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-health-600 animate-spin mb-2" />
            <p className="text-xs font-medium text-slate-500">Loading articles...</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Last Updated</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6 max-w-sm">
                      <div className="font-bold text-slate-900 text-sm">{art.title}</div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {art.content.replace(/[#*]/g, '').slice(0, 90)}...
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-bold text-health-800 bg-health-50 px-2.5 py-1 rounded-full border border-health-200">
                        {art.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(art.updatedAt || art.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(art)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        title="Edit Article"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(art.id, art.title)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                        title="Delete Article"
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
            No articles found. Click "Add New Article" above to create one.
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingArticle ? 'Edit Safety Article' : 'Publish New Safety Article'}
          maxWidth="max-w-3xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Article Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Recognizing & Preventing Organophosphate Poisoning"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-health-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-health-500 text-sm bg-white"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Article Content (Markdown Supported) *</label>
              <textarea
                rows="10"
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write the educational content, guidelines, and safety steps here..."
                className="w-full p-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-health-500 text-xs sm:text-sm font-mono"
              />
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
                {saving ? 'Saving...' : editingArticle ? 'Update Article' : 'Publish Article'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
