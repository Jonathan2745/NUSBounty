import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Jobs: a.model({
      jobId: a.string(),
      title: a.string(),
      content: a.string(),
      isDone: a.boolean(),
      numBooked: a.integer(),
      numberOfPax: a.integer(),
      bounty: a.integer(),
      DateCreated: a.datetime(),
      createdBy: a.string(),
      createdByDisplayed: a.string(),
      duration: a.integer(),
      timeStart: a.time(),
      timeEnd: a.time(),
      DateStart: a.date(),
      DateEnd: a.date(),
      userToClaim : a.id().array(),
      acceptedBy: a.id().array(),
      location: a.string(),
    })
    .authorization((allow) => [allow.authenticated()]),

  User: a.model({
    userId: a.id().required(),
    username: a.string(),
    email: a.email(),
    phoneNumber: a.phone(),
    walletBalance: a.integer(),
    bankName: a.string(),
    bankNumber: a.integer(),
    acceptedJobs: a.id().array(),
    notifications: a.string().array(),
    bio: a.string(),
  })
  .identifier(['userId'])
  .authorization((allow) => [allow.owner()]),

  Notifications: a.model({
      content: a.string(),
      isDone: a.boolean(),
      Userfor: a.id().required(),
    })
    .authorization(allow => [allow.authenticated()]),

});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
