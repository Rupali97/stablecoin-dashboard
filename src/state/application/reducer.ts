import {createReducer, nanoid} from '@reduxjs/toolkit';

import {addPopup, removePopup, toggleSettingsMenu, toggleWalletModal, updateBlockNumber, loaderVisibile} from './actions';
import {INITIAL_APP_STATE} from '../../utils/constants';

export default createReducer(INITIAL_APP_STATE, (builder) =>
  builder
    .addCase(updateBlockNumber, (state, action) => {
      const {chainId, blockNumber} = action.payload;
      // console.log('reducer state action', state, action)
 
      if (typeof state.blockNumber[chainId] !== 'number') {
        console.log('reducer update if', )
        state.blockNumber[chainId] = blockNumber;
      } else {
        console.log('reducer update else', )

        state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId]);
      }
    })
    .addCase(toggleWalletModal, (state) => {
      state.walletModalOpen = !state.walletModalOpen;
    })
    .addCase(toggleSettingsMenu, (state) => {
      state.settingsMenuOpen = !state.settingsMenuOpen;
    })
    .addCase(addPopup, (state, {payload: {content, key, removeAfterMs = 15000}}) => {
      state.popupList = (key
          ? state.popupList.filter((popup) => popup.key !== key)
          : state.popupList
      ).concat([
        {
          key: key || nanoid(),
          show: true,
          content,
          removeAfterMs,
        },
      ]);
    })
    .addCase(removePopup, (state, {payload: {key}}) => {
      state.popupList.forEach((p) => {
        if (p.key === key) {
          p.show = false;
        }
      });
    })
    .addCase(loaderVisibile, (state, {payload: {isVisible}}) => {
      console.log(state.isVisible, isVisible)
      state.isVisible = isVisible;
    })
);
