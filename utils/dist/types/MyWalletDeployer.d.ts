import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common";
export interface MyWalletDeployerInterface extends utils.Interface {
    functions: {
        "deployWallet(address,address,uint256)": FunctionFragment;
        "getDeploymentAddress(address,address,uint256)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "deployWallet" | "getDeploymentAddress"): FunctionFragment;
    encodeFunctionData(functionFragment: "deployWallet", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "getDeploymentAddress", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    decodeFunctionResult(functionFragment: "deployWallet", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getDeploymentAddress", data: BytesLike): Result;
    events: {};
}
export interface MyWalletDeployer extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: MyWalletDeployerInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        deployWallet(entryPoint: PromiseOrValue<string>, owner: PromiseOrValue<string>, salt: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getDeploymentAddress(entryPoint: PromiseOrValue<string>, owner: PromiseOrValue<string>, salt: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
    };
    deployWallet(entryPoint: PromiseOrValue<string>, owner: PromiseOrValue<string>, salt: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getDeploymentAddress(entryPoint: PromiseOrValue<string>, owner: PromiseOrValue<string>, salt: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    callStatic: {
        deployWallet(entryPoint: PromiseOrValue<string>, owner: PromiseOrValue<string>, salt: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        getDeploymentAddress(entryPoint: PromiseOrValue<string>, owner: PromiseOrValue<string>, salt: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    };
    filters: {};
    estimateGas: {
        deployWallet(entryPoint: PromiseOrValue<string>, owner: PromiseOrValue<string>, salt: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getDeploymentAddress(entryPoint: PromiseOrValue<string>, owner: PromiseOrValue<string>, salt: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        deployWallet(entryPoint: PromiseOrValue<string>, owner: PromiseOrValue<string>, salt: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getDeploymentAddress(entryPoint: PromiseOrValue<string>, owner: PromiseOrValue<string>, salt: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
