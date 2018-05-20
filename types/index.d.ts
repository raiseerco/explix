/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE
 */

import { ParameterInfo, FieldInfo, ActionInfo, ActionGuard, ActionUpdate,
    ContractDefinition as R4ContractDefinition } from "ratatosk/dist/contractdefinition";
import { ProcessedMessage } from "ratatosk/dist/contractinstance";
import {ActionMatch, LogicalMessage, PrivKey, PubKey } from "ratatosk/dist/types";
import { RType } from "ratatosk/dist/objects";

export { ParameterInfo, FieldInfo, ProcessedMessage, ActionGuard, ActionInfo, ActionUpdate,
    R4ContractDefinition, ActionMatch, RType, LogicalMessage
}

export interface PrincipalIdentity {
    isSetUp(): boolean;
    getID(): string;

    importIdentity(encodedKeyPair: any): Promise<void>;
    importIdentityFromPrivateKey(privKey: PrivKey): void;
    generateIdentity(entropy?: Buffer): Promise<void>;

    setAttribute(key: string, value: any): Promise<void>;
    setCertificate(certificate: any): Promise<void>;

    getRawKeyPair(): any;
    getKeyPair(): any;
    getPublicKey(): any;
    getPrivateKey(): any;

    getCertificate(): any;
    getAttribute(key: string): any;
}


export interface ContractDefinition {
    readonly contractHash: string;
    readonly r4ContractDefinition: R4ContractDefinition;
}

export interface ContractDefinitionManager {
    getAllDefinitions(): ContractDefinition[];
    registerDefinition(defdata: any): any;
    registerDefinitionFromURL(url: string): Promise<ContractDefinition>;
}

export interface ContractInstanceManager {
    sync(): Promise<boolean>

    getContractInstances(): ContractInstance[];

    getInstanceByChainID(id: string): ContractInstance | undefined;

    joinContractInstance(chainID: string, metadata: any): Promise<ContractInstance>;

    createContractInstance(contractDefinition: ContractDefinition, parameters: Parameters): Promise<ContractInstance>;
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

export interface FieldInfos {
    [name: string]: FieldInfo;
}

export interface Parameters {
    [name: string]: any;
}

export interface ContractInstance {
    getChainID(): string;
    getFields(): Parameters;
    getActionInfo(name: string): ActionInfo;
    getFieldInfo(): FieldInfos;
    getMessageChain(): ProcessedMessage[];
    getApplicableActions(pubkeys?: any): ActionMatch[];
    performAction(action: string, params: Parameters): Promise<ProcessedMessage | undefined>
}
