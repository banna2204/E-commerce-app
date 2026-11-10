import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidator {
    static noSpace(control: AbstractControl): ValidationErrors | null {
        const value = control.value as string;
        if(! value) return null;
        if (/\s/.test(value)) {
        return { noSpace: true };
        }
        return null;
    }
}