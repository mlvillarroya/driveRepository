// SHARED DRIVES
//
// - CREATE SHARED DRIVE
// - GET SHARED DRIVE

function createSharedDrive(driveName) {
  if (getSharedDrive(driveName) != null) return false;
  var requestID = generateUUID();
  var resource = {
    name: driveName
  };
  try {
    return Drive.Drives.insert(resource, requestID).id;
  }
  catch (err) {
    return false
  }
}

function getSharedDrive(driveName) {
  var query = 'name = "' + driveName + '"';
  var optionalArgs = { 
    q: query
  };
  try {
  var drivesList = Drive.Drives.list(optionalArgs);
  if (drivesList.items.length > 0) return drivesList.items[0].id;
  return false;
  }
  catch (err) {
    return false
  }
}

// FOLDERS
//
// - CREATE FOLDER
// - GET FOLDER

function createFolder(folderName, parentObjectId) {
  var resource = {
    title: folderName,
    mimeType: "application/vnd.google-apps.folder",
    parents:[{
      "id": parentObjectId,
    }]
  };
  var optionalArgs = {
    supportsAllDrives: true
    };
  try {
    return Drive.Files.insert(resource, null, optionalArgs).id;
  }  
  catch (err) {
    return false
  }
}

function getFolder(folderName) {
  var query = 'mimeType = "application/vnd.google-apps.folder" AND title = "' + folderName + '"';
  var optionalArgs = { 
    q: query,
    supportsAllDrives: true,
    corpora: "allDrives",
    includeItemsFromAllDrives : true
  };
  try {
    var drivesList = Drive.Files.list(optionalArgs);
    if (drivesList.items.length > 0) return drivesList.items[0].id;
    return false;
  }
  catch (err) {
    return false
  }
}

// PERMISSIONS
//
// - LIST PERMISSIONS IN SHARED DRIVE
// - SET PERMISSIONS TO SHARED DRIVE
// - DELETE PERMISSIONS IN SHARED DRIVE

function listPermissionsInElement(elementId) {
  var optionalArgs = { 
    supportsAllDrives: true
    };
  try {
    return Drive.Permissions.list(elementId, optionalArgs);
    }
  catch (err) {
    return false
  }
}

function setPermissionsToElement(elementId, userEmail, role) {
  if (!(variableInEnum(role, DriveRoles))) {
    return false;
  }
  var resource = {
    role: role,
    type: "user",
    value: userEmail,
  }
  // optional arguments to work on Shared drive
  var optionalArgs = {
    sendNotificationEmails: false,
    supportsAllDrives: true
  };
  try {
    Drive.Permissions.insert(resource, elementId, optionalArgs);
    return true;
  }
  catch (err) {
    return false
  }
}

function deletePermissionInElement(elementId, permissionId) {
  var optionalArgs = { 
    supportsAllDrives: true
    };
  try {
    Drive.Permissions.remove(elementId, permissionId, optionalArgs);
  }
  catch (err) {
    return false
  }
}

// USERS
//
// https://developers.google.com/apps-script/advanced/admin-sdk-directory
// - GET USER
// - CREATE USER

function getUser(userEmail) {
  try {
    const user = AdminDirectory.Users.get(userEmail);
    return user.id;
  } catch (err) {
    return false;
  }
}

function addUser(firstName, lastName, user_type) {
  if (!(variableInEnum(user_type, UserTypes))) {
    return false;
  }
  let userName = createUserName(firstName, lastName, user_type);
  if (!userName) return false;
  let user = {
    primaryEmail: userName,
    name: {
      givenName: firstName,
      familyName: lastName,
    },
    password: Math.random().toString(36)
  };
  try {
    return AdminDirectory.Users.insert(user).id;
  } catch (err) {
    Logger.log(JSON.stringify(err));
    return false;
  }
}

function deleteUser(userId) {
  try {
    AdminDirectory.Users.remove(userId);
    return true;
  } catch (err) {
    Logger.log(JSON.stringify(err));
    return false;
  }
}
