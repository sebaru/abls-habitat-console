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
               <input id="idArchiveDBRetention" type="number" min="1" class="form-control" placeholder="Nombre de jours de retention">
               <div class="input-group-append"> <span class="input-group-text">jours</span> </div>
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Nombre d'archives</label>
               <input id="idArchiveNumber" type="text" disabled class="form-control" placeholder="Nombre d'enregistrements">
               <div class="input-group-append"> <span class="input-group-text">archives</span> </div>
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Taille de base de données</label>
               <input id="idArchiveDatabaseSize" type="text" disabled class="form-control" placeholder="Volume de stockage">
               <div class="input-group-append"> <span class="input-group-text">MB</span> </div>
             </div>
           </div>

           <div class="row form-group">
             <div class="input-group">
               <label class="col-4 col-form-label text-right">Nombre de tables</label>
               <input id="idArchiveTableNumber" type="text" disabled class="form-control" placeholder="Nombre de tables">
               <div class="input-group-append"> <span class="input-group-text">tables</span> </div>
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

   <div class="table-responsive">
    <table id="idTableArchive" class="table table-striped table-bordered table-hover w-100">
      <thead class="thead-dark">
      </thead>
      <tbody>
      </tbody>
    </table>
   </div>

<!-- Container -->
</div>

<script src="/js/archive.js" type="text/javascript"></script>
