import { tronMultiSigContract } from "./constants";

export async function setMultisigContract() {
   
    let multisigContract = await window.tronWeb.contract().at(tronMultiSigContract);

    return multisigContract
}