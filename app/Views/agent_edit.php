    <div class="container">

 <div class="row m-2">
   <h3><i class="fas fa-crown text-primary"></i> Editer l'agent <strong>'<span id="idAGENTLabel"></span>'</strong></h3>

   <div class ="ms-auto btn-group align-items-center">
        <button type="button" onclick=Redirect("/agents") class="btn btn-secondary"><i class="fas fa-list"></i> Liste Agents</button>
   </div>
 </div>

<hr>

<!----------------------------------------------------------------------------------------------------------------------------->

       <div class="card m-1 shadow">
         <div class="card-header"> <i class="fas fa-pen text-primary"></i> <label>Configuration de l'agent</label> </div>
         <div class="card-body">

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Informations</label>
               <input disabled id="idAGENTHostname" type="text" class="form-control" placeholder="Agent Hostname">
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Agent UUID</label>
               <input disabled id="idAGENTUUID" type="text" class="form-control" placeholder="Agent UUID">
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Description</label>
               <input id="idAGENTDescription" type="text" class="form-control" placeholder="Agent description">
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Switch branch</label>
               <input id="idAGENTBranche" type="text" class="form-control" placeholder="new GIT branch">
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Headless</label>
               <select id="idAGENTHeadless" class="form-control"></select>
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Log Level</label>
               <select id="idAGENTLogLevel" class="form-control"></select>
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Log MSRV</label>
               <select id="idAGENTLogMSRV" class="form-control"></select>
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Log BUS</label>
               <select id="idAGENTLogBUS" class="form-control"></select>
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Log DLS</label>
               <select id="idAGENTLogDLS" class="form-control"></select>
             </div>
           </div>

         </div>

         <div class="card-footer d-flex">
              <button id="idAGENTSaveButton" type="button" class="btn btn-success ms-auto">
                <i class="fas fa-save"></i> Save
              </button>
         </div>
       </div>

<!------------------------------------------------ Card de liaison ------------------------------------------------------------>
       <div class="card m-1 shadow">
         <div class="card-header"> <i class="fas fa-pen text-primary"></i> <label>Lier l'agent</label> </div>
         <div class="card-body">

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Lier un agent natif</label>
               <textarea id="idAGENTLinkNatif" readonly rows="5" type="text" class="form-control" placeholder="Link a native agent"></textarea>
             </div>
           </div>

           <div class="row ">
             <div class="input-group mb-1">
               <label class="col-4 col-form-label text-right">Lier un agent en container</label>
               <textarea id="idAGENTLinkPodman" readonly rows="7" type="text" class="form-control" placeholder="Link a container agent"></textarea>
             </div>
           </div>

         </div>
       </div>

<script src="/js/agent_edit.js" type="text/javascript"></script>
<!-- Container -->
</div>
