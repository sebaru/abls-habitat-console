    <div class="container">

 <div class="row m-2">
   <h3><i class="fas fa-user-friends text-primary"></i> Inviter une personne sur le domaine <strong>'<span id="idDomainLabel"></span>'</strong></h3>
 </div>

<hr>

<!----------------------------------------------------------------------------------------------------------------------------->

       <div class="card m-1 shadow">
         <div class="card-header"> <i class="fas fa-pen text-primary"></i> <label>Coordonnées de la personne</label> </div>
         <div class="card-body">

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">New Friend Email</label>
               <div class="input-group-prepend"> <div class="input-group-text">@</div> </div>
               <input id="idUserInviteEmail" type="email" class="form-control" placeholder="New Friend Email">
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">New Friend Access Level</label>
               <div class="input-group-prepend"> <div class="input-group-text"><i class="fas fa-star text-primary"></i></div> </div>
               <select id="idUserInviteAccessLevel" class="custom-select"></select>
             </div>
           </div>

         </div>

         <div class="card-footer d-flex">
              <button id="idUserInviteValider" type="button" class="btn btn-primary ml-auto">
                <i class="fas fa-user-friends"></i> Inviter
              </button>
         </div>

       </div>

<script src="/js/user_invite.js" type="text/javascript"></script>
<!-- Container -->
</div>
