    <div class="container">

 <div class="row m-2">
   <h3><i class="fas fa-crown text-primary"></i> Ajouter un agent au domaine</h3>

   <div class ="ms-auto btn-group align-items-center">
        <button type="button" onclick=Redirect("/agents") class="btn btn-secondary"><i class="fas fa-list"></i> Liste Agents</button>
   </div>
 </div>

<hr>

<!------------------------------------------------ Card de liaison ------------------------------------------------------------>
       <div class="card m-1 shadow">
         <div class="card-header"> <i class="fas fa-pen text-primary"></i> <label>Ajouter un agent</label> </div>
         <div class="card-body">

           <div class="row ">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Pour un agent natif</label>
               <textarea id="idAGENTLinkNatif" readonly rows="6" type="text" class="form-control" placeholder="Command to link agent"></textarea>
             </div>
           </div>

           <div class="row ">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Pour un agent en container</label>
               <textarea id="idAGENTLinkPodman" readonly rows="6" type="text" class="form-control" placeholder="Command to link agent"></textarea>
             </div>
           </div>

         </div>
       </div>

<script src="/js/agent_add.js" type="text/javascript"></script>
<!-- Container -->
</div>
