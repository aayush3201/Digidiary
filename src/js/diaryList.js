export const addDiary=(d)=>{
    return {
        day: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear(),
        content: '',
        id: d.getDate().toString() +'/'+ d.getMonth().toString()+ '/'+ d.getFullYear().toString()
    };
}