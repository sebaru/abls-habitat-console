    <div class="container">

 <div class="row m-2">
   <h3><i class="fas fa-crown text-primary"></i> Editer l'agent <strong>'<span id="idAGENTLabel"></span>'</strong></h3>

   <div class ="ml-auto btn-group align-items-start">
        <button type="button" onclick=Redirect("/agents") class="btn btn-secondary"><i class="fas fa-list"></i> Liste Agents</button>
   </div>
 </div>

<hr>

<!----------------------------------------------------------------------------------------------------------------------------->

       <div class="card m-1 shadow">
         <div class="card-header"> <i class="fas fa-pen text-primary"></i> <label>Configuration de l'agent</label> </div>
         <div class="card-body">

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Informations</label>
               <input disabled id="idAGENTHostname" type="text" class="form-control" placeholder="Agent Hostname">
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Agent UUID</label>
               <input disabled id="idAGENTUUID" type="text" class="form-control" placeholder="Agent UUID">
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
               <label class="col-4 col-form-label text-right">Description</label>
               <input id="idAGENTDescription" type="text" class="form-control" placeholder="Agent description">
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Headless</label>
               <select id="idAGENTHeadless" class="form-control"></select>
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Log Level</label>
               <select id="idAGENTLogLevel" class="form-control"></select>
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Log MSRV</label>
               <select id="idAGENTLogMSRV" class="form-control"></select>
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Log BUS</label>
               <select id="idAGENTLogBUS" class="form-control"></select>
             </div>
           </div>

         </div>

         <div class="card-footer d-flex">
              <button id="idAGENTSaveButton" type="button" class="btn btn-success ml-auto">
                <i class="fas fa-save"></i> Save
              </button>
         </div>
       </div>

<script src="/js/agent_edit.js" type="text/javascript"></script>
<!-- Container -->
</div>
