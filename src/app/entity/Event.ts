
export class Event {

  eventId: string = '';
  assignedBy: string = '';
  assignedTomembers: string[] = [];
  startDate: string = ''; // Assuming startDate and endDate are ISO date strings
  endDate: string = '';
  startTime: string = ''; // Assuming startTime and endTime are ISO time strings
  endTime: string = '';
  location: string = '';
  address: string = '';
  description: string = '';
  title: string = '';
  color: string = '#32c6b1';
  notification: string = '';
  createGoogleMeeting: boolean = false;
  googleMeetingLink: string = '';
  notificationTime: string = ''; // Assuming notificationTime is an ISO time string
  isAllDay: boolean = false;

  constructor() { }

  /**
   * Sets the startTime and endTime to represent the whole day if isAllDay is true.
   */
   setTimesForWholeDay(checkCondition: boolean): void {
    if (checkCondition) {
      this.endDate = this.startDate;
      this.startTime = '00:00'; // Start of the day
      this.endTime = '23:59'; // End of the day
    }
    else {
      this.endDate = "";

      this.startTime = ''; // Start of the day
      this.endTime = ''; // End of the day

    }
  }


  public patchValue(myDates: { startDate: any; endDate: any; }) {
    this.startDate = myDates.startDate;
    this.endDate = myDates.endDate;
  }

}
