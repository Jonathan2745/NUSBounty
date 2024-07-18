

import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../amplify/data/resource';
import { useState, useEffect } from 'react';

import { NavigationButtons } from "../src/components/NavigationButtons";
import { useAuthenticator } from "@aws-amplify/ui-react";

import { Button } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();


export const MyJobsPage = () => {

    // Set up the Queries for the Jobs Taken //
    type Bounty = Schema['Jobs']['type'];
    const { user } = useAuthenticator((context) => [context.user]);


    const [acceptedBounty, setAcceptedBounty] = useState<Bounty[]>([]);
    const [postedBounty, setPostedBounty] = useState<Bounty[]>([]);
    const [numberBooked, setNumberBooked] = useState<number>(-1);
    // Deletion of Bounty // 
    
    const deleteBounty = async(bountyId:string) => {
        try {
            const jobToDelete = {
                id: bountyId,
            }
            if ( jobToDelete ){
                await client.models.Jobs.delete(jobToDelete);
                console.log ("Job with ID ${id} deleted successfully");
            } else {
                console.log("Job with ID ${id} not found");
            }
        } catch (error) {
            console.error('Error deleting job:', error);
        }
        fetchPostedBounties();
        fetchTakenBounties();
    };

    // Completion of Bounty //
    const completeBounty = async (bountyId:string) => {
        try {
            const jobToComplete = {
                id: bountyId,
                isDone: true,
            }
            if ( jobToComplete ){
                await client.models.Jobs.update(jobToComplete);
                console.log ("Job with ID ${id} completed successfully");
            } else {
                console.log("Job with ID ${id} not found");
            }
        } catch (error) {
            console.error('Error deleting job:', error);
        }
        fetchPostedBounties();
        fetchTakenBounties();
    };

    // Cancellation of Bounty //
    const cancelBounty = async(bountyId:string) => {
        try {
            const jobToCancel = {
                id: bountyId,
            }
            if ( jobToCancel ){
                const { data: Job } = await client.models.Jobs.get(jobToCancel);
                if ( Job?.numBooked ){
                    const NumberBooked = Job?.numBooked;
                    setNumberBooked(NumberBooked);
                }
                const realjobToCancel = {
                    id: bountyId,
                    numBooked: numberBooked,
                }
                await client.models.Jobs.update(realjobToCancel);
                console.log ("Job with ID ${id} cancelled successfully");
            } else {
                console.log("Job with ID ${id} not found");
            }
        } catch (error) {
            console.error('Error deleting job:', error);
        }
        fetchPostedBounties();
        fetchTakenBounties();

    }


    // Queries for Taken bounties
    const fetchTakenBounties = async () => {
        
        // const { data: userAcceptedBounties } = await client.models.User.get({
        //     id: "",
        // })

        
        
        const { data: acceptedBounties } = await client.models.Jobs.list({
            filter:{
                id: {
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
   
   
        }
    , [user.username])


    return (
        <div className="flex flex-col items-center justify-center h-screen overflow-y-auto">
        <NavigationButtons/>
            <h1> test messege </h1>

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
                    <Button onClick={() => cancelBounty(job.id)} > Cancel Bounty </Button>
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
                    <p className="text-sm text-gray-500">Positions filled {job.numBooked} / {job.numberOfPax}</p>
                    {/* Add more job details as needed */}
                    <p className="text-sm text-gray-500"> Completed? :{ (job.isDone ? "Yes" : "No ") } </p>
                    <Button onClick={() => deleteBounty(job.id)}>Delete</Button>
                    <Button onClick={() => completeBounty(job.id)}>Bounty Completed</Button>
                    </div>
                </div>
                </li>
            ))}
            </ul>


        </div>
    );
};