
export class Task {
  


	id: string = '';
	description: string = '';
	title: string = '';
	isAllDay: boolean = false;
	startDate: string = ''; // Assuming startDate and endDate are ISO date strings
	endDate: string = '';
	startTime: string = '00:00'; // Assuming startTime and endTime are ISO time strings
	endTime: string = '23:59';
	color: string = '#32c6b1';
	assignedBy: string = '';
	assignedTo: string = '';

	constructor() { }

	/**
	 * Sets the startTime and endTime to represent the whole day if isAllDay is true.
	 */
	setTimesForWholeDay(checkCondition:boolean): void {
		if(checkCondition){
			this.endDate= this.startDate;
				this.startTime = '00:00'; // Start of the day
				this.endTime = '23:59'; // End of the day
		}   
		else{
			this.endDate= "";
			this.startTime = ''; // Start of the day
			this.endTime = ''; // End of the day

		}
	}

	patchValue(myDates: { startDate: any; endDate: any; }) {
		this.startDate = myDates.startDate;
		this.endDate=myDates.endDate;
	   }
	
}
