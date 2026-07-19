import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// Send weekly reminders for outstanding tax receipts every Monday at 9:00 AM Malaysian Time (1:00 AM UTC)
crons.weekly(
    "weekly-receipt-reminder",
    {
        dayOfWeek: "monday",
        hourUTC: 1,
        minuteUTC: 0,
    },
    api.donations.sendWeeklyReceiptReminder
);

export default crons;
