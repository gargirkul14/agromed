import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { BookOpen, ArrowLeft, Calendar, Tag, AlertTriangle, Loader2, Share2, CheckCircle2 } from 'lucide-react';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await api.get(`/articles/${id}`);
        if (res.data.success) {
          setArticle(res.data.article);
        } else {
          setError('Article not found.');
        }
      } catch (err) {
        setError('Failed to load safety article.');
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-agri-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading educational guide...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 max-w-md mx-auto">
        <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Article Unavailable</h2>
        <p className="text-xs text-slate-500">{error || 'This article could not be loaded.'}</p>
        <Link to="/knowledge" className="inline-block px-5 py-2.5 rounded-xl bg-agri-600 text-white text-xs font-bold">
          ← Back to Knowledge Center
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Back button */}
      <Link
        to="/knowledge"
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-agri-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Safety Knowledge Center</span>
      </Link>

      {/* Main Article Container */}
      <article className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase text-agri-800 bg-agri-100 px-3 py-1 rounded-full">
              {article.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Published {new Date(article.createdAt).toLocaleDateString()}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
            {article.title}
          </h1>
        </div>

        {/* Content Body */}
        <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {article.content}
        </div>

        {/* Disclaimer Strip */}
        <div className="mt-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Occupational Safety Note: </span>
            This guide is compiled for educational awareness and preventative health purposes. In case of acute chemical poisoning, consult a hospital with the chemical name and packaging label.
          </div>
        </div>

      </article>

    </div>
  );
}
