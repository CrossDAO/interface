import { useState } from "react";
import Proposal from "./ProposalItem";
import { PlusIcon } from "@heroicons/react/24/outline";

const items = [
  { id: 1, title: "Proposal 1", description: "Lorem Ipsum" },
  { id: 2, title: "Proposal 2", description: "Lorem Ipsum" },
];

const ProposalsList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVote = () => {};

  return (
    <div className="gap-4 flex flex-col">
      <h2 className="text-center">
        <span className="text-5xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-400">
          Proposals
        </span>
      </h2>
      <button
        className="bg-purple-600 mt-10 flex-1 text-white px-4 py-2 rounded hover:bg-purple-700 text-center flex gap-2 justify-center"
        onClick={() => setIsModalOpen(true)}
      >
        <PlusIcon className="w-6 h-6" /> Create new Proposal
      </button>

      {items.map((item, i) => (
        <Proposal key={i} proposal={item} onVote={handleVote} />
      ))}
    </div>
  );
};

export default ProposalsList;
