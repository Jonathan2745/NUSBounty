import { useParams } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { type Schema } from "../amplify/data/resource";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/api";
import { CiLocationOn, CiMoneyBill, CiCalendar, CiTimer } from "react-icons/ci";
import { AiOutlineFileDone } from "react-icons/ai";
import { IoPeopleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import MainTemplate from "../src/components/template/MainTemplate.tsx";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import mimic from "../src/assets/Icons/mimic.png"


const client = generateClient<Schema>();

const JobDetailsPage = () => {
  // const Variable declaration + taking in jobId from params(url) //
  const { jobId } = useParams();
  const { user } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();

  type Jobs = Schema["Jobs"]["type"];
  type User = Schema["User"]["type"];
  const [currentBounty, setCurrentBounty] = useState<Jobs | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Fetches Bounty Selected by User in previous page //
  const fetchBounties = async () => {
    if (jobId) {
      const { data: bounty, errors } = await client.models.Jobs.get({
        id: jobId,
      });
      if (errors) {
        console.error("No Such Job found");
      } else {
        try {
          setCurrentBounty(bounty);
          if (!bounty?.title) navigate("/jobs");
        } catch (error) {
          console.error("Error fetching Bounty");
        }
      }
    } else {
      console.error("No Such Job found");
      return;
    }
  };

  // Fetches currentUser - from authenticated currentUser //
  const fetchCurrentUser = async () => {
    if (user) {
      const { data: currentuser, errors } = await client.models.User.get({
        userId: user.userId,
      });
      if (errors) {
        console.error("User not found");
      } else {
        try {
          setCurrentUser(currentuser);
        } catch (error) {
          console.error("errror setting curent user", error);
        }
      }
    } else {
      console.error("No user found");
    }
  };

  // Function to Book selected Bounty - updates User and Job parameters
  const BookBounty = async () => {
    if (
      currentBounty &&
      currentBounty.numBooked != null &&
      currentBounty.numBooked != currentBounty.numberOfPax
      && currentBounty.numberOfPax != null
    ) {
      setIsButtonDisabled(true);

      const { numBooked, numberOfPax, id: bountyId } = currentBounty;
      // if ( (currentnumberBooked) && (currentNumOfPax) && currentnumberBooked < currentNumOfPax ){
      if (numBooked < numberOfPax) {
        try {
          // Book Job //
          if (currentUser) {
            const updatedAcceptedBy = currentBounty.acceptedBy
              ? [...currentBounty.acceptedBy, currentUser.userId]
              : [currentUser.userId];
            const updatedBounty = {
              id: currentBounty.id,
              numBooked: numBooked ? 1 : numBooked + 1,
              acceptedBy: updatedAcceptedBy,
            };
            console.log("Current Bounty: ", currentBounty);
            console.log("Updating bounty with:", updatedBounty);
            try {
              const { data: updatedBounties } = await client.models.Jobs.update(
                updatedBounty
              );
              console.log("Updated Bounty: ", updatedBounties);
              // Update local state
              setCurrentBounty(updatedBounties);
              if (!updatedBounties?.title) navigate("/jobs");
            } catch (error) {
              console.error("Error updating user", error);
            }
          } else {
            console.log("No User");
            return;
          }
          // Update currentUsers accepted Jobs //
          if (currentUser) {
            try {
              const updatedAcceptedJobs = currentUser.acceptedJobs
                ? [...currentUser.acceptedJobs, bountyId]
                : [bountyId];
              const updatedUser = {
                userId: currentUser.userId,
                acceptedJobs: updatedAcceptedJobs,
              };
              console.log("Current User: ", currentUser);
              console.log("Updating user with,", updatedUser);
              const { data: updatedUsers } = await client.models.User.update(
                updatedUser
              );
              console.log("Updated User: ", updatedUsers);
              // Update local state
              setCurrentUser(updatedUsers);
              checkButtonStatus(currentBounty, updatedUsers);
              console.log("Current Bounty", currentBounty);
              console.log("Current User", currentUser);
            } catch (errors) {
              console.error("new error lol", errors);
            }
            // Send notification to current user //
            try {
              const newNotification = {
                content: `Accepted Job: ${currentBounty.title}`,
                isDone: false,
                Userfor: currentUser.userId,
              };

              await client.models.Notifications.create(newNotification);
              console.log("Notification created:", newNotification);
            } catch (error) {
              console.error("Error creating notification:", error);
              return;
            }
          } else {
            console.error("Current user does not exist");
            return;
          }
        } catch (error) {
          console.error("Error faced while booking job", error);
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
  };
  // Function to toggle Booking button if user is valid to book Job/Bounty //
  const checkButtonStatus = (
    bounty: Jobs | null = currentBounty,
    user: User | null = currentUser
  ) => {
    if (bounty && user && bounty.numBooked && bounty.numberOfPax) {
      const isFullyBooked = bounty.numBooked >= bounty.numberOfPax; // returns true if fully booked //
      const isAlreadyAccepted = user.acceptedJobs?.includes(bounty.id) || false; // returns true if already accepted //
      console.log("is Fully Booked", isFullyBooked);
      console.log("is Already Accepted", isAlreadyAccepted);
      setIsButtonDisabled(!(isFullyBooked && isAlreadyAccepted));
    } else {
      console.error("missing bounty or user", bounty, user);
    }
  };

  useEffect(() => {
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
    <MainTemplate currentNavigation={""}>
      <div className="flex-grow flex flex-col justify-center items-center">
        <div
          className="flex flex-col gap-3 border-2 p-6 rounded-lg border-gray-400 mx-20"
          key={currentBounty?.id}
        >
          <div className="flex flex-row items-center gap-4">
            <div>
              <StorageImage
              alt=""
              path={`public/${currentBounty?.createdBy}`}
              fallbackSrc= {mimic}
              onGetUrlError={(error) => console.error(error)}
              className="w-14 bg-gray-300 rounded-md" />
            </div>
            <div className="flex-grow flex flex-col items-start justify-between self-stretch py-1">
              <p className="text-xl font-semibold">{currentBounty?.title}</p>
              <p className="text-sm text-gray-400">
                {currentBounty?.createdByDisplayed}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Posted today</p>
            </div>
          </div>
          <p className="text-left">
            {currentBounty?.content}
          </p>
          <hr className="border-t-2 border-gray-300" />
          <div className="grid grid-cols-6 items-center gap-2">
            <div className="flex flex-row items-center gap-2 col-span-3">
              <CiCalendar
                className="fill-gray-500"
                style={{ height: "1.2rem", width: "1.2rem" }}
              />
              <p className="text-sm text-gray-500 text-left">
                Date: {currentBounty?.DateStart} - {currentBounty?.DateEnd}
              </p>
            </div>
            <div className="flex flex-row items-center gap-2 col-span-3">
              <CiTimer
                className="fill-gray-500"
                style={{ height: "1.2rem", width: "1.2rem" }}
              />
              <p className="text-sm text-gray-500">
                Time: {currentBounty?.timeStart} - {currentBounty?.timeEnd}
              </p>
            </div>
            <div className="col-span-6">
              <hr className="border-t-2 border-gray-300" />
            </div>
            <div className="flex flex-row items-center gap-2 col-span-2">
              <CiMoneyBill
                className="fill-gray-500"
                style={{ height: "1.2rem", width: "1.2rem" }}
              />
              <p className="text-sm text-gray-500">${currentBounty?.bounty}</p>
            </div>
            <div className="flex flex-row items-center gap-2 col-span-2">
              <CiLocationOn
                className="fill-gray-500"
                style={{ height: "1.2rem", width: "1.2rem" }}
              />
              <p className="text-sm text-gray-500">{currentBounty?.location}</p>
            </div>
            <div className="flex flex-row items-center gap-2 col-span-2">
                      <IoPeopleOutline className="stroke-gray-500" style={{height: "1.2rem", width: "1.2rem"}} />
                      <p className="text-sm text-gray-500">Positions Filled: {currentBounty?.numBooked} / {currentBounty?.numberOfPax}</p>
                    </div>
            {isButtonDisabled ||
                <div className="flex flex-row items-center gap-2 col-span-4 col-start-2">
                <button className="p-2 border-2 border-gray-300 hover:border-gray-500 group w-full h-full flex flex-row gap-2 bg-white justify-center mt-4" onClick={BookBounty}>
                    <AiOutlineFileDone
                    className="fill-gray-500 group-hover:fill-gray-600"
                    style={{ height: "1.2rem", width: "1.2rem" }}
                    />
                    <p className="text-sm text-gray-500 group-hover:text-gray-600">
                    Book it?
                    </p>
                </button>
                </div>
            }
          </div>
        </div>
      </div>
    </MainTemplate>
  );
};

export default JobDetailsPage;
