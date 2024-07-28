import MainTemplate from "../src/components/template/MainTemplate.tsx";
import { Schema } from "../amplify/data/resource.ts";
import { generateClient } from "aws-amplify/data";
import { useState, useEffect } from "react";
import { CiLocationOn, CiMoneyBill, CiCalendar, CiTimer } from "react-icons/ci";
import { TbReportMoney } from "react-icons/tb";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";

const Wallet = () => {
  const client = generateClient<Schema>();
  const { user } = useAuthenticator((context) => [context.user]);
  type User = Schema["User"]["type"];
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // type WalletBalance = Schema['Jobs']['type'];
  const [balance, setWalletBalance] = useState<number | null>(null);


  useEffect(() => {
    const sub = client.models.User.observeQuery().subscribe({
      next: ({ items }) => {
        const fetchedUser = items.find((item) => item.userId === user?.userId);
        if (fetchedUser) {
          setCurrentUser(fetchedUser);
        }
      },
      error: (error) => {
        console.error("Error observing user query", error);
      },
    });
    return () => sub.unsubscribe();
  }, [user]);
  type Bounty = Schema["Jobs"]["type"];

  const [acceptedBounty, setAcceptedBounty] = useState<Bounty[]>([]);
  const [completedBounty, setCompletedBounty] = useState<Bounty[]>([]);

  const [filteredCompletedBounty, setFilteredCompletedBounty] = useState<
    Bounty[]
  >([]);

  const [claimButtonStatuses, setClaimButtonStatuses] = useState<{
    [key: string]: boolean;
  }>({});
  const [search, setSearch] = useState<string>("");

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

  const fetchWalletBalance = async () => {
    if (currentUser && currentUser.walletBalance) {
      const currentBalance = currentUser.walletBalance;
      setWalletBalance(currentBalance);
    } else {
      setWalletBalance(400);
    }
  };
  


  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchWalletBalance();
  }, [currentUser]);

  useEffect(() => {
    const fetchBounties = async () => {
      try {
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
    const result: Bounty[] = completedBounty.filter(
      (job) => job && job.title && job.title.includes(search)
      
    );
    setSearch(search);
    setFilteredCompletedBounty(result);
  }, [search, completedBounty]);

  return (
    <MainTemplate currentNavigation={"wallet"}>
      <div className="flex flex-col gap-4 flex-grow h-full">
        <div className="self-start rounded-lg border-2 p-5 border-gray-300 flex flex-row items-center gap-2 justify-center">
          <CiMoneyBill className="stroke-gray-700 h-8 w-8" />
          <p className="text-gray-700">Balance: ${balance}</p>
        </div>
        <div className="flex flex-col flex-grow overflow-hidden">
          <div className="flex-grow rounded-lg border-2 p-5 border-gray-300 overflow-hidden relative">
            <div className="absolute inset-0 overflow-auto p-2">
              <div className="flex flex-col gap-5 p-3">
                {filteredCompletedBounty.length > 0 &&
                  filteredCompletedBounty.map((job) => (
                    <div
                      className="flex flex-col gap-3 border-2 p-6 rounded-lg border-gray-400"
                      key={job.id}
                    >
                      <div className="flex flex-row items-center gap-4">
                        <div>
                          <img
                            src="../src/assets/Icons/mimic.png"
                            className="w-14 bg-gray-300 rounded-md"
                            alt=""
                          />
                        </div>
                        <div className="flex-grow flex flex-col items-start justify-between self-stretch py-1">
                          <p className="text-xl font-semibold">{job.title}</p>
                          <p className="text-sm text-gray-400">
                            {currentUser?.username}
                          </p>
                        </div>
                        <div className="flex flex-col items-end justify-between self-stretch gap-1 py-1">
                          <p className="text-sm text-gray-400">Posted today</p>
                          <button
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            className="p-1 border-0 border-gray-300 hover:border-gray-500 group flex flex-row gap-2 bg-white"
                          >
                            <p className="text-sm text-gray-400 group-hover:text-gray-600">
                              More Details &raquo;
                            </p>
                          </button>
                        </div>
                      </div>
                      <p
                        className="line-clamp-3 text-left"
                        style={{ height: "4.5em" }}
                      >
                        {job.content}
                      </p>
                      <hr className="border-t-2 border-gray-300" />
                      <div className="grid grid-cols-6 items-center gap-2">
                        <div className="flex flex-row items-center gap-2 col-span-3">
                          <CiCalendar
                            className="fill-gray-500"
                            style={{ height: "1.2rem", width: "1.2rem" }}
                          />
                          <p className="text-sm text-gray-500 text-left">
                            Date: {job.DateStart} - {job.DateEnd}
                          </p>
                        </div>
                        <div className="flex flex-row items-center gap-2 col-span-3">
                          <CiTimer
                            className="fill-gray-500"
                            style={{ height: "1.2rem", width: "1.2rem" }}
                          />
                          <p className="text-sm text-gray-500">
                            Time: {job.timeStart} - {job.timeEnd}
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
                          <p className="text-sm text-gray-500">${job.bounty}</p>
                        </div>
                        <div className="flex flex-row items-center gap-2 col-span-2">
                          <CiLocationOn
                            className="fill-gray-500"
                            style={{ height: "1.2rem", width: "1.2rem" }}
                          />
                          <p className="text-sm text-gray-500">
                            {job.location}
                          </p>
                        </div>

                        <div className="flex flex-row items-center gap-2 col-span-2">
                          {claimButtonStatuses[job.id] ? (
                            <button
                              onClick={() => claimBounty(job.id)}
                              className="p-2 border-2 border-gray-300 hover:border-gray-500 group w-full h-full flex flex-row gap-2 bg-white"
                            >
                              <TbReportMoney
                                className="stroke-gray-500 group-hover:stroke-gray-600"
                                style={{ height: "1.2rem", width: "1.2rem" }}
                              />
                              <p className="text-sm text-gray-500 group-hover:text-gray-600">
                                Claim Bounty?
                              </p>
                            </button>
                          ) : (
                            <div className="py-2 border-2 border-white w-full h-full flex flex-row gap-2 bg-white">
                              <TbReportMoney
                                className="stroke-gray-500"
                                style={{ height: "1.2rem", width: "1.2rem" }}
                              />
                              <p className="text-sm text-gray-500">
                                Bounty Claimed
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                {filteredCompletedBounty.length > 0 &&
                  filteredCompletedBounty.map((job) => (
                    <div
                      className="flex flex-col gap-3 border-2 p-6 rounded-lg border-gray-400"
                      key={job.id}
                    >
                      <div className="flex flex-row items-center gap-4">
                        <div>
                          <img
                            src="../src/assets/Icons/mimic.png"
                            className="w-14 bg-gray-300 rounded-md"
                            alt=""
                          />
                        </div>
                        <div className="flex-grow flex flex-col items-start justify-between self-stretch py-1">
                          <p className="text-xl font-semibold">{job.title}</p>
                          <p className="text-sm text-gray-400">
                            {currentUser?.username}
                          </p>
                        </div>
                        <div className="flex flex-col items-end justify-between self-stretch gap-1 py-1">
                          <p className="text-sm text-gray-400">Posted today</p>
                          <button
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            className="p-1 border-0 border-gray-300 hover:border-gray-500 group flex flex-row gap-2 bg-white"
                          >
                            <p className="text-sm text-gray-400 group-hover:text-gray-600">
                              More Details &raquo;
                            </p>
                          </button>
                        </div>
                      </div>
                      <p
                        className="line-clamp-3 text-left"
                        style={{ height: "4.5em" }}
                      >
                        {job.content}
                      </p>
                      <hr className="border-t-2 border-gray-300" />
                      <div className="grid grid-cols-6 items-center gap-2">
                        <div className="flex flex-row items-center gap-2 col-span-3">
                          <CiCalendar
                            className="fill-gray-500"
                            style={{ height: "1.2rem", width: "1.2rem" }}
                          />
                          <p className="text-sm text-gray-500 text-left">
                            Date: {job.DateStart} - {job.DateEnd}
                          </p>
                        </div>
                        <div className="flex flex-row items-center gap-2 col-span-3">
                          <CiTimer
                            className="fill-gray-500"
                            style={{ height: "1.2rem", width: "1.2rem" }}
                          />
                          <p className="text-sm text-gray-500">
                            Time: {job.timeStart} - {job.timeEnd}
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
                          <p className="text-sm text-gray-500">${job.bounty}</p>
                        </div>
                        <div className="flex flex-row items-center gap-2 col-span-2">
                          <CiLocationOn
                            className="fill-gray-500"
                            style={{ height: "1.2rem", width: "1.2rem" }}
                          />
                          <p className="text-sm text-gray-500">
                            {job.location}
                          </p>
                        </div>

                        <div className="flex flex-row items-center gap-2 col-span-2">
                          {claimButtonStatuses[job.id] ? (
                            <button
                              onClick={() => claimBounty(job.id)}
                              className="p-2 border-2 border-gray-300 hover:border-gray-500 group w-full h-full flex flex-row gap-2 bg-white"
                            >
                              <TbReportMoney
                                className="stroke-gray-500 group-hover:stroke-gray-600"
                                style={{ height: "1.2rem", width: "1.2rem" }}
                              />
                              <p className="text-sm text-gray-500 group-hover:text-gray-600">
                                Claim Bounty?
                              </p>
                            </button>
                          ) : (
                            <div className="py-2 border-2 border-white w-full h-full flex flex-row gap-2 bg-white">
                              <TbReportMoney
                                className="stroke-gray-500"
                                style={{ height: "1.2rem", width: "1.2rem" }}
                              />
                              <p className="text-sm text-gray-500">
                                Bounty Claimed
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                {filteredCompletedBounty.length <= 0 && (
                  <p className="self-center mx-auto text-2xl font-semibold text-gray-500">
                    No jobs available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
};

export default Wallet;
