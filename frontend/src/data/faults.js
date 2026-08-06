export const initialFaults = [
  {
    id: 1,
    equipmentName: 'GPU Server Alpha (NVIDIA A100)',
    reportedBy: 'Rahul Sharma',
    labName: 'Deep Learning & Neural Networks Lab',
    date: '2026-03-28',
    status: 'Open',
    severity: 'High',
    description: 'Overheating under full memory allocation loads. Fan #2 not spinning.',
  },
  {
    id: 2,
    equipmentName: 'Logic Analyzer Keysight 16800',
    reportedBy: 'Priya Patel',
    labName: 'VLSI & Embedded Systems Lab',
    date: '2026-03-27',
    status: 'In Progress',
    severity: 'Medium',
    description: 'Channel 4 input probe intermittent connection.',
  },
  {
    id: 3,
    equipmentName: 'Optical Microscope Olympus BX53',
    reportedBy: 'Anish Verma',
    labName: 'Nanotechnology & Bio-Sensors Lab',
    date: '2026-03-25',
    status: 'Resolved',
    severity: 'Low',
    description: 'Stage height adjustment dial sticking.',
  },
];

export default initialFaults;
