import { Configuration } from './utils/interface';
import ethereum from './chainConfig/ethereum'
import maticMumbai from './chainConfig/maticMumbai'

const configurations: { [env: string]: Configuration } = {
  ...ethereum,
  ...maticMumbai
};

export default configurations;

export const getSupportedChains = (): number[] =>
  Object.keys(configurations).map((i) => Number(i));
