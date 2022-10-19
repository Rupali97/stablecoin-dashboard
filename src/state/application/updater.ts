import {useWallet} from 'use-wallet';
import {useDispatch} from 'react-redux';
import {useCallback, useEffect, useState} from 'react';
import { useNetwork } from 'wagmi'

import config from '../../config';
import {updateBlockNumber} from './actions';
import useDebounce from '../../hooks/useDebounce';
import {getDefaultProvider} from '../../utils/provider';
import useIsWindowVisible from '../../hooks/useIsWindowVisible';
import {useGetActiveChainId} from "../chains/hooks";

export default function Updater(): null {
  // const {ethereum, chainId} = useWallet();
  const { chain } = useNetwork()

  let id
  if(chain){
    id = chain.id
  }
  
  const dispatch = useDispatch();
  const windowVisible = useIsWindowVisible();
  const activeChainId = useGetActiveChainId();

  const [state, setState] = useState<{
    chainId: number | undefined;
    blockNumber: number | null;
  }>({
    chainId: id,
    blockNumber: null,
  });

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState((state: any) => {
        if (id === state.chainId) {
          if (typeof state.blockNumber !== 'number') return {chainId: id, blockNumber};
          return {chainId: id, blockNumber: Math.max(blockNumber, state.blockNumber)};
        }
        return state;
      });
    },
    [chain?.id, setState],
  );

  // The attach/detach listeners.
  useEffect(() => {
    if (!window.ethereum || !id|| !windowVisible) return undefined;
    setState({chainId: chain?.id, blockNumber: null});

    const provider = getDefaultProvider(config[activeChainId]);
    provider
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch((error: any) =>
        console.error(`Failed to get block number for chainId: ${chain?.id}`, error),
      );

    provider.on('block', blockNumberCallback);

    return () => {
      provider.removeListener('block', blockNumberCallback);
    };
  }, [dispatch, chain?.id, window.ethereum, blockNumberCallback, windowVisible]);

  const debouncedState = useDebounce(state, 100);

  console.log('debouncedState', debouncedState)

  useEffect(() => {
    console.log('debouncedState', !debouncedState.chainId, !debouncedState.blockNumber, !windowVisible)
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return;
    dispatch(
      updateBlockNumber({
        chainId: debouncedState.chainId,
        blockNumber: debouncedState.blockNumber,
      }),
    );
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId]);

  return null;
}
