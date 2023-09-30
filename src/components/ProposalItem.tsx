import { useCallback, useState } from "react";
import Spinner from "./Spinner";
import { chainLogos, governanceContract } from "@/constants";
import Image from "next/image";
import { toast } from "react-hot-toast";
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "wagmi/actions";
import { Abi } from "viem";
import { useNetwork } from "wagmi";

export interface IProposal {
  id: number;
  title: string;
  description: string;
  chainId: number;
}

interface ProposalProps {
  refetchProposals: () => void;
  proposal: IProposal;
}

const Proposal = ({ refetchProposals, proposal }: ProposalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { chain } = useNetwork();

  const handleVoteTransaction = useCallback(
    async (vote: boolean) => {
      if (!chain?.id) return;

      setIsLoading(true);

      try {
        const { request } = await prepareWriteContract({
          address: governanceContract[chain.id],
          abi: [] as Abi,
          functionName: "vote",
          args: [],
        });

        const { hash } = await writeContract(request);

        await waitForTransaction({ hash });

        toast.success("Vote submitted");

        refetchProposals();
      } catch (err) {
        toast.error("Something went wrong", { id: "vote-error" });
      } finally {
        setIsLoading(false);
      }
    },
    [chain, refetchProposals]
  );

  const chainImage = chainLogos[proposal.chainId as keyof typeof chainLogos];

  return (
    <>
      <div
        className="card bg-blue-700 shadow-xl m-auto w-full border-2 border-transparent hover:border-blue-500 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="card-body">
          <div className="flex gap-4">
            <div>
              {chainImage ? (
                <Image src={chainImage} width={30} height={30} alt="" />
              ) : null}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-purple-400">
                {proposal.title}
              </h2>
              <p className="text-xl my-2 text-white">{proposal.description}</p>
            </div>
          </div>
        </div>
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
            <Image src={chainImage} width={30} height={30} alt="" />
            <div className="text-2xl mb-5 mt-2">{proposal.title}</div>
            <p className="text-xl my-2 w-full">{proposal.description}</p>
          </div>

          <div className="flex gap-4 flex-col w-1/2 mt-10">
            <div className="flex gap-3 mt-5">
              {isLoading ? (
                <div className="w-full flex justify-center">
                  <Spinner />
                </div>
              ) : (
                <>
                  <button
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-center w-60"
                    onClick={() => handleVoteTransaction(true)}
                  >
                    Vote For
                  </button>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center w-60"
                    onClick={() => handleVoteTransaction(false)}
                  >
                    Vote Against
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Proposal;
