import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money'
})
export class MoneyPipe implements PipeTransform {

  transform(value: any): string {
    if (isNaN(value)) {
      return value;
    }
    
    // Ensure value is a number and fixed to 2 decimal places
    value = parseFloat(value).toFixed(2);
    
    // Split the value into integer and decimal parts
    let [integerPart, decimalPart] = value.split('.');
    
    // Apply Indian numbering system formatting
    let lastThreeDigits = integerPart.slice(-3);
    let otherDigits = integerPart.slice(0, -3);
    
    if (otherDigits != '') {
      lastThreeDigits = ',' + lastThreeDigits;
    }
    
    let formattedIntegerPart = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThreeDigits;
    
    // Combine integer part with decimal part
    return `₹ ${formattedIntegerPart}.${decimalPart}`;
  }

}
