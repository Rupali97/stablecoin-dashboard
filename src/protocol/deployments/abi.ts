import IERC20 from "./abi/IERC20.json";

import ERC20 from "./abi/ERC20.json";
import { IABIS } from "../../utils/interface";
import StablecoinImpl from "./abi/StablecoinImpl.json";
import MultiSig from "./abi/MultiSig.json";

const abis: IABIS = {
  IERC20,
  StablecoinImpl,
  MultiSig,
  ERC20,
};

export default abis;
