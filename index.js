const admin = require('firebase-admin');
const readline = require('readline');
const serviceAccount = require('./fffyggghiii.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://wavee-9124f-default-rtdb.firebaseio.com/'
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const resetStyle = '\x1b[0m';
const boldStyle = '\x1b[1m';
const yellowStyle = '\x1b[33m';
const bgBlueStyle = '\x1b[44m';

console.clear();

console.log();
console.log(`${bgBlueStyle}${boldStyle}WAVEE ADMIN COMMAND PANEL (v1)${resetStyle}\x0a`);
console.log(`${boldStyle}Admin Actions:${resetStyle}`);
console.log(`  ${yellowStyle}1${resetStyle}.\x20Change\x20User's\x20Username`);
console.log(`  ${yellowStyle}2${resetStyle}.\x20Change\x20a\x20User's\x20Email`);
console.log(`  ${yellowStyle}3${resetStyle}.\x20Change\x20a\x20User's\x20Password`);
console.log(`  ${yellowStyle}4${resetStyle}.\x20Disable/Undisable\x20Account`);
console.log(`  ${yellowStyle}5${resetStyle}.\x20Search\x20For\x20a\x20User`);
console.log(`  ${yellowStyle}6${resetStyle}.\x20List\x20Users`);
console.log(`  ${yellowStyle}7${resetStyle}.\x20Add\x20Verified\x20User`);
console.log(`  ${yellowStyle}8${resetStyle}.\x20Remove\x20Verified\x20User`);
console.log(`  ${yellowStyle}Q${resetStyle}.\x20Quit\x0a`);

function updatePassword() {
  rl.question('Enter the User ID of the user whose password you want to update:\x20', userId => {
    rl.question('Enter the New Password For The User (Case Sensitive):\x20', newPassword => {
      admin.auth().updateUser(userId, { 'password': newPassword })
        .then(userRecord => {
          console.log(yellowStyle + 'Password updated successfully:' + resetStyle);
          console.log(boldStyle + 'User Record:' + resetStyle);
          console.log(userRecord.toJSON());
          rl.close();
        })
        .catch(error => {
          console.error(boldStyle + 'Error updating password:' + resetStyle, error);
          rl.close();
        });
    });
  });
}

function updateEmail() {
  rl.question('Email Update | Enter the User ID:', userId => {
    rl.question('Enter the New Email For The User:\x20', newEmail => {
      admin.auth().updateUser(userId, { 'email': newEmail })
        .then(userRecord => {
          console.log(yellowStyle + 'Email updated successfully:' + resetStyle);
          console.log(boldStyle + 'User Record:' + resetStyle);
          console.log(userRecord.toJSON());
          rl.close();
        })
        .catch(error => {
          console.error(boldStyle + 'Error updating email:' + resetStyle, error);
          rl.close();
        });
    });
  });
}

function toggleAccountStatus() {
  rl.question('Enter the User ID of the user whose account you want to disable/undisable:\x20', userId => {
    admin.auth().getUser(userId)
      .then(userData => {
        const isDisabled = userData.disabled || false;
        admin.auth().updateUser(userId, { 'disabled': !isDisabled })
          .then(() => {
            const action = !isDisabled ? 'disabled' : 'undisabled';
            console.log(yellowStyle + 'User\'s account ' + action + ' successfully:' + resetStyle);
            rl.close();
          })
          .catch(error => {
            console.error(boldStyle + 'Error updating account status:' + resetStyle, error);
            rl.close();
          });
      })
      .catch(error => {
        console.error(boldStyle + 'Error getting user:' + resetStyle, error);
        rl.close();
      });
  });
}

function changeUsername() {
  rl.question('Enter the User ID of the user whose username you want to change:\x20', userId => {
    rl.question('Enter the New Username For The User:\x20', newUsername => {
      admin.auth().updateUser(userId, { 'displayName': newUsername })
        .then(userRecord => {
          console.log(yellowStyle + 'Username updated successfully:' + resetStyle);
          console.log(boldStyle + 'User Record:' + resetStyle);
          console.log(userRecord.toJSON());
          rl.close();
        })
        .catch(error => {
          console.error(boldStyle + 'Error updating username:' + resetStyle, error);
          rl.close();
        });
    });
  });
}

function listUsers() {
  admin.auth().listUsers()
    .then(listUsersResult => {
      console.log(yellowStyle + 'User List:' + resetStyle);
      console.log(boldStyle + 'Total Users: ' + listUsersResult.users.length + resetStyle);
      console.log(boldStyle + 'User Information:' + resetStyle);
      listUsersResult.users.forEach(user => {
        console.log(yellowStyle + 'User ID: ' + user.uid + resetStyle);
        console.log('Username: ' + (user.displayName || 'N/A'));
        console.log('Email: ' + (user.email || 'N/A'));
        console.log('Signup Date: ' + user.metadata.creationTime);
        console.log('Latest Login Date: ' + user.metadata.lastSignInTime);
        console.log('Account Status: ' + (user.disabled ? 'Disabled' : 'Active'));
        console.log('---------------------------------------');
      });
      rl.close();
    })
    .catch(error => {
      console.error(boldStyle + 'Error listing users:' + resetStyle, error);
      rl.close();
    });
}

function searchUserByUID() {
  rl.question('Enter the User ID (UID) of the user you want to search for:\x20', userId => {
    admin.auth().getUser(userId)
      .then(userData => {
        console.log(yellowStyle + 'User Information for UID: ' + userId + resetStyle);
        console.log('Username: ' + (userData.displayName || 'N/A'));
        console.log('Email: ' + (userData.email || 'N/A'));
        console.log('Signup Date: ' + userData.metadata.creationTime);
        console.log('Latest Login Date: ' + userData.metadata.lastSignInTime);
        console.log('Account Status: ' + (userData.disabled ? 'Disabled' : 'Active'));
        rl.close();
      })
      .catch(error => {
        console.error(boldStyle + 'Error getting user:' + resetStyle, error);
        rl.close();
      });
  });
}

function addVerifiedUser() {
  rl.question('Enter the username to verify:\x20', username => {
    const verifiedUsersRef = admin.database().ref('verifiedUsers');
    verifiedUsersRef.child(username).set(!![], error => {
      if (error) {
        console.error(boldStyle + 'Error adding user to verifiedUsers:' + resetStyle, error);
      } else {
        console.log(yellowStyle + 'User ' + username + ' successfully added to verified users.' + resetStyle);
      }
      rl.close();
    });
  });
}

function removeVerifiedUser() {
  rl.question('Enter the username to unverify:\x20', username => {
    const verifiedUsersRef = admin.database().ref('verifiedUsers');
    verifiedUsersRef.child(username).remove(error => {
      if (error) {
        console.error(boldStyle + 'Error removing user from verifiedUsers:' + resetStyle, error);
      } else {
        console.log(yellowStyle + 'User ' + username + ' successfully removed from verified users.' + resetStyle);
      }
      rl.close();
    });
  });
}

rl.question('Enter Action Number (e.g. 1 for Change Username):\x20', action => {
  switch (action) {
    case '1':
      changeUsername();
      break;
    case '2':
      updateEmail();
      break;
    case '3':
      updatePassword();
      break;
    case '4':
      toggleAccountStatus();
      break;
    case '5':
      searchUserByUID();
      break;
    case '6':
      listUsers();
      break;
    case '7':
      addVerifiedUser();
      break;
    case '8':
      removeVerifiedUser();
      break;
    case 'Q':
      rl.close();
      break;
    default:
      console.log(yellowStyle + 'Invalid action. Please enter a valid action number.' + resetStyle);
      rl.close();
  }
});
