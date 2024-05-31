const DriveRoles = {
  ORGANIZER: 'organizer',
  WRITER: 'writer',
  READER: 'reader',
}

const UserTypes = {
  TEACHER: 'teacher',
  STUDENT: 'student',
}

function replaceAccents(textWithAccents) {
  return textWithAccents.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function variableInEnum(variable, myEnum) {
  for (var value in myEnum) {
    enumValue = myEnum[value];
    if (variable == enumValue) return true;
  }
  return false;
}

function generateUUID() {
  return Utilities.getUuid();
}

function createUserName(firstName, lastName, userType) {
  if (userType == UserTypes.TEACHER) {
    return (replaceAccents(firstName + lastName) + '@iernestlluch.cat').toLowerCase();
  }
  else if (userType == UserTypes.STUDENT) {
    return (replaceAccents(firstName + lastName) + (Math.floor(Math.random() * 20) + 1).toString() + '@iernestlluch.cat').toLowerCase();
  }
  else return false;
}
