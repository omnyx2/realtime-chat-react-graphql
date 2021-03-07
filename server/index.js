
import { GraphQLServer, PubSub } from "graphql-yoga";

const messages =[]
const typeDefs = `
  type Meassage {
    id: ID!
    user: String!
    content: String!
  }

  type Query {
    messages: [Meassage!]
  }

  type Mutation {
    postMessage(user: String!, content: String!): ID!
  }

  type Subscription {
    messages: [Meassage!]
  }
`;

const subscribers = [];
const onMessagesUpdates =(fn) =>subscribers.push(fn)

const resolvers = {
  Query: {
      messages: () => messages,
  },
  Mutation: {
      postMessage: (_, { user, content}) => {
          const id = messages.length;
          messages.push({
              id,
              user,
              content,
          });
          subscribers.forEach((fn) => fn())
          return id;
      }
  },
  Subscription: {
      messages: {
          subscribe: (_, args, { pubsub }) => {
              const channel = Math.random().toString(36).slice(2, 15);
              onMessagesUpdates(() => pubsub.publish(channel, { messages }))
              console.log(channel)
              setTimeout(() => pubsub.publish(channel, {messages}), 0)
              return pubsub.asyncIterator(channel)
          } 
      }
  }
}
const pubsub = new PubSub()
const server = new GraphQLServer({typeDefs, resolvers, context: { pubsub }});
server.start(({ port}) => {
    console.log(`Server on http://localhost:${port}/`);
})
