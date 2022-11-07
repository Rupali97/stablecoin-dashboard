import {useWallet} from 'use-wallet';
import {useCallback, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useNetwork } from 'wagmi'

import {addPopup, removePopup, toggleSettingsMenu, toggleWalletModal,loaderVisibile} from './actions';
import {AppState} from '../index';
import {PopupContent} from '../../utils/interface';

export function useBlockNumber(): number | undefined {
  // const {chainId} = useWallet();
  const { chain} = useNetwork()

  const test = useSelector((state: AppState) => state)

  return useSelector((state: AppState) => state.application.blockNumber[chain?.id ?? -1]);
}

export function useWalletModalOpen(): boolean {
  return useSelector((state: AppState) => state.application.walletModalOpen);
}

export function useWalletModalToggle(): () => void {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(toggleWalletModal()), [dispatch]);
}

export function useSettingsMenuOpen(): boolean {
  return useSelector((state: AppState) => state.application.settingsMenuOpen);
}

export function useToggleSettingsMenu(): () => void {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(toggleSettingsMenu()), [dispatch]);
}

// Returns a function that allows adding a popup.
export function useAddPopup(): (content: PopupContent, key?: string) => void {
  const dispatch = useDispatch();

  return useCallback(
    (content: PopupContent, key?: string) => {
      dispatch(addPopup({content, key}));

      // setTimeout(() => {
      //   window.location.reload()
      // }, 5000)
    },
    [dispatch],
  );
}

// Returns a function that allows removing a popup via its key.
export function useRemovePopup(): (key: string) => void {
  const dispatch = useDispatch();
  return useCallback(
    (key: string) => {
      dispatch(removePopup({key}));
    },
    [dispatch],
  );
}

// Get the list of active popups.
export function useActivePopups(): AppState['application']['popupList'] {
  const list = useSelector((state: AppState) => state.application.popupList);
  return useMemo(() => list.filter((item) => item.show), [list]);
}

// Get the loader
export function useGetLoader(): boolean {
  return useSelector((state: AppState) => state.application.isVisible);
}


export function useUpdateLoader(): (isVisible: boolean) => void {
  const dispatch = useDispatch();
  return useCallback((isVisible: boolean) => dispatch((loaderVisibile({isVisible}))), [dispatch]);
}