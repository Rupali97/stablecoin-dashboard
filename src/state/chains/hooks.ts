import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {getSupportedChains} from '../../config';
import {AppDispatch, AppState} from '../index';

import {updateChainId} from './actions';

/**
 * Returns the active chainId
 */
export function useGetActiveChainId(): number {
  const updateId = useGetUpdateActiveChainId();
  // const updateIds = useUpdateAvailableChains();
  const id = useSelector((state: AppState) => {
    return state.chains.active;
  });
  const avaiableIds = getSupportedChains();
  if (avaiableIds.includes(id)) {
    return id;
  } else {
    const changedId = avaiableIds[0];
    // updateIds(avaiableIds);
    updateId(changedId);
    return changedId;
  }
}

/**
 * Used to update the active chainId
 * @param chainId to update the active chainId
 */
export function useGetUpdateActiveChainId(): (chainId: number) => void {
  const chains = getSupportedChains();
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    (chainId: number) => {
      if (chains.includes(chainId)) {
        dispatch(
          updateChainId({
            chainId: chainId,
          }),
        );
      } else {
        console.log(`chainId: ${chainId} is not supported on this app`);
      }
    },
    [chains, dispatch],
  );
}

/**
 * Used to update the avaiable Chains
 */
/*export function useGetAvaiableChains(): Array<number> {
  return useSelector((state: AppState) => {
    return state.chains.availableNetworks;
  });
}*/

/**
 * Used to add the new chain to the available chains array
 * @param chainId to add it to available chains array
 */

/*export function useAddAvaiableChains(): (chainId: number) => void {
  const dispatch = useDispatch<AppDispatch>();

  const chains = useSelector((state: AppState) => {
    return state.chains.availableNetworks;
  });

  return useCallback(
    (chainId: number) => {
      if (chains.includes(chainId)) {
        console.log(`Trying to add the already present chainId ${chainId}`);
        return;
      } else {
        const updatingChains = chains;
        updatingChains.push(chainId);
        dispatch(
          updateAvailableChains({
            chains: updatingChains,
          }),
        );
      }
    },
    [chains, dispatch],
  );
}*/

/*export function useUpdateAvailableChains(): (chainId: number[]) => void {
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    (chainId: number[]) => {
      dispatch(
        updateAvailableChains({
          chains: chainId,
        }),
      );
    },
    [dispatch],
  );
}*/
