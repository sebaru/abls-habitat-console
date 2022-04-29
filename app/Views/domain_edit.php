    <div class="container">

 <div class="row m-2">
   <h3><i class="fas fa-fort-awesome text-primary"></i> Editer le domaine <strong>'<span id="idDomainLabel"></span>'</strong></h3>
 </div>

<hr>

<!----------------------------------------------------------------------------------------------------------------------------->

       <div class="card m-1">
         <div class="card-header">
           <label>Informations générales</label>
         </div>
         <div class="card-body">

           <div class="row d-block form-group ml-auto mx-auto">
               <div style="cursor:pointer" class="text-center mb-1"><img id="idDomainImage" src="" /></div>
               <input type="file" class="d-none" id="idDomainInputFile">
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Description</label>
               <input id="idDomainDescription" type="text" class="form-control" placeholder="Domain Description">
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">UUID</label>
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
               <label class="col-4 col-form-label text-right">Date création</label>
               <input disabled id="idDomainDateCreate" type="text" class="form-control" placeholder="date de création">
             </div>
           </div>

         </div>


         <div class="card-footer d-flex">
              <button id="idDomainChangeImageButton" type="button" class="btn btn-primary ml-auto">
                <i class="fas fa-image"></i> Change Image
              </button>

              <button id="idDomainSaveButton" type="button" class="btn btn-primary ml-1">
                <i class="fas fa-save"></i> Save
              </button>
         </div>


       </div>

       <div class="card m-1">
         <div class="card-header">
           <label>Users</label>
         </div>
         <div class="card-body">
         </div>
       </div>

       <div class="card m-1 border border-danger">
         <div class="card-header">
           <a class="text-danger" data-toggle="collapse" href="#idAdvancedOptions" role="button">Zone de Danger</a>
         </div>
         <div class="card-body collapse" id="idAdvancedOptions">

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Owner<br><small class="text-danger">Cannot be Undone</small></label>
               <input id="idDomainOwner" type="text" class="form-control" placeholder="Domain Owner">
               <button id="idDomainTransferButton" class="col-2 ml-1 form-control btn btn-danger">Transfer</button>
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group align-items-center">
               <label class="col-4 col-form-label text-right">Delete Domain<br><small class="text-danger">Cannot be Undone</small></label>
               <input  id="idDomainDeleteText" type="text" class="col-6 form-control" placeholder="type 'ok to delete ' followed by domain_uuid">
               <button id="idDomainDeleteButton" class="col-2 ml-1 form-control btn btn-danger">Delete</button>
             </div>
           </div>

         </div>
       </div>

<script src="/js/domain_edit.js" type="text/javascript"></script>
<!-- Container -->
</div>
