import { ApifyClient } from 'apify-client';
import { ApiResponse } from './Apiresponse.js';
import { videoPostModel } from '../src/models/reelPost.model.js';
import { vendorModel } from '../src/models/vendor.model.js';
import { vendorNames } from '../src/constants.js';
const apifyCredentials=[]
// Initialize the ApifyClient with API token
const apiKeys=process.env.APIFY_TOKENS?.split(",") ?? [];
export const getInstaData = async(vendorName,contentLength) =>{
    const client = new ApifyClient({
        // token: apiKeys[Math.floor(Math.random()*apiKeys.length)],
        token: 'apify_api_uQoQNQwy0GGS3z0P4NwE07WTgWdznM1Bb1ZU',
    });
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
    console.log(apiKeys);
    
    try {
        let igdata=await Promise.all(
            vendorNames.map(item => getInstaData(item,1))
        )
        resp.status(200).send(new ApiResponse(200,igdata,"succ"))
    } catch (error) {
        console.log(error);  
        resp.status(500).send(new ApiResponse(500,null,"failed"))  
    }
}
// (async () => {
//     // Run the Actor and wait for it to finish
//     const run = await client.actor("shu8hvrXbJbY3Eb9W").call(input);