<div class="container">

 <div class="row m-2">
   <h3><i class="fas fa-database text-primary"></i> Paramétrage des Archives</h3>

 </div>

<hr>

       <div class="card m-1">
         <div class="card-header"> <label>Configuration</label> </div>
         <div class="card-body">

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Durée de retention</label>
               <input id="idArchiveDBRetention" type="number" min="1" class="form-control" placeholder="Nombre de jours">
               <div class="input-group-append"> <span class="input-group-text">jours</span> </div>
             </div>
           </div>

         </div>

         <div class="card-footer d-flex">
              <button id="idDomainSaveButton" type="button" class="btn btn-success ml-auto" onclick="Archive_sauver_parametre()">
                <i class="fas fa-save"></i> Save
              </button>
         </div>


       </div>

<hr>

 <h3><i class="fas fa-database text-primary"></i> Gestion des tables d'archivage</h3>

    <table id="idTableArchive" class="table table-striped table-bordered table-hover w-100">
      <thead class="thead-dark">
      </thead>
      <tbody>
      </tbody>
    </table>

<!-- Container -->
</div>

<script src="/js/archive.js" type="text/javascript"></script>
