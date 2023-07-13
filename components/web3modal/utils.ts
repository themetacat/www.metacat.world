import { toast } from 'react-hot-toast';

import { IChainData } from './interface';
import supportedChains from './chains';

export function getChainData(chainId: number): IChainData | null {
  const chainData = supportedChains.filter((chain: any) => chain.chain_id === chainId)[0];

  if (!chainData) {
    toast.error('Sorry, Please connect to Ethereum Sepolia.');

    return null;
  }

  const API_KEY = process.env.REACT_APP_INFURA_ID;

  if (
    chainData.rpc_url.includes('infura.io') &&
    chainData.rpc_url.includes('%API_KEY%') &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc_url.replace('%API_KEY%', API_KEY);

    return {
      ...chainData,
      rpc_url: rpcUrl,
    };
  }

  return chainData;
}
