    <div class="container">

 <div class="row m-2">
   <h3><i class="fas fa-fort-awesome text-primary"></i> Editer le domaine <strong>'<span id="idDomainLabel"></span>'</strong></h3>

   <div class ="ml-auto btn-group align-items-start">
        <button type="button" onclick=Redirect("/domains") class="btn btn-secondary"><i class="fas fa-list"></i> Liste domaines</button>
   </div>

 </div>

<hr>

<!----------------------------------------------------------------------------------------------------------------------------->

       <div class="card m-1 shadow">
         <div class="card-header"> <i class="fas fa-pen text-primary"></i> <label>Configuration</label> </div>
         <div class="card-body">

           <div class="row d-block form-group ml-auto mx-auto">
               <div style="cursor:pointer" class="text-center mb-1"><img id="idDomainImage" src="" /></div>
               <input type="file" class="d-none" id="idDomainInputFile">
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">My Permissions level</label>
               <div class="input-group-prepend"> <div class="input-group-text"><i class="fas fa-star text-primary"></i></div> </div>
               <span class='form-control' id="idDomainAccessLevel"></span>
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Domain Name</label>
               <input id="idDomainName" type="text" class="form-control" placeholder="Short name of domain">
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Domain UUID</label>
               <input disabled id="idDomainUuid" type="text" class="form-control" placeholder="Domain UUID">
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group align-items-center">
               <label class="col-4 col-form-label text-right">Domain Secret Key<br><small class="text-danger">Keep it secret</small></label>
               <input disabled id="idDomainSecret" type="password" class="form-control" placeholder="Domain's Secret Key">
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Creation date</label>
               <input disabled id="idDomainDateCreate" type="text" class="form-control" placeholder="when the domain was created">
             </div>
           </div>

         </div>

         <div class="card-footer d-flex">
              <button id="idDomainChangeImageButton" type="button" class="btn btn-primary ml-auto">
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
           <a class="text-danger" data-toggle="collapse" href="#idAdvancedOptions" role="button"><i class="fas fa-exclamation text-danger"></i> Danger Zone</a>
         </div>
         <div class="card-body collapse" id="idAdvancedOptions">

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">New Email Owner<br><small class="text-danger">Cannot be Undone</small></label>
               <input id="idDomainNewOwnerEmail" type="text" class="form-control" placeholder="New Owner Email">
               <button id="idDomainTransferButton" class="col-2 ml-1 form-control btn btn-danger">Transfer</button>
             </div>
           </div>

           <div class="row form-group">
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
