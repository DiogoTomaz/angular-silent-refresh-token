
import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'src/app/shared/models/user';

@Pipe({
  name: 'userName'
})
export class UserNamePipe implements PipeTransform {

  transform(user: User | null): string | null {
    if(user) {
      return `${user.firstName} ${user.lastName}`;
    }

    return null;
  }

}
