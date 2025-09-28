export interface AttendanceRecord {
  id: string;
  courseName: string;
  trainingDate: string;
  participantName: string;
  participantPosition: string;
  participantEmpresa: string;
  signature: string; // base64 data URL
}
