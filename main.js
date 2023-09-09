(function () {
  let btn = document.querySelector("#myFirstBtn");
  // let h1=document.querySelector("h1");
  // btn.addEventListener("click",function(){
  //   h1.style.color="grey";
  // });
  // btn.addEventListener("mouseover",function(){
  //   h1.style.color="blue";
  // });
  // btn.addEventListener("mouseout",function(){
  //   h1.style.color="brown";
  // });


  let myTemplates = document.querySelector("#myTemplates");
  let divContainer = document.querySelector("#container");
  let fid = 0;
  let folders = [];
  let fjson=localStorage.getItem("data");
  if(fjson != null && fjson.length > 0){
      folders=JSON.parse(fjson);
  }

// load in the beginning
  btn.addEventListener("click", function () {
    let FileName = prompt("Enter the Folder's Name");
    if (FileName == null) {
      return;
    }
    let divFolderTemplate = myTemplates.content.querySelector(".folder");
    let divFolder = document.importNode(divFolderTemplate, true);
    // divFolder.innerHTML=FileName;
    let divName = divFolder.querySelector("[purpose='name']");
    divName.innerHTML = FileName;
    divFolder.setAttribute("Fid", ++fid);

    let spanDelete = divFolder.querySelector("span[action='delete']");
    spanDelete.addEventListener("click", function () {
      let flag = confirm("Do you want to delete the folder " + divName.innerHTML);
      if (flag == true) {
        divContainer.removeChild(divFolder);
        let idx = folders.findIndex(f => f.id == parseInt(divFolder.getAttribute("Fid")));
        folders.splice(idx, 1);
        persisFolder();
      }
    });

    let spanEdit = divFolder.querySelector("span[action='edit']");
    spanEdit.addEventListener("click", function () {
      let FileName = prompt("Enter the new folder name ");
      if (!FileName) {
        return;
      }
      // let divName=divFolder.querySelector("[purpose='name']");
      divName.innerHTML = FileName;
      let folder = folders.find(f => f.id == parseInt(divFolder.getAttribute("Fid")));
      folder.name = FileName;
      persisFolder();
    });


    divContainer.appendChild(divFolder);

    folders.push({
      id: fid,
      name: FileName
    });
    persisFolder();

  });

  function persisFolder() {
    console.log(folders);
    let fjson = JSON.stringify(folders);
    localStorage.setItem("data", fjson);
  }
})();