import { useCallback, useState } from "react";
import Proposal from "./ProposalItem";
import { PlusIcon } from "@heroicons/react/24/outline";
import Spinner from "./Spinner";
import { useNetwork } from "wagmi";
import toast from "react-hot-toast";
import { Abi } from "viem";
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "wagmi/actions";
import { governanceContract } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import governanceAbi from "@/abi/governanceAbi.json";

const ProposalsList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { chain } = useNetwork();

  const {
    data: proposals = [],
    isLoading: isFetchingProposals,
    refetch: refetchProposals,
  } = useQuery({
    queryKey: ["proposals"],
    queryFn: async () => {
      const response = await axios.get("/api/proposals").catch((err) => {
        console.error(err);
        return { data: [] };
      });

      return response.data;
    },
  });

  const handleCreateProposalTransaction = useCallback(async () => {
    if (!chain?.id) return;

    setIsCreating(true);

    try {
      const { request } = await prepareWriteContract({
        address: governanceContract[chain.id],
        abi: governanceAbi as Abi,
        functionName: "createProposal",
        args: [[], [], [], `${title}:${description}`],
      });

      const { hash } = await writeContract(request);

      await waitForTransaction({ hash });

      toast.success("Proposal created");

      refetchProposals();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong", { id: "create-error" });
    } finally {
      setIsCreating(false);
      setIsModalOpen(false);
    }
  }, [chain, description, refetchProposals, title]);

  if (isFetchingProposals) {
    return (
      <div className="flex items-center flex-col flex-grow pt-10 max-w-5xl m-auto w-full">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="gap-4 flex flex-col pb-10">
        <h2 className="text-center">
          <span className="text-5xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-400">
            Proposals
          </span>
        </h2>
        <button
          className="bg-purple-600 mt-10 flex-1 text-white px-4 py-2 mb-4 rounded hover:bg-purple-700 text-center flex gap-2 justify-center"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusIcon className="w-6 h-6" /> Create new Proposal
        </button>

        {proposals?.map((item: any, i: number) => (
          <Proposal
            key={i}
            proposal={item}
            refetchProposals={refetchProposals}
          />
        ))}
      </div>

      <div className={`modal ${isModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box w-full max-w-xl flex items-center flex-col bg-blue-950 text-white shadow-md">
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
              className="rounded input input-bordered w-full bg-transparent"
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              value={description}
              placeholder="Description"
              className="rounded input input-bordered w-full py-2 h-20 bg-transparent"
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
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProposalsList;
