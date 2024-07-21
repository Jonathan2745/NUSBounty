import { Button, Flex, Input, Label, useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { type Schema } from "../amplify/data/resource";
import MainTemplate from "../src/components/template/MainTemplate";

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
}

export const NewJobPage = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  const navigate = useNavigate();

  // Declaration of useStates and types used for NewJobpage
  const { register, handleSubmit, watch, setValue } = useForm<FormData>();
  const [newJob, setNewJob] = useState<NewJob | null>(null);
  const [errors, setErrors] = useState<any>(null);
  const [jobDuration, setDuration] = useState<any>(null);
  
  type User = Schema['User']['type'];
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  


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
  
  useEffect(() => {
    fetchCurrentUser();
  }, []);
  

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
      if ( currentUser?.walletBalance ){
        const updatedBalance = currentUser?.walletBalance - (formData.bounty * formData.numberOfPax);
        if ( updatedBalance < 0 ){
          alert("User has Insufficent Balance to perform this booking");
          return;
        } else {
          const updatedUser = {
            userId : currentUser.userId,
            walletBalance: updatedBalance,
          };
          console.log("Original Balance: ", currentUser.walletBalance);
          console.log("Updated Balance: ", updatedBalance);
          console.log("Current User: ", user.userId);
          try {
            const { data: updatedUsers } = await client.models.User.update(updatedUser);
            console.log("Updated users wallet: ", updatedUser);
            setCurrentUser(updatedUsers);
          } catch (error) {
            console.error("Error updating user", error);
          }
        }
      } else {
        prompt("Error: User not logged in or has not initialised wallet.");
        return;
      }
    } catch (error) {
      console.error("Error updating user", error);
      return;
    }
    

    try {
      const createdId: string = makeid(16);
      const { errors, data: newJob } = await client.models.Jobs.create({
        jobId: createdId,
        title: formData.title,
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
      });

      
      setNewJob(newJob);
      setErrors(errors);
      // Send notification to current user //
      try {
        const newNotification = {
            content: `Created Job ${newJob?.jobId}`,
            isDone: false,
            Userfor: currentUser.userId,
        }

        await client.models.Notifications.create(newNotification);
        console.log('Notification created:', newNotification);
      } catch (error) {
          console.error('Error creating notification:', error);
      }

    } catch (err) {
      console.error(err);
    }
    navigate("/jobs");

  };

  return (
    <MainTemplate>
    <div className="m-5 flex flex-col">
      <div className="flex flex-col items-center justify-center m-5">
        <Flex>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <div className="flex flex-col gap-1">
              <Label>Title:</Label>
              <Input
                className=""
                placeholder="Title"
                {...register("title")}
                isRequired
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Content:</Label>
              <Input
                placeholder="Content"
                {...register("content")}
                isRequired
              />
            </div>
            <div className="flex flex-row gap-4 justify-center">
              <div className="flex flex-col gap-1">
                <Label>Number of Pax Required:</Label>
                <Input
                  placeholder="Number of Pax"
                  {...register("numberOfPax", { valueAsNumber: true })}
                  type="number"
                  isRequired
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Bounty per pax:</Label>
                <Input
                  placeholder="Bounty"
                  {...register("bounty", { valueAsNumber: true })}
                  type="number"
                  isRequired
                />
              </div>
            </div>
            <div>
              <Label>Date:</Label>
              <Input {...register("DateStart")} type="date" isRequired />
            </div>

            <div className="flex flex-row gap-4 justify-center">
              <div className="flex flex-col flex-grow">
                <Label>Start Time:</Label>
                <Input {...register("timeStart")} type="time" isRequired />
              </div>
              <div className="flex flex-col flex-grow">
                <Label>End Time:</Label>
                <Input {...register("timeEnd")} type="time" isRequired />
              </div>
            </div>
            <div>
              <Label>Duration:</Label>
              <span>{jobDuration} Minutes</span>
            </div>
            <Button type="submit" variation="primary">Create Post</Button>

            {errors && <div>Error: {JSON.stringify(errors)}</div>}
            {newJob && <div>New Job Created: {JSON.stringify(newJob)}</div>}
          </form>
        </Flex>
      </div>

    </div>
    </MainTemplate>
  );
};
