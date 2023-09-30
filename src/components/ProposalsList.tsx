import { useState } from "react";
import Proposal from "./ProposalItem";
import { PlusIcon } from "@heroicons/react/24/outline";
import Spinner from "./Spinner";
import { sepolia } from "wagmi";
import { optimismGoerli } from "viem/chains";

const items = [
  {
    id: 1,
    title: "Proposal 1",
    description: "Lorem Ipsum",
    chainId: 420,
  },
  {
    id: 2,
    title: "Proposal 2",
    description: "Lorem Ipsum",
    chainId: 11155111,
  },
];

const ProposalsList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateProposalTransaction = async () => {};

  const handleVoteTransaction = (vote: boolean) => {
    console.log(vote);
  };

  return (
    <>
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
          <Proposal key={i} proposal={item} onVote={handleVoteTransaction} />
        ))}
      </div>

      <div className={`modal ${isModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box w-full max-w-xl flex items-center flex-col">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setIsModalOpen(false)}
          >
            ✕
          </button>
          <div className="flex flex-col gap-2 w-full">
            <div className="text-2xl mb-5">New Proposal</div>

            <input
              type="text"
              value={title}
              placeholder="Title"
              className="rounded input input-bordered w-full"
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              value={description}
              placeholder="Description"
              className="rounded input input-bordered w-full py-2 h-20"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-4 flex-col w-1/2 mt-10">
            {isCreating ? (
              <div className="w-full flex justify-center">
                <Spinner />
              </div>
            ) : (
              <>
                <button
                  className="bg-purple-600 flex-1 text-white px-4 py-2 rounded hover:bg-purple-700 text-center"
                  onClick={() => handleCreateProposalTransaction()}
                >
                  Submit
                </button>
                <button
                  className="bg-blue-600 flex-1 px-4 py-2 rounded text-white hover:bg-blue-700 text-center"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProposalsList;
