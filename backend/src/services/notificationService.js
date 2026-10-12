// const twilio = require("twilio");

// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// const sendTaskNotification = async (user, task) => {
//   if (!user.phone) {
//     throw new Error("User phone number is missing");
//   }

//   const message = `Hello ${user.name}, a new task has been assigned to you.

// Task: ${task.title}
// Priority: ${task.priority}
// Due Date: ${new Date(task.dueDate).toLocaleDateString("en-IN")}

// Please log in to your Task Management app for details.`;

//   return client.messages.create({
//     body: message,
//     from: process.env.TWILIO_PHONE_NUMBER,
//     to: user.phone,
//   });
// };

// module.exports = { sendTaskNotification };



const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendTaskNotification = async (user, task) => {
  if (!user.phone) {
    throw new Error("User phone number is missing");
  }

  console.log("FROM:", process.env.TWILIO_PHONE_NUMBER);
  console.log("TO:", user.phone);

  return client.messages.create({
    body: "sms_internal_alerts",
    from: process.env.TWILIO_PHONE_NUMBER,
    to: user.phone,
  });
};

module.exports = {
  sendTaskNotification,
};

