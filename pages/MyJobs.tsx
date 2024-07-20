

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
    type User = Schema['User']['type'];
    const { user } = useAuthenticator((context) => [context.user]);


    const [acceptedBounty, setAcceptedBounty] = useState<Bounty[]>([]);
    const [postedBounty, setPostedBounty] = useState<Bounty[]>([]);
    const [numberBooked, setNumberBooked] = useState<number>(-1);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [claimButtonStatuses, setClaimButtonStatuses] = useState<{ [key: string]: boolean }>({});

    
    const fetchCurrentUser = async () => {
        if (user) {
            const { data: currentuser, errors } = await client.models.User.get({
                userId: user.userId,
            })
            if ( errors ){
                console.error("User not found");
            } else {
                try{ 
                    setCurrentUser(currentuser);
                } catch (error) {
                    console.error("errror setting curent user", error);
                }
            }
        } else {
            console.error("No user found");
        }
    }

    // Deletion of Bounty // 

    
    const deleteBounty = async(bountyId:string) => {
        try {
            const jobToDelete = {
                id: bountyId,
            }
            if ( jobToDelete ){
                // Find Users who accepted Job //
                // Then Update their notifications //
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
    const completeBounty = async(bountyId:string) => {
        try {
            const {data: jobToComplete} = await client.models.Jobs.get({
                id: bountyId,
            });

            if ( jobToComplete && jobToComplete.acceptedBy && currentUser ){
                // update Users that ready to claim //
                const acceptedUsers = jobToComplete.acceptedBy;
                console.log("current Accepted Users ", acceptedUsers );

                const updatedCompletedJob = {
                    id: bountyId,
                    isDone: true,
                    userToClaim: acceptedUsers,
                }

                // Update Job Status to complete //
                await client.models.Jobs.update(updatedCompletedJob);
                console.log ("Job with ID ${id} completed successfully");
            } else {
                console.log("Job with ID ${id} not found");
            }
        } catch (error) {
            console.error('Error completing job:', error);
        }

        // Need to update users wallets //

        


        fetchPostedBounties();
        fetchTakenBounties();
    };

    // Cancellation of Bounty //
    const cancelBounty = async(bountyId:string) => {
        try {
            const jobToCancel = {
                id: bountyId,
            }
            const { data: Job } = await client.models.Jobs.get(jobToCancel);
            if ( Job && Job.numBooked ){
                const NumberBooked = Job.numBooked;
                setNumberBooked(NumberBooked);
            } else {
                console.error("Job not found");
                return;
            }
            
            if ( Job.acceptedBy && currentUser ){
                const updatedAcceptedBy = Job.acceptedBy.filter(function(item) {
                    return item != currentUser.userId;
                });
                console.log("new accepted-by list: ", updatedAcceptedBy);

                const realjobToCancel = {
                    id: bountyId,
                    numBooked: numberBooked,
                    acceptedBy: updatedAcceptedBy,
                }

;

                // Update Users' accepted Jobs : 
                if ( currentUser?.acceptedJobs){
                    const updatedAcceptedUser = currentUser.acceptedJobs.filter(function(jobIdNumber) {
                        return jobIdNumber != Job.id;
                    })
                    const updatedUserAccepted = {
                        userId: currentUser.userId,
                        acceptedJobs: updatedAcceptedUser,
                    }
                    // for bug testing //
                    console.log("new User Accepted Jobs list: ", updatedAcceptedUser);

                
                    // Part of Job-side Cancellation //
                    await client.models.User.update(updatedUserAccepted);
                    await client.models.Jobs.update(realjobToCancel);
                    console.log ("Job with ID", bountyId,"cancelled successfully")
                } else {
                    console.error("Error cancelling on user side");
                    return;
                }

            } else {
                console.error("Job not accepted");
                return;
            }

        } catch (error) {
            console.error('Error deleting job:', error);
            return;
        }
        fetchPostedBounties();
        fetchTakenBounties();

    }


    // Queries for Taken bounties
    const fetchTakenBounties = async () => {        
        // return list of user taken bounties // 
        if ( currentUser?.acceptedJobs ){
            
            const userTakenBounties = currentUser.acceptedJobs;

            if (userTakenBounties.length === 0) {
                console.error("No accepted jobs found for the current user.");
                return;
            }


            const arrayOfIds = {
                or: userTakenBounties.map(jobidnumber => ({ id: { eq: jobidnumber } }))
            };
            
            const filter = {
                or: arrayOfIds.or as { id: { eq: string } }[] // Explicit type definition
            };
            
            const { data: acceptedBounties } = await client.models.Jobs.list({
                filter: filter
            });
            setAcceptedBounty(acceptedBounties);
            acceptedBounties.forEach(job => updateClaimButtonStatus(job.id));
            
        } else {
            console.error("error finding current user");
            return;
        }
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


    // Function to Claim Jobs //
    const claimBounty = async (claimedBounty:string) => {
        const { data : acceptedJob } = await client.models.Jobs.get({ 
            id: claimedBounty
        })

        // Check if Jobs is completed and user is in claim list //
        if ( acceptedJob && acceptedJob.isDone && acceptedJob.userToClaim && currentUser ){
            if ( acceptedJob.userToClaim.includes(currentUser.userId) && acceptedJob.bounty ){
                // user is in claim list //
                console.log("user is in claim list");
                // Step 1 : remove user from claim list //
                const updatedUserToClaim = acceptedJob.userToClaim.filter(id => id !== currentUser.userId );
                const updatedJob = {
                    id: acceptedJob.id,
                    userToClaim: updatedUserToClaim,
                }
                await client.models.Jobs.update(updatedJob);
                console.log("Job updated", updatedJob);
                // step 2: update user wallet //
                const updatedUserWallet = { 
                    userId: currentUser.userId,
                    walletBalance: currentUser.walletBalance ? currentUser.walletBalance + acceptedJob.bounty : acceptedJob.bounty,
                }
                await client.models.User.update(updatedUserWallet);
                console.log("User Updated", updatedUserWallet);

            } else {
                console.error("user not in claim list");
                return;
            }
        } else {
            console.error("error claiming job ( job not found ) ");
            return;
        }
    }

    const updateClaimButtonStatus = async (jobId: string) => {
        try {
            const { data: acceptedJob } = await client.models.Jobs.get({ 
                id: jobId,
            });
            
            if (acceptedJob && acceptedJob.isDone && acceptedJob.userToClaim && currentUser) {
                console.log(acceptedJob);
                if (acceptedJob.userToClaim.includes(currentUser.userId) && acceptedJob.bounty) {
                    
                    setClaimButtonStatuses((prevStatuses) => ({
                        ...prevStatuses,
                        [jobId]: true,
                    }));
                    console.log("previous status set ", claimButtonStatuses[jobId])
                    return;
                }
            }
            setClaimButtonStatuses((prevStatuses) => ({
                ...prevStatuses,
                [jobId]: false,
            }));
        } catch (error) {
            console.error('Error fetching job status:', error);
            setClaimButtonStatuses((prevStatuses) => ({
                ...prevStatuses,
                [jobId]: false,
            }));
        }
    };
    

    useEffect(() => {
        fetchCurrentUser();
    }, []);

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
    , [currentUser])

    
    

    // Completed Jobs ? // for now put fucniton in accpeted Jobs


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
                    <p className="text-sm text-gray-500">Completed? : { job.isDone ? "yes": "no" }</p>
                    {/* Add more job details as needed */}
                    <Button variation="primary" width="10rem"  onClick={() => claimBounty(job.id)} disabled={!claimButtonStatuses[job.id]} className="right-0" style={{ bottom: '4px' }}> Claim bounty </Button>

                    <Button onClick={() => cancelBounty(job.id)} > Cancel Accepting Bounty  </Button>
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
                    <p className="text-sm text-gray-500">Positions filled: {job.numBooked} / {job.numberOfPax} </p>
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