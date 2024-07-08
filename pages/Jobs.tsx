import { NavigationButtons } from "../src/components/NavigationButtons";
import { useNavigate } from "react-router-dom";

import { Collection, Card, Heading, View, Divider, Button } from '@aws-amplify/ui-react';
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { SearchField } from "@aws-amplify/ui-react";
import * as React from 'react';

import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../amplify/data/resource';
import { useState, useEffect } from 'react';


const client = generateClient<Schema>();




export const JobPage = () => {
  
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
    duration?: number | null; // Adjusted to allow for null values
    timeStart?: string | null; // Adjusted to allow for null values
    timeEnd?: string | null; // Adjusted to allow for null values
  }


    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const searchButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const navigate = useNavigate();
  
    const onClick = React.useCallback(() => {
      if( inputRef.current ){
        inputRef.current.focus();
      alert(`You searched for: ${inputRef.current.value}`);
      }
    }, []);
  
    React.useEffect(() => {
      const searchButtonRefCurrent = searchButtonRef.current;
      if (searchButtonRef && searchButtonRefCurrent) {
        // Note: this example is contrived to demonstrate using refs.
        // Use the `onSubmit` prop on `SearchField` instead which
        // responds to input field `Enter` keypresses and Submit button clicks.
        searchButtonRefCurrent.addEventListener('click', onClick, false);
        return () => {
          searchButtonRefCurrent.removeEventListener('click', onClick, false);
        };
      }
    }, [onClick]);


      const [Jobs, setPosts] = useState<Jobs[]>([]);
        
      useEffect(() => {
        const fetchPosts = async () => {
          try { 
            const { data: fetchedJobs } = await client.models.Jobs.list();
            setPosts(fetchedJobs);
          } catch (error) {
            console.error('Error fetching posts: ', error);
          }
        
        };
      
        fetchPosts();
      }, []);

      


    // const items = [
    //     {
    //       title: 'Test Job #1',
    //       badges: ['High Pay', 'Verified'],
    //     },
    //     {
    //       title: 'Test Job #2',
    //       badges: ['Low Commitment', 'Verified'],
    //     },
    //   ];
      
    const handleClick = () => {
        alert("Not Implemented Yet!");
      };

    const handleNewJobs = () => {
      navigate("/jobs/new");
    }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl mb-6 font-semibold">Jobs</h1>
      <NavigationButtons />
      <button
        onClick={handleNewJobs}
        className="bg-amplify-teal px-5 py-3 rounded-md"
      >
        New Job
      </button>
      <SearchField label="Password" ref={inputRef} searchButtonRef={searchButtonRef} />
      <Collection
        items={Jobs}
        type="list"
        direction="row"
        gap="20px"
        wrap="nowrap"
      >
        {(item, index) => (
          <Card
            key={index}
            borderRadius="medium"
            maxWidth="20rem"
            variation="outlined"
          >
            <StorageImage
              path = "public/cat.jpg"
              alt="Cat"
              width="100px"
              height="auto"
            />
            <View padding="xs">
              {/* <Flex>
                {item.badges.map((badge) => (
                  <Badge
                    key={badge}
                    backgroundColor={
                      badge === 'Waterfront' ? 'blue.40' 
                      : badge === 'Mountain' ? 'green.40' : 'yellow.40'}
                  >
                    {badge}
                  </Badge>
                ))}
              </Flex> */}
              <Divider padding="xs" />
              <Heading padding="medium">{item.title}</Heading>
              <Button variation="primary" isFullWidth onClick={handleClick}>
                Book it
              </Button>
            </View>
          </Card>
        )}
      </Collection>
      <ul className="divide-y divide-gray-200">
        {Jobs.map(job => (
          <li key={job.id} className="py-4">
            <div className="flex space-x-3">
              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                <p className="text-gray-500">{job.content}</p>
                <p className="text-sm text-gray-500">Created by: {job.createdBy}</p>
                {/* Add more job details as needed */}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};


