/*
 * Copyright (c) 2016-2018 ChromaWay AB. Licensed under the Apache License v. 2.0, see LICENSE
 */

declare module 'esplix' {
    import {ParameterInfo} from "ratatosk/dist/contractdefinition";
    import {ProcessedMessage} from "ratatosk/dist/contractinstance";

    class EsplixContext {
        constructor(params: any);
        initialize(): Promise<void>;
        update(): Promise<void>;
    }

    interface ParameterInfos {
        [name:string]: ParameterInfo;
    }

    interface Parameters {
        [name: string]: any;
    }

    interface ContractInstance {
        performAction (action: string, params: Parameters): Promise<ProcessedMessage | undefined>
    }
}

