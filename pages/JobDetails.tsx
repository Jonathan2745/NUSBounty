import { useParams } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { type Schema } from '../amplify/data/resource';
import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { Button } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import MainTemplate from "../src/components/template/MainTemplate";


const client = generateClient<Schema>();

export const JobDetailsPage = () => {
    // const Variable declaration + taking in jobId from params(url) //
    const { jobId } = useParams();
    const { user } = useAuthenticator((context) => [context.user]);
    const navigate = useNavigate();

    type Jobs = Schema['Jobs']['type'];
    type User = Schema['User']['type'];
    const [ currentBounty, setCurrentBounty ] = useState<Jobs | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);


    // Fetches Bounty Selected by User in previous page //
    const fetchBounties = async () => {
        if( jobId ) {
        const { data: bounty, errors }  = await client.models.Jobs.get({
            id: jobId,
        }) 
            if ( errors ){
                console.error("No Such Job found")
            } else {
                try {
                setCurrentBounty(bounty);   
                } catch (error) {
                console.error("Error fetching Bounty");
                }
            }            
        } else {
            console.error("No Such Job found")
            return;
        }
    }

    // Fetches currentUser - from authenticated currentUser //
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

    // Function to Book selected Bounty - updates User and Job parameters
    const BookBounty = async () => {    
        if ( currentBounty && currentBounty.numBooked != null && currentBounty.numberOfPax ){
            setIsButtonDisabled(true);

            const { numBooked, numberOfPax, id: bountyId } = currentBounty;
            // if ( (currentnumberBooked) && (currentNumOfPax) && currentnumberBooked < currentNumOfPax ){ 
                if ( numBooked < numberOfPax ){
                    try {
                    // Book Job //
                    if ( currentUser ) {
                        const updatedAcceptedBy = currentBounty.acceptedBy ? [...currentBounty.acceptedBy, currentUser.userId] : [currentUser.userId];
                        const updatedBounty = {
                            id: currentBounty.id,
                            numBooked: numBooked ? 1 : numBooked + 1,
                            acceptedBy: updatedAcceptedBy,
                        };
                        console.log("Current Bounty: ", currentBounty);
                        console.log("Updating bounty with:", updatedBounty);
                        try {
                            const { data: updatedBounties } = await client.models.Jobs.update(updatedBounty);
                            console.log("Updated Bounty: ", updatedBounties);
                            // Update local state 
                            setCurrentBounty(updatedBounties);
                        } catch (error){
                            console.error("Error updating user", error)
                        }
                    }  else {
                        console.log("No User");
                        return;
                    }
                    // Update currentUsers accepted Jobs //
                        if ( currentUser ){
                            try {
                            const updatedAcceptedJobs = currentUser.acceptedJobs ? [...currentUser.acceptedJobs, bountyId] : [bountyId];
                            const updatedUser = { 
                                userId: currentUser.userId,
                                acceptedJobs: updatedAcceptedJobs,
                            };
                            console.log("Current User: ", currentUser);
                            console.log("Updating user with,", updatedUser);
                            const{data : updatedUsers } = await client.models.User.update(updatedUser);
                            console.log("Updated User: ", updatedUsers);
                            // Update local state 
                            setCurrentUser(updatedUsers);
                            checkButtonStatus(currentBounty, updatedUsers);
                            console.log("Current Bounty", currentBounty);
                            console.log("Current User", currentUser);
                            } catch (errors){
                                console.error("new error lol", errors);
                            }
                            // Send notification to current user //
                                try {
                                    
                                    const newNotification = {
                                        content: `Accepted Job ${currentBounty}`,
                                        isDone: false,
                                        Userfor: currentUser.userId,
                                    }
                    
                                    await client.models.Notifications.create(newNotification);
                                    console.log('Notification created:', newNotification);
                                } catch (error) {
                                    console.error('Error creating notification:', error);
                                    return;
                                }
                        } else {
                            console.error("Current user does not exist");
                            return;
                        }
                    } catch (error) {
                        console.error("Error faced while booking job", error );
                        return;
                    }
            } else {
                console.log("Full Jobs, Cannot book");
                return; 
            }
        } else {
            console.error("Job does not exist");
            return;
        }
        
    }
    // Function to toggle Booking button if user is valid to book Job/Bounty //
    const checkButtonStatus = (bounty: Jobs | null = currentBounty , user: User | null = currentUser) => {
        if ((bounty && user) && bounty.numBooked && bounty.numberOfPax) {
            const isFullyBooked = bounty.numBooked >= bounty.numberOfPax; // returns true if fully booked //
            const isAlreadyAccepted = user.acceptedJobs?.includes(bounty.id) || false; // returns true if already accepted //
            console.log("is Fully Booked", isFullyBooked);
            console.log("is Already Accepted", isAlreadyAccepted);
            setIsButtonDisabled(!(isFullyBooked && isAlreadyAccepted));
        } else {
            console.error("missing bounty or user", bounty, user);
        }
    }

    useEffect(()=> {
        fetchBounties();
    }, [jobId]);

    useEffect(() => {
        fetchCurrentUser();
    }, [currentBounty]);

    useEffect(() => {
        checkButtonStatus(currentBounty, currentUser);
    }, [currentUser]);
    // Implement UI ? //


    return (
        <MainTemplate>
        <div>
            <h1> Testing Job: {currentBounty?.title ? currentBounty.title : "error finding job"}</h1>
            <ul className="divide-y divide-gray-200 w-full px-4">
            <li  className="py-4">
            <div className="flex space-x-3">
              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-medium text-gray-900">{currentBounty?.title}</h3>
                <p className="text-gray-500">{currentBounty?.content}</p>
                <p className="text-gray-500">Bounty: ${currentBounty?.bounty}</p>
                <p className="text-gray-500">Date: {currentBounty?.DateStart}</p>
                <p className="text-sm text-gray-500">Start Time: {currentBounty?.timeStart}</p>
                <p className="text-sm text-gray-500">End Time: {currentBounty?.timeEnd}</p>
                <p className="text-sm text-gray-500">Created by: {currentBounty?.createdBy}</p>
                <p className="text-sm text-gray-500">Num Pax: {currentBounty?.numBooked}</p>
                <p className="text-sm text-gray-500">Total Pax: {currentBounty?.numberOfPax}</p>

                {/* Add more job details as needed */}
                <Button variation="primary" width="10rem"  onClick={BookBounty} disabled={isButtonDisabled} className="right-0" style={{ bottom: '4px' }}>
                Book it
                </Button>
            </div>
            </div>
          </li>
          </ul>
          <Button variation="primary" width="20rem" onClick={()=> navigate('/jobs')} > Return to Jobs </Button>
        </div>
        </MainTemplate>
    )
}