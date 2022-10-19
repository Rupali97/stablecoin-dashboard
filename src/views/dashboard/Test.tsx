import { ethers } from "ethers"
import { useGetTransactions } from "../../hooks/multisig/useMultiSig"
import USDA from "../../protocol/deployments/abi/USDA.json"
import MultiSig from "../../protocol/deployments/abi/MultiSig.json"


function Test() {

    let iface = new ethers.utils.Interface(USDA)

    let data = iface.encodeFunctionData("mint", ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", ethers.utils.parseEther("10")])

    // let count = useGetTransactions(2)

    console.log('Test', data)

    return(
        <div>
            
        </div>
    )
}

export default Test