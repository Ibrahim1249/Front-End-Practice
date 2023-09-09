(function () {
    let btn = document.querySelector("#myFirstBtn");
    let pageTemplates = document.querySelector("#pageTemplates");
    let divContainer = document.querySelector("#container");
    let divBreadCrumb = document.querySelector("#divBreadCrumb");
    let aRootPath=document.querySelector(".path")
    let fid = -1;
    let cfid=-1; // id of the folder in which we are
    let folders = [];

    btn.addEventListener("click", addFolder);
    aRootPath.addEventListener("click",navigateBreadCrumb);

    function addFolder() {
        let folderName = prompt("Enter the Folder's Name?");
        if (!!folderName) {
            let exists = folders.some(f => f.name == folderName);
            if (exists == false) {
                fid++;
                folders.push({
                    id: fid,
                    name: folderName,
                    pid:cfid
                });
                addFolderHTMLToPage(folderName, fid,cfid);
                persisDataToStorage();
            } else {
                alert(folderName + "already exists! ");
            }

        } else {
            alert(" please enter something ")
        }
    }

    function editFolder() {
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        //let editfid = parseInt(divFolder.getAttribute("fid"));
        let oldFolderName = divName.innerHTML;

        let newfolderName = prompt("Enter the new Folder's Name of " + oldFolderName);
        if (!!newfolderName) {
            if (newfolderName != oldFolderName) {
                let exists = folders.filter(f=> f.pid == cfid).some(f => f.name == newfolderName);
                if (exists == false) {
                    //ram
                    let folder = folders.filter(f=> f.pid == cfid).find(f => f.name == oldFolderName);
                    folder.name = newfolderName;

                    // html
                    divName.innerHTML = newfolderName;

                    // stroage
                    persisDataToStorage();
                }else{
                    alert(newfolderName+ " already exist ! ");
                }
            } else {
                alert("this is old name. please enter something new ")
            }

        } else {
            alert("please enter the name ")
        }

    }

    function deleteFolder() {
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let fidToBeDeleted = divFolder.getAttribute("fid");

        let flag = confirm("Do you want to delete " + divName.innerHTML + " ?");
        if (flag==true) {
            let exists=folders.some(f=> f.pid == fidToBeDeleted);
            if(exists==false){
             
                //ram
                 let fidx=folders.findIndex(f=>f.pid == fidToBeDeleted);
                 folders.splice(fidx,1);

                 //html
                 divContainer.removeChild(divFolder);

                 //stroage
                 persisDataToStorage();
            }else{
                alert("can't delete. has children ");
            }

        }
    }
    function navigateBreadCrumb(){
       let folderName=this.innerHTML;
       cfid= parseInt(this.getAttribute("fid"));

       divContainer.innerHTML="";
       folders.filter(f=> f.pid == cfid).forEach(f=>{
        addFolderHTMLToPage(f.name,f.id,f.pid);
       });
       while(this.nextSibling){
        this.parentNode.removeChild(this.nextSibling);
       }
      }
    function viewFolder(){
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        cfid =parseInt(divFolder.getAttribute("fid"));
        let aPathTemplate = pageTemplates.content.querySelector(".path");
        let aPath = document.importNode(aPathTemplate, true);

        aPath.innerHTML=divName.innerHTML;
        aPath.setAttribute("fid",cfid);
        aPath.addEventListener("click",navigateBreadCrumb);
        divBreadCrumb.appendChild(aPath);

        divContainer.innerHTML="";
        folders.filter(f=>f.pid == cfid).forEach(f=> {
            addFolderHTMLToPage(f.name,f.id,f.pid);
        });

    }

    function addFolderHTMLToPage(folderName, fid, pid) {
        let divFolderTemplate = pageTemplates.content.querySelector(".folder");
        let divFolder = document.importNode(divFolderTemplate, true);

        //  let divName=divFolder.querySelector("[purpose='name']");
        let divName = divFolder.querySelector("[purpose='name']");
        let spanEdit = divFolder.querySelector("[action='edit']");
        let spanDelete = divFolder.querySelector("[action='delete']");
        let spanView = divFolder.querySelector("[action='view']");

        divName.innerHTML = folderName;
        spanEdit.addEventListener("click", editFolder);
        spanDelete.addEventListener("click", deleteFolder);
        spanView.addEventListener("click",viewFolder);
        divFolder.setAttribute("fid", fid);
        divFolder.setAttribute("pid", pid);

        divContainer.appendChild(divFolder);
    }
    function persisDataToStorage() {
        let folderJson = JSON.stringify(folders);
        localStorage.setItem("data", folderJson);
    }

    function loadDataFromStorage() {
        let folderJson = localStorage.getItem("data");
        if (!!folderJson) {
            folders = JSON.parse(folderJson);
            //  folders.foreach(f => addFolderHTMLToPage(f.name, f.id));
            folders.forEach(folder => {
                if (folder.id > fid) {
                    fid = folder.id;
                }
                if(folder.pid == cfid){
                addFolderHTMLToPage(folder.name, folder.id);
                }
            });
        }

    }

    loadDataFromStorage();
})();