import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

import governanceAbi from "@/abi/governanceAbi.json";

const polygonMumbai = new ethers.JsonRpcProvider(
  `https://polygon-mumbai.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
);
const avalancheFuji = new ethers.JsonRpcProvider(
  `https://avalanche-fuji.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`
);

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
      fujiProposals.push({ ...proposal, chainId: 43113 });
    }

    const mumbaiProposals = [];
    for (let i = 0; i < Number(mumbaiTotalProposals); i++) {
      const proposal = await mumbaiContract.baseProposals(i);
      mumbaiProposals.push({ ...proposal, chainId: 80001 });
    }

    const proposals = [...fujiProposals, ...mumbaiProposals];

    return res.json(proposals);
  } catch (error) {
    return res.status(500).json(error);
  }
}
