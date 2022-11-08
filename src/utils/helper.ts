import TronWeb from 'tronweb';
import tronConfig from '../tronConfig';

const chain = tronConfig.chain;

const tronWeb = new TronWeb({
  fullHost: chain.fullHost
});

export const fromHex = (hexString: string) => {
    return tronWeb.address.fromHex(hexString.replace('/^0x/', '41'));
};
  
export const addressToHex = (addr: string) => {
    return tronWeb.address.toHex(addr);
};
  
export const isAddress = (address: string) => {
    return tronWeb.isAddress(address);
};