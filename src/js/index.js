import * as diaryList from './diaryList';
import * as diaryListDisplay from './diaryListDisplay';
import * as diaryDisplay from './diaryDisplay';
import * as todoDisplay from './todoDisplay';
import * as todo from './todo';
import * as eventDisplay from './eventDisplay';
import * as eventMemory from './eventMemory';
import * as notifications from './notifications';
import * as notiDisplay from './notiDisplay';

let state;
let db;
let dbReq = indexedDB.open('Digidiary',1);


const init = ()=>{
    let date = new Date();
    state.currentPage={
        year:date.getFullYear(),
        month:date.getMonth()    
    };
    updateDB(state);
    let check = 0;
    state.list_diaries.forEach((d)=>{
        if(d.id===date.getDate().toString() +'/'+ date.getMonth().toString()+ '/'+ date.getFullYear().toString())
        check=1;
    });
    if(check===0){
        let newobj = diaryList.addDiary(date);
        state.list_diaries.push(newobj);
        updateDB(state);
    }
    state.list_todo = eventMemory.removeExpired(state.list_todo);
    state.events.one =  eventMemory.removeExpired(state.events.one);
    diaryListDisplay.updateListUI(state);
    state.notiList =  notifications.newNotificationList(state.list_todo,state.events);
    notiDisplay.displayList(state.notiList);
    updateDB(state);
}


dbReq.onupgradeneeded = (event)=>{
    db = event.target.result;
    let obj = db.createObjectStore('state', {autoIncrement: true});
}
dbReq.onsuccess = async function(event) {
    db = event.target.result;
    let tx = db.transaction(['state'], 'readwrite');
    let store = tx.objectStore('state');
    let c = store.count();
    c.onsuccess = ()=>{
        if(c.result==0){
            console.log('called');
            store.add({ 
                currentPage: undefined,
                list_diaries:[],
                list_todo: [],
                events: {
                    annual:[],
                    monthly:[],
                    one:[]
                },
                notiList : []
            });
        }
        let req = store.get(1);
        req.onsuccess = event=>{
            state = event.target.result;
            init();
        }
        req.onerror = event=>{
            alert('Error');
        }
    }

  }
  dbReq.onerror = function(event) {
    alert('error opening database ' + event.target.errorCode);
  }

    /*state = {
    list_diaries:[diaryList.addDiary(new Date(2020, 5, 26, 0, 0, 0, 0))],
    list_todo: [{description:'aa', date:'2020-07-01', time:'12:30', id:'aaa'}, {description:'aas', date:'2020-08-01', time:'12:30', id:'aada'}],
    events: {
        annual:[{description:'Test1',month:'July',date:'1',id:'abc'},{description:'Test2',month:'July',date:'29',id:'abc1'}, {description:'Test1',month:'June',date:'30',id:'abc2'},{description:'Test1',month:'July',date:'10',id:'abc2'}],
        monthly:[{description:'month', date:'25',id:'aa'}],
        one:[{description:'one', date:'2020-08-01', id:'un1'},{description:'one', date:'2020-08-02', id:'un2'}]
    },
    notiList : []
};*/
document.querySelector('.btn-prev').addEventListener('click',()=>{
    if(state.currentPage.month!==0){
        state.currentPage.month--;
        updateDB(state);
    }
    
    else{
        state.currentPage.month=11;
        state.currentPage.year--;
        updateDB(state);
    }
    diaryListDisplay.updateListUI(state);
});

document.querySelector('.btn-next').addEventListener('click',()=>{
    if(state.currentPage.month!==11){
    state.currentPage.month++;
    updateDB(state);
    }
    else{
        state.currentPage.month=0;
        state.currentPage.year++;
        updateDB(state);
    }
    diaryListDisplay.updateListUI(state);
});

