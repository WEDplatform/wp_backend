import { ApifyClient } from 'apify-client';
import { tryCatchWrapper } from './asyncHandler.js';
import { ApiResponse } from './Apiresponse.js';
import { videoPostModel } from '../src/models/reelPost.model.js';
const apifyCredentials=[]
// Initialize the ApifyClient with API token
const client = new ApifyClient({
    token: 'apify_api_WdQeBTZpGIf30BuqLMahsFxPJXZWzd2G7FUd',
});
// Prepare Actor input
export const getInstaData = async(vendorName,contentLength) =>{
    const input = {
        "username": [
            `${vendorName}`
        ],
        "resultsLimit": contentLength
    };
    const run = await client.actor("xMc5Ga1oCONPmWJIa").call(input);
    // Fetch and print Actor results from the run's dataset (if any)
    console.log('Results from dataset');
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    console.log(items);
    return items   
}
export const syncIG_DB=async(req,resp)=>{
    // try {
    //     const input = {
    //         "username": [
    //             `natgeo`
    //         ],
    //         "resultsLimit": 0
    //     };
    //     const run = await client.actor("xMc5Ga1oCONPmWJIa").call(input);
    //     // Fetch and print Actor results from the run's dataset (if any)
    //     console.log('Results from dataset');
    //     const { items } = await client.dataset(run.defaultDatasetId).listItems();
    //     console.log(items);
    //     return items 
    // } catch (error) {
    //     console.log(error);     
    // }
    await videoPostModel.distinct('')
    resp.send("succ")
}
// (async () => {
//     // Run the Actor and wait for it to finish
//     const run = await client.actor("shu8hvrXbJbY3Eb9W").call(input);