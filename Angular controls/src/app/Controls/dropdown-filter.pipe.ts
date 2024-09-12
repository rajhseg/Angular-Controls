import { Pipe, PipeTransform } from '@angular/core';
import { DropdownModel } from './dropdown/dropdownmodel';

@Pipe({
  name: 'rfilter',
  pure: false,
  standalone: true
})
export class RDropdownFilterPipe implements PipeTransform {

  transform(value: DropdownModel[], ...args: unknown[]): any[] {
    let length = (value as [])?.length;
    if(length && length>0){
      let search = args[0] as string;

      if(search.trim()==''){
        return value;
      }

      let resultValue = value.filter(x=>x.DisplayValue.toLowerCase().includes(search.toLowerCase()));
      return resultValue;
    } else {
      return value;
    }
  }

}
