import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

import governanceAbi from "@/abi/governanceAbi.json";

const polygonMumbai = new ethers.JsonRpcProvider(
  `https://polygon-mumbai.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
);
const avalancheFuji = new ethers.JsonRpcProvider(
  `https://avalanche-fuji.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
);

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const fujiContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_FUJI_CONTRACT_ADDRESS!,
      governanceAbi,
      avalancheFuji
    );
    const mumbaiContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_MUMBAI_CONTRACT_ADDRESS!,
      governanceAbi,
      polygonMumbai
    );

    const fujiTotalProposals = await fujiContract.totalProposals();
    const mumbaiTotalProposals = await mumbaiContract.totalProposals();

    const fujiProposals = [];
    for (let i = 0; i < Number(fujiTotalProposals); i++) {
      const proposal = await fujiContract.baseProposals(i);
      const [title, description] = proposal[2].split(":");

      fujiProposals.push({
        id: proposal[0],
        title,
        description,
        baseChainVotes: proposal[7],
        otherChainVotes: proposal[8],
        chainId: 43113,
      });
    }

    const mumbaiProposals = [];
    for (let i = 0; i < Number(mumbaiTotalProposals); i++) {
      const proposal = await mumbaiContract.baseProposals(i);
      const [title, description] = proposal[2].split(":");
      console.log(proposal);
      mumbaiProposals.push({
        id: proposal[0],
        title,
        description,
        baseChainVotes: proposal[7],
        otherChainVotes: proposal[8],
        chainId: 80001,
      });
    }

    const proposals = [...fujiProposals, ...mumbaiProposals];

    return res.json(proposals);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
}
