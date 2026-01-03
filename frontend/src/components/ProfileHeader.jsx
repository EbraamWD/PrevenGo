import React, { useState, useEffect } from 'react';
import { User, Building2, Upload, X, LogOut, AlertCircle, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import siteLogo from './assets/prevengoLogo-noBG.png';
import { ReactComponent as Logo } from './assets/logoFinalSVG.svg';
import { ReactComponent as LogoText } from './assets/newLogoText.svg';

function ProfileHeader() {
  const { logout, user, setUser } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [address, setAddress] = useState('');
  const [vatNumber, setVatNumber] = useState('');

  const [initialData, setInitialData] = useState({
    companyName: '',
    address: '',
    vatNumber: '',
    logoPreview: null
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const goToHistory = () => {
    navigate('/history');
  };

  useEffect(() => {
    if (!user) return;

    const initial = {
      companyName: user.companyName || '',
      address: user.address || '',
      vatNumber: user.vatNumber || '',
      logoPreview: user.logoUrl || null
    };

    setCompanyName(initial.companyName);
    setAddress(initial.address);
    setVatNumber(initial.vatNumber);
    setLogoPreview(initial.logoPreview);
    setInitialData(initial);
  }, [user]);

  // Verifica se ci sono modifiche
  const hasChanges =
    companyName !== initialData.companyName ||
    address !== initialData.address ||
    vatNumber !== initialData.vatNumber ||
    logo !== null;

  // Verifica se i dati sono incompleti
  const isIncomplete = !companyName || !address || !vatNumber || !logoPreview;

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogo(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const formData = new FormData();
    console.log("Handle save called");

    // Aggiungi solo i campi modificati
    if (companyName !== initialData.companyName) {
      formData.append('companyName', companyName);
    }

    if (address !== initialData.address) {
      formData.append('address', address);
    }

    if (vatNumber !== initialData.vatNumber) {
      formData.append('vatNumber', vatNumber);
    }

    if (logo) {
      console.log("Adding logo to formData", logo);
      formData.append('logo', logo);
    }

    // Se non ci sono modifiche, non inviare la richiesta
    if (!hasChanges) {
      toast('Nessuna modifica da salvare', { icon: 'ℹ️' });
      setIsModalOpen(false);
      return;
    }

    try {
      console.log("Submitting modified fields only");

      // Debug: mostra tutti i campi nel FormData
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await api.post('/auth/companyProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Aggiorna i dati iniziali dopo il salvataggio
      setInitialData({
        companyName: res.data.company.companyName || '',
        address: res.data.company.address || '',
        vatNumber: res.data.company.vatNumber || '',
        logoPreview: res.data.company.companyLogo || null
      });

      setLogo(null);
      setIsModalOpen(false);
      toast.success('Profilo aziendale aggiornato con successo!');
    } catch (error) {
      console.error("Errore nel salvataggio:", error);
      console.error("Response data:", error.response?.data);
      toast.error('Errore durante l\'aggiornamento del profilo aziendale.');
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-auto text-blue-600" />
              <LogoText className="h-8 w-auto text-gray-500" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold mt-2 text-white">
              Preventivi professionali in pochi click
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2">
              Aggiungi articoli, carica il tuo logo aziendale e scarica subito il PDF.
            </p>
          </div>

          {/* PROFILO + LOGOUT */}
          <div className="flex items-center gap-2 sm:gap-3 sm:ml-6">
            <button
              onClick={goToHistory}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Storico</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors relative"
            >
              {/* Indicatore dati incompleti */}
              {isIncomplete && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-slate-900 animate-pulse" />
              )}

              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo"
                  className="w-8 h-8 rounded object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-slate-400" />
                </div>
              )}

              <div className="text-left">
                <p className="text-xs text-slate-400 hidden sm:block">
                  Profilo Aziendale
                </p>
                <p className="text-sm text-white font-medium truncate">
                  {companyName || '—'}
                </p>
              </div>

              <User className="w-4 h-4 text-slate-400 hidden sm:block" />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-rose-600 hover:bg-rose-700 rounded-lg border border-rose-700 text-white"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Esci</span>
            </button>
          </div>
        </div>

        {/* Banner informativo sotto l'header - visibile sempre se dati incompleti */}
        {isIncomplete && (
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-500">
                Completa il tuo profilo aziendale
              </p>
              <p className="text-xs text-amber-200/80 mt-1">
                Aggiungi nome azienda, indirizzo, partita IVA e logo per creare preventivi più professionali.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 text-xs font-medium rounded transition-colors whitespace-nowrap"
            >
              Completa ora
            </button>
          </div>
        )}
      </header>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md my-8 sm:my-16">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Profilo Aziendale
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Nome azienda */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Nome Azienda
                </label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Email Aziendale
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Indirizzo Aziendale
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Partita IVA
                </label>
                <input
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              {/* Logo */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Logo Aziendale
                </label>

                {logoPreview && (
                  <div className="mb-3 p-4 bg-slate-900 rounded border border-slate-700">
                    <img
                      src={logoPreview}
                      alt="Preview"
                      className="max-h-32 mx-auto"
                    />
                  </div>
                )}

                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer bg-slate-900/50">
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-400">
                    Clicca o trascina un file
                  </span>
                  <input
                    type="file"
                    hidden
                    accept="image/png,image/jpeg"
                    onChange={handleLogoChange}
                  />
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-700">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg"
              >
                Annulla
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className={`flex-1 py-2 rounded-lg font-medium ${hasChanges
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  }`}
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileHeader;