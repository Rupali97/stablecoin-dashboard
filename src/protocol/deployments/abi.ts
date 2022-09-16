import IERC20 from "./abi/IERC20.json";

import { IABIS } from "../../utils/interface";
import Token from "./abi/Token.json"
import Token2 from "./abi/Token2.json"
import MultiSig from "./abi/MultiSig.json"

const abis: IABIS = {
      IERC20,
      Token,
      Token2,
      MultiSig
}

export default abis