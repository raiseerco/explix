import { encodeParameters} from "ratatosk2"

export function postchainQuery(restClient, type, args) {
    return new Promise( (resolve, reject) => {
        restClient.query(
            Object.assign({type: type}, args),
            (err, res) => {
                if (err) reject(err);
                else resolve(res);
            }
        )
    })
}

export function parameterDict(parameterList) {
    const dict = {};
    for (const p of parameterList) {
        dict[p.name] = {
            name: p.name,
            description: p.description,
            type: p.simpleType
        };
    }
    return dict;
}

export function orderParameters(params, parameterInfoList) {
    const paramList = [];
    for (const p of parameterInfoList) {
        if (p.name in params) {
            paramList.push(params[p.name]);
        } else  throw Error("Missing parameter: " + p.name);
    }
    return paramList;
}

export { encodeParameters };