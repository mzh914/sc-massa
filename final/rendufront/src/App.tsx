import React from 'react';
import './App.css';
import massa from './massa-logo.png';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import type { } from '@mui/lab/themeAugmentation';
import secret from "./secret.json";
import {
    Args,
    Client,
    ClientFactory,
    DefaultProviderUrls,
    IAccount,
    ICallData,
    IReadData,
    WalletClient,
} from '@massalabs/massa-web3';
import useAsyncEffect from './utils/asyncEffect';
import axios from 'axios';
const baseAccountSecretKey = secret.SECRET_KEY;

const readdata : IReadData = {
    fee: 0,
    maxGas: 100_000_000,
    targetAddress: "A1ns5TfCD5cMCkx2kZwBE3EBKt1u4LLmvL94owzUoR3HVdKh5NK",
    targetFunction: "triggerValue",
    parameter: new Args().serialize(),
}


const App: React.FC = () => {
    const sc_addr = "A1ns5TfCD5cMCkx2kZwBE3EBKt1u4LLmvL94owzUoR3HVdKh5NK"
    const [value, setValue] = React.useState<number | null>(null);
    const [web3Client, setWeb3Client] = useState<Client | null>(null);
    const data: ICallData = {
        fee: 0,
        maxGas: 100_000_000,
        coins: 0,
        targetAddress: sc_addr,
        functionName: "triggerValue",
        parameter: new Args().serialize(),
    }
    useAsyncEffect(async () => {
        try {
            const baseAccount: IAccount = await WalletClient.getAccountFromSecretKey(
                baseAccountSecretKey,
            );
            const client = await ClientFactory.createDefaultClient(
                DefaultProviderUrls.TESTNET,
                true,
                baseAccount,
            );
            setWeb3Client(client);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const update = async () => {
        // Way 1:
        // if (web3Client) {
        //     let res = (await web3Client.publicApi().getDatastoreEntries([{ address: sc_addr, key: new Args().addString("counter").serialize() } as IDatastoreEntryInput]))
        //     if (res[0].candidate_value) {
        //         console.log("update2");
        //         setValue(new Args(res[0].candidate_value).nextU32());
        //     }
        // }
        if (web3Client) {
            // Way 2:
            let res = await web3Client.smartContracts().readSmartContract(readdata);
            setValue(new Args(res.returnValue).nextU32());
            
            //Way 3:
            // await web3Client.smartContracts().callSmartContract(data)
                // .then(async (operationId) => {
                //     console.log(operationId)
                //     if (operationId) {
                //         let res;
                //         for (let i = 0; i < 10; i++) {
                //             try {
                //                 res = await axios.post("https://test.massa.net/api/v2",
                //                     {
                //                         "jsonrpc": "2.0",
                //                         "method": "get_filtered_sc_output_event",
                //                         "params": [{
                //                             start: null,
                //                             end: null,
                //                             emitter_address: null,
                //                             original_caller_address: null,
                //                             original_operation_id: operationId,
                //                         }],
                //                         "id": 0
                //                     },
                //                     { headers: { "Content-Type": "application/json" } }
                //                 )
                //             } catch (err) { continue; }
                //             if (res.data) {
                //                 console.log(res.data)
                //                 return res.data;
                //             }
                //         }
                //     }
                // })
        }
    }

    const arg = new Args();
    return (
        <div className="App">
            <header className="App-header">
                <img src={massa} className="App-logo" alt="logo" />
                <h1>{value ? value : "Click on button update to get value"} </h1>
            </header>
            <div>        <Button
                variant="secondary"
                style={{
                    position: "absolute",
                    bottom: "150px",
                    height: "50px",
                    width: "200px",
                    left: "45%",
                }}
                onClick={() => {
                    update();
                }}
            >
                Update Value
            </Button>
            </div>
        </div>
    );
};

export default App;
