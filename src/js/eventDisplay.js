import * as diaryDisplay from './diaryDisplay';
export const displayEvents = ()=>{
    document.querySelector('.eventmodal').classList.remove('hide');
}
export const displayEventList = (all)=>{
    document.querySelector('.event-list').innerHTML='';
    all.annual.forEach(el=>{
        let markup = `<li class="row event-item" id="$id">
        <p class="event-description">$desc on <strong>$day $month</strong>.</p>
    </li>`;
    markup = markup.replace('$id',el.id);
    markup = markup.replace('$desc',el.description);
    markup = markup.replace('$day',el.date);
    markup = markup.replace('$month',el.month);
    document.querySelector('.event-list').insertAdjacentHTML('beforeend',markup);
    });
    all.monthly.forEach(el=>{
        let markup = `<li class="row event-item" id="$id">
        <p class="event-description">$desc on the <strong>$day</strong> of every month.</p>
    </li>`;
    markup = markup.replace('$id',el.id);
    markup = markup.replace('$desc',el.description);
    markup = markup.replace('$day',postfixed(el.date));
    document.querySelector('.event-list').insertAdjacentHTML('beforeend',markup);
    });
    all.one.forEach(el=>{
        let markup = `<li class="row event-item" id="$id">
        <p class="event-description">$desc on <strong>$day $month, $year</strong>.</p>
    </li>`;
    markup = markup.replace('$id',el.id);
    markup = markup.replace('$desc',el.description);
    markup = markup.replace('$day', parseInt(el.date.substr(8,2)));
    markup = markup.replace('$month', diaryDisplay.fullMonth(parseInt(el.date.substr(5,2))-1) );
    markup = markup.replace('$year',el.date.substr(0,4));
    document.querySelector('.event-list').insertAdjacentHTML('beforeend',markup);
    });
}
const postfixed = (num)=>{
    if(num==1 || num==21 || num==31){
        return num+'st';    
    }
    else if(num==2 || num==22){
        return num+='nd';
    }
    else if(num==3 || num==23){
        return num+='rd';
    }
    else return num+='th';
}