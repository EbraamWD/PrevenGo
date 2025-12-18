import React, { useState } from 'react';
import { User, Building2, Upload, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
function ProfileHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (user?.companyName) {
      setCompanyName(user.companyName);
    }
  }, [user]);
  
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Qui salveresti i dati (es. localStorage o API)
    console.log('Salvato:', { companyName, logo });
    setIsModalOpen(false);
  };

  return (
    <>
      <header className="mb-8 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Prevengo</p>
          <h1 className="text-3xl font-semibold mt-2 text-white">
            Genera preventivi eleganti in pochi click
          </h1>
          <p className="text-slate-300 mt-2">
            Aggiungi articoli, carica il tuo logo aziendale e scarica subito il PDF con il riepilogo costi.
          </p>
        </div>

        {/* Profile and Logout Buttons */}
        <div className="ml-6 flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="w-8 h-8 rounded object-cover" />
            ) : (
              <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-slate-400" />
              </div>
            )}
            <div className="text-left">
              <p className="text-xs text-slate-400">Profilo Aziendale</p>
              <p className="text-sm text-white font-medium">{companyName}</p>
            </div>
            <User className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 rounded-lg border border-rose-700 transition-colors text-white"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Esci</span>
          </button>
        </div>
      </header>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Profilo Aziendale
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nome Azienda
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Es. La Mia Azienda S.r.l."
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Logo Aziendale
                </label>

                {/* Preview */}
                {logoPreview && (
                  <div className="mb-3 p-4 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="max-h-32 max-w-full object-contain"
                    />
                  </div>
                )}

                {/* Upload Button */}
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-slate-600 transition-colors bg-slate-900/50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-sm text-slate-400">
                      <span className="font-semibold">Clicca per caricare</span> o trascina qui
                    </p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG fino a 5MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleLogoChange}
                  />
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-700">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
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