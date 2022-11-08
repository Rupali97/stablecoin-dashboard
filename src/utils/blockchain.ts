import { BigNumber } from 'ethers';
import TronWeb from 'tronweb';
import tronConfig from '../tronConfig';
import { tronMultiSigContract } from './constants';


const DATA_LEN = 64;
export const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
const chain = tronConfig.chain;
const privateKey = chain.privateKey;

export const mainchain = new TronWeb({
  fullHost: chain.fullHost,
//   privateKey
});

export const triggerSmartContract = async (address, functionSelector, options = {}, parameters = []) => {
    try {
      const tronweb = window.tronWeb;
      const transaction = await tronweb.transactionBuilder.triggerSmartContract(
        address,
        functionSelector,
        Object.assign({ feeLimit: 20 * 1e6 }, options),
        parameters
      );
  
      if (!transaction.result || !transaction.result.result) {
        throw new Error('Unknown trigger error: ' + JSON.stringify(transaction.transaction));
      }
      return transaction;
    } catch (error) {
      console.error("triggerSmartContract", error)
    }
  };

export const getTransactionInfo = tx => {
    const tronWeb = mainchain;
    console.log("mainchain", mainchain)
    return new Promise((resolve, reject) => {
      tronWeb.trx.getConfirmedTransaction(tx, (e, r) => {
        if (!e) {
          resolve(r);
        } else {
          reject(e);
        }
      });
    });
  };

export const multisigContract = async() => {
  try{
    const tronweb =  window.tronWeb;
    const contract = await tronweb.contract().at(tronMultiSigContract)
      
    return contract
  } catch (error){
    console.error("multisigContract", error)
  }
}

