import React, { useState } from 'react';
import { 
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    gql,
    useQuery,
    useMutation,
    useSubscription
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import styled from 'styled-components';

const GET_MESSAGES = gql`
subscription {
  messages {
    id
    content
    user
  }
}`;

const POST_MESSAGE = gql`
  mutation ($user: String!, $content: String!){
    postMessage(user: $user, content: $content)
  }`;


const Button = styled.button`
  
  border-radius: 3px;
  border: 1px solid #FFFFFF;
  background: #ffffff;
  box-shadow:  10px 10px 20px #d9d9d9, -10px -10px 20px #ffffff;
`;
// from here to there is neumorphism UI
const Container = styled.div`
  background-color: #E0E5EC;
  align-center: {
    text-align: center
  }
`

const NewButtonShape1 = styled.button`
  border-radius: 50px;
  margin-left: auto;
  margin-right: auto;
  margin-right: 30px;
  margin-top:100px;
  margin-bottom:100px;
  width:150px;
  height:150px;
  background-color:#E0E5EC;
  box-shadow: 9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px    rgba(255,255,255, 0.5);
  border: none;
  outline: none;

  &:focus {
    box-shadow: none;
  }

`
const NewButtonShape2 = styled.button`
  border-radius: 50px;
  margin-left: auto;
  margin-right: 30px;
  margin-top:100px;
  margin-bottom:100px;
  width:150px;
  height:150px;
  background: linear-gradient(145deg, #caced4, #f0f5fd);
  box-shadow: 9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px    rgba(255,255,255, 0.5);
  border: none;
  outline: none;

  &:focus {
    box-shadow: none;
  }

`
const NewButtonShape3 = styled.button`
  border-radius: 50px;
  margin-left: auto;
  margin-top:100px;
  margin-right: 30px;
  margin-bottom:100px;
  width:150px;
  height:150px;
  background: linear-gradient(145deg, #f0f5fd, #caced4);
  box-shadow: 9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px    rgba(255,255,255, 0.5);
  border: none;
  outline: none;

  &:focus {
    box-shadow: none;
  }

`
const NewButtonShape4 = styled.button`
  border-radius: 50px;
  margin-left: auto;
  margin-top:100px;
  margin-right: 30px;
  margin-bottom:100px;
  width:150px;
  height:150px;
  background-color:#E0E5EC;
  box-shadow: inset 20px 20px 60px #bec3c9,
            inset -20px -20px 60px #ffffff;
  border: none;
  outline: none;

  &: focus {
    box-shadow: none;
  }

`

const Input = styled.input`
  border-radius: 5px;
  margin-right: 30px;
  margin-top: 30px;
  border: 1px solid #FFFFFF;
  background: #ffffff;
  box-shadow:  10px 10px 20px #d9d9d9, -10px -10px 20px #ffffff;
  font-size: 12pt;
  text-align: left;
  color: #63717f;
`;

const link = new WebSocketLink({
  uri: 'ws://localhost:4000/',
  options: {
    reconnect: true
  }
});

const client = new ApolloClient({
    link,
    uri: "http://localhost:4000/",
    cache: new InMemoryCache()
});

const Messages = ({ user }) => {
    const  { data } = useSubscription(GET_MESSAGES);
    if( !data ) {
        return null;
    }

    return (
        <>
              
          { data.messages.map(({ id, user: messageUser, content }) => (
              <div 
                style={{
                    display: 'flex',
                    justifyContent: user === messageUser ? "flex-end" : "flex-start",
                    paddingBottom: "1em",
                }}
              >
              { user !== messageUser && (
                  <div 
                  style={{
                      height: 50,
                          width: 50,
                          marginRight: '0.5em', 
                          border: '2px solid #e5e6ea',
                          borderRadius: 25,
                          textAlign: "center",
                          fontSize: "18pt",
                          paddingTop: 5,
                  }}
                  >   
                  {
                      messageUser.slice(0, 2).toUpperCase()
                  }
                  </div>
              )}

              <div
                style={{
                    background: user === messageUser ? "#58bf56" : "#e5e6ea",
                    color: user === messageUser ? "white" : "black",
                    padding: "1em",
                    borderRadius: "1em",
                    maxWidth: "60%",
                }}
              >
                { content }
             </div>  
            </div>
          ))}
        </>
        )
}


const Chat = () => {
    const [state, stateSet] = React.useState({
        user: "Jack",
        content: '',
    })
    const [postMessage] = useMutation(POST_MESSAGE);
    const onSend = () => {
        if(state.content.length > 0) {
          postMessage({ 
              variables: state,
          })
        }
        stateSet({
            ...state,
            content: "",
        })
      
    }
    return (
        <div>
            <Container>
                <NewButtonShape1>1.</NewButtonShape1>
                <NewButtonShape2>2.</NewButtonShape2>
                <NewButtonShape3>3.</NewButtonShape3>
                <NewButtonShape4>4.</NewButtonShape4>
            </Container>
            <Messages user={state.user}/>
            <Input
                label="User"
                value={state.user}
                onChange={(evt) => stateSet({
                    ...state,
                    user: evt.target.value,
                })}/>
            <Input
                label="Content"
                value={state.content}
                onChange={(evt) => stateSet({
                    ...state,
                    content: evt.target.value,
                })}
                onKeyUp={(evt) => {
                    if( evt.keyCode == 13) {
                        onSend()
                    }}}
            />
                <Button onClick={()=> onSend()}>Send</Button>
        </div>
  )
}

export default () => (
  <ApolloProvider client={client}>
      <Chat />
  </ApolloProvider>
)
