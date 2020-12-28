let uniqid = require('uniqid');
export const newAnnualEvent = ()=>{
    return {
        description: document.querySelector('.description-annual').value,
        month:  document.querySelector('.month-annual').value,
        date: document.querySelector('.date-annual').value,
        id: uniqid()
    }
}
export const newMonthlyEvent = ()=>{
    return {
        description: document.querySelector('.description-monthly').value,
        date: document.querySelector('.date-monthly').value,
        id: uniqid()
    }
}
export const newOneTimeEvent = ()=>{
    return {
        description: document.querySelector('.description-onetime').value,
        date: document.querySelector('.date-onetime').value,
        id: uniqid()
    }
}
export const removeExpired = (list)=>{
    let arr = [];
    let date = new Date();
    list.forEach(el=>{
        let year  = parseInt(el.date.substr(0,4));
        let month  = parseInt(el.date.substr(5,2));
        let day  = parseInt(el.date.substr(8,2));
        if(!(year<date.getFullYear() || (year==date.getFullYear() && month<date.getMonth()+1) || (year==date.getFullYear() && month==date.getMonth()+1 && day<date.getDate()))){
            arr.push(el);
        }
    });
    return arr;
}
