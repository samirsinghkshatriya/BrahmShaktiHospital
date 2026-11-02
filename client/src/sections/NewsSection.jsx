import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, ArrowRight, ExternalLink, Clock, Tag } from 'lucide-react';
import { fetchNews } from '../lib/api';

export const NewsSection = ({ onSelectArticle }) => {
  const [articles, setArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      try {
        const data = await fetchNews({ category: activeCategory });
        setArticles(data);
      } catch (err) {
        console.error('Failed to load news articles', err);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, [activeCategory]);

  const categories = [
    { label: 'All Dispatches', value: 'all' },
    { label: 'Clinical Milestone', value: 'Clinical' },
    { label: 'Academic & Research', value: 'Academic' },
    { label: 'Community Welfare', value: 'Community' },
    { label: 'Health Advisory', value: 'Advisory' }
  ];

  return (
    <section id="news" className="py-20 sm:py-28 bg-white border-b border-gray-200 scroll-mt-16">
      <div className="max-w-page mx-auto px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#EBF3FA] text-[#1769AA] text-xs font-semibold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>CLINICAL RESEARCH & JOURNAL DISPATCHES</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#123653] tracking-tight">
              Medical Insights, Research & Announcements
            </h2>
            <p className="text-sm text-[#637386] mt-2">
              Official updates from the Department of Medical Education, clinical breakthroughs, and seasonal preventive health advisories.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setActiveCategory(c.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeCategory === c.value
                    ? 'bg-[#123653] text-white shadow-sm'
                    : 'bg-[#F5F7FA] text-[#637386] hover:bg-gray-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Journal-style Editorial Grid */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#1769AA]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((item) => (
              <article
                key={item.id}
                className="bg-[#F8FAFC] rounded-xl overflow-hidden border border-gray-200/80 hover:border-gray-300 shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative overflow-hidden h-44 bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-[#123653]/90 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <Calendar className="w-3.5 h-3.5 text-[#1769AA]" />
                      <span>{item.date}</span>
                      <span>&middot;</span>
                      <span>{item.readTime}</span>
                    </div>

                    <h3 className="font-serif font-bold text-sm text-[#123653] leading-snug group-hover:text-[#1769AA] transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#637386] leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-gray-100 mt-2">
                  <button
                    onClick={() => onSelectArticle && onSelectArticle(item)}
                    className="w-full pt-3 text-xs font-semibold text-[#1769AA] group-hover:text-[#123653] flex items-center justify-between transition-colors"
                  >
                    <span>Read Publication</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
