export const loadDiary = (diaryInfo)=>{
    document.querySelector('.diary-area').innerHTML='';
    let markup = `
                    <div class="row headline">
                            <h2 class="head-date">${diaryInfo.day} ${fullMonth(diaryInfo.month)}, ${diaryInfo.year}</h2>
                            <div class="btn btn-edit">
                                <ion-icon name="hammer"></ion-icon>
                                <span>Edit</span>
                            </div>
                        </div>
                        <div class="views">
                   <div class="readview">
                        <p class="diary-text">${diaryInfo.content}</p>
                        <div class="row">
                            <div class="next-page btn-next btn">
                                <span>Next</span>
                                <ion-icon name="arrow-forward"></ion-icon>
                            </div>
                            <div class="prev-page btn-prev btn">
                                <ion-icon name="arrow-back"></ion-icon>
                                <span>Back</span>
                            </div>
                        </div>
                     </div>
                     </div>`;
                     document.querySelector('.diary-area').innerHTML=markup;                
}
export const fullMonth = (num)=>{
    let m = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return m[num];
}
export const editViewOn = (current)=>{
    document.querySelector('.views').innerHTML = `<div class="edit-view">
    <textarea class = "diary-entry" name="diary-entry" placeholder="What's up! You can tell me about all that happened today :)"></textarea>
    <div class="btn submit save-content">
        <span>Save</span>
    </div>
</div>`;
document.querySelector('.diary-entry').value= current.content;
document.querySelector('.btn-edit').style.display = 'none';
}
export const getNewContent = ()=>{
    return document.querySelector('.diary-entry').value;
}