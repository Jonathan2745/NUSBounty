import { Card, useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { type Schema } from "../amplify/data/resource";
import { NavigationButtons } from "../src/components/NavigationButtons";

const client = generateClient<Schema>();

// Create unique IDs for Jobs //
function makeid(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;

  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// Define the FormData interface
interface FormData {
  title: string;
  content: string;
  numberOfPax: number;
  bounty: number;
  duration: number;
  timeStart: string;
  timeEnd: string;
  DateStart: string;
}

// Define the type for the new job response
interface NewJob {
  jobId?: string | null;
  title?: string | null; // Adjusted to allow for null values
  content?: string | null; // Adjusted to allow for null values
  isDone?: boolean | null;
  numBooked?: number | null; // Adjusted to allow for null values
  numberOfPax?: number | null; // Adjusted to allow for null values
  bounty?: number | null; // Adjusted to allow for null values
  DateCreated?: string | null; // Adjusted to allow for null values
  createdBy?: string | null; // Adjusted to allow for null values
  duration?: number | null; // Adjusted to allow for null values
  timeStart?: string | null; // Adjusted to allow for null values
  timeEnd?: string | null; // Adjusted to allow for null values
  DateStart?: string | null;
  completed?: boolean | null;
}

export const NewJobPage = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue } = useForm<FormData>();
  const [newJob, setNewJob] = useState<NewJob | null>(null);
  const [errors, setErrors] = useState<any>(null);
  const [jobDuration, setDuration] = useState<any>(null);

  const timeStart = watch("timeStart");
  const timeEnd = watch("timeEnd");

  useEffect(() => {
    const updateDuration = () => {
      if (timeStart && timeEnd) {
        const startTime = new Date(`1970-01-01T${timeStart}:00`);
        const endTime = new Date(`1970-01-01T${timeEnd}:00`);

        let diff = (endTime.getTime() - startTime.getTime()) / 1000;

        if (diff < 0) {
          diff += 24 * 60 * 60; // adjust for times past midnight
        }

        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const duration = hours * 60 + minutes;

        setValue("duration", duration);
        setDuration(duration);
      }
    };

    updateDuration();
  }, [timeStart, timeEnd, setValue]);

  const onSubmit = async (formData: FormData) => {
    if (authStatus !== "authenticated") {
      console.error("User is not authenticated");
      return;
    }

    try {
      const createdId: string = makeid(16);
      const { errors, data: newJob } = await client.models.Jobs.create({
        jobId: createdId,
        title: formData.content,
        content: formData.content,
        isDone: false,
        numBooked: 0,
        numberOfPax: formData.numberOfPax,
        bounty: formData.bounty,
        DateCreated: new Date().toISOString(),
        createdBy: user.username,
        duration: jobDuration,
        timeStart: formData.timeStart,
        timeEnd: formData.timeEnd,
        DateStart: formData.DateStart,
        completed: false,
      });
      setNewJob(newJob);
      setErrors(errors);
      navigate("/jobs");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="m-5 flex flex-col">
      <div className="flex flex-col items-center justify-center m-5">
        <Card
          key="1"
          borderRadius="medium"
          variation="outlined"
          className="flex flex-col items-center justify-center"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <div className="flex flex-col gap-1">
              <label>Title:</label>
              <input
                className="border-2 border-gray-400 rounded text-center"
                placeholder="Title"
                {...register("title")}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label>Content:</label>
              <textarea
                className="border-2 border-gray-400 rounded text-center"
                placeholder="Content"
                {...register("content")}
                required
              />
            </div>
            <div className="flex flex-row gap-4 justify-center">
              <div className="flex flex-col gap-1">
                <label>Number of Pax Required:</label>
                <input
                  className="border-2 border-gray-400 rounded text-center"
                  placeholder="Number of Pax"
                  {...register("numberOfPax", { valueAsNumber: true })}
                  type="number"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label>Bounty:</label>
                <input
                  className="border-2 border-gray-400 rounded text-center"
                  placeholder="Bounty"
                  {...register("bounty", { valueAsNumber: true })}
                  type="number"
                  required
                />
              </div>
            </div>
            <div>
              <label>Date:</label>
              <input {...register("DateStart")} type="date" required />
            </div>

            <div className="flex flex-row gap-4 justify-center">
              <div>
                <label>Start Time:</label>
                <input {...register("timeStart")} type="time" required />
              </div>
              <div>
                <label>End Time:</label>
                <input {...register("timeEnd")} type="time" required />
              </div>
            </div>
            <div>
              <label>Duration:</label>
              <span>{jobDuration} Minutes</span>
            </div>
            <button type="submit">Create Post</button>

            {errors && <div>Error: {JSON.stringify(errors)}</div>}
            {newJob && <div>New Job Created: {JSON.stringify(newJob)}</div>}
          </form>
        </Card>
      </div>
      <NavigationButtons />
    </div>
  );
};
