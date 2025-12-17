import QuoteForm from "./QuoteForm";
import ProfileHeader from "./ProfileHeader";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <ProfileHeader />
        <QuoteForm />
      </div>
    </div>
  );
}