document.querySelector('.btn-jump').addEventListener('click',()=>{
    document.querySelector('.jumptomodal').classList.remove('hide');
});
document.querySelector('.extras').addEventListener('click',(event)=>{
    if(event.target.classList.contains('close')){
        if(event.target.parentNode.classList.contains('modal-content')){
            let modals = Array.from(document.querySelectorAll('.modal'));
            modals.forEach((el)=>{
                if(el.classList.contains('hide')===false){
                    el.classList.add('hide');
                }
            });
        }else if(event.target.parentNode.classList.contains('popup-content')){
            let popups = Array.from(document.querySelectorAll('.popup'));

            popups.forEach((el)=>{
                if(el.classList.contains('hide')===false){
                    el.classList.add('hide');
                }
            });
        }
    }
    if(event.target.classList.contains('close-todo')){
        let arr = [];
        let todos = Array.from(document.querySelectorAll('.todo-item'));
        todos.forEach(el=>{
            if(el.querySelector('.check-box').checked){
                arr.push(el.parentNode.id);
            }
        });
        let noti = document.querySelector('.noti-list');
        let notilist = Array.from(noti.querySelectorAll('.noti-list-item'));
        arr.forEach(el=>{
            let ind;
            for(let i=0; i<state.list_todo.length;i++){
                if(state.list_todo[i].id==el){
                    ind=i;
                    break;
                }
            }
            state.list_todo.splice(ind,1);
            updateDB(state);
            let element;
            for(let i=0;i<notilist.length;i++){
                if(notilist[i].id==el){
                    element=notilist[i];
                    break;
                }
            }
            if(element)
            noti.removeChild(element);
        });
    }
    if(event.target.classList.contains('submit-btn-jump')){
        if(document.querySelector('.jump-date').value==='')
        alert('Please enter date');
        else{
            let newDate = (document.querySelector('.jump-date').value).toString();
            let newYear = parseInt(newDate.substr(0,4));
            let newMonth = parseInt(newDate.substr(5,2))-1;
            state.currentPage.month=newMonth;
            state.currentPage.year=newYear;
            updateDB(state);
            diaryListDisplay.updateListUI(state);
            document.querySelector('.jump-date').value='';
            document.querySelector('.jumptomodal').classList.add('hide');  
        }
    }
    if(event.target.classList.contains('add-new')){
        todoDisplay.todoPopup(getString(new Date()));
    }
    if(event.target.classList.contains('submit-btn-newtodo')){
        let desc = document.querySelector('.todo-description');
        let date = document.querySelector('.todo-date');
        let time = document.querySelector('.todo-time');
        let today = new Date();
        let hrs = today.getHours();
        let min = today.getMinutes();
        if(desc.value == '' || date.value == '' || time.value == ''){
            alert('Please enter all fields before submitting');
        }
        else if(date.value==getString(today) && parseInt(time.value.substr(0,2))<=hrs){
            if(parseInt(time.value.substr(3,2))<=min)
            alert('Cannot set a To-do for the past!');
            else{
                let objTodo = todo.newTodo({description:desc.value,date:date.value,time:time.value});
                state.list_todo.push(objTodo);
                updateDB(state);
                todoDisplay.displayList(state.list_todo);
                desc.value='';
                date.value='';
                time.value='';
                document.querySelector('.todopopup').classList.add('hide');
            }
        }
        else{
           let objTodo = todo.newTodo({description:desc.value,date:date.value,time:time.value});
           state.list_todo.push(objTodo);
           updateDB(state);
           todoDisplay.displayList(state.list_todo);
           desc.value='';
           date.value='';
           time.value='';
           document.querySelector('.todopopup').classList.add('hide');
        }
    }
    if(event.target.classList.contains('new-annual-btn') || event.target.parentNode.classList.contains('new-annual-btn')){
        document.querySelector('.annualpopup').classList.remove('hide');
    }
    if(event.target.classList.contains('new-monthly-btn') || event.target.parentNode.classList.contains('new-monthly-btn')){
        document.querySelector('.monthlypopup').classList.remove('hide');
    }
    if(event.target.classList.contains('new-one-btn') || event.target.parentNode.classList.contains('new-one-btn')){
        document.querySelector('.onetimepopup').classList.remove('hide');
        document.querySelector('.date-onetime').min=getString(new Date());
    }
    if(event.target.classList.contains('submit-btn-newannual')){
        if(document.querySelector('.description-annual').value == '' || document.querySelector('.month-annual').value == 'Choose' || document.querySelector('.date-annual').value==''){
            alert('Please fill all fields');
        }
        else if(checkMonth(document.querySelector('.date-annual').value,document.querySelector('.month-annual').value)){
            alert(`${document.querySelector('.month-annual').value} doesn't have ${document.querySelector('.date-annual').value} days!`);
        }
        else{
            let obj = eventMemory.newAnnualEvent();
            state.events.annual.push(obj);
            updateDB(state);
            eventDisplay.displayEventList(state.events);
            document.querySelector('.annualpopup').classList.add('hide');
            document.querySelector('.description-annual').value = '';
            document.querySelector('.month-annual').value = 'Choose';
            document.querySelector('.date-annual').value='';
        }
    }
    if(event.target.classList.contains('submit-btn-newmonthly')){
        if(document.querySelector('.description-monthly').value == '' || document.querySelector('.date-monthly').value == ''){
            alert('Please fill all fields');
        }else if(document.querySelector('.date-monthly').value>31 || document.querySelector('.date-monthly').value<1){
            alert('No month has that many days!');
        }
        else{
            let obj = eventMemory.newMonthlyEvent();
            state.events.monthly.push(obj);
            updateDB(state);
            eventDisplay.displayEventList(state.events);
            document.querySelector('.monthlypopup').classList.add('hide');
            document.querySelector('.description-monthly').value = '';
            document.querySelector('.date-monthly').value='';
        }
    }
    if(event.target.classList.contains('submit-btn-newonetime')){
        if(document.querySelector('.description-onetime').value == '' || document.querySelector('.date-onetime').value == ''){
            alert('Please fill all fields or check for incorrectly filled fields');
        }
        else{
            let date = document.querySelector('.date-onetime').value;
            let today = new Date();
            let day = parseInt(date.substr(8,2));
            let month = parseInt(date.substr(5,2));
            let year = parseInt(date.substr(0,4));
            if(year<today.getFullYear() || (year==today.getFullYear() && month<today.getMonth()+1) || year==today.getFullYear() && month==today.getMonth()+1 && day<today.getDate()){
                alert('Cannot set an Event for the past!');
            } else {
                let obj = eventMemory.newOneTimeEvent();
                state.events.one.push(obj);
                updateDB(state);
                eventDisplay.displayEventList(state.events);
                document.querySelector('.description-onetime').value = '';
                document.querySelector('.date-onetime').value = '';
                document.querySelector('.onetimepopup').classList.add('hide');
            }
        }
    }
});
document.querySelector('.diary-list').addEventListener('click',(event)=>{
    if(event.target.classList.contains('diary-item') || event.target.parentNode.classList.contains('diary-item')){
        let diaryId = event.target.parentNode.id.toString();
        if(!diaryId)
        diaryId = event.target.parentNode.parentNode.id.toString();
        let info;
        for(let i=0;i<state.list_diaries.length;i++){
            if(state.list_diaries[i].id==diaryId){
                info=state.list_diaries[i];
                break;
            }
        }
        state.current=info;
        updateDB(state);
        diaryDisplay.loadDiary(info);
        diaryListDisplay.activate(state.current);
    }
});
document.querySelector('.diary-area').addEventListener('click',(event)=>{
    if(event.target.classList.contains('btn-edit') || event.target.parentNode.classList.contains('btn-edit')){
        diaryDisplay.editViewOn(state.current);
    }
    if(event.target.classList.contains('save-content') || event.target.parentNode.classList.contains('save-content')){
        let rec = diaryDisplay.getNewContent();
        state.current.content = rec;
        updateDB(state);
        diaryDisplay.loadDiary(state.current); 
        if(rec === '')
        document.getElementById(state.current.id).querySelector('.diary-title').textContent='No content present';
        else
        document.getElementById(state.current.id).querySelector('.diary-title').textContent='Content present';
    }
});
document.querySelector('.dropdown').addEventListener('click',(event)=>{
    if(event.target.classList.contains('todo-list-button')){
        todoDisplay.displayTodo();
        todoDisplay.displayList(state.list_todo);
    } 
    if(event.target.classList.contains('events-button')){
        eventDisplay.displayEvents();
        eventDisplay.displayEventList(state.events);
    }
    if(event.target.classList.contains('about-button')){
        document.querySelector('.aboutmodal').classList.remove('hide');
    }
});
document.querySelector('.noti-list').addEventListener('click',event=>{
    if(event.target.classList.contains('delete-btn')){
        let id = event.target.parentNode.parentNode;
        let p = event.target.parentNode.parentNode.parentNode;
        p.removeChild(id);
    }
});
document.querySelector('.view-noti').addEventListener('click',(e)=>{
    
    if(document.querySelector('.notifications').style.display=='none'){
        document.querySelector('.notifications').style.display='block';
        document.querySelector('.diary-area').style.display='none';
    }
    else{
        document.querySelector('.notifications').style.display='none';
        document.querySelector('.diary-area').style.display='block';
    } 
});
const getString = (date)=>{
    let str = '';
    str+=date.getFullYear()+'-';
    let m = date.getMonth()+1;
    if(m<10)
    str+='0'+m;
    else str+=m;
    str+='-';
    let d = date.getDate();
    if(d<10)
    str+='0'+d;
    else str+=d;
    return str;
}
const checkMonth=(days,month)=>{
    let map = new Map();
    map.set('January',31);
    map.set('February',29);
    map.set('March',31);
    map.set('April',30);
    map.set('May',31);
    map.set('June',30);
    map.set('July',31);
    map.set('August',31);
    map.set('September',30);
    map.set('October',31);
    map.set('November',30);
    map.set('December',31);
    if(days>=1 && days<=map.get(month)){
        return false;
    }
    else return true;
}

const updateDB = (obj)=>{
    let tx = db.transaction(['state'], 'readwrite');
    let store = tx.objectStore('state');
    let req = store.put(obj,1);
    req.onsuccess = ()=>{
        return;
    }
    req.onerror =()=>{
        console.log('error');
    }
}