const admin = require('firebase-admin');
const readline = require('readline');
const serviceAccount = require('./fffyggghiii.json');
const process = require('process');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://waveev2-68ecb-default-rtdb.firebaseio.com/'
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const resetStyle = '\x1b[0m';
const boldStyle = '\x1b[1m';
const yellowStyle = '\x1b[33m';
const bgBlueStyle = '\x1b[44m';
const redStyle = '\x1b[31m';
const greenStyle = '\x1b[32m';
const underlineStyle = '\x1b[4m';

// Function to center text
function centerText(text) {
  const terminalWidth = process.stdout.columns;
  const textLength = text.replace(/\x1b\[[0-9;]*m/g, '').length; // Remove ANSI escape codes
  const padding = Math.max((terminalWidth - textLength) / 2, 0);
  return ' '.repeat(padding) + text;
}

// ASCII Art for Header
const header = `
${bgBlueStyle}${boldStyle}######################################################${resetStyle}
${bgBlueStyle}${boldStyle}#                                                    #${resetStyle}
${bgBlueStyle}${boldStyle}#          WAVEE ADMIN COMMAND PANEL (v1)            #${resetStyle}
${bgBlueStyle}${boldStyle}#                                                    #${resetStyle}
${bgBlueStyle}${boldStyle}######################################################${resetStyle}
`;

const menu = `
${boldStyle}${underlineStyle}Admin Actions:${resetStyle}
  ${yellowStyle}1${resetStyle}. Change User's Username
  ${yellowStyle}2${resetStyle}. Change a User's Email
  ${yellowStyle}3${resetStyle}. Change a User's Password
  ${yellowStyle}4${resetStyle}. Disable/Undisable Account
  ${yellowStyle}5${resetStyle}. Search For a User
  ${yellowStyle}6${resetStyle}. List Users
  ${yellowStyle}7${resetStyle}. Add Verified User
  ${yellowStyle}8${resetStyle}. Remove Verified User
  ${yellowStyle}Q${resetStyle}. Quit
`;

console.clear();

header.split('\n').forEach(line => console.log(centerText(line)));
menu.split('\n').forEach(line => console.log(centerText(line)));

function updatePassword() {
  rl.question(`${boldStyle}Enter the User ID of the user whose password you want to update:${resetStyle} `, userId => {
    rl.question(`${boldStyle}Enter the New Password For The User (Case Sensitive):${resetStyle} `, newPassword => {
      admin.auth().updateUser(userId, { password: newPassword })
        .then(userRecord => {
          console.log(`${greenStyle}Password updated successfully:${resetStyle}`);
          console.log(`${boldStyle}User Record:${resetStyle}`);
          console.log(userRecord.toJSON());
          showMenu();
        })
        .catch(error => {
          console.error(`${redStyle}Error updating password:${resetStyle}`, error);
          showMenu();
        });
    });
  });
}

function updateEmail() {
  rl.question(`${boldStyle}Email Update | Enter the User ID:${resetStyle} `, userId => {
    rl.question(`${boldStyle}Enter the New Email For The User:${resetStyle} `, newEmail => {
      admin.auth().updateUser(userId, { email: newEmail })
        .then(userRecord => {
          console.log(`${greenStyle}Email updated successfully:${resetStyle}`);
          console.log(`${boldStyle}User Record:${resetStyle}`);
          console.log(userRecord.toJSON());
          showMenu();
        })
        .catch(error => {
          console.error(`${redStyle}Error updating email:${resetStyle}`, error);
          showMenu();
        });
    });
  });
}

function toggleAccountStatus() {
  rl.question(`${boldStyle}Enter the User ID of the user whose account you want to disable/undisable:${resetStyle} `, userId => {
    admin.auth().getUser(userId)
      .then(userData => {
        const isDisabled = userData.disabled || false;
        admin.auth().updateUser(userId, { disabled: !isDisabled })
          .then(() => {
            const action = !isDisabled ? 'disabled' : 'undisabled';
            console.log(`${greenStyle}User's account ${action} successfully:${resetStyle}`);
            showMenu();
          })
          .catch(error => {
            console.error(`${redStyle}Error updating account status:${resetStyle}`, error);
            showMenu();
          });
      })
      .catch(error => {
        console.error(`${redStyle}Error getting user:${resetStyle}`, error);
        showMenu();
      });
  });
}

function changeUsername() {
  rl.question(`${boldStyle}Enter the User ID of the user whose username you want to change:${resetStyle} `, userId => {
    rl.question(`${boldStyle}Enter the New Username For The User:${resetStyle} `, newUsername => {
      admin.auth().updateUser(userId, { displayName: newUsername })
        .then(userRecord => {
          console.log(`${greenStyle}Username updated successfully:${resetStyle}`);
          console.log(`${boldStyle}User Record:${resetStyle}`);
          console.log(userRecord.toJSON());
          showMenu();
        })
        .catch(error => {
          console.error(`${redStyle}Error updating username:${resetStyle}`, error);
          showMenu();
        });
    });
  });
}

function listUsers() {
  admin.auth().listUsers()
    .then(listUsersResult => {
      console.log(`${greenStyle}User List:${resetStyle}`);
      console.log(`${boldStyle}Total Users: ${listUsersResult.users.length}${resetStyle}`);
      listUsersResult.users.forEach(user => {
        console.log(`${yellowStyle}User ID: ${user.uid}${resetStyle}`);
        console.log(`Username: ${user.displayName || 'N/A'}`);
        console.log(`Email: ${user.email || 'N/A'}`);
        console.log(`Signup Date: ${user.metadata.creationTime}`);
        console.log(`Latest Login Date: ${user.metadata.lastSignInTime}`);
        console.log(`Account Status: ${user.disabled ? 'Disabled' : 'Active'}`);
        console.log('---------------------------------------');
      });
      showMenu();
    })
    .catch(error => {
      console.error(`${redStyle}Error listing users:${resetStyle}`, error);
      showMenu();
    });
}

function searchUserByUID() {
  rl.question(`${boldStyle}Enter the User ID (UID) of the user you want to search for:${resetStyle} `, userId => {
    admin.auth().getUser(userId)
      .then(userData => {
        console.log(`${greenStyle}User Information for UID: ${userId}${resetStyle}`);
        console.log(`Username: ${userData.displayName || 'N/A'}`);
        console.log(`Email: ${userData.email || 'N/A'}`);
        console.log(`Signup Date: ${userData.metadata.creationTime}`);
        console.log(`Latest Login Date: ${userData.metadata.lastSignInTime}`);
        console.log(`Account Status: ${userData.disabled ? 'Disabled' : 'Active'}`);
        showMenu();
      })
      .catch(error => {
        console.error(`${redStyle}Error getting user:${resetStyle}`, error);
        showMenu();
      });
  });
}

function addVerifiedUser() {
  rl.question(`${boldStyle}Enter the username to verify:${resetStyle} `, username => {
    const verifiedUsersRef = admin.database().ref('verifiedUsers');
    verifiedUsersRef.child(username).set(true, error => {
      if (error) {
        console.error(`${redStyle}Error adding user to verifiedUsers:${resetStyle}`, error);
      } else {
        console.log(`${greenStyle}User ${username} successfully added to verified users.${resetStyle}`);
      }
      showMenu();
    });
  });
}

function removeVerifiedUser() {
  rl.question(`${boldStyle}Enter the username to unverify:${resetStyle} `, username => {
    const verifiedUsersRef = admin.database().ref('verifiedUsers');
    verifiedUsersRef.child(username).remove(error => {
      if (error) {
        console.error(`${redStyle}Error removing user from verifiedUsers:${resetStyle}`, error);
      } else {
        console.log(`${greenStyle}User ${username} successfully removed from verified users.${resetStyle}`);
      }
      showMenu();
    });
  });
}

function showMenu() {
  console.clear();
  header.split('\n').forEach(line => console.log(centerText(line)));
  menu.split('\n').forEach(line => console.log(centerText(line)));
  rl.question(`${boldStyle}Enter Action Number (e.g. 1 for Change Username):${resetStyle} `, action => {
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
        console.log(`${redStyle}Invalid action. Please enter a valid action number.${resetStyle}`);
        showMenu();
    }
  });
}

showMenu();
