import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'myfilter',
    pure: false
})
export class MyFilterPipe implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items.length || (!filter.search && !filter.column && !filter.order)) {
            return items;
        }

        if(filter.column && filter.order){debugger;
            if(filter.search){
                items = items.filter(item => item.name.toLocaleLowerCase().indexOf(filter.search) !== -1);
            }
            return items.sort(this.compareValues(filter.column, filter.order));

        }

        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        // @ts-ignore
        return items.filter(item => item.name.toLocaleLowerCase().indexOf(filter.search) !== -1);
    }
    compareValues(key, order = 'asc') {
        return function innerSort(a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                // property doesn't exist on either object
                return 0;
            }

            const varA = (typeof a[key] === 'string')
                ? a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string')
                ? b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (
                (order === 'desc') ? (comparison * -1) : comparison
            );
        };
    }
}
