import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Zap, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Star,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Velocità Immediata',
      description: 'Genera preventivi professionali in pochi secondi. Niente più template complicati o software costosi.'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'PDF Professionale',
      description: 'PDF eleganti e personalizzabili con il tuo logo aziendale. Pronti per essere inviati ai clienti.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Sicuro e Privato',
      description: 'I tuoi dati sono protetti e privati. Solo tu hai accesso ai tuoi preventivi.'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Gestione Semplice',
      description: 'Interfaccia intuitiva che ti permette di creare preventivi senza formazione.'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Risparmia Tempo',
      description: 'Crea preventivi in minuti invece di ore. Più tempo per concentrarti sul tuo business.'
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Calcolo Automatico',
      description: 'IVA e totali calcolati automaticamente. Zero errori di calcolo.'
    }
  ];

  const benefits = [
    'Nessuna carta di credito richiesta',
    'Setup in meno di 2 minuti',
    'Supporto clienti dedicato',
    'Aggiornamenti gratuiti',
    'Accesso da qualsiasi dispositivo',
    'Backup automatico dei dati'
  ];

  const testimonials = [
    {
      name: 'Marco Rossi',
      role: 'Consulente IT',
      content: 'Finalmente un tool che mi permette di creare preventivi professionali senza perdere tempo. Fantastico!',
      rating: 5
    },
    {
      name: 'Laura Bianchi',
      role: 'Agenzia Marketing',
      content: 'I miei clienti sono rimasti impressionati dalla qualità dei PDF. Prevengo ha migliorato la mia immagine professionale.',
      rating: 5
    },
    {
      name: 'Giuseppe Verdi',
      role: 'Architetto',
      content: 'Semplice, veloce ed efficace. Esattamente quello che cercavo per gestire i preventivi del mio studio.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-8 h-8 text-emerald-400" />
          <span className="text-2xl font-bold">Prevengo</span>
        </div>
        <button
          onClick={handleLogin}
          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium transition-colors"
        >
          Accedi
        </button>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-sm font-medium mb-6">
            ✨ La soluzione più semplice per i preventivi
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-100 to-blue-200 bg-clip-text text-transparent">
            Preventivi Professionali
            <br />
            <span className="text-emerald-400">In Un Click</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Crea preventivi eleganti e personalizzati in pochi secondi. 
            Niente più template complicati o software costosi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-semibold text-lg shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 flex items-center gap-2"
            >
              Inizia Gratis
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold text-lg transition-all">
              Guarda Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-emerald-400">10k+</div>
              <div className="text-sm text-slate-400">Preventivi creati</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">500+</div>
              <div className="text-sm text-slate-400">Aziende attive</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400">98%</div>
              <div className="text-sm text-slate-400">Soddisfazione</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Tutto quello che ti serve
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Una piattaforma completa per gestire i tuoi preventivi in modo professionale
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all hover:scale-105"
            >
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20 bg-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Perché scegliere Prevengo?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Cosa dicono i nostri utenti
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-300 mb-4 italic">"{testimonial.content}"</p>
              <div>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-slate-400">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center p-12 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-400/30 rounded-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Pronto a iniziare?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Crea il tuo primo preventivo professionale in meno di 2 minuti
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-semibold text-lg shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 flex items-center gap-2 mx-auto"
          >
            Inizia Subito Gratis
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <FileText className="w-6 h-6 text-emerald-400" />
            <span className="text-xl font-bold">Prevengo</span>
          </div>
          <div className="text-slate-400 text-sm">
            © 2024 Prevengo. Tutti i diritti riservati.
          </div>
        </div>
      </footer>
    </div>
  );
}

