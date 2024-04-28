let admin = require("firebase-admin");

// config
let email = "treasphonemail@gmail.com";
let serviceAccountData = require("XXX.json");
let adminConfig = {
    credential: admin.credential.cert(serviceAccountData),
    databaseURL: "https://waveev2-68ecb-default-rtdb.firebaseio.com/",
};
let newUserOverrides = {
    uid: "1",
};

Start();
async function Start() {
    console.log("Initializing firebase. databaseURL:", adminConfig.databaseURL);
    admin.initializeApp(adminConfig);

    console.log("Starting update for user with email:", email);
    let oldUser = await admin.auth().getUserByEmail(email);
    console.log("Old user found:", oldUser);

    await admin.auth().deleteUser(oldUser.uid);
    console.log("Old user deleted.");

    let dataToTransfer_keys = ["disabled", "displayName", "email", "emailVerified", "phoneNumber", "photoURL", "uid"];
    let newUserData = {};
    for (let key of dataToTransfer_keys) {
        newUserData[key] = oldUser[key];
    }
    Object.assign(newUserData, newUserOverrides);
    console.log("New user data ready: ", newUserData);

    let newUser = await admin.auth().createUser(newUserData);
    console.log("New user created: ", newUser);
}
