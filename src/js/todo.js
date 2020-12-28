let uniqid = require('uniqid');
export const newTodo = (obj)=>{
    return {
        description: obj.description,
        date: obj.date,
        time: obj.time,
        id: uniqid()
    }
}

