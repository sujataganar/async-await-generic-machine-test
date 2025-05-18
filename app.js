let cl = console.log ;

const postform = document.getElementById("postform")
const titlecontrol = document.getElementById("title")
const contentcontrol = document.getElementById("content")
const useridcontrol = document.getElementById("userid")
const postcontainer = document.getElementById("postcontainer")

const addpostbtn = document.getElementById("addpostbtn")
const updatebtn = document.getElementById("updatebtn")






const baseurl = `https://crud-b17-js-12673-default-rtdb.firebaseio.com`
const posturl =`${baseurl}/posts.json`


let postarr = [];

const makeapicall = async (url , methodname , msgbody) => {
    try{
        msgbody = msgbody ? JSON.stringify(msgbody) : null
        let res = await fetch(url , {
        method : methodname ,
        body : msgbody,
        headers : {
            'content-type' : 'application/json',
            Auth : 'token (from ls)'
        }
    })
    return res.json()
    }catch(err) {
        cl("error")
    }
}

//templating
const createcards = (arr) => {
    let result = '';
    arr.forEach(ele => {
        result += `
                <div class="col-md-4 mt-4" id = "${ele.id}">
                  <div class="card">
                      <div class="card-header">
                        <h3>${ele.title}</h3>
                      </div>
                      <div class="card-body">
                         <p>${ele.content}</p>
                      </div>
                     <div class="card-footer d-flex justify-content-between">
                       <button class="btn-sm btn-outline-info" onclick ="oneditbtn(this)">Edit</button>
                       <button class="btn-sm btn-outline-danger" onclick ="onremovebtn(this)">Remove</button>
                    </div>
                  </div>
               </div>
        `
        
    });
    postcontainer.innerHTML = result;

}
const oneditbtn = async (eve) => {
    //edit id
    let editid = eve.closest(".col-md-4").id
    localStorage.setItem("editid" , editid)
    //edit url 
    let editurl = `${baseurl}/posts/${editid}.json`
    //api call
    let res = await makeapicall (editurl , 'GET')

    if(res){
         titlecontrol.value = res.title,
         contentcontrol.value = res.content,
         useridcontrol.value =  res.userid;

         //hide btn 
         addpostbtn.classList.add("d-none")
         updatebtn.classList.remove("d-none")
    }
}


const onupdate = async () => {
    //update id 
    let updateid = localStorage.getItem("editid")
    //update url
    let updateurl = `${baseurl}/posts/${updateid}.json`
    //update obj 
    let updateobj = {
        title : titlecontrol.value,
        content : contentcontrol.value,
        userid : useridcontrol.value
        }
        postform.reset()

        //api call
        let res = await makeapicall(updateurl , 'PATCH' ,updateobj)

        //update on ui
        let card = document.getElementById(updateid)
        card.querySelector('h3').innerHTML = updateobj.title;
         card.querySelector('p').innerHTML = updateobj.content;

         //btn hide show
         addpostbtn.classList.remove("d-none")
         updatebtn.classList.add("d-none")


}

const onremovebtn = async (eve) => {
    //remove id
    let removeid = eve.closest(".col-md-4").id
    //remove url 
    let removeurl = ` ${baseurl}/posts/${removeid}.json`
    // api call
    let res =  await makeapicall(removeurl , 'DELETE')

    if(res){
        eve.closest(".col-md-4").remove()
    }
}


//fetch data
const fetchallpost = async () => {
   try{ let data = await makeapicall(posturl , 'GET' , null)
    cl(data)

    let postarr = objtoarr(data);

    createcards(postarr)

   }catch(err){
    cl("no data fetch")
   }
}
fetchallpost()



const objtoarr = (obj) => {
    let arr = [];
    for (const key in obj) {
        arr.push({...obj[key] , id:key})
            
        }
        return arr 
    }



const onpostadd = async (eve) => {
    eve.preventDefault()

    let newpostobj = {
        title : titlecontrol.value,
        content : contentcontrol.value,
        userid : useridcontrol.value

    }

    //api call 
    let res = await makeapicall(posturl , 'POST' , newpostobj)
    postform.reset()
    cl(newpostobj)

    //card create

    let card = document.createElement("div")
    card.className = "col-md-4 mt-4"
    card.id = res.name 
    card.innerHTML = `
                    <div class="col-md-4 mt-4">
                      <div class="card">
                      <div class="card-header">
                        <h3>${newpostobj.title}</h3>
                      </div>
                      <div class="card-body">
                         <p>${newpostobj.content}</p>
                      </div>
                     <div class="card-footer d-flex justify-content-between">
                       <button class="btn-sm btn-outline-info" onclick ="oneditbtn(this)">Edit</button>
                       <button class="btn-sm btn-outline-danger" onclick ="onremovebtn(this)">Remove</button>
                    </div>
                  </div>
                 </div>
    `
    postcontainer.append(card)
}










postform.addEventListener("submit" , onpostadd)
updatebtn.addEventListener("click" , onupdate)