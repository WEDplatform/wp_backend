import { ApifyClient } from 'apify-client';
import { tryCatchWrapper } from './asyncHandler.js';
import { ApiResponse } from './Apiresponse.js';

// Initialize the ApifyClient with API token
const client = new ApifyClient({
    token: 'apify_api_SHw9Le3eAB7HOQYNb8LSEYgIv4qcfQ3aXdKR',
});
// Prepare Actor input

export const getInstaData = async(vendorName) =>{
    const input = {
        "username": [
            ``
        ],
        "resultsLimit": 3
    };
    const run = await client.actor("xMc5Ga1oCONPmWJIa").call(input);

    // Fetch and print Actor results from the run's dataset (if any)
    console.log('Results from dataset');
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    console.log(items);
    return items
}
// (async () => {
//     // Run the Actor and wait for it to finish
//     const run = await client.actor("shu8hvrXbJbY3Eb9W").call(input);

//     // Fetch and print Actor results from the run's dataset (if any)
//     console.log('Results from dataset');
//     const { items } = await client.dataset(run.defaultDatasetId).listItems();
//     items.forEach((item) => {
//         console.dir(item);
//     });
// })();