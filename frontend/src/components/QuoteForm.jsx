import { useMemo, useState } from "react";
import api from "../api";
const currency = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" });

export default function QuoteForm() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [items, setItems] = useState([{ description: "", quantity: 1, unitPrice: "" }]);
  const [logo, setLogo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0);
    const tax = subtotal * 0.22;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [items]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("userId", "123456");
    formData.append("customerName", customerName);
    formData.append("customerEmail", customerEmail);
    formData.append("items", JSON.stringify(items));
    formData.append("subtotal", totals.subtotal);
    formData.append("tax", totals.tax);
    formData.append("total", totals.total);
    if (logo) formData.append("logo", logo);

    try {
      const res = await api.post("/quotes", formData);
      const quoteId = res.data._id;
      const pdfRes = await api.get(`/quotes/${quoteId}/pdf`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([pdfRes.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `quote-${quoteId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      //alert("Preventivo generato e PDF scaricato!");
    } catch (err) {
      console.error(err);
      alert("Errore nella generazione del preventivo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
      {/* Summary Card - Mobile First (mostrato prima su mobile) */}
      <aside className="space-y-4 lg:order-2 lg:col-start-3">
        <div className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl p-4 sm:p-5 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">Riepilogo</p>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Totali preventivo</h3>
          <div className="space-y-2 text-sm text-slate-200">
            <div className="flex items-center justify-between">
              <span>Subtotale</span>
              <span className="font-medium">{currency.format(totals.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>IVA (22%)</span>
              <span className="font-medium">{currency.format(totals.tax)}</span>
            </div>
            <div className="h-px bg-white/10 my-2" />
            <div className="flex items-center justify-between text-base font-semibold text-white">
              <span>Totale</span>
              <span>{currency.format(totals.total)}</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Aggiorna quantità e prezzi per vedere i totali in tempo reale. Il PDF includerà gli importi e, se presente, il logo cliente.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-emerald-50">
          <p className="text-sm font-semibold">Suggerimenti rapidi</p>
          <ul className="mt-2 space-y-1 text-xs sm:text-sm">
            <li>• Aggiungi righe per servizi, licenze o sconti.</li>
            <li>• Usa prezzi unitari con IVA esclusa: l'IVA è calcolata automaticamente.</li>
            <li>• Carica il logo per un PDF più professionale.</li>
          </ul>
        </div>
      </aside>

      {/* Main Form */}
      <div className="lg:col-span-2 lg:order-1">
        <div className="bg-white/10 border border-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Anagrafica</p>
              <h2 className="text-lg sm:text-xl font-semibold text-white">Dati cliente</h2>
            </div>
            <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-200 border border-emerald-400/20 self-start sm:self-auto">
              PDF in un click
            </span>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Nome Cliente</label>
                <input
                  type="text"
                  placeholder="Es. Mario Rossi"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/30"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Email Cliente</label>
                <input
                  type="email"
                  placeholder="cliente@email.it"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/30"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Articoli</p>
                  <h3 className="text-base sm:text-lg font-semibold text-white">Linee di costo</h3>
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-500/20 self-start sm:self-auto"
                >
                  + Aggiungi riga
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/10 bg-slate-900/50 p-3 sm:p-4 shadow-lg shadow-slate-900/40"
                  >
                    <div className="flex flex-col gap-3">
                      {/* Description - Full Width */}
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400">Descrizione</label>
                        <textarea
                          type="text"
                          placeholder="Es. Consulenza, licenza, pacchetto ore"
                          value={item.description}
                          onChange={(e) => handleItemChange(i, "description", e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/30"
                          required
                        />
                      </div>

                      {/* Quantity, Price, Total - Responsive Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <label className="text-xs text-slate-400">Quantità</label>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => handleItemChange(i, "quantity", +e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-3 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/30"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-slate-400">Prezzo unit.</label>
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(i, "unitPrice", +e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-3 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/30"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1 flex items-end justify-between sm:flex-col sm:items-end gap-2">
                          <p className="text-sm text-slate-300 py-3">Tot: {currency.format(item.quantity * item.unitPrice || 0)}</p>
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(i)}
                              className="text-xs text-rose-300 hover:text-rose-200 py-3"
                            >
                              Rimuovi
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-white font-semibold shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Generazione..." : "Genera PDF"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}