export const displayList = (list)=>{
    document.querySelector('.noti-list').innerHTML='';
    let arr  = [];
    list.forEach(el=>{
        if(el.dueIn.years!=-1){
            if(el.dueIn.months<2){
                arr.push(el);
            }
        }
    });
    let newArrToday=[];
    let newArrUpcoming=[];
    arr.forEach((el)=>{
        if(el.dueIn.years=='today'){
            newArrToday.push(el);
        }
        else newArrUpcoming.push(el);
    });

    newArrUpcoming = bubbleSort(newArrUpcoming);
    console.log(newArrToday);
    newArrToday.forEach(el=>{
        let markup = `
        <li class="noti-list-item" id="$id">
                                <div class="row noti-item">
                                    <p class="message clearfix">$desc today$time.</p>
                                    <ion-icon class="delete-btn clearfix" name="close-circle"></ion-icon>
                                </div>
        </li>
        `;
        markup=markup.replace('$id',el.id);
        markup=markup.replace('$desc',el.description);
        
        if(el.dueIn.hours!=0 || el.dueIn.minutes!=0){
            let str='';
            if(el.dueIn.hours<10)
            str+='0';
            str+=el.dueIn.hours;
            str+=':';
            if(el.dueIn.minutes<10)
            str+='0';
            str+=el.dueIn.minutes;
            markup=markup.replace('$time',` at ${str}`);
        }
        else markup=markup.replace('$time','');
        document.querySelector('.noti-list').insertAdjacentHTML('beforeend',markup);
    });
    newArrUpcoming.forEach(el=>{
        let markup = `
        <li class="noti-list-item" id="$id">
                                <div class="row noti-item">
                                    <p class="message clearfix">$desc in $time.</p>
                                    <ion-icon class="delete-btn clearfix" name="close-circle"></ion-icon>
                                </div>
        </li>
        `;
        markup=markup.replace('$id',el.id);
        markup=markup.replace('$desc',el.description);
        markup=markup.replace('$time',getTime(el.dueIn));
        document.querySelector('.noti-list').insertAdjacentHTML('beforeend',markup);
    });
    
}


const dueInGenerator = (el)=>{
    return parseFloat(`${el.dueIn.years}${el.dueIn.months}${el.dueIn.days<10?'0'+el.dueIn.days:el.dueIn.days}.${el.dueIn.hours}${el.dueIn.minutes}`);
}

const getTime = (el)=>{
    let str = '';
    if(el.months!=0)
    str+= el.months+' month(s) ';
    if(el.days!=0)
    str+= el.days+' day(s) ';
    if(el.hours!=0)
    str+= el.hours+' hr(s) ';
    if(el.minutes!=0)
    str+= el.minutes+' min(s) ';
    return str;
}
const bubbleSort = (arr)=>{
    let n = arr.length; 
        for (let i = 0; i < n-1; i++) 
            for (let j = 0; j < n-i-1; j++) 
                if (dueInGenerator(arr[j]) > dueInGenerator(arr[j+1])) 
                { 
                    // swap arr[j+1] and arr[i] 
                    let temp = arr[j]; 
                    arr[j] = arr[j+1]; 
                    arr[j+1] = temp; 
                }
                return arr;
}