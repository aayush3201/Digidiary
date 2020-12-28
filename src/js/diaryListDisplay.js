    const displayArr=(arr, page)=>{
    document.querySelector('.diary-list').innerHTML='';    
    arr.forEach(e=>{
        let markup=`
        <li>
            <a href="#" id = $id>
                <div class="row diary-item">
                    <h2 class="date">$month<br>$date</h2>
                    <h3 class="diary-title">$cont</h3>
                </div>
            </a>
        </li>`;
        if(e.month==page.month && e.year==page.year){
            markup=markup.replace('$id',e.id);
            markup=markup.replace('$month',month(e.month));
            markup=markup.replace('$date',e.day);
            if(e.content=='')
            markup=markup.replace('$cont','No content present');
            else
            markup=markup.replace('$cont','Content present');
            document.querySelector('.diary-list').insertAdjacentHTML('beforeend',markup);
        }
    });
}
const month = (num)=>{
    let m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return m[num];
}
export const updateListUI = (state)=>{
    document.querySelector('.year').textContent =`Year ${state.currentPage.year}`;
    displayArr(state.list_diaries,state.currentPage);
    if(document.querySelector('.diary-list').innerHTML=='')
    document.querySelector('.diary-list').innerHTML = `
    <p class="no-diaries">No diaries found for ${month(state.currentPage.month)}, ${state.currentPage.year}!</p>
    `;
}
export const activate = (current)=>{
    console.log('called');
    let arr = Array.from(document.querySelectorAll('.diary-item'));
    arr.forEach((e)=>{
        e.classList.remove('active');
    });
    document.getElementById(current.id).firstElementChild.classList.add('active');
}
