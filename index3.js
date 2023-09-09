
(function () {
    let addfolderbtn = document.querySelector("#addfolder");
    let addtextbtn = document.querySelector("#addtext");
    let addalbumbtn=document.querySelector("#addalbum");
    let divBreadCrumb = document.querySelector("#divBreadCrumb");
    let divContainer = document.querySelector("#divContainer");
    let divApp = document.querySelector("#app");
    let divAppTitleBar = document.querySelector("#app-title-bar");
    let appClose=document.querySelector("#app-close");
    let divAppTitle = document.querySelector("#app-title");
    let divAppMenuBar = document.querySelector("#app-menu-bar");
    let divAppBody = document.querySelector("#app-body");
    let templates = document.querySelector("#templates");
    let aRootPath = divBreadCrumb.querySelector("a[purpose='path']");
    let resources = [];
    let cfid = -1; // initially we are at root (which has an id -1)

    let rid = 0;

    addfolderbtn.addEventListener("click", addFolder);
    addtextbtn.addEventListener("click", addTextFile);
    addalbumbtn.addEventListener("click",addAlbum);
    aRootPath.addEventListener("click", viewFolderFromPath);
    appClose.addEventListener("click",closeApp);


    function closeApp(){
        divAppTitle.innerHTML="here the title will come"
        divAppTitle.setAttribute("rid","");
        divAppMenuBar.innerHTML="";
        divAppBody.innerHTML="";
    }

    // persist -> ram,html,stroage
    // validation -> unique,null,same name by using spacebar
    function addFolder() {

        let FolderName = prompt("Enter the Folder's Name ");
        // same name by using spacebar
        if (FolderName != null) {
            FolderName = FolderName.trim();
        }

        // empty validation
        if (!FolderName) {
            alert("empty folder name is not allowed.");
            return;
        }

        //uniquness validation
        let alreadyExists = resources.some(r => r.rname == FolderName && r.pid == cfid)
        if (alreadyExists == true) {
            alert(FolderName + " has already exist please use new name ");
            return;
        }

        let pid = cfid;
        rid++;
        // folder to html
        addFolderToHTML(FolderName, rid, pid);
        // folder to ram

        resources.push({
            rname: FolderName,
            rid: rid,
            rtype: "folder",
            pid: cfid
        });
        // save to stroage
        saveToStroage();

    }

    function addTextFile() {
        let TextFileName = prompt("Enter the TextFile Name ");
        // same name by using spacebar
        if (TextFileName != null) {
            TextFileName = TextFileName.trim();
        }

        // empty validation
        if (!TextFileName) {
            alert("empty folder name is not allowed.");
            return;
        }

        //uniquness validation
        let alreadyExists = resources.some(r => r.rname == TextFileName && r.pid == cfid)
        if (alreadyExists == true) {
            alert(TextFileName + " has already exist please use new name ");
            return;
        }

        let pid = cfid;
        rid++;
        // folder to html
        addTextFileToHTML(TextFileName, rid, pid);
        // folder to ram

        resources.push({
            rname: TextFileName,
            rid: rid,
            rtype: "text-file",
            pid: cfid,
            isBold:false,
            isItalic:false,
            isUnderline:false,
            BgColor:"#ffffff",
            TextColor:"#000000",
            FontFamily: "serif",
            FontSize: 20,
            content:"This is a new file"

        });
        // save to stroage
        saveToStroage();
    }

    function addAlbum(){
        let AlbumName = prompt("Enter the Album Name ");
        // same name by using spacebar
        if (AlbumName != null) {
            AlbumName = AlbumName.trim();
        }

        // empty validation
        if (!AlbumName) {
            alert("empty folder name is not allowed.");
            return;
        }

        //uniquness validation
        let alreadyExists = resources.some(r => r.rname == AlbumName && r.pid == cfid)
        if (alreadyExists == true) {
            alert(AlbumName + " has already exist please use new name ");
            return;
        }

        let pid = cfid;
        rid++;
        // folder to html
        addAlbumToHTML(AlbumName, rid, pid);
        // folder to ram
    //    let imgUrl=divAppBody.querySelector(".photo-list > img").getAttribute("src");
    //     console.log(url);
        resources.push({
            rname: AlbumName,
            rid: rid,
            rtype: "album",
            pid: cfid,
        });
        // save to stroage
        saveToStroage();
    }

    function deleteFolder() {
        // delete all folder inside also
        let spanDelete = this;
        let divFolder = spanDelete.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");

        let fidToBeDeleted = parseInt(divFolder.getAttribute("rid"));
        let fname = divName.innerHTML;

        let childrenExists = resources.some(r => r.pid == fidToBeDeleted);
        let sure = confirm(`are sure you want to deleted this ${fname} folder?` + (childrenExists ? ".It also have children." : ""));
        if (!sure) {
            return;
        }

        // html
        divContainer.removeChild(divFolder);

        // ram
        deleteHelper(fidToBeDeleted);
        // stroage
        saveToStroage();

    }
    function deleteHelper(fidToBeDeleted) {
        let children = resources.filter(r => r.pid == fidToBeDeleted);
        for (let i = 0; i < children.length; i++) {
            deleteHelper(children[i].rid);// captable of removing the child folder recursly
        }
        let ridx = resources.findIndex(r => r.rid == fidToBeDeleted);
        console.log(resources[ridx].rname);
        resources.splice(ridx, 1);
    }

    function deleteTextFile() {
        let spanDelete = this;
        let divTextFile = spanDelete.parentNode;
        let divName = divTextFile.querySelector("[purpose='name']");

        let fidToBeDeleted = parseInt(divTextFile.getAttribute("rid"));
        let fname = divName.innerHTML;

        let sure = confirm(`are sure you want to deleted this ${fname} file?`);
        if (!sure) {
            return;
        }

        // html
        divContainer.removeChild(divTextFile);

        // ram
        let ridx = resources.findIndex(r => r.rid == fidToBeDeleted);
        resources.splice(ridx, 1);
        // stroage
        saveToStroage();
    }

    function deleteAlbum(){
        let spanDelete = this;
        let divAlbum = spanDelete.parentNode;
        let divName = divAlbum.querySelector("[purpose='name']");

        let fidToBeDeleted = parseInt(divAlbum.getAttribute("rid"));
        let Aname = divName.innerHTML;

        let sure = confirm(`are sure you want to deleted this ${Aname} album?`);
        if (!sure) {
            return;
        }

        // html
        divContainer.removeChild(divAlbum);

        // ram
        let ridx = resources.findIndex(r => r.rid == fidToBeDeleted);
        resources.splice(ridx, 1);
        // stroage
        saveToStroage();
    }
    // empty,unique and null
    function renameFolder() {
        let newFolderName = prompt("Enter the new Folder's Name ");
        // same name by using spacebar
        if (newFolderName != null) {
            newFolderName = newFolderName.trim();
        }

        // empty validation
        if (!newFolderName) {
            alert("empty folder name is not allowed.");
            return;
        }
        //old name validation
        let spanRename = this;
        let divFolder = spanRename.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let oldFName = divName.innerHTML;
        let ridToBeUpdated = parseInt(divFolder.getAttribute("rid"));
        if (oldFName == newFolderName) {
            alert(newFolderName + "already exist please something new ");
            return;
        }
        //uniquness validation
        let alreadyExists = resources.some(r => r.rname == newFolderName && r.pid == cfid)
        if (alreadyExists == true) {
            alert(newFolderName + " has already exist please use new name ");
            return;
        }

        //html
        divName.innerHTML = newFolderName;

        // ram
        let resource = resources.find(r => r.rid == ridToBeUpdated);
        resource.rname = newFolderName;

        // save to stroage
        saveToStroage();


    }

    function remaneTextFile() {
        let newTextFileName = prompt("Enter the new Folder's Name ");
        // same name by using spacebar
        if (newTextFileName != null) {
            newTextFileName = newTextFileName.trim();
        }

        // empty validation
        if (!newTextFileName) {
            alert("empty folder name is not allowed.");
            return;
        }
        //old name validation
        let spanRename = this;
        let divTextFile = spanRename.parentNode;
        let divName = divTextFile.querySelector("[purpose='name']");
        let oldFName = divName.innerHTML;
        let ridToBeUpdated = parseInt(divTextFile.getAttribute("rid"));
        if (oldFName == newTextFileName) {
            alert(newTextFileName + "already exist please something new ");
            return;
        }
        //uniquness validation
        let alreadyExists = resources.some(r => r.rname == newTextFileName && r.pid == cfid)
        if (alreadyExists == true) {
            alert(newTextFileName + " has already exist please use new name ");
            return;
        }

        //html
        divName.innerHTML = newTextFileName;

        // ram
        let resource = resources.find(r => r.rid == ridToBeUpdated);
        resource.rname = newTextFileName;

        // save to stroage
        saveToStroage();
    }
    function renameAlbum(){
        let newAlbumName = prompt("Enter the new Folder's Name ");
        // same name by using spacebar
        if (newAlbumName != null) {
            newAlbumName = newAlbumName.trim();
        }

        // empty validation
        if (!newAlbumName) {
            alert("empty folder name is not allowed.");
            return;
        }
        //old name validation
        let spanRename = this;
        let divAlbum = spanRename.parentNode;
        let divName = divAlbum.querySelector("[purpose='name']");
        let oldAName = divName.innerHTML;
        let ridToBeUpdated = parseInt(divAlbum.getAttribute("rid"));
        if (oldAName == newAlbumName) {
            alert(newAlbumName + "already exist please something new ");
            return;
        }
        //uniquness validation
        let alreadyExists = resources.some(r => r.rname == newAlbumName && r.pid == cfid)
        if (alreadyExists == true) {
            alert(newAlbumName + " has already exist please use new name ");
            return;
        }

        //html
        divName.innerHTML = newAlbumName;

        // ram
        let resource = resources.find(r => r.rid == ridToBeUpdated);
        resource.rname = newAlbumName;

        // save to stroage
        saveToStroage();
    }

    function viewFolder() {
        let spanView = this;
        let divFolder = spanView.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");

        let fname = divName.innerHTML;
        let fid = parseInt(divFolder.getAttribute("rid"));

        let aPathTemplate = templates.content.querySelector("[purpose='path']");
        let aPath = document.importNode(aPathTemplate, true);

        aPath.innerHTML = fname;
        aPath.setAttribute("rid", fid);
        aPath.addEventListener("click", viewFolderFromPath);
        divBreadCrumb.appendChild(aPath);


        cfid = fid;
        divContainer.innerHTML = "";
        for (let i = 0; i < resources.length; i++) {
            if (resources[i].pid == cfid) {
                if (resources[i].rtype == "folder") {
                    addFolderToHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                } else if (resources[i].rtype == "text-file") {
                    // addTextFileToHTML(resources[i].rname, resources[i].rid, resources[i].pid,resources[i].isBold,resources[i].isItalic,
                    // resources[i].isUnderline,resources[i].BgColor,resources[i].TextColor,resources[i].FontFamily,resources[i].FontSize,resources[i].content);
                    addTextFileToHTML(resources[i].rname,resources[i].rid,resources[i].pid);
                }
            }
        }



    }

    function viewTextFile() {
        let spanView = this;
        let divTextFile = spanView.parentNode;
        let divName = divTextFile.querySelector("[purpose='name']");
        let fname = divName.innerHTML;
        let fid = parseInt(divTextFile.getAttribute("rid"));

        let divNotepadMenuTemplate = templates.content.querySelector("[purpose='notepad-menu']");
        let divNotepadMenu = document.importNode(divNotepadMenuTemplate, true);

        divAppMenuBar.innerHTML = "";
        divAppMenuBar.appendChild(divNotepadMenu);

        let divNotepadBodyTemplate = templates.content.querySelector("[purpose='notepad-body']");
        let divNotepadBody = document.importNode(divNotepadBodyTemplate, true);

        divAppBody.innerHTML = "";
        divAppBody.appendChild(divNotepadBody);

        divAppTitle.innerHTML = fname;
        divAppTitle.setAttribute("rid", fid);

        let spanSave = divAppMenuBar.querySelector("[action='save']");
        let spanBold = divAppMenuBar.querySelector("[action='bold']");
        let spanItalic = divAppMenuBar.querySelector("[action='italic']");
        let spanUnderline = divAppMenuBar.querySelector("[action='underline']");
        let inputBgColor = divAppMenuBar.querySelector("[purpose='bg-color']");
        let inputTextColor = divAppMenuBar.querySelector("[purpose='fg-color']");
        let selectFontFamily = divAppMenuBar.querySelector("[action='font-family']");
        let selectFontSize = divAppMenuBar.querySelector("[action='font-size']");
        let spanDownload = divAppMenuBar.querySelector("[action='download']");
        let spanForUpload = divAppMenuBar.querySelector("[action='forUpload']");
        let inputUpload= divAppMenuBar.querySelector("[action='upload']");
        let textarea = divAppBody.querySelector("textarea");
  

        spanSave.addEventListener("click", saveNotepad);
        spanBold.addEventListener("click", makeNotepadBold);
        spanItalic.addEventListener("click", makeNotepadItalic);
        spanUnderline.addEventListener("click", makeNotepadUnderline);
        inputBgColor.addEventListener("change", changeNotepadBgColor);
        inputTextColor.addEventListener("change", changeNotepadTextColor);
        selectFontFamily.addEventListener("change", changeNotepadFontFamily);
        selectFontSize.addEventListener("change", changeNotepadFontSize);
        spanDownload.addEventListener("click",downloadNotepad);
        inputUpload.addEventListener("change",uploadNotepad);
        spanForUpload.addEventListener("click",function(){
            inputUpload.click();
        })

        let resource=resources.find(r=>r.rid==fid);

        spanBold.setAttribute("pressed", !resource.isBold);
        spanItalic.setAttribute("pressed", !resource.isItalic);
        spanUnderline.setAttribute("pressed", !resource.isUnderline);
        inputBgColor.value=resource.BgColor;
        inputTextColor.value=resource.TextColor;
        selectFontFamily.value=resource.FontFamily;
        selectFontSize.value=resource.FontSize;
        textarea.value=resource.content;

        spanBold.dispatchEvent(new Event("click"));
        spanItalic.dispatchEvent(new Event("click"));
        spanUnderline.dispatchEvent(new Event("click"));
        inputBgColor.dispatchEvent(new Event("change"));
        inputTextColor.dispatchEvent(new Event("change"));
        selectFontFamily.dispatchEvent(new Event("change"));
        selectFontSize.dispatchEvent(new Event("change"));

    }

    function viewAlbum(){
        let spanView = this;
        let divAlbum = spanView.parentNode;
        let divName = divAlbum.querySelector("[purpose='name']");
        let Aname = divName.innerHTML;
        let fid = parseInt(divAlbum.getAttribute("rid"));

        let divAlbumMenuTemplate = templates.content.querySelector("[purpose='album-menu']");
        let divAlbumMenu = document.importNode(divAlbumMenuTemplate, true);

        divAppMenuBar.innerHTML = "";
        divAppMenuBar.appendChild(divAlbumMenu);

        let divAlbumBodyTemplate = templates.content.querySelector("[purpose='album-body']");
        let divAlbumBody = document.importNode(divAlbumBodyTemplate, true);

        divAppBody.innerHTML = "";
        divAppBody.appendChild(divAlbumBody);

        divAppTitle.innerHTML = Aname;
        divAppTitle.setAttribute("rid", fid);

        let spanAdd=divAlbumMenu.querySelector("[action='add']");
        spanAdd.addEventListener("click",addPhotoToAlbum);
    }

    function addPhotoToAlbum(){
        let iurl=prompt(" enter the image url ");
        if(iurl==null){
            alert("please enter the url ");
            return;
        }
        let img=document.createElement("img");
        img.setAttribute("src",iurl);
        img.setAttribute("pressed",false);
    
        let divPhotoList=divAppBody.querySelector(".photo-list");
        divPhotoList.appendChild(img)
    
        img.addEventListener("click",showPhotoInMain);
    }
    function showPhotoInMain(){
        let divPhotoMainImg=divAppBody.querySelector(".photo-main > img");
        divPhotoMainImg.setAttribute("src",this.getAttribute("src"));

        let divPhotoList=divAppBody.querySelector(".photo-list");
        let imgs=divPhotoList.querySelectorAll("img");
        for(let i=0;i<imgs.length;i++){
            imgs[i].setAttribute("pressed",false);
        }
        this.setAttribute("pressed",true);
     
    }
    function saveNotepad() {
        let fid = parseInt(divAppTitle.getAttribute("rid"));
        let resource = resources.find(r => r.rid == fid);

        let spanSave = divAppMenuBar.querySelector("[action='save']");
        let spanBold = divAppMenuBar.querySelector("[action='bold']");
        let spanItalic = divAppMenuBar.querySelector("[action='italic']");
        let spanUnderline = divAppMenuBar.querySelector("[action='underline']");
        let inputBgColor = divAppMenuBar.querySelector("[purpose='bg-color']");
        let inputTextColor = divAppMenuBar.querySelector("[purpose='fg-color']");
        let selectFontFamily = divAppMenuBar.querySelector("[action='font-family']");
        let selectFontSize = divAppMenuBar.querySelector("[action='font-size']");
        let textarea = divAppBody.querySelector("textarea");

        resource.isBold = spanBold.getAttribute("pressed") == "true";
        resource.isItalic = spanItalic.getAttribute("pressed") == "true";
        resource.isUnderline = spanUnderline.getAttribute("pressed") == "true";
        resource.BgColor = inputBgColor.value;
        resource.TextColor = inputTextColor.value;
        resource.FontFamily = selectFontFamily.value;
        resource.FontSize = selectFontSize.value;
        resource.content = textarea.value;
  

        saveToStroage();

    }
    function makeNotepadBold() {
        let textarea = divAppBody.querySelector("textarea");
        let isPressed = this.getAttribute("pressed") == "true";
        if (isPressed == false) {
            this.setAttribute("pressed", true);
            textarea.style.fontWeight = "bold";
        } else {
            this.setAttribute("pressed", false);
            textarea.style.fontWeight = "normal";
        }
    }
    function makeNotepadItalic() {
        let textarea = divAppBody.querySelector("textarea");
        let isPressed = this.getAttribute("pressed") == "true";
        if (isPressed == false) {
            this.setAttribute("pressed", true);
            textarea.style.fontStyle = "italic";
        } else {
            this.setAttribute("pressed", false);
            textarea.style.fontStyle = "normal";
        }
    }
    function makeNotepadUnderline() {
        let textarea = divAppBody.querySelector("textarea");
        let isPressed = this.getAttribute("pressed") == "true";
        if (isPressed == false) {
            this.setAttribute("pressed", true);
            textarea.style.textDecoration = "underline";
        } else {
            this.setAttribute("pressed", false);
            textarea.style.textDecoration = "none";
        }
    }
    function changeNotepadBgColor() {
        let color = this.value;
        let textarea = divAppBody.querySelector("textarea");
        textarea.style.backgroundColor = color;
    }
    function changeNotepadTextColor() {
        let color = this.value;
        let textarea = divAppBody.querySelector("textarea");
        textarea.style.color = color;
    }
    function changeNotepadFontFamily() {
        let fontFamily = this.value;
        let textarea = divAppBody.querySelector("textarea");
        textarea.style.fontFamily = fontFamily;

    }
    function changeNotepadFontSize() {
        let fontSize = this.value;
        let textarea = divAppBody.querySelector("textarea");
        textarea.style.fontSize = fontSize + "px";
    }
    function downloadNotepad(){
        let fid = parseInt(divAppTitle.getAttribute("rid"));
        let resource = resources.find(r => r.rid == fid);
        let divNotepadMenu=this.parentNode;

        let strDownload=JSON.stringify(resource);
        let encodeData=encodeURIComponent(strDownload);

        let aDownload=divNotepadMenu.querySelector("a[purpose='download']");
        aDownload.setAttribute("href","data:text/json;charset=utf-8," +encodeData);
        aDownload.setAttribute("download",resource.rname + ".json");

        aDownload.click();

    }
    function uploadNotepad(){
     let file = window.event.target.files[0];

     let reader=new FileReader();
     reader.addEventListener("load",function(){
        let data=window.event.target.result;
        let resource=JSON.parse(data);

        let spanSave = divAppMenuBar.querySelector("[action='save']");
        let spanBold = divAppMenuBar.querySelector("[action='bold']");
        let spanItalic = divAppMenuBar.querySelector("[action='italic']");
        let spanUnderline = divAppMenuBar.querySelector("[action='underline']");
        let inputBgColor = divAppMenuBar.querySelector("[purpose='bg-color']");
        let inputTextColor = divAppMenuBar.querySelector("[purpose='fg-color']");
        let selectFontFamily = divAppMenuBar.querySelector("[action='font-family']");
        let selectFontSize = divAppMenuBar.querySelector("[action='font-size']");
        let textarea = divAppBody.querySelector("textarea");

        spanBold.setAttribute("pressed", !resource.isBold);
        spanItalic.setAttribute("pressed", !resource.isItalic);
        spanUnderline.setAttribute("pressed", !resource.isUnderline);
        inputBgColor.value=resource.BgColor;
        inputTextColor.value=resource.TextColor;
        selectFontFamily.value=resource.FontFamily;
        selectFontSize.value=resource.FontSize;
        textarea.value=resource.content;

        
        spanBold.dispatchEvent(new Event("click"));
        spanItalic.dispatchEvent(new Event("click"));
        spanUnderline.dispatchEvent(new Event("click"));
        inputBgColor.dispatchEvent(new Event("change"));
        inputTextColor.dispatchEvent(new Event("change"));
        selectFontFamily.dispatchEvent(new Event("change"));
        selectFontSize.dispatchEvent(new Event("change"));
     });
     reader.readAsText(file);
    }




    function addFolderToHTML(rname, rid, pid) {
        let divFolderTemplate = templates.content.querySelector(".folders");
        let divFolder = document.importNode(divFolderTemplate, true);

        let divName = divFolder.querySelector("[purpose='name']");
        let spanDelete = divFolder.querySelector("[action='delete']");
        let spanRename = divFolder.querySelector("[action='rename']");
        let spanView = divFolder.querySelector("[action='view']");

        spanDelete.addEventListener("click", deleteFolder);
        spanRename.addEventListener("click", renameFolder)
        spanView.addEventListener("click", viewFolder);

        divName.innerHTML = rname;
        divFolder.setAttribute("rid", rid);
        divFolder.setAttribute("pid", pid);

        divContainer.appendChild(divFolder);
    }
    function addTextFileToHTML(TextFileName, rid, pid) {
        let divTextFileTemplate = templates.content.querySelector(".text-file");
        let divTextFile = document.importNode(divTextFileTemplate, true);

        let divName = divTextFile.querySelector("[purpose='name']");
        let spanDelete = divTextFile.querySelector("[action='delete']");
        let spanRename = divTextFile.querySelector("[action='rename']");
        let spanView = divTextFile.querySelector("[action='view']");

        spanDelete.addEventListener("click", deleteTextFile);
        spanRename.addEventListener("click", remaneTextFile)
        spanView.addEventListener("click", viewTextFile);

        divName.innerHTML = TextFileName;
        divTextFile.setAttribute("rid", rid);
        divTextFile.setAttribute("pid", pid);

        divContainer.appendChild(divTextFile);

    }
    function addAlbumToHTML(AlbumName,rid,pid){
        let divAlbumTemplate = templates.content.querySelector(".album");
        let divAlbum = document.importNode(divAlbumTemplate, true);

        let divName = divAlbum.querySelector("[purpose='name']");
        let spanDelete = divAlbum.querySelector("[action='delete']");
        let spanRename = divAlbum.querySelector("[action='rename']");
        let spanView = divAlbum.querySelector("[action='view']");

        spanDelete.addEventListener("click", deleteAlbum);
        spanRename.addEventListener("click", renameAlbum)
        spanView.addEventListener("click", viewAlbum);

        divName.innerHTML = AlbumName;
        divAlbum.setAttribute("rid", rid);
        divAlbum.setAttribute("pid", pid);

        divContainer.appendChild(divAlbum);

    }
    function viewFolderFromPath() {
        let aPath = this;
        let fid = parseInt(aPath.getAttribute("rid"));

        // ste the breadcrumb
        while (aPath.nextSibling) {
            aPath.parentNode.removeChild(aPath.nextSibling);
        }
        // set the div contanier
        cfid = fid;
        divContainer.innerHTML = "";
        for (let i = 0; i < resources.length; i++) {
            if (resources[i].pid == cfid) {
                if (resources[i].rtype == "folder") {
                    addFolderToHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                } else if (resources[i].rtype == "text-file") {
                    // addTextFileToHTML(resources[i].rname, resources[i].rid, resources[i].pid,resources[i].isBold,resources[i].isItalic,
                    //  resources[i].isUnderline,resources[i].BgColor,resources[i].TextColor,resources[i].FontFamily,resources[i].FontSize,resources[i].content);
                    addTextFileToHTML(resources[i].rname,resources[i].rid,resources[i].pid);
                }
            }
        }

    }

    function saveToStroage() {
        let rjson = JSON.stringify(resources); // used to convert array to jso ans used as json string to save 
        localStorage.setItem("data", rjson);


    }
    function loadToStroage() {
        let rjson = localStorage.getItem("data");
        if (!!rjson) {
            resources = JSON.parse(rjson);
            for (let i = 0; i < resources.length; i++) {
                if (resources[i].pid == cfid) {
                    if (resources[i].rtype == "folder") {
                        addFolderToHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                    } else if (resources[i].rtype == "text-file") {
                        // addTextFileToHTML(resources[i].rname, resources[i].rid, resources[i].pid,resources[i].isBold,resources[i].isItalic,
                        // resources[i].isUnderline,resources[i].BgColor,resources[i].TextColor,resources[i].FontFamily,resources[i].FontSize,resources[i].content);
                        addTextFileToHTML(resources[i].rname,resources[i].rid,resources[i].pid);
                    }else if(resources[i].rtype == "album"){
                        addAlbumToHTML(resources[i].rname,resources[i].rid,resources[i].pid);
                    }
                }
                if (resources[i].rid > rid) {
                    rid = resources[i].rid;
                }
            }
        }

    }
    loadToStroage();

})();