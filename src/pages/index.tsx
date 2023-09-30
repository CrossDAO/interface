import ProposalsList from "@/components/ProposalsList";
import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-800">
      <Header />
      <div className="max-w-4xl m-auto pt-20">
        <ProposalsList />
      </div>
    </main>
  );
}
