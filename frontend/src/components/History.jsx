import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Eye, Trash2, Search, Calendar, Euro, User as UserIcon, Filter, X } from 'lucide-react';
import { ReactComponent as Logo } from './assets/logoFinalSVG.svg';
import { ReactComponent as LogoText } from './assets/newLogoText.svg';
import api from '../api';
import toast from 'react-hot-toast';

function History() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, recent, old
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, total-desc, total-asc

  useEffect(() => {
    loadQuotesHistory();
  }, []);

  useEffect(() => {
    filterAndSortQuotes();
  }, [quotes, searchTerm, filterStatus, sortBy]);

  const loadQuotesHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/quotes/history');
      setQuotes(res.data.quotes || []);
    } catch (error) {
      console.error("Errore nel caricamento dello storico:", error);
      toast.error('Errore nel caricamento dello storico preventivi.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortQuotes = () => {
    let filtered = [...quotes];

    // Filtro per ricerca
    if (searchTerm) {
      filtered = filtered.filter(quote => 
        quote.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.quoteNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro per data
    if (filterStatus === 'recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(quote => new Date(quote.createdAt) >= thirtyDaysAgo);
    } else if (filterStatus === 'old') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(quote => new Date(quote.createdAt) < thirtyDaysAgo);
    }

    // Ordinamento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'total-desc':
          return (b.total || 0) - (a.total || 0);
        case 'total-asc':
          return (a.total || 0) - (b.total || 0);
        default:
          return 0;
      }
    });

    setFilteredQuotes(filtered);
  };

  const handleDownload = async (quoteId) => {
    try {
      const res = await api.get(`/quotes/${quoteId}/pdf`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `preventivo-${quoteId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Preventivo scaricato con successo!');
    } catch (error) {
      console.error("Errore nel download:", error);
      toast.error('Errore durante il download del preventivo.');
    }
  };

  const handleDelete = async (quoteId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo preventivo?')) {
      return;
    }

    try {
      await api.delete(`/quotes/${quoteId}`);
      setQuotes(quotes.filter(q => q._id !== quoteId));
      toast.success('Preventivo eliminato con successo!');
    } catch (error) {
      console.error("Errore nell'eliminazione:", error);
      toast.error('Errore durante l\'eliminazione del preventivo.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Torna alla dashboard</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <Logo className="h-8 w-auto text-blue-600" />
            <LogoText className="h-6 w-auto text-gray-500" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Storico Preventivi</h1>
          <p className="text-slate-400">Tutti i preventivi generati dalla tua azienda</p>
        </div>

        {/* Filtri e Ricerca */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Barra di ricerca */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cerca per cliente o numero preventivo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-slate-400 hover:text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Filtri */}
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tutti i periodi</option>
                <option value="recent">Ultimi 30 giorni</option>
                <option value="old">Più vecchi di 30 giorni</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date-desc">Data (più recente)</option>
                <option value="date-asc">Data (più vecchio)</option>
                <option value="total-desc">Importo (maggiore)</option>
                <option value="total-asc">Importo (minore)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista Preventivi */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm || filterStatus !== 'all' ? 'Nessun preventivo trovato' : 'Nessun preventivo creato'}
            </h3>
            <p className="text-slate-400">
              {searchTerm || filterStatus !== 'all' 
                ? 'Prova a modificare i filtri di ricerca' 
                : 'Inizia creando il tuo primo preventivo'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredQuotes.map((quote) => (
              <div
                key={quote._id}
                className="bg-slate-800 rounded-xl border border-slate-700 p-4 hover:border-slate-600 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Info principale */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-500" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {quote.quoteNumber || `Preventivo #${quote._id.slice(-6)}`}
                        </h3>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                          {quote.customerName && (
                              <div className="flex items-center gap-1">
                                <UserIcon className="w-3.5 h-3.5" />
                                <span>{quote.customerName}</span>
                              </div>
                            )}
                          
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(quote.createdAt)}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 font-semibold text-blue-400">
                            <Euro className="w-3.5 h-3.5" />
                            <span>{formatCurrency(quote.total)}</span>
                          </div>
                        </div>

                        {quote.items && quote.items.length > 0 && (
                          <p className="text-xs text-slate-500 mt-2">
                            {quote.items.length} {quote.items.length === 1 ? 'articolo' : 'articoli'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Azioni */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-0 sm:ml-2 sm:flex-shrink-0">
                    <button
                      onClick={() => handleDownload(quote._id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors w-full sm:w-auto"
                      title="Scarica PDF"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Scarica</span>
                    </button>

                    <button
                      onClick={() => handleDelete(quote._id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors w-full sm:w-auto"
                      title="Elimina"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Elimina</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer conteggio */}
        {!loading && filteredQuotes.length > 0 && (
          <div className="mt-6 text-center text-sm text-slate-400">
            Visualizzati {filteredQuotes.length} {filteredQuotes.length === 1 ? 'preventivo' : 'preventivi'}
            {filteredQuotes.length !== quotes.length && ` su ${quotes.length} totali`}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;