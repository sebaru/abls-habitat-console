<div class="container">

 <div class="row m-2">
   <div class="col-auto"><h3><i class="fas fa-crown text-danger"></i> Maintenance des Agents</h3> </div>

   <div class ="ml-auto btn-group align-items-start">
        <button type="button" onclick="Redirect ('/agent/add')" class="btn btn-primary"><i class="fas fa-plus"></i> Ajouter</button>
        <button type="button" onclick="AGENT_Refresh()" class="btn btn-outline-secondary"><i class="fas fa-redo"></i> Refresh</button>
   </div>
 </div>

<hr>

   <div class="table-responsive">
     <table id="idTableAGENT" class="table table-striped table-bordered table-hover">
       <thead class="thead-dark">
       </thead>
       <tbody>
       </tbody>
     </table>
   </div>

<!-- Container -->
</div>

<script src="/js/agents.js" type="text/javascript"></script>
