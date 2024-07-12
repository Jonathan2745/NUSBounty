import { NavigationButtons } from "../src/components/NavigationButtons";
import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../amplify/data/resource';
import { useForm } from 'react-hook-form';
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";

const client = generateClient<Schema>();

// Create unique IDs for Jobs //
function makeid(length:number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
  isDone? : boolean | null;
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
  const { authStatus } = useAuthenticator(context => [context.authStatus]);

  const navigate = useNavigate();


  const { register, handleSubmit, watch, setValue } = useForm<FormData>();
  const [newJob, setNewJob] = useState<NewJob | null>(null);
  const [errors, setErrors] = useState<any>(null);
  const [jobDuration, setDuration] = useState<any>(null);

  const timeStart = watch('timeStart');
  const timeEnd = watch('timeEnd');

  useEffect(() => {
    const updateDuration = () => {
    if (timeStart && timeEnd) {
      const startTime = new Date(`1970-01-01T${timeStart}:00`);
      const endTime = new Date(`1970-01-01T${timeEnd}:00`);

      let diff = (endTime.getTime() - startTime.getTime()) / 1000;

      if (diff < 0) {
        diff += 24*60*60; // adjust for times past midnight
      }

      const hours = Math.floor(diff / 3600 );
      const minutes = Math.floor((diff % 3600) / 60);
      const duration = hours*60 + minutes;

      setValue('duration', duration);
      setDuration(duration);
    }
  };
  
    updateDuration();
  },[timeStart, timeEnd, setValue]);


  const onSubmit = async (formData: FormData) => {
    if (authStatus !== 'authenticated') {
      console.error('User is not authenticated');
      return;
    }

    try {
      const createdId:string = makeid(16);
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
      navigate('/jobs');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
      <div>
          <label>Title:</label>
          <input {...register('title')} required />
        </div>
        <div>
          <label>Content:</label>
          <input {...register('content')} required />
        </div>
        <div>
          <label>Number of Pax Required:</label>
          <input {...register('numberOfPax', { valueAsNumber: true })} type="number" required />
        </div>
        <div>
          <label>Bounty:</label>
          <input {...register('bounty', { valueAsNumber: true })} type="number" required />
        </div>

        <div>
          <label>Date:</label>
          <input {...register('DateStart')} type="date" required />
        </div>

        <div>
          <label>Start Time:</label>
          <input {...register('timeStart')} type="time" required />
        </div>
        <div>
          <label>End Time:</label>
          <input {...register('timeEnd')} type="time" required />
        </div>
        <div>
          <label>Duration:</label>
          <span>{jobDuration} Minutes</span>
        </div>
        <button type="submit">Create Post</button>

        {errors && <div>Error: {JSON.stringify(errors)}</div>}
        {newJob && <div>New Job Created: {JSON.stringify(newJob)}</div>}
      </form>
      <NavigationButtons />
    </div>
  );
};
