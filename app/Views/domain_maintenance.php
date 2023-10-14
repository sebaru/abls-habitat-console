    <div class="container">

 <div class="row m-2">
   <h3><i class="fas fa-globe text-primary"></i> Maintenance du domaine <strong>'<span id="idDomainLabel"></span>'</strong></h3>
 </div>

<hr>

<!-- Encadré Maintenance ------------------------------------------------------------------------------------------------------>

       <div class="card m-1 shadow">
         <div class="card-header"> <i class="fas fa-wrench text-warning"></i> <label>Domain Maintenance</label> </div>
         <div class="card-body">

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-6 col-form-label text-right">Compilation complète D.L.S</label>
               <button id="idDomainCompilAllButton" type="button" class="col-6 btn btn-block btn-warning"><i class="fas fa-coffee"></i> Compil All</button>
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-6 col-form-label text-right">Rechargement des Mappings I/O</label>
               <button id="idDomainRemap" type="button" class="col-6 btn btn-block btn-secondary"><i class="fas fa-directions"></i> Remap I/O</button>
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-6 col-form-label text-right">Rechargement des ticks Horloges</label>
               <button id="idDomainHorlogeReload" type="button" class="col-6 btn btn-block btn-secondary"><i class="fas fa-clock"></i> Reload Ticks</button>
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-6 col-form-label text-right">Déchargement des Visuels</label>
               <button id="idDomainHorlogeClearVisuel" type="button" class="col-6 btn btn-block btn-secondary"><i class="fas fa-image"></i> Unload Visuels</button>
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-6 col-form-label text-right">Notification aux utilisateurs</label>
               <input id="idDomainUserNotif" type="text" class="col-4 form-control mr-1" placeholder="Notification aux utilisateurs">
               <button id="idDomainUserNotifSend" type="button" class="col-2 btn btn-block btn-primary"><i class="fas fa-message"></i> Send</button>
             </div>
           </div>

         </div>
<!--
         <div class="card-footer d-flex">
              <button id="idDomainMaintenanceSaveButton" type="button" class="btn btn-success ms-auto">
                <i class="fas fa-save"></i> Save
              </button>
         </div>
-->
 </div>


 <div class="card m-1 shadow">
         <div class="card-header"> <i class="fas fa-wrench text-danger"></i> <label>API Maintenance</label> </div>
         <div class="card-body">

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-6 col-form-label text-right">Rechargement des icones en base</label>
               <button id="idApiReloadIcons" type="button" class="col-6 btn btn-block btn-secondary"><i class="fas fa-redo"></i> Reload</button>
             </div>
           </div>

         </div>
 </div>

<script src="/js/domain_maintenance.js" type="text/javascript"></script>
<!-- Container -->
</div>
