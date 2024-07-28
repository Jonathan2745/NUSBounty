import { useNavigate } from "react-router-dom";

import { SearchField } from "@aws-amplify/ui-react";
import * as React from "react";
import { CiLocationOn, CiMoneyBill, CiCalendar, CiTimer } from "react-icons/ci";
import { TbReport } from "react-icons/tb";

import { generateClient } from "aws-amplify/data";
import { type Schema } from "../amplify/data/resource";
import { useState, useEffect } from "react";
import MainTemplate from "../src/components/template/MainTemplate.tsx";

const client = generateClient<Schema>();

const JobPage = () => {
  interface Jobs {
    id: string;
    createdAt: string;
    updatedAt: string;
    title?: string | null; // Adjusted to allow for null values
    content?: string | null; // Adjusted to allow for null values
    numBooked?: number | null; // Adjusted to allow for null values
    numberOfPax?: number | null; // Adjusted to allow for null values
    bounty?: number | null; // Adjusted to allow for null values
    DateCreated?: string | null; // Adjusted to allow for null values
    createdBy?: string | null; // Adjusted to allow for null values
    createdByDisplayed?: string | null;
    duration?: number | null; // Adjusted to allow for null values
    timeStart?: string | null; // Adjusted to allow for null values
    timeEnd?: string | null; // Adjusted to allow for null values
    DateStart?: string | null;
  }

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const searchButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  type Bounty = Schema["Jobs"]["type"];
  const [Jobs, setPosts] = useState<Jobs[]>([]);

  // Search feature, UNIMPLEMENTED YET -- to return inputRef into a filter //
  const onClick = React.useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      alert(`You searched for: ${inputRef.current.value}`);
    }
  }, []);

  // Function that updates search when clicked //
  React.useEffect(() => {
    const searchButtonRefCurrent = searchButtonRef.current;
    if (searchButtonRef && searchButtonRefCurrent) {
      // Note: this example is contrived to demonstrate using refs.
      // Use the `onSubmit` prop on `SearchField` instead which
      // responds to input field `Enter` keypresses and Submit button clicks.
      searchButtonRefCurrent.addEventListener("click", onClick, false);
      return () => {
        searchButtonRefCurrent.removeEventListener("click", onClick, false);
      };
    }
  }, [onClick]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: fetchedJobs } = await client.models.Jobs.list();
        fetchedJobs.sort((a: Bounty, b: Bounty) =>
          b.createdAt.localeCompare(a.createdAt)
        );
        setPosts(fetchedJobs);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, []);

  const navigateToJobDetils = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleNewJobs = () => {
    navigate("/newjob");
  };
  const [search, setSearch] = useState<string>("");
  const [filteredJobs, setFilteredJobs] = useState<Bounty[]>([]);

  useEffect(() => {
    const result: Bounty[] = Jobs.filter(
      (job) => job && job.title && job.title.includes(search)
    );
    setFilteredJobs(result);
  }, [search, Jobs]);

  return (
    <MainTemplate currentNavigation={"jobs"}>
      <div className="flex flex-col items-stretch justify-start flex-grow gap-8">
        <div className="flex flex-row gap-6">
          <SearchField
            label="Search"
            labelHidden
            textAlign={"start"}
            className="flex-grow"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button 
            onClick={handleNewJobs}>
            Create Job
          </button>
        </div>
        <div className="grid grid-cols-5 gap-5">
          <div className="col-span-5 grid grid-flow-row gap-5">
            {filteredJobs.length > 0 &&
              filteredJobs.map((job) => (
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
                        {job.createdByDisplayed}
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
                      <p className="text-sm text-gray-500">{job.location}</p>
                    </div>
                    <div className="flex flex-row items-center gap-2 col-span-2">
                      <button
                        onClick={() => navigateToJobDetils(job.id)}
                        className="p-2 border-2 border-gray-300 hover:border-gray-500 group w-full h-full flex flex-row gap-2 bg-white"
                      >
                        <TbReport
                          className="stroke-gray-500 group-hover:stroke-gray-600"
                          style={{ height: "1.2rem", width: "1.2rem" }}
                        />
                        <p className="text-sm text-gray-500 group-hover:text-gray-600">
                          Book it?
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col items-center justify-center h-screen overflow-y-auto">
      <h1 className="text-5xl mb-6 font-semibold">Jobs</h1>
      <button
        onClick={handleNewJobs}
        className="bg-amplify-teal px-5 py-3 rounded-md mb-4"
      >
        New Job
      </button>
      <h1 className="text-5xl mb-6 font-semibold"> Latest Jobs </h1>
      <Collection
        items={Jobs.slice(0,5)}
        type="list"
        direction="row"
        gap="20px"
        wrap="nowrap"
        margin = "20px"
        >
        {(item, index) => (
          <Card
            key={index}
            borderRadius="medium"
            minWidth="12rem"
            maxWidth="12rem"
            minHeight="16rem"
            maxHeight="16rem"
            variation="outlined"
            className="relative"

          >
            <StorageImage
              path = "public/cat.jpg"
              alt="Cat"
              width="100px"
              height="100px"
            />
            <View padding="s">
              <Divider padding="xs" />
              <Heading padding="medium">{item.title}</Heading>
              <p className="text-sm text-gray-500">Date: {item.DateStart}</p>
              <p className="text-gray-500">Bounty: ${item.bounty}</p>
              <p className="text-sm text-gray-500">Start Time: {item.timeStart}</p>
              <p className="text-sm text-gray-500">End Time: {item.timeEnd}</p>
              <Divider padding= "s" />
              <Button variation="primary" width="10rem"  onClick={() =>navigateToJobDetils(item.id)} className="absolute bottom-16 left-4 right-0" style={{ bottom: '4px' }}>
                Book it
              </Button>
            </View>
          </Card>
        )}
      </Collection>
      <h1 className="text-5xl mb-6 font-semibold"> Find your bounty !</h1>
      <SearchField label="Password" ref={inputRef} searchButtonRef={searchButtonRef} className="mb-4" />
      <ul className="divide-y divide-gray-200 w-full px-4">
        {Jobs.map(job => (
          <li key={job.id} className="py-4">
            <div className="flex space-x-3">
              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                <p className="text-gray-500">{job.content}</p>
                <p className="text-gray-500">Bounty: ${job.bounty}</p>
                <p className="text-gray-500">Date: {job.DateStart}</p>
                <p className="text-sm text-gray-500">Start Time: {job.timeStart}</p>
                <p className="text-sm text-gray-500">End Time: {job.timeEnd}</p>
                <p className="text-sm text-gray-500">Created by: {job.createdByDisplayed}</p>
                {/* Add more job details as needed }
                <Button variation="primary" width="10rem"  onClick={() =>navigateToJobDetils(job.id)} className="right-0" style={{ bottom: '4px' }}>
                Book it
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div> */}
    </MainTemplate>
  );
};

export default JobPage;
