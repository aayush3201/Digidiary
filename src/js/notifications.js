export const newNotificationList = (todo, events)=>{
    let arr = [];
    todo.forEach(el=>{
        arr.push({
            id: el.id,
            description: el.description,
            dueIn: dueTime(el)
        });
    });
    events.annual.forEach(el=>{
        arr.push({
            id: el.id,
            description: el.description,
            dueIn: dueTime(el)
        });
    });
    events.monthly.forEach(el=>{
        arr.push({
            id: el.id,
            description: el.description,
            dueIn: dueTime(el)
        });
    });
    events.one.forEach(el=>{
        arr.push({
            id: el.id,
            description: el.description,
            dueIn: dueTime(el)
        });
    });
    return arr;
}

export const dueTime = (el)=>{
if(el.date.indexOf('-')!=-1 && el.time){
        let year = parseInt(el.date.substr(0,4));
        let month = parseInt(el.date.substr(5,2));
        let date = parseInt(el.date.substr(8,2));
        let hour = parseInt(el.time.substr(0,2));
        let min = parseInt(el.time.substr(3,2));
        return working(year,month,date,hour,min);
}else if(el.month){
    let map = new Map();
    map.set('January',1);
    map.set('February',2);
    map.set('March',3);
    map.set('April',4);
    map.set('May',5);
    map.set('June',6);
    map.set('July',7);
    map.set('August',8);
    map.set('September',9);
    map.set('October',10);
    map.set('November',11);
    map.set('December',12);
    let present = new Date();
    let month = map.get(el.month);
    let year = present.getFullYear();
    let date = parseInt(el.date);
    if(present.getMonth()+1>month || (present.getMonth()+1==month && present.getDate()>date)){
        let obj = working(year+1,month,date,0,0);
        obj.hours=0;
        obj.minutes=0;
        obj.days++;
        if(obj.days>30){
            obj.days=0;
            obj.months++;
            if(obj.months>=12){
                obj.years=-1;
            }
        }
        return obj;
    } else {
        let obj = working(year,month,date,0,0);
        obj.hours=0;
        obj.minutes=0;
        obj.days++;
        if(obj.days>30){
            obj.days=0;
            obj.months++;
            if(obj.months>=12){
                obj.years=-1;
            }
        }
        return obj;
    } 
} else if(parseInt(el.date) && el.date.indexOf('-')==-1){
    let present = new Date();
    let year = present.getFullYear();
    let date = parseInt(el.date);
    let month = date>=present.getDate()?present.getMonth()+1:present.getMonth()+2;
    let obj = working(year,month,date,0,0);
    obj.hours=0;
    obj.minutes=0;
    obj.days++;
    if(obj.days>30){
        obj.days=0;
        obj.months++;
        if(obj.months>=12){
            obj.years=-1;
        }
    }
    return obj;
} else if(el.date.indexOf('-')!=-1){
    let year = parseInt(el.date.substr(0,4));
    let month = parseInt(el.date.substr(5,2));
    let date = parseInt(el.date.substr(8,2));
    let obj = working(year,month,date,0,0);
    obj.hours=0;
    obj.minutes=0;
    obj.days++;
    if(obj.days>30){
        obj.days=0;
        obj.months++;
        if(obj.months>=12){
            obj.years=-1;
        }
    }
    return obj;
}
}


const daysthisMonth = (num,year)=>{
    let d = [31,29,31,30,31,30,31,31,30,31,30,31];
    if(year%4!=0)
    d[1]--;
    return d[num];
}

const working = (year, month, date, hour, min)=>{
    let today = new Date();
    let retObj = {
        years: -1,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0
    };
    if(year==today.getFullYear() && month==today.getMonth()+1 && date==today.getDate()){
        retObj.years = 'today';
        retObj.hours = hour;
        retObj.minutes = min;
    }
    else{
        if(today.getFullYear()+1==year && today.getMonth()>month){
            retObj.years=0;
            retObj.months = 12+month-(today.getMonth()+1);
            if(date<today.getDate()){
                let num = daysthisMonth(today.getMonth())+date;
                retObj.days=num-today.getDate();
                retObj.months--;
            }
            else{
                retObj.days=date-today.getDate();
            }
            if(hour<today.getHours()){
                retObj.hours = 24+hour-today.getHours();
                retObj.days--;
                if(retObj.days==-1){
                    retObj.days=daysthisMonth(today.getMonth())-1;;
                    retObj.months-1==-1?retObj.months=0:retObj.months=retObj.months-1;  
                }
                if(min<today.getMinutes()){
                    retObj.minutes = 60+min-today.getMinutes();
                    retObj.hours--;
                    if(retObj.hours==-1){
                        retObj.hours=23;
                        retObj.days--;
                        if(retObj.days==-1){
                            retObj.days=daysthisMonth(today.getMonth())-1;;
                            retObj.months-1==-1?retObj.months=0:retObj.months=retObj.months-1;  
                        }
                    }
                } else{
                    retObj.minutes=min-today.getMinutes();
                }
            } else{
                retObj.hours=hour-today.getHours();
                if(min<today.getMinutes()){
                    retObj.minutes = 60+min-today.getMinutes();
                    retObj.hours--;
                    if(retObj.hours==-1){
                        retObj.hours=23;
                        retObj.days--;
                        if(retObj.days==-1){
                            retObj.days=daysthisMonth(today.getMonth())-1;;
                            retObj.months-1==-1?retObj.months=0:retObj.months=retObj.months-1;  
                        }
                    }
                } else{
                    retObj.minutes=min-today.getMinutes();
                }
            }
        } 
        if(year==today.getFullYear()){
            retObj.years=0;
            if(month==today.getMonth()+1){
                retObj.days = date-today.getDate();
            }
            else{
                if(date<today.getDate()){
                    let num = daysthisMonth(today.getMonth())+date;
                    retObj.days=num-today.getDate();
                    retObj.months = (month-1)-(today.getMonth()+1);
                }
                else{
                    retObj.days=date-today.getDate();
                    retObj.months = month-(today.getMonth()+1);
                }
            }
            if(hour<today.getHours()){
                retObj.hours = 24+hour-today.getHours();
                retObj.days--;
                if(retObj.days==-1){
                    retObj.days=daysthisMonth(today.getMonth())-1;;
                    retObj.months-1==-1?retObj.months=0:retObj.months=retObj.months-1;  
                }
                if(min<today.getMinutes()){
                    retObj.minutes = 60+min-today.getMinutes();
                    retObj.hours--;
                    if(retObj.hours==-1){
                        retObj.hours=23;
                        retObj.days--;
                        if(retObj.days==-1){
                            retObj.days=daysthisMonth(today.getMonth())-1;;
                            retObj.months-1==-1?retObj.months=0:retObj.months=retObj.months-1;  
                        }
                    }
                } else{
                    retObj.minutes=min-today.getMinutes();
                }
            } else{
                retObj.hours=hour-today.getHours();
                if(min<today.getMinutes()){
                    retObj.minutes = 60+min-today.getMinutes();
                    retObj.hours--;
                    if(retObj.hours==-1){
                        retObj.hours=23;
                        retObj.days--;
                        if(retObj.days==-1){
                            retObj.days=daysthisMonth(today.getMonth())-1;;
                            retObj.months-1==-1?retObj.months=0:retObj.months=retObj.months-1;  
                        }
                    }
                } else{
                    retObj.minutes=min-today.getMinutes();
                }
            }
        }
    }
    return retObj;
}

