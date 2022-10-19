import { Configuration } from './utils/interface';
import ethereum from './chainConfig/ethereum'
import maticMumbai from './chainConfig/maticMumbai'
import goerli from './chainConfig/goerli';

const configurations: { [env: string]: Configuration } = {
  ...ethereum,
  ...maticMumbai,
  ...goerli
};

export default configurations;

export const getSupportedChains = (): number[] =>
  Object.keys(configurations).map((i) => Number(i));
