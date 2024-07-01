import { ValidatorFn, AbstractControl, ValidationErrors, FormControl, FormGroup, Validators } from "@angular/forms";

export class AppUtils {
//these are the dates to fetch the data for calendar
    startDate: any;
    endDate: any;
    static startDate: any;
    static endDate: any;
    public static modelDismiss(id: any) {
        let element = document.getElementById(id);
        element?.click();
    }

    public static formSubmittion(addForm: any) {
        Object.keys(addForm.controls).forEach((key) => {
            const control = addForm.get(key);
            if (control) {
                control.markAsTouched();
            }
        });
        document.querySelector('input.ng-invalid');
    }


    public static notSundayValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const selectedDate = new Date(control.value as Date);
            console.log('date', selectedDate);

            if (!selectedDate || selectedDate.getDay() !== 0) {
                return null; // Valid date or no date selected
            }

            return { notSunday: true }; // Sunday is not allowed
        };
    }

    public static isTitleValid() {
        return (control: AbstractControl): ValidationErrors | null => {
            const title = /^[A-Z]{1}([A-za-z]*\s*)+$/;
            if (title.test(control.value)) {
                return null; // Valid date or no date selected
            }

            return { 'title': true };
        };
    }

    public static isDateFormmatValid() {
        return (control: AbstractControl): ValidationErrors | null => {
            const title = /^\d{4}-\d{2}-\d{2}$/;
            if (title.test(control.value)) {
                return null; // Valid date or no date selected
            }

            return { 'notValid': true };
        };
    }



    static min() {
        return (control: AbstractControl): ValidationErrors | null => {
            let title = control.value as string
            if (title == null) {
                return { min: false };
            }
            if (title.length >= 3) {
                return null; // Valid date or no date selected
            }

            return { min: true }; // Sunday is not allowed
        };
    }
    static max() {
        return (control: AbstractControl): ValidationErrors | null => {
            let title = control.value as string
            if (title == null) {
                return { max: false };
            } if (title.length <= 50) {
                return null; // Valid date or no date selected
            }
            return { max: true }; // Sunday is not allowed
        };
    }


    public static dateValidator() {
        return (formGroup: AbstractControl): ValidationErrors | null => {


            const startDate = formGroup.get('startDate')?.value;
            const endDate = formGroup.get('endDate')?.value;
            console.log(startDate, '   ', endDate);

            if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
                return { 'dateInvalid': true };

            }
            return null;
        };
    }







    public static setDates(start: string, end: string) {
      
        // If the new dates do not fall within the existing range, set the values
        this.startDate = start;
        this.endDate = end;
    }

    public static  addControls(myForm: FormGroup<any>) {
        myForm.addControl('endDate', new FormControl('', [Validators.required,]))
        myForm.addControl('endTime', new FormControl('', Validators.required))
        myForm.addControl('startTime', new FormControl('', Validators.required))
      }
      public static     removeControls(myForm: FormGroup<any>) {
        myForm.removeControl('endDate')
        myForm.removeControl('endTime')
        myForm.removeControl('startTime')
      }


}







