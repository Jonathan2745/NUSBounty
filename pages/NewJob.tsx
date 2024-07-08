import { NavigationButtons } from "../src/components/NavigationButtons";
import { useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../amplify/data/resource';
import { useForm } from 'react-hook-form';
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";

const client = generateClient<Schema>();

// Define the FormData interface
interface FormData {
  content: string;
  numBooked: number;
  bounty: number;
  duration: number;
  timeStart: string; 
  timeEnd: string;
}

// Define the type for the new job response
interface NewJob {
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
  duration?: number | null; // Adjusted to allow for null values
  timeStart?: string | null; // Adjusted to allow for null values
  timeEnd?: string | null; // Adjusted to allow for null values
}

export const NewJobPage = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const { authStatus } = useAuthenticator(context => [context.authStatus]);

  const navigate = useNavigate();


  const { register, handleSubmit } = useForm<FormData>();
  const [newJob, setNewJob] = useState<NewJob | null>(null);
  const [errors, setErrors] = useState<any>(null);

  const onSubmit = async (formData: FormData) => {
    if (authStatus !== 'authenticated') {
      console.error('User is not authenticated');
      return;
    }

    try {
      const { errors, data: newJob } = await client.models.Jobs.create({
        content: formData.content,
        isDone: false,
        numBooked: formData.numBooked,
        numberOfPax: 0,
        bounty: formData.bounty,
        DateCreated: new Date().toISOString(),
        createdBy: user.username, 
        duration: formData.duration,
        timeStart: formData.timeStart,
        timeEnd: formData.timeEnd,
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
          <label>Content:</label>
          <input {...register('content')} required />
        </div>
        <div>
          <label>Number of Pax Required:</label>
          <input {...register('numBooked', { valueAsNumber: true })} type="number" required />
        </div>
        <div>
          <label>Bounty:</label>
          <input {...register('bounty', { valueAsNumber: true })} type="number" required />
        </div>
        <div>
          <label>Duration:</label>
          <input {...register('duration', { valueAsNumber: true })} type="number" required />
        </div>
        <div>
          <label>Start Time:</label>
          <input {...register('timeStart')} type="time" required />
        </div>
        <div>
          <label>End Time:</label>
          <input {...register('timeEnd')} type="time" required />
        </div>
        <button type="submit">Create Post</button>

        {errors && <div>Error: {JSON.stringify(errors)}</div>}
        {newJob && <div>New Job Created: {JSON.stringify(newJob)}</div>}
      </form>
      <NavigationButtons />
    </div>
  );
};
