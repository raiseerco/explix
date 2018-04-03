/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE
 */

import {ParameterInfo} from "ratatosk/dist/contractdefinition";
import {ProcessedMessage} from "ratatosk/dist/contractinstance";

export interface PrincipalIdentity {
    isSetUp(): boolean;

    getID(): string;

    importIdentity (encodedKeyPair: any): Promise<void>;

    generateIdentity (entropy?: any): Promise<void>;

    getRawKeyPair(): any;

    getKeyPair(): any;

    getPublicKey (): any;

    getPrivateKey (): any;
}

export interface ContractDefinition {

}

export interface ContractDefinitionManager {
    registerDefinition(defdata: any): any;

    registerDefinitionFromURL(url: string): Promise<ContractDefinition>;
}

export interface ContractInstanceManager {
    sync(): Promise<boolean>

    getContractInstances(): ContractInstance[];

    getInstanceByChainID(id: string): ContractInstance | undefined;

    joinContractInstance (chainID: string, metadata: any): Promise<ContractInstance>;

    createContractInstance (contractDefinition: ContractDefinition, parameters: Parameters): Promise<ContractInstance>;
}

export class EsplixContext {
    principalIdentity: PrincipalIdentity;
    contractDefinitionManager: ContractDefinitionManager;
    contractInstanceManager: ContractInstanceManager;

    constructor(params: any);

    initialize(): Promise<void>;

    update(): Promise<void>;
}


export function dummyConfig(a?: any): any;

export function postchainConfig(a: any): any;

export interface ParameterInfos {
    [name: string]: ParameterInfo;
}

export interface Parameters {
    [name: string]: any;
}

export interface ContractInstance {
    performAction (action: string, params: Parameters): Promise<ProcessedMessage | undefined>
}

