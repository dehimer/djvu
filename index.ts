import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onChildAdded, child, push, update} from "firebase/database";

import * as readline from 'readline';
import * as colors from 'colors';

const firebaseApp = initializeApp({
  apiKey: "AIzaSyDIU4aipsb4TpwLra2Yts7qrKaTPwdkJCw",
  authDomain: "djvu-b393d.firebaseapp.com",
  projectId: "djvu-b393d",
  storageBucket: "djvu-b393d.appspot.com",
  messagingSenderId: "191172952226",
  appId: "1:191172952226:web:54d4699f42bce6388257fb",
  databaseURL: 'https://djvu-b393d-default-rtdb.firebaseio.com/'
});
const db = getDatabase(firebaseApp);

const chatsRef = ref(db, 'chats');

const rl = readline.createInterface(process.stdin, process.stdout);

// Logs a message keeping prompt on last line
function log(message: string) {
  readline.cursorTo(process.stdout, 0, undefined);
  console.log(message);
  rl.prompt(true);
}

// Read input line from user and delete it from console
function prompt(message: string) {
  return new Promise<string>(resolve => {
    rl.question(message, userInput => {
      readline.moveCursor(process.stdout, 0, -1);
      readline.clearLine(process.stdout, 0);
      resolve(userInput);
    });
  });
}

(async () => {
  // Get user name
  const userName = (await prompt('Your name (anonymous): ')).trim() || 'anonymous';

  // Write new messages to console
  onChildAdded(chatsRef, snapshot => {
    const message = snapshot!.val();
    log(`${colors.yellow(message.user)}: ${message.text}`);
  });

  // Prompt for messages to send
  while (true) {
    const newMsgKey = push(child(ref(db), 'chats')).key;
    const updates = {};
    updates['/chats/' + newMsgKey] = {
      text: await prompt('> '),
      user: userName,
    };

    update(ref(db), updates);
  }
})();
