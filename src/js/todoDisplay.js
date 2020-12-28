import * as diaryDisplay from './diaryDisplay';
export const displayTodo = ()=>{
    document.querySelector('.todomodal').classList.remove('hide');
}
export const todoPopup = (today)=>{
    document.querySelector('.todopopup').classList.remove('hide');
    document.querySelector('.todo-date').min = today;
}
export const displayList = (list)=>{
    document.querySelector('.todo-list').innerHTML='';
    let markup = `<li id="$id">
    <div class="row todo-item">
     <p class="task clearfix">"$desc" due on <strong>$date $month, $year</strong> at <strong>$time</strong></p>
        <input class="check-box clearfix" type="checkbox">
    </div>
</li>`;
    list.forEach(el=>{
        let mark = markup;
        mark = mark.replace('$id',el.id);
        mark = mark.replace('$desc',el.description);
        let back = el.date.lastIndexOf('-')
        mark = mark.replace('$date',el.date.substr(back+1,2));
        let month = diaryDisplay.fullMonth(parseInt(el.date.substr(back-2,2))-1);
        mark = mark.replace('$month',month);
        mark = mark.replace('$year',el.date.substr(0,4));
        mark = mark.replace('$time',el.time);
        document.querySelector('.todo-list').insertAdjacentHTML('beforeend',mark);
    });
}