const form = document.querySelector('form')
const ul = document.querySelector('ul')

//getting data
db.collection("cafes").get().then((snapshot) => {
    snapshot.docs.forEach((arr)=>{
        render_li(arr)
    })
});

function render_li(arr){
    let li = document.createElement('li')
    let name = document.createElement('span')
    let city = document.createElement('span')
    let cross = document.createElement('button')

    name.textContent = arr.data().name
    city.textContent = arr.data().city
    cross.textContent = 'x'

    li.append(name)
    li.append(city)
    li.append(cross)

    cross.addEventListener('click',(e)=>{
        e.stopPropagation()
        let id = cross.parentElement.id
        db.collection('cafes').doc(id).delete()
        cross.parentElement.remove()
    })

    li.id = arr.id
    ul.append(li)
}

//saving data
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    db.collection('cafes').add({
    name : form.name.value,
    city : form.city.value
    })
    form.name.value = ''
    form.city.value = ''
})

//query data
let where = document.querySelector('#where')
where.addEventListener('click',()=>{
    db.collection('cafes').where('city', '>', 'B').get().then(snapshot =>{
        snapshot.docs.forEach((arr) =>{
            render_li(arr)
        })
    })
})

//orderby
let order = document.querySelector('#orderBy')
order.addEventListener('click',()=>{
    db.collection('cafes').orderBy('name').get().then(snapshot =>{
        snapshot.docs.forEach((arr) =>{
            render_li(arr)
        })
    })
})

//rerendering
db.collection('cafes').orderBy('city').onSnapshot(snapshot =>{
    let changes  = snapshot.docChanges()
    changes.forEach(change =>{
        if(change.type == 'added'){
            render_li(change.doc)
        }else if(change.type == 'removed'){
            let li = document.querySelector(`[id=${change.doc.id}]`)
            li.remove()
        }
    })
})

//update
// db.collection('cafes').doc(id).update({
//     name : 'hiss'
// })
// //completely overwrite
// db.collection('cafes').doc(id).set({
//     name : 'hiss',
//    city : 'b'
// })

// console.log(navigator.userAgent,navigator.platform)
// console.log(navigator.oscpu)
