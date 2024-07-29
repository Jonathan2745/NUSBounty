import { generateClient } from "aws-amplify/data";
import { type Schema } from "../amplify/data/resource";
import { useState, useEffect } from "react";
import { CiLocationOn, CiMoneyBill, CiCalendar, CiTimer } from "react-icons/ci";
import { IoPeopleOutline } from "react-icons/io5";
import { MdOutlineDoneAll, MdOutlineRemoveDone, MdOutlineDelete, MdOutlineCancel } from "react-icons/md";
import { TbReportMoney } from "react-icons/tb";

import MainTemplate from "../src/components/template/MainTemplate.tsx";

import { StorageImage } from "@aws-amplify/ui-react-storage";
import mimic from "../src/assets/Icons/mimic.png"


import {
  SearchField,
  SelectField,
  useAuthenticator,
} from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";

const client = generateClient<Schema>();

const MyJobsPage = () => {
  // Set up the Queries for the Jobs Taken //
  type Bounty = Schema["Jobs"]["type"];
  type User = Schema["User"]["type"];
  const navigate = useNavigate();
  const { user } = useAuthenticator((context) => [context.user]);

  const [acceptedBounty, setAcceptedBounty] = useState<Bounty[]>([]);
  const [postedBounty, setPostedBounty] = useState<Bounty[]>([]);
  const [completedBounty, setCompletedBounty] = useState<Bounty[]>([]);

  const [filteredAcceptedBounty, setFilteredAcceptedBounty] = useState<
    Bounty[]
  >([]);
  const [filteredPostedBounty, setFilteredPostedBounty] = useState<Bounty[]>(
    []
  );
  const [filteredCompletedBounty, setFilteredCompletedBounty] = useState<
    Bounty[]
  >([]);

  const [numberBooked, setNumberBooked] = useState<number>(-1);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [claimButtonStatuses, setClaimButtonStatuses] = useState<{
    [key: string]: boolean;
  }>({});
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("accepted");

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

  // Deletion of Bounty //
  const deleteBounty = async (bountyId: string) => {
    try {
      const { data: jobToDelete } = await client.models.Jobs.get({
        id: bountyId,
      });

      if (jobToDelete && jobToDelete.acceptedBy) {
        // Find Users who accepted Job //
        for (const id of jobToDelete.acceptedBy) {
          // Send notification to accepted user //
          try {
            if (id) {
              const newNotification = {
                content: `Accepted Job: ${jobToDelete.title} has been deleted`,
                isDone: false,
                Userfor: id,
              };

              await client.models.Notifications.create(newNotification);
              console.log("Notification created:", newNotification);
            } else {
              // Assuming no one accepted Job // Do nothing
              console.log("This should be null ", jobToDelete.acceptedBy);
            }
          } catch (error) {
            console.error("Error creating notification:", error);
          }
        }
        // Then Update their notifications //
        // alert current user that job deleted  //
        if (currentUser) {
          try {
            const newNotification = {
              content: `Job: ${jobToDelete.title} has been deleted`,
              isDone: false,
              Userfor: currentUser.userId,
            };

            await client.models.Notifications.create(newNotification);
            console.log("Notification created:", newNotification);
          } catch (error) {
            console.error("Error creating notification:", error);
          }
          await client.models.Jobs.delete(jobToDelete);
          console.log("Job with ID ${id} deleted successfully");
        } else {
          console.error("user not found");
          return;
        }
        await client.models.Jobs.delete({
          id: jobToDelete.id
        });
      } else {
        console.log("Job with ID ${id} not found");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }


    fetchPostedBounties();
    fetchTakenBounties();
    fetchCompletedBounties();
  };

  // Completion of Bounty //
  const completeBounty = async (bountyId: string) => {
    try {
      const { data: jobToComplete } = await client.models.Jobs.get({
        id: bountyId,
      });

      if (jobToComplete && jobToComplete.acceptedBy && currentUser) {
        // update Users that ready to claim //
        const acceptedUsers = jobToComplete.acceptedBy;
        console.log("current Accepted Users ", acceptedUsers);

        const updatedCompletedJob = {
          id: bountyId,
          isDone: true,
          userToClaim: acceptedUsers,
        };

        // Update Job Status to complete //
        await client.models.Jobs.update(updatedCompletedJob);
        console.log("Job with ID ${id} completed successfully");

        // Alert currentUser that Job has been marked as complete //
        // Send notification to current user //
        try {
          const newNotification = {
            content: `Job: ${jobToComplete.title} has been marked as complete`,
            isDone: false,
            Userfor: currentUser.userId,
          };

          await client.models.Notifications.create(newNotification);
          console.log("Notification created:", newNotification);
        } catch (error) {
          console.error("Error creating notification:", error);
        }

        // Alert acceptedUsers that Job has been marked as complete //
        // Find Users who accepted Job //
        if (jobToComplete.userToClaim) {
          for (const id of jobToComplete.userToClaim) {
            // Send notification to accepted user //
            try {
              if (id) {
                const newNotification = {
                  content: `Accepted Job: ${jobToComplete.title} has been marked as Complete, please proceed to claim Bounty`,
                  isDone: false,
                  Userfor: id,
                };

                await client.models.Notifications.create(newNotification);
                console.log("Notification created:", newNotification);
              } else {
                // Assuming no one accepted Job // Do nothing
                console.log("This should be null ", jobToComplete.acceptedBy);
              }
            } catch (error) {
              console.error("Error creating notification:", error);
            }
          }
        } else {
          console.error(
            "userToClaim not updated or no one did job",
            acceptedUsers
          );
        }
      } else {
        console.log("Job with ID ${id} not found");
        // INSERT REACT TOAST HERE FOR NO ONE ACCEPTED AND ONE MORE OR JOB DOES NOT EXIST ??? //

  
      }
    } catch (error) {
      console.error("Error completing job:", error);
    }

    fetchPostedBounties();
    fetchTakenBounties();
    fetchCompletedBounties();
  };

  // Cancellation of Bounty //
  const cancelBounty = async (bountyId: string) => {
    try {
      const jobToCancel = {
        id: bountyId,
      };
      const { data: Job } = await client.models.Jobs.get(jobToCancel);
      if (Job && Job.numBooked) {
        const NumberBooked = Job.numBooked;
        setNumberBooked(NumberBooked);
      } else {
        console.error("Job not found");
        return;
      }

      if (Job.acceptedBy && currentUser) {
        const updatedAcceptedBy = Job.acceptedBy.filter(function (item) {
          return item != currentUser.userId;
        });
        console.log("new accepted-by list: ", updatedAcceptedBy);

        const realjobToCancel = {
          id: bountyId,
          numBooked: numberBooked,
          acceptedBy: updatedAcceptedBy,
        };

        // Update Users' accepted Jobs :
        if (currentUser?.acceptedJobs) {
          const updatedAcceptedUser = currentUser.acceptedJobs.filter(function (
            jobIdNumber
          ) {
            return jobIdNumber != Job.id;
          });
          const updatedUserAccepted = {
            userId: currentUser.userId,
            acceptedJobs: updatedAcceptedUser,
          };
          // for bug testing //
          console.log("new User Accepted Jobs list: ", updatedAcceptedUser);

          // Part of Job-side Cancellation //
          await client.models.User.update(updatedUserAccepted);
          await client.models.Jobs.update(realjobToCancel);
          console.log("Job with ID", bountyId, "cancelled successfully");

          // Send notification to current user //
          try {
            const newNotification = {
              content: `Cancelled Job: ${Job.title}`,
              isDone: false,
              Userfor: currentUser.userId,
            };

            await client.models.Notifications.create(newNotification);
            console.log("Notification created:", newNotification);
          } catch (error) {
            console.error("Error creating notification:", error);
          }

          // Send Notification to Job Owner //
          try {
            if (Job.createdBy) {
              const newNotification = {
                content: `Job: ${Job.title} cancelled by ${currentUser.username}`,
                isDone: false,
                Userfor: Job.createdBy,
              };

              await client.models.Notifications.create(newNotification);
              console.log("Notification created:", newNotification);
            } else {
              console.error("Error Notifying Job Creator");
            }
          } catch (error) {
            console.error("Error creating notification:", error);
          }
        } else {
          console.error("Error cancelling on user side");
          return;
        }
      } else {
        console.error("Job not accepted");
        return;
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      return;
    }
    fetchPostedBounties();
    fetchTakenBounties();
    fetchCompletedBounties();
  };

  // Queries for Taken bounties
  const fetchTakenBounties = async () => {
    // return list of user taken bounties //
    console.log("fetching Taken Bounties");
    if (currentUser?.acceptedJobs) {
      const userTakenBounties = currentUser.acceptedJobs;

      if (userTakenBounties.length === 0) {
        console.error("No accepted jobs found for the current user.");
        return;
      }

      const arrayOfIds = {
        or: userTakenBounties.map((jobidnumber) => ({
          id: { eq: jobidnumber },
        })),
      };

      const filter = {
        or: arrayOfIds.or as { id: { eq: string } }[], // Explicit type definition
      };

      const { data: acceptedBounties } = await client.models.Jobs.list({
        filter: filter,
      });
      setAcceptedBounty(acceptedBounties);
      acceptedBounties.forEach((job: Bounty) =>
        updateClaimButtonStatus(job.id)
      );
    } else {
      console.error("current user has no accepted obs");
      return;
    }
  };

  // Set up Queries for the Jobs Posted //
  const fetchPostedBounties = async () => {
    console.log("fetching Posted Bounties");
    const { data: postedBounties } = await client.models.Jobs.list({
      filter: {
        createdBy: {
          contains: user.username,
        },
      },
    });
    setPostedBounty(postedBounties);
  };

  const fetchCompletedBounties = async () => {
    console.log("fetching completed Bounties");
    try {
      const completedBounties = acceptedBounty.filter(
        (bounty) => bounty.isDone
      );
      setCompletedBounty(completedBounties);
    } catch (error) {
      console.error("Error filtering accepted bounties: ", error);
    }
  };

  // Function to Claim Jobs  -- Checks if user is valid and updates users Wallet //
  const claimBounty = async (claimedBounty: string) => {
    const { data: acceptedJob } = await client.models.Jobs.get({
      id: claimedBounty,
    });

    // Check if Jobs is completed and user is in claim list //
    if (
      acceptedJob &&
      acceptedJob.isDone &&
      acceptedJob.userToClaim &&
      currentUser
    ) {
      if (
        acceptedJob.userToClaim.includes(currentUser.userId) &&
        acceptedJob.bounty
      ) {
        // user is in claim list //
        console.log("user is in claim list");
        // Step 1 : remove user from claim list //
        const updatedUserToClaim = acceptedJob.userToClaim.filter(
          (id) => id !== currentUser.userId
        );
        const updatedJob = {
          id: acceptedJob.id,
          userToClaim: updatedUserToClaim,
        };
        await client.models.Jobs.update(updatedJob);
        console.log("Job updated", updatedJob);
        // step 2: update user wallet //
        const updatedUserWallet = {
          userId: currentUser.userId,
          walletBalance: currentUser.walletBalance
            ? currentUser.walletBalance + acceptedJob.bounty
            : acceptedJob.bounty,
        };
        await client.models.User.update(updatedUserWallet);
        console.log("User Updated", updatedUserWallet);

        // Send notification to current user //
        try {
          const newNotification = {
            content: `Bounty Claimed: ${acceptedJob.bounty}, Bounty from: ${acceptedJob.title}`,
            isDone: false,
            Userfor: currentUser.userId,
          };
          await client.models.Notifications.create(newNotification);
          console.log("Notification created:", newNotification);
        } catch (error) {
          console.error("Error creating notification:", error);
        }
      } else {
        console.error("user not in claim list");
        return;
      }
    } else {
      console.error("error claiming job ( job not found ) ");
      return;
    }
  };

  // Funciton to Disable Claim Button if bounty already claimed/ Job not completed yet
  const updateClaimButtonStatus = async (jobId: string) => {
    try {
      const { data: acceptedJob } = await client.models.Jobs.get({
        id: jobId,
      });

      if (
        acceptedJob &&
        acceptedJob.isDone &&
        acceptedJob.userToClaim &&
        currentUser
      ) {
        console.log(acceptedJob);
        if (
          acceptedJob.userToClaim.includes(currentUser.userId) &&
          acceptedJob.bounty
        ) {
          setClaimButtonStatuses((prevStatuses) => ({
            ...prevStatuses,
            [jobId]: true,
          }));
          console.log("previous status set ", claimButtonStatuses[jobId]);
          return;
        }
      }
      setClaimButtonStatuses((prevStatuses) => ({
        ...prevStatuses,
        [jobId]: false,
      }));
    } catch (error) {
      console.error("Error fetching job status:", error);
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
        await fetchPostedBounties();
        await fetchTakenBounties();
        fetchCompletedBounties();
      } catch (error) {
        console.error("Error fetching bounties: ", error);
      }
    };
    fetchBounties();
  }, [currentUser]);

  useEffect(() => {
    fetchCompletedBounties();
  }, [acceptedBounty]);

  useEffect(() => {
    const result: Bounty[] = acceptedBounty.filter(
      (job) => job && job.title && job.title.includes(search)
    );
    setFilteredAcceptedBounty(result);
  }, [search, acceptedBounty]);

  useEffect(() => {
    const result: Bounty[] = postedBounty.filter(
      (job) => job && ((job.title && job.title.toLowerCase().includes(search.toLowerCase()) ||
                (job.content && job.content.toLowerCase().includes(search.toLowerCase()))))
    );
    setFilteredPostedBounty(result);
  }, [search, postedBounty]);

  useEffect(() => {
    const result: Bounty[] = completedBounty.filter(
      (job) => job && job.title && job.title.includes(search)
    );
    setFilteredCompletedBounty(result);
  }, [search, completedBounty]);


  return (
    <MainTemplate currentNavigation={"my_jobs"}>
      <div className="flex flex-col items-stretch justify-start flex-grow gap-8">
        <div className="flex flex-row gap-6">
          <SelectField
            label="Category"
            labelHidden
            width={"15rem"}
            value={category}
            textAlign={"start"}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="accepted">Accepted Jobs</option>
            <option value="posted">Posted Jobs</option>
            <option value="completed">Completed Jobs</option>
          </SelectField>
          <SearchField
            label="Search"
            labelHidden
            textAlign={"start"}
            className="flex-grow"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        { ((category === "accepted" && filteredAcceptedBounty.length <= 0) ||
          (category === "posted" && filteredPostedBounty.length <= 0) ||
          (category === "completed" && filteredCompletedBounty.length <= 0)) &&
          <p className="self-center flex-grow mx-auto text-2xl font-semibold text-gray-500">
            No jobs available
          </p>
        }
        <div className="grid grid-cols-5 gap-5">
          <div className="col-span-5 grid grid-flow-row gap-5">
          {category === "accepted" &&
            (filteredAcceptedBounty.length > 0 && (
              filteredAcceptedBounty.map((job) => (
              <div
                className="flex flex-col gap-3 border-2 p-6 rounded-lg border-gray-400"
                key={job.id}
              >
                <div className="flex flex-row items-center gap-4">
                  <div>
                  <StorageImage
              alt=""
              path={`public/${job?.createdBy}`}
              fallbackSrc= {mimic}
              onGetUrlError={(error) => console.error(error)}
              className="w-14 bg-gray-300 rounded-md" />
                  </div>
                  <div className="flex-grow flex flex-col items-start justify-between self-stretch py-1">
                    <p className="text-xl font-semibold">{job.title}</p>
                    <p className="text-sm text-gray-400">{currentUser?.username}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between self-stretch gap-1 py-1">
                    <p className="text-sm text-gray-400">Posted today</p>
                    <button onClick={()=> navigate(`/jobs/${job.id}`)}className="p-1 border-0 border-gray-300 hover:border-gray-500 group flex flex-row gap-2 bg-white">
                      <p className="text-sm text-gray-400 group-hover:text-gray-600">More Details &raquo;</p>
                    </button>
                  </div>
                  
                </div>
                <p className="line-clamp-3 text-left" style={{height: "4.5em"}}>
                  {job.content}
                </p>
                <hr className="border-t-2 border-gray-300"/>
                <div className="grid grid-cols-6 items-center gap-2">
                  <div className="flex flex-row items-center gap-2 col-span-3">
                    <CiCalendar className="fill-gray-500" style={{height: "1.2rem", width: "1.2rem"}} />
                    <p className="text-sm text-gray-500 text-left">Date: {job.DateStart} - {job.DateEnd}</p>
                  </div>
                  <div className="flex flex-row items-center gap-2 col-span-3">
                    <CiTimer className="fill-gray-500" style={{height: "1.2rem", width: "1.2rem"}} />
                    <p className="text-sm text-gray-500">Time: {job.timeStart} - {job.timeEnd}</p>
                  </div>
                  <div className="col-span-6">
                    <hr className="border-t-2 border-gray-300"/>
                  </div>
                  <div className="flex flex-row items-center gap-2 col-span-2">
                    <CiMoneyBill className="fill-gray-500" style={{height: "1.2rem", width: "1.2rem"}} />
                    <p className="text-sm text-gray-500">${job.bounty}</p>
                    </div>
                  <div className="flex flex-row items-center gap-2 col-span-2">
                    <CiLocationOn className="fill-gray-500" style={{height: "1.2rem", width: "1.2rem"}} />
                    <p className="text-sm text-gray-500">{job.location}</p>
                  </div>
                  <div className="flex flex-row items-center gap-2 col-span-2">
                    { job.isDone &&
                      <div className="p-2 border-2 border-white w-full h-full flex flex-row gap-2 bg-white">
                        <MdOutlineDoneAll className="fill-gray-500" style={{height: "1.2rem", width: "1.2rem"}} />
                        <p className="text-sm text-gray-500">Complete</p>
                      </div>
                    }
                    { (!job.isDone) &&
                      <div className="p-2 border-2 border-white w-full h-full flex flex-row gap-2 bg-white">
                        <MdOutlineRemoveDone className="fill-gray-500" style={{height: "1.2rem", width: "1.2rem"}} />
                        <p className="text-sm text-gray-500">Not Completed</p>
                      </div>
                    }
                  </div>
                  <div className="flex flex-row items-center gap-2 col-span-3">
                    { claimButtonStatuses[job.id] ?
                    (<button onClick={() => claimBounty(job.id)}
                      className="p-2 border-2 border-gray-300 hover:border-gray-500 group w-full h-full flex flex-row gap-2 bg-white">
                      <TbReportMoney className="stroke-gray-500 group-hover:stroke-gray-600" style={{height: "1.2rem", width: "1.2rem"}} />
                      <p className="text-sm text-gray-500 group-hover:text-gray-600">Claim Bounty?</p>
                    </button>)
                    :
                    <div className="py-2 border-2 border-white w-full h-full flex flex-row gap-2 bg-white">
                      <TbReportMoney className="stroke-gray-500" style={{height: "1.2rem", width: "1.2rem"}} />
                      <p className="text-sm text-gray-500">Bounty Claimed</p>
                    </div>
                    }
                  </div>
                  <div className="flex flex-row items-center gap-2 col-span-3">
                    <button onClick={() => cancelBounty(job.id)} className="p-2 border-2 border-gray-300 hover:border-gray-500 group w-full h-full flex flex-row gap-2 bg-white">
                      <MdOutlineCancel className="fill-gray-500 group-hover:fill-gray-600" style={{height: "1.2rem", width: "1.2rem"}} />
                      <p className="text-sm text-gray-500 group-hover:text-gray-600">Cancel Bounty?</p>
                    </button>
                  </div>
                </div>
              </div>
                 
              ))
            ))}

          {category === "posted" &&
            (filteredPostedBounty.length > 0 && (
              filteredPostedBounty.map((job) => (
                <div
                  className="flex flex-col gap-3 border-2 p-6 rounded-lg border-gray-400"
                  key={job.id}
                >
                  <div className="flex flex-row items-center gap-4">
                    <div>
                    <StorageImage
              alt=""
              path={`public/${job?.createdBy}`}
              fallbackSrc= {mimic}
              onGetUrlError={(error) => console.error(error)}
              className="w-14 bg-gray-300 rounded-md"  />
                    </div>
                    <div className="flex-grow flex flex-col items-start justify-between self-stretch py-1">
                      <p className="text-xl font-semibold">{job.title}</p>
                      <p className="text-sm text-gray-400">{currentUser?.username}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between self-stretch gap-1 py-1">
                      <p className="text-sm text-gray-400">Posted today</p>
                      <button onClick={()=> navigate(`/jobs/${job.id}`)}className="p-1 border-0 border-gray-300 hover:border-gray-500 group flex flex-row gap-2 bg-white">
                        <p className="text-sm text-gray-400 group-hover:text-gray-600">More Details &raquo;</p>
                      </button>
                    </div>
                    
                  </div>
                  <p className="line-clamp-3 text-left" style={{height: "4.5em"}}>
                    {job.content}
                  </p>
                  <hr className="border-t-2 border-gray-300"/>
                  <div className="grid grid-cols-6 items-center gap-2">
                    <div className="flex flex-row items-center gap-2 col-span-3">
                      <CiCalendar className="fill-gray-500" style={{height: "1.2rem", width: "1.2rem"}} />
                      <p className="text-sm text-gray-500 text-left">Date: {job.DateStart} - {job.DateEnd}</p>
                    </div>
                    <div className="flex flex-row items-center gap-2 col-span-3">
                      <CiTimer className="fill-gray-500" style={{height: "1.2rem", width: "1.2rem"}} />
                      <p className="text-sm text-gray-500">Time: {job.timeStart} - {job.timeEnd}</p>
                    </div>
                    <div className="col-span-6">
                      <hr className="border-t-2 border-gray-300"/>
                    </div>
                    <div className="flex flex-row items-center gap-2 col-span-2">
                      <CiMoneyBill className="fill-gray-500" style={{height: "1.2rem", width: "1.2rem"}} />
                      <p className="text-sm text-gray-500">${job.bounty}</p>
                      </div>
                    <div className="flex flex-row items-center gap-2 col-span-2">
                      <CiLocationOn className="fill-gray-500" style={{height: "1.2rem", width: "1.2rem"}} />
                      <p className="text-sm text-gray-500">{job.location}</p>
                    </div>
                    <div className="flex flex-row items-center gap-2 col-span-2">
                      { job.isDone &&
                        <div className="p-2 border-2 border-white w-full h-full flex flex-row gap-2 bg-white">
                          <MdOutlineDoneAll className="fill-gray-500" style={{height: "1.2rem", width: "1.2rem"}} />
                          <p className="text-sm text-gray-500">Complete</p>
                        </div>
                      }
                      { (!job.isDone && job.numBooked!==0) &&
                        <button onClick={() => completeBounty(job.id)} className="p-2 border-2 border-gray-300 hover:border-gray-500 group w-full h-full flex flex-row gap-2 bg-white">
                          <MdOutlineRemoveDone className="fill-gray-500 group-hover:fill-gray-600" style={{height: "1.2rem", width: "1.2rem"}} />
                          <p className="text-sm text-gray-500 group-hover:text-gray-600">Mark as Complete?</p>
                        </button>
                      }
                      { (!job.isDone && job.numBooked===0) &&
                        <div className="p-2 border-2 border-white w-full h-full flex flex-row gap-2 bg-white">
                          <MdOutlineRemoveDone className="fill-gray-500" style={{height: "1.2rem", width: "1.2rem"}} />
                          <p className="text-sm text-gray-500">Not Completed</p>
                        </div>
                      }
                    </div>
                    <div className="flex flex-row items-center gap-2 col-span-4">
                      <IoPeopleOutline className="stroke-gray-500" style={{height: "1.2rem", width: "1.2rem"}} />
                      <p className="text-sm text-gray-500">Positions Filled: {job.numBooked} / {job.numberOfPax}</p>
                    </div>
                    <div className="flex flex-row items-center gap-2 col-span-2">
                      <button onClick={() => deleteBounty(job.id)} className="p-2 border-2 border-gray-300 hover:border-gray-500 group w-full h-full flex flex-row gap-2 bg-white">
                        <MdOutlineDelete className="fill-gray-500 group-hover:fill-gray-600" style={{height: "1.2rem", width: "1.2rem"}} />
                        <p className="text-sm text-gray-500 group-hover:text-gray-600">Delete Bounty?</p>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ))
          }

          {category === "completed" &&
            (filteredCompletedBounty.length > 0 && (
              filteredCompletedBounty.map((job) => (
                <div
                className="flex flex-col gap-3 border-2 p-6 rounded-lg border-gray-400"
                key={job.id}
              >
                <div className="flex flex-row items-center gap-4">
                  <div>
                  <StorageImage
              alt=""
              path={`public/${job?.createdBy}`}
              fallbackSrc= {mimic}
              onGetUrlError={(error) => console.error(error)}
              className="w-14 bg-gray-300 rounded-md" />
                  </div>
                  <div className="flex-grow flex flex-col items-start justify-between self-stretch py-1">
                    <p className="text-xl font-semibold">{job.title}</p>
                    <p className="text-sm text-gray-400">{currentUser?.username}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between self-stretch gap-1 py-1">
                    <p className="text-sm text-gray-400">Posted today</p>
                    <button onClick={()=> navigate(`/jobs/${job.id}`)}className="p-1 border-0 border-gray-300 hover:border-gray-500 group flex flex-row gap-2 bg-white">
                      <p className="text-sm text-gray-400 group-hover:text-gray-600">More Details &raquo;</p>
                    </button>
                  </div>
                  
                </div>
                <p className="line-clamp-3 text-left" style={{height: "4.5em"}}>
                  {job.content}
                </p>
                <hr className="border-t-2 border-gray-300"/>
                <div className="grid grid-cols-6 items-center gap-2">
                  <div className="flex flex-row items-center gap-2 col-span-3">
                    <CiCalendar className="fill-gray-500" style={{height: "1.2rem", width: "1.2rem"}} />
                    <p className="text-sm text-gray-500 text-left">Date: {job.DateStart} - {job.DateEnd}</p>
                  </div>
                  <div className="flex flex-row items-center gap-2 col-span-3">
                    <CiTimer className="fill-gray-500" style={{height: "1.2rem", width: "1.2rem"}} />
                    <p className="text-sm text-gray-500">Time: {job.timeStart} - {job.timeEnd}</p>
                  </div>
                  <div className="col-span-6">
                    <hr className="border-t-2 border-gray-300"/>
                  </div>
                  <div className="flex flex-row items-center gap-2 col-span-2">
                    <CiMoneyBill className="fill-gray-500" style={{height: "1.2rem", width: "1.2rem"}} />
                    <p className="text-sm text-gray-500">${job.bounty}</p>
                    </div>
                  <div className="flex flex-row items-center gap-2 col-span-2">
                    <CiLocationOn className="fill-gray-500" style={{height: "1.2rem", width: "1.2rem"}} />
                    <p className="text-sm text-gray-500">{job.location}</p>
                  </div>
                  
                  <div className="flex flex-row items-center gap-2 col-span-2">
                    { claimButtonStatuses[job.id] ?
                    (<button onClick={() => claimBounty(job.id)}
                      className="p-2 border-2 border-gray-300 hover:border-gray-500 group w-full h-full flex flex-row gap-2 bg-white">
                      <TbReportMoney className="stroke-gray-500 group-hover:stroke-gray-600" style={{height: "1.2rem", width: "1.2rem"}} />
                      <p className="text-sm text-gray-500 group-hover:text-gray-600">Claim Bounty?</p>
                    </button>)
                    :
                    <div className="py-2 border-2 border-white w-full h-full flex flex-row gap-2 bg-white">
                      <TbReportMoney className="stroke-gray-500" style={{height: "1.2rem", width: "1.2rem"}} />
                      <p className="text-sm text-gray-500">Bounty Claimed</p>
                    </div>
                    }
                  </div>
                </div>
              </div>
              ))
            ))}
            </div>
        </div>
      </div>
    </MainTemplate>
  );
};
export default MyJobsPage;
