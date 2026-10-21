import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ARTICLE_CATEGORIES } from '../utils/constants';
import {
  BookOpen,
  Search,
  ArrowRight,
  Filter,
  Tag,
  Loader2,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function KnowledgeCenterPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') {
          queryParams.append('category', selectedCategory);
        }
        if (searchQuery.trim()) {
          queryParams.append('search', searchQuery.trim());
        }

        const res = await api.get(`/articles?${queryParams.toString()}`);
        if (res.data.success) {
          setArticles(res.data.articles || []);
        }
      } catch (err) {
        console.error('Failed to fetch articles:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchArticles();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-100 px-3 py-1 rounded-full">
            Educational Resource Library
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Safety Knowledge Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Verified occupational safety and agrochemical handling articles simplified for agricultural practitioners.
          </p>
        </div>

        <div className="shrink-0">
          <span className="px-4 py-2 rounded-2xl bg-agri-50 border border-agri-200 text-agri-800 text-xs font-bold">
            {articles.length} Guides Available
          </span>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keyword (e.g. organophosphate, eye splash, ORS hydration, gloves)..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-agri-500 text-xs sm:text-sm bg-slate-50 focus:bg-white transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {ARTICLE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-agri-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-agri-600 animate-spin mb-2" />
          <p className="text-xs font-medium text-slate-500">Loading safety articles...</p>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => {
            // First 120 chars as short description
            const cleanSnippet = art.content.replace(/[#*`]/g, '').slice(0, 140) + '...';

            return (
              <div
                key={art.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase text-agri-700 bg-agri-50 px-2.5 py-1 rounded-full border border-agri-200/60">
                      {art.category}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(art.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-agri-700 transition mb-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {cleanSnippet}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100">
                  <Link
                    to={`/knowledge/${art.id}`}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-agri-700 group-hover:text-agri-800 transition"
                  >
                    <span>Read Complete Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching articles found</h3>
          <p className="text-xs text-slate-500">Try changing your search term or selecting another category.</p>
        </div>
      )}

    </div>
  );
}
