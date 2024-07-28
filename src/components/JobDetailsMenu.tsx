// import { generateClient } from "aws-amplify/api";  
// import { type Schema } from '../../amplify/data/resource'
// import { useState } from "react";
// import { useAuthenticator } from "@aws-amplify/ui-react";

// const client = generateClient<Schema>();

// export const JobDetailsMenu = ( selectedJob :  ) => {
//   type Bounty = Schema["Jobs"]["type"];
//   const { user } = useAuthenticator((context) => [context.user]);

//   const [currentJob, setCurrentJob] = useState<Bounty>(); 
//   const { jobId } = selectedJob;
//   const fetchJob = async () => {
//     const { data : currentlySelectedJob } = await client.models.Jobs.get({
//       id: jobId,
//     })
//   }
// }