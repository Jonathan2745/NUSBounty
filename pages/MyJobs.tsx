

import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../amplify/data/resource';
import { useState, useEffect } from 'react';

import { NavigationButtons } from "../src/components/NavigationButtons";
import { useAuthenticator

 } from "@aws-amplify/ui-react";
const client = generateClient<Schema>();


export const MyJobsPage = () => {
    // Set up the Queries for the Jobs Taken //
    type Bounty = Schema['Jobs']['type'];
    const { user } = useAuthenticator((context) => [context.user]);


    const [acceptedBounty, setAcceptedBounty] = useState<Bounty[]>([]);
    const [postedBounty, setPostedBounty] = useState<Bounty[]>([]);

    const fetchTakenBounties = async () => {
        const { data: acceptedBounties } = await client.models.Jobs.list({
            filter:{
                jobId: {
                    contains: "" //placeholder//
                }
            }
        });
        setAcceptedBounty(acceptedBounties);
    } 

// Set up Queries for the Jobs Posted //
    const fetchPostedBounties = async () => {
        const { data: postedBounties } = await client.models.Jobs.list({
            filter:{
                createdBy:{
                    contains: user.username
                }
            }
        });
        setPostedBounty(postedBounties);
    }

    useEffect(() => {
        const fetchBounties = async () => {
            try {
                fetchPostedBounties();
                fetchTakenBounties();

            } catch (error) {
                console.error('Error fetching bounties: ', error);
            }
        };
        fetchBounties();
    })

    return (
        <div className="flex flex-col items-center justify-center h-screen overflow-y-auto">
        <NavigationButtons/>
            <text> test messege </text>

            <h1 className="text-5xl mb-6 font-semibold"> Accepted bounties !</h1>
            <ul className="divide-y divide-gray-200 w-full px-4">
            {acceptedBounty.map(job => (
                <li key={job.id} className="py-4">
                <div className="flex space-x-3">
                    <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                    <p className="text-gray-500">{job.content}</p>
                    <p className="text-gray-500">Bounty: ${job.bounty}</p>
                    <p className="text-sm text-gray-500">Start Time: {job.timeStart}</p>
                    <p className="text-sm text-gray-500">End Time: {job.timeEnd}</p>
                    <p className="text-sm text-gray-500">Created by: {job.createdBy}</p>
                    {/* Add more job details as needed */}
                    </div>
                </div>
                </li>
            ))}
            </ul>

            <h1 className="text-5xl mb-6 font-semibold"> Posted bounties !</h1>
            <ul className="divide-y divide-gray-200 w-full px-4">
            {postedBounty.map(job => (
                <li key={job.id} className="py-4">
                <div className="flex space-x-3">
                    <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                    <p className="text-gray-500">{job.content}</p>
                    <p className="text-gray-500">Bounty: ${job.bounty}</p>
                    <p className="text-sm text-gray-500">Start Time: {job.timeStart}</p>
                    <p className="text-sm text-gray-500">End Time: {job.timeEnd}</p>
                    <p className="text-sm text-gray-500">Created by: {job.createdBy}</p>
                    {/* Add more job details as needed */}
                    </div>
                </div>
                </li>
            ))}
            </ul>


        </div>
    );
};