import { ValidatorFn, AbstractControl } from '@angular/forms';



const allTheThings = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);


export function allValidators(reqs: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const valid = reqs.test(control.value);
    return valid ? null : {'forbiddenPassword': {value: control.value}};
  };

}

