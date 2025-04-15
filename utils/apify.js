import { ApifyClient } from 'apify-client';
import { ApiResponse } from './Apiresponse.js';
import { videoPostModel } from '../src/models/reelPost.model.js';
import { vendorModel } from '../src/models/vendor.model.js';
import { vendorNames } from '../src/constants.js';
const apifyCredentials=[]
// Initialize the ApifyClient with API token
const apiKeys=[
    
]
const client = new ApifyClient({
    token: 'apify_api_WdQeBTZpGIf30BuqLMahsFxPJXZWzd2G7FUd',
});
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
function getCommonElements(arr1, arr2) {
    const set2 = new Set(arr2);
    const common = arr1.filter(item => set2.has(item));
    return [...new Set(common)];
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
    //     return items 
    // } catch (error) {
    //     console.log(error);     
    // }
    // const vendorsNames=await videoPostModel.distinct('ownerUsername')
    // const vendorUserNames=await vendorModel.distinct('businessName')
    // console.log(getCommonElements(vendorUserNames,vendorsNames));
    resp.status(200).send(new ApiResponse(200,getCommonElements(vendorUserNames,vendorsNames),"succ"))
}

// (async () => {
//     // Run the Actor and wait for it to finish
//     const run = await client.actor("shu8hvrXbJbY3Eb9W").call(input);