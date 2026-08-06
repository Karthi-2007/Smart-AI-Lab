export const initialNotifications = [
  {
    id: 1,
    title: 'Booking Approved',
    message: 'Your booking for GPU Server Alpha (NVIDIA A100) has been approved by Dr. S. Ramanujan.',
    time: '10 mins ago',
    read: false,
    type: 'success',
  },
  {
    id: 2,
    title: 'Maintenance Reminder',
    message: 'Scheduled calibration for Oscilloscope Tektronix TBS2000B on April 5, 2026.',
    time: '2 hours ago',
    read: false,
    type: 'info',
  },
  {
    id: 3,
    title: 'Fault Report Updated',
    message: 'Fault report #204 for Logic Analyzer is currently under maintenance.',
    time: '1 day ago',
    read: true,
    type: 'warning',
  },
];

export default initialNotifications;
