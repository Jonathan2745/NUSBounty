// // import { defineAuth } from '@aws-amplify/backend';

// // /**
// //  * Define and configure your auth resource
// //  * @see https://docs.amplify.aws/gen2/build-a-backend/auth
// //  */
// // export const auth = defineAuth({
// //   loginWith: {
// //     email: true,
// //   },
// // });


// import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// import { defineAuth } from "@aws-amplify/backend"

// /**
//  * Define and configure your auth resource
//  * @see https://docs.amplify.aws/gen2/build-a-backend/auth
//  */
// export const auth = defineAuth({
//   loginWith: {
//     email: true,
//   },
// })

// const schema = a.schema({
//   Todo: a
//     .model({
//       content: a.string(),
//       isDone: a.boolean()
//     })
//     .authorization(allow => [allow.owner()])
// });

// export type Schema = ClientSchema<typeof schema>;

// export const data = defineData({
//   schema,
//   authorizationModes: {
//     defaultAuthorizationMode: 'userPool'
//   }
// });


import { defineAuth } from "@aws-amplify/backend"

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
})