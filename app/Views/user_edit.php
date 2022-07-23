    <div class="container">

 <div class="row m-2">
   <h3><i class="fas fa-user text-primary"></i> Editer l'utilisateur <strong>'<span id="idUserLabel"></span>'</strong></h3>
 </div>

<hr>

<!----------------------------------------------------------------------------------------------------------------------------->

       <div class="card m-1 shadow">
         <div class="card-header"> <i class="fas fa-pen text-primary"></i> <label>Configuration</label> </div>
         <div class="card-body">

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">User UUID</label>
               <input id="idUserUUID" disabled type="text" class="form-control" placeholder="User UUID">
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">User Email</label>
               <input id="idUserEmail" disabled type="text" class="form-control" placeholder="User Email">
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">User Name</label>
               <input id="idUserName" type="text" class="form-control" placeholder="User Shortname">
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Permissions level</label>
               <div class="input-group-prepend"> <div class="input-group-text"><i class="fas fa-star text-primary"></i></div> </div>
               <span class='form-control' id="idUserAccessLevel"></span>
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">User Phone</label>
               <input id="idUserPhone" type="text" class="form-control" placeholder="User phone">
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">User XMPP</label>
               <input id="idUserXmpp" type="text" class="form-control" placeholder="User instant message">
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Notification GSM</label>
               <select id="idUserCanRecvSms" class="custom-select"></select>
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group align-items-center">
               <label class="col-4 col-form-label text-right">Commande autorisée<br><small class="text-dark">par GSM ou IMSG</small></label>
               <select id="idUserCanSendTxt" class="custom-select"></select>
             </div>
           </div>

         </div>

         <div class="card-footer d-flex">
              <button id="idUserSaveButton" type="button" class="btn btn-primary ml-auto">
                <i class="fas fa-save"></i> Save
              </button>
         </div>

       </div>

       <div class="card m-1 border border-danger shadow">
         <div class="card-header">
           <a class="text-danger" data-toggle="collapse" href="#idAdvancedOptions" role="button"><i class="fas fa-exclamation text-danger"></i> Danger Zone</a>
         </div>
         <div class="card-body collapse" id="idAdvancedOptions">

           <div class="row form-group">
             <div class="input-group align-items-center">
               <label class="col-4 col-form-label text-right">Delete User<br><small class="text-danger">Cannot be Undone</small></label>
               <input  id="idUserDeleteText" type="text" class="col-6 form-control" placeholder="type 'ok to delete ' followed by user_uuid">
               <button id="idUserDeleteButton" class="col-2 ml-1 form-control btn btn-danger">
                 <span id="idSpinnerDelete" class="spinner-border spinner-border-sm" style="display:none" role="status" aria-hidden="true"></span> Delete</button>
             </div>
           </div>

         </div>
       </div>

<script src="/js/user_edit.js" type="text/javascript"></script>
<!-- Container -->
</div>
