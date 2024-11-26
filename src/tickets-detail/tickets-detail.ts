import { Component, input, signal } from "@angular/core";
import { StForm, StFormComponent } from "../forms/stform";
import { FormControl, Validators } from "@angular/forms";

const ExampleForm = StForm.group({
    firstName: StForm.control('', { props: { label: 'First Name' }, validators: [Validators.required] }),
    lastName: StForm.control(''),
    email: StForm.control('a', {
      expression: (control: FormControl<string>, options) => {
        console.log('expression', control, options());
        control.patchValue(control.root.value.firstName + 'a', { emitEvent: false });
        options.update(() => ({ ...options(), props: { label: control.root.value.firstName + 'Email' } }));
      },
      validators: [Validators.email, Validators.minLength(5)],
      props: { label: 'Email', type: 'email' },
    }),
    address: StForm.group({
      street: StForm.control('', { props: { labelClass: ['text-sm', 'text-success'] } }),
      city: StForm.control(''),
      state: StForm.control('', { group: 'stzip', groupClass: ['d-flex', 'justify-content-between'] }),
      zip: StForm.control('', { group: 'stzip' }),
    }),
    range: StForm.control(null as { from: Date; to: Date } | null, { validators: [Validators.required] }),
    aliases: StForm.control([] as string[], { props: { label: 'Aliases', type: 'tags' } }),
  }, {group:'root',groupClass:['card', 'p-2']});

@Component({
    selector: 'app-tickets-detail',
    imports: [StFormComponent],
    templateUrl: './tickets-detail.html',
})
export class TicketsDetail {
    label = input('Add Ticket');
    form = signal(ExampleForm);

    submit() {
        this.form().markAllAsTouched();
    }
}
