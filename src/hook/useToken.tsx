import { ethers } from "ethers";
import { erc20ABI, usePrepareContractWrite, useContractWrite, useContractRead, useAccount, useNetwork, useWaitForTransaction } from "wagmi";
import { getNetwork } from "src/constants/networks";
import { toast } from 'react-toastify';

export const useTokenAllowance = (tokenAddress: string, spender: string) => {
    const { address } = useAccount()

    const { data, isError, isFetching } = useContractRead({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [address as `0x${string}`, spender as `0x${string}`],
        watch: true
    })

    return data
}

export const useTokenBalance = (tokenAddress: string) => {
    const { address } = useAccount()

    const { data, isError, isFetching } = useContractRead({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
        watch: true
    })

    return data
}

export const useContractTokenBalance = (contractAddress: string, tokenAddress: string) => {
    const { data, isError, isFetching } = useContractRead({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [contractAddress as `0x${string}`],
        watch: true
    })
    return data
}

export const useTokenSupply = (tokenAddress: string) => {
    const { data, isError, isFetching } = useContractRead({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'totalSupply',
        watch: true
    })
    return data
}

export const useApproveToken = (tokenAddress: string, approveFor: string) => {
    const { config } = usePrepareContractWrite({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'approve',
        args: [approveFor as `0x${string}`, ethers.constants.MaxUint256]
    });
    const { write, data } = useContractWrite({
        ...config,
        onSuccess() {
            toast.dismiss();
            toast.loading("Approving token...");
        },
        onError() {
            toast.dismiss();
            toast.error("Failed to approve token!");
        }
    });
    useWaitForTransaction({
        hash: data?.hash,
        onError() {
            toast.dismiss();
            toast.error("Failed to approve token!");
        },
        onSuccess() {
            toast.dismiss();
            toast.success("Successfully approved token!");
        }
    });
    return [write];
}