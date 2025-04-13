    <div class="container">

 <div class="row m-2">
   <div class ="col-auto"><h3><i class="fas fa-globe text-primary"></i> Editer le domaine <strong>'<span id="idDomainLabel"></span>'</strong></h3></div>

   <div class ="col-auto ms-auto btn-group align-items-center">
        <button type="button" onclick=Redirect("/domains") class="btn btn-secondary"><i class="fas fa-list"></i> Liste domaines</button>
   </div>

 </div>

<hr>

<!----------------------------------------------------------------------------------------------------------------------------->

       <div class="card m-1 shadow">
         <div class="card-header"> <i class="fas fa-pen text-primary"></i> <label>Configuration</label> </div>
         <div class="card-body">

           <div class="row d-block  ms-auto mx-auto">
               <div style="cursor:pointer" class="text-center mb-1"><img id="idDomainImage" src="" /></div>
               <input type="file" class="d-none" id="idDomainInputFile">
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">My Permissions level</label>
               <div class="input-group-text"><i class="fas fa-star text-primary"></i></div>
               <span class='form-control' id="idDomainAccessLevel"></span>
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Domain Name</label>
               <input id="idDomainName" type="text" class="form-control" placeholder="Short name of domain">
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Domain UUID</label>
               <input disabled id="idDomainUuid" type="text" class="form-control" placeholder="Domain UUID">
             </div>
           </div>

           <div class="row ">
             <div class="input-group align-items-center">
               <label class="col-4 col-form-label text-right">Domain Secret Key<br><small class="text-danger">Keep it secret</small></label>
               <input disabled id="idDomainSecret" type="password" class="form-control" placeholder="Domain's Secret Key">
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Creation date</label>
               <input disabled id="idDomainDateCreate" type="text" class="form-control" placeholder="when the domain was created">
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Notification aux utilisateurs</label>
               <input id="idDomainNotif" type="text" class="form-control" placeholder="Notification aux utilisateurs">
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">TechID de l'Audio principal<br><small class="text-danger">Need Agent restart</small>
               </label>
               <input id="idDomainAudioTechID" type="text" class="form-control" placeholder="TechID du thread principal AUDIO">
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Debug Traduction D.L.S</label>
               <select id="idDomainDebugDls" class="custom-select"></select>
             </div>
           </div>

         </div>


         <div class="card-footer d-flex">
              <button id="idDomainChangeImageButton" type="button" class="btn btn-primary ms-auto">
                <i class="fas fa-image"></i> Change Image
              </button>

              <button id="idDomainSaveButton" type="button" class="btn btn-success ml-1">
                <i class="fas fa-save"></i> Save
              </button>
         </div>
       </div>
<!-- Encadré Danger Zone ------------------------------------------------------------------------------------------------------>
       <div class="card m-1 border border-danger shadow">
         <div class="card-header">
           <a class="text-danger" data-bs-toggle="collapse" href="#idAdvancedOptions" role="button"><i class="fas fa-exclamation text-danger"></i> Danger Zone</a>
         </div>
         <div class="card-body collapse" id="idAdvancedOptions">

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">New Email Owner<br><small class="text-danger">Cannot be Undone</small></label>
               <input id="idDomainNewOwnerEmail" type="text" class="form-control" placeholder="New Owner Email">
               <button id="idDomainTransferButton" class="col-2 ml-1 form-control btn btn-danger">Transfer</button>
             </div>
           </div>

           <div class="row ">
             <div class="input-group align-items-center">
               <label class="col-4 col-form-label text-right">Delete Domain<br><small class="text-danger">Cannot be Undone</small></label>
               <input  id="idDomainDeleteText" type="text" class="col-6 form-control" placeholder="type 'ok to delete ' followed by domain_uuid">
               <button id="idDomainDeleteButton" class="col-2 ml-1 form-control btn btn-danger">
                 <span id="idSpinnerDelete" class="spinner-border spinner-border-sm" style="display:none" role="status" aria-hidden="true"></span> Delete</button>
             </div>
           </div>

         </div>
       </div>

<script src="/js/domain_edit.js" type="text/javascript"></script>
<!-- Container -->
</div>
